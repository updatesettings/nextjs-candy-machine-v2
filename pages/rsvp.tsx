import { NextPage } from "next";
import Head from "next/head";
import RSVP from "../components/rsvp/RSVP";

const Mint: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>RSVP</title>
      </Head>

      <h1 className="text-3xl font-bold">Whitelist</h1>
      <RSVP />
    </div>
  );
};

export default Mint;
