//DO NOT USE THIS IS A DEMO BUTTON

import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import {
  Keypair,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import React, { FC, useCallback } from "react";

export const DevTip: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  var recieverWallet = new web3.PublicKey(
    "5Jji69V6Ck1wK85DmtoUvacDekb5vdXc9K19g7S7GGT"
  );
  const sendValue = 100000000 / LAMPORTS_PER_SOL;

  const onClick = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError();

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recieverWallet,
        // toPubkey: Keypair.generate().publicKey,
        lamports: 100000000,
      })
    );

    const signature = await sendTransaction(transaction, connection);

    await connection.confirmTransaction(signature, "processed");
  }, [publicKey, sendTransaction, connection]);

  return (
    <>
      <button
        className=" flex flex-row items-center text-pageText hover:text-pageBG  hover:bg-pageText font-semibold mb-2"
        onClick={onClick}
        disabled={!publicKey}
      >
        &#x27F6; Tip the dev team
      </button>
    </>
  );
};
