import { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import useWalletBalance from "../context/WalletBalanceProvider";
import MintMain from "../components/mint/MintMain";
import * as anchor from "@project-serum/anchor";
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';


const getCandyMachineId = (): anchor.web3.PublicKey | undefined => {
  try {
    const candyMachineId = new anchor.web3.PublicKey(
      process.env.NEXT_PUBLIC_CANDY_MACHINE_ID!,
    );

    return candyMachineId;
  } catch (e) {
    console.log('Failed to construct CandyMachineId', e);
    return undefined;
  }
};

const candyMachineId = getCandyMachineId();
const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork;
const rpcHost = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!;
const connection = new anchor.web3.Connection(rpcHost);

const startDate = parseInt(process.env.NEXT_PUBLIC_CANDY_START_DATE!, 10);
const txTimeout = 30000;



const Mint: NextPage = () => {
  const [balance] = useWalletBalance();
  

  return (
    <div className={styles.container}>
      <Head>
        <title>Mint</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Mint Page</h1>
        <p>{balance}</p>
        <MintMain
          candyMachineId={candyMachineId}
          connection={connection}
          startDate={startDate}
          txTimeout={txTimeout}
          rpcHost={rpcHost}
        />
      </main>
    </div>
  );
};

export default Mint;
