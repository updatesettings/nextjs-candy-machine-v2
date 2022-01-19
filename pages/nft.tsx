import { NextPage } from "next";
import Head from "next/head";
import { NFTCollection } from "../components/nft/NFTCollection";

const Mint: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>NFT Collection</title>
      </Head>

      <h1 className="text-3xl font-bold">Collection</h1>
      <NFTCollection />
    </div>
  );
};

export default Mint;
