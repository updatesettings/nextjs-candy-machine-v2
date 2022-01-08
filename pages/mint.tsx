import { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import useWalletBalance from "../context/WalletBalanceProvider";
import useCandyMachine from "../context/CandyMachineProvider";
import MintMain from "../components/mint/MintMain";

const Mint: NextPage = () => {
  const [balance] = useWalletBalance();
  const [
    candyMachineId,
    connection,
    startDate,
    txTimeout,
    rpcHost,
  ] = useCandyMachine();

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
