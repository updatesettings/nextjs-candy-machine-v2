import { NextPage } from "next";
import Head from "next/head";
import RSVP from "../components/rsvp/RSVP";

const Mint: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>RSVP</title>
      </Head>

      <main className="">
        <h1 className="">RSVP</h1>
        <RSVP />
      </main>
    </div>
  );
};

export default Mint;
