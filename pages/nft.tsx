import { NextPage } from "next";
import Head from "next/head";
import { NFTCollection } from "../components/nft/NFTCollection";

const Mint: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>NFT Collection</title>
      </Head>

      <main className="">
        <h1 className="">Collection</h1>
        <NFTCollection/>
      </main>
    </div>
  );
};

export default Mint;
