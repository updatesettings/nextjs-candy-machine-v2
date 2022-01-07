import { NextPage } from "next";
import Head from "next/head";
import RSVP from "../components/rsvp/RSVP";
import styles from "../styles/Home.module.css";

const Mint: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>RSVP</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>RSVP</h1>
        <RSVP />
      </main>
    </div>
  );
};

export default Mint;
