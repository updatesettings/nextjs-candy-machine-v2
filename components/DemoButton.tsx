//DO NOT USE THIS IS A DEMO BUTTON

import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Keypair,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import React, { FC, useCallback } from "react";

export const DemoButton: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  // var recieverWallet = new web3.PublicKey("9fuYBoRvgptU4fVZ8ZqvWTTc6oC68P4tjuSA2ySzn6Nv");
  const sendValue = 100000 / LAMPORTS_PER_SOL;

  const onClick = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError();
    console.log("Publickey", publicKey);
    console.log("Gen keypair", Keypair.generate().publicKey);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: Keypair.generate().publicKey,
        lamports: 10000000,
      })
    );

    const signature = await sendTransaction(transaction, connection);

    await connection.confirmTransaction(signature, "processed");
  }, [publicKey, sendTransaction, connection]);

  return (
    <>
      <button onClick={onClick} disabled={!publicKey}>
        Send {sendValue} lamport to a random address!
      </button>
    </>
  );
};
