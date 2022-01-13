import { useEffect, useState } from "react";
import { AccountLayout, TOKEN_PROGRAM_ID, u64 } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { deserializeUnchecked } from "borsh";
import * as anchor from "@project-serum/anchor";

import { Metadata, METADATA_SCHEMA } from "../lib/metadata";
import { extendBorsh } from "../lib/utils/borsh";
extendBorsh();

const deserializeAccount = (data: Buffer) => {
  const accountInfo = AccountLayout.decode(data);
  accountInfo.mint = new PublicKey(accountInfo.mint);
  accountInfo.owner = new PublicKey(accountInfo.owner);
  accountInfo.amount = u64.fromBuffer(accountInfo.amount);

  if (accountInfo.delegateOption === 0) {
    accountInfo.delegate = null;
    accountInfo.delegatedAmount = new u64(0);
  } else {
    accountInfo.delegate = new PublicKey(accountInfo.delegate);
    accountInfo.delegatedAmount = u64.fromBuffer(accountInfo.delegatedAmount);
  }

  accountInfo.isInitialized = accountInfo.state !== 0;
  accountInfo.isFrozen = accountInfo.state === 2;

  if (accountInfo.isNativeOption === 1) {
    accountInfo.rentExemptReserve = u64.fromBuffer(accountInfo.isNative);
    accountInfo.isNative = true;
  } else {
    accountInfo.rentExemptReserve = null;
    accountInfo.isNative = false;
  }

  if (accountInfo.closeAuthorityOption === 0) {
    accountInfo.closeAuthority = null;
  } else {
    accountInfo.closeAuthority = new PublicKey(accountInfo.closeAuthority);
  }

  return accountInfo;
};

const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
const getMetadataAddress = async (mint: PublicKey): Promise<PublicKey> => {
  return (
    await PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0];
};

const METADATA_REPLACE = new RegExp("\u0000", "g");

const decodeMetadata = (buffer: Buffer): Metadata => {
  const metadata = deserializeUnchecked(
    METADATA_SCHEMA,
    Metadata,
    buffer
  ) as Metadata;
  metadata.data.name = metadata.data.name.replace(METADATA_REPLACE, "");
  metadata.data.uri = metadata.data.uri.replace(METADATA_REPLACE, "");
  metadata.data.symbol = metadata.data.symbol.replace(METADATA_REPLACE, "");
  return metadata;
};

const useMetadataAccounts = () => {
  const rpcHost = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!;
  const connection = new anchor.web3.Connection(rpcHost);
  const wallet = useWallet();
  const [metadataAccounts, setMetadataAccounts] = useState<Metadata[]>();

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [logs, setLogs] = useState([""]);

  useEffect(() => {
    if (status) {
      setLogs((previous) => previous.concat(status));
    }
  }, [status, setLogs]);

  useEffect(() => {
    const fetchMetadataAccounts = async () => {
      setIsLoading(true);
      setStatus("Fetching metadata accounts...");

      try {
        if (!wallet.publicKey) throw "No wallet connected.";

        /** Get all token accounts of the current wallet */
        const tokenAccounts = await connection.getTokenAccountsByOwner(
          wallet.publicKey,
          {
            programId: TOKEN_PROGRAM_ID,
          }
        );

        /** Deserialize all accounts */
        const deserializedAccounts = tokenAccounts.value.map((account) =>
          deserializeAccount(Buffer.from(account.account.data))
        );

        /** Array of promises to fetch all metadata account infos */
        const metadataAccountsPromises = deserializedAccounts.map(
          async (acc) => {
            /** Get metadata account address from token account */
            const metadataAddress = await getMetadataAddress(acc.mint);

            /** Fetch info */
            const metadataAccountInfo = await connection.getAccountInfo(
              metadataAddress
            );

            if (!metadataAccountInfo) return null;

            /** Turn token data into Metadata schema */
            const data = decodeMetadata(metadataAccountInfo.data);
            /**
             * START TO CHECK IF CURRENT WALLET IS HOLDING AN AMOUNT OF THE CURRENT TOKEN
             * OTHERWISE, IT IS NOT THE ACTUAL NFT OWNER
             */

            /** Fetch largest owners */
            const largestAccounts = await connection.getTokenLargestAccounts(
              new PublicKey(data.mint)
            );

            /**
             * Map all largest accounts of the current mint(or NFT)
             * And fetch account info to verify the owner address
             */
            const allLargestAccountsInfo = await Promise.all(
              largestAccounts.value
                .map(async (account) => {
                  /** Fetch account info */
                  const accountInfo = await connection.getAccountInfo(
                    account.address
                  );

                  if (!accountInfo) return null;

                  const decoded = deserializeAccount(accountInfo.data);

                  return decoded;
                })
                .filter((value) => value !== null)
            );

            /** Check if account owner of any largest account is equal to the current wallet */
            const currentWalletAsLargeAccount = allLargestAccountsInfo.find(
              (accountInfo) => {
                return (
                  accountInfo.owner.toString() === wallet.publicKey?.toString()
                );
              }
            );

            /** Assure that the current wallet is at least a large account*/
            if (!currentWalletAsLargeAccount) return null;

            /**
             * Ensure the account is holding 1 quantity of the token
             * If it's not holding 1, it means it's not the owner of the NFT
             */
            if (Number(currentWalletAsLargeAccount.amount) < 1) {
              return null;
            }
            return data;
          }
        );

        const metadataAccsResult = await Promise.all(metadataAccountsPromises);

        /** Remove all nulls */
        const filtered = metadataAccsResult.filter(
          (value): value is Metadata => value !== null
        );

        if (filtered) {
          setMetadataAccounts(filtered);
        }
        setIsLoading(false);
      } catch (error: any) {
        setStatus(error);
      }
    };

    if (wallet.publicKey) {
      fetchMetadataAccounts();
    }
  }, [wallet.publicKey]);

  return { metadataAccounts, isLoading, status, logs };
};

export default useMetadataAccounts;
