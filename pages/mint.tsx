import { NextPage } from "next";
import Head from "next/head";

import MintMain from "../components/mint/MintMain";
import * as anchor from "@project-serum/anchor";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

const getCandyMachineId = (): anchor.web3.PublicKey | undefined => {
  try {
    const candyMachineId = new anchor.web3.PublicKey(
      process.env.NEXT_PUBLIC_CANDY_MACHINE_ID!
    );

    return candyMachineId;
  } catch (e) {
    console.log("Failed to construct CandyMachineId", e);
    return undefined;
  }
};

const candyMachineId = getCandyMachineId();
const rpcHost = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!;
const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || WalletAdapterNetwork.Devnet;
const connection = new anchor.web3.Connection(rpcHost);

const txTimeout = 30000;

const Mint: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Mint</title>
      </Head>

      <main>
        <h1 className="text-3xl font-bold">Mint</h1>
        {console.log("candymachine id", candyMachineId)}
        <MintMain
          candyMachineId={candyMachineId}
          connection={connection}
          txTimeout={txTimeout}
          rpcHost={rpcHost}
          network={network as WalletAdapterNetwork}
        />
      </main>
    </div>
  );
};

export default Mint;
