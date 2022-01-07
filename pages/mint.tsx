import { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import useWalletBalance from "../context/WalletBalanceProvider";
import MintMain from "../components/mint/MintMain";

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
        <MintMain />
      </main>
    </div>
  );
};

export default Mint;
