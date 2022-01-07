import { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useMainContext } from "../context/MainContextProvider";
import useWalletBalance from "../context/WalletBalanceProvider";
import { DemoButton } from "../components/DemoButton";

const Index: NextPage = () => {
  const { demo, setDemo } = useMainContext();
  const [balance] = useWalletBalance();

  return (
    <div className={styles.container}>
      <Head>
        <title>Next.js CMv2 Demo</title>
        <meta name="description" content="Candy Machine V2 Demo with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>{demo}</h1>
        <button onClick={() => setDemo("Demo Changing Context")}>
          Click me
        </button>
        <DemoButton />
        <p>{balance}</p>
      </main>
    </div>
  );
};

export default Index;
