import { NextPage } from "next";

import MintMain from "../components/mint/MintMain";
import * as anchor from "@project-serum/anchor";
import useWalletBalance from "../context/WalletBalanceProvider";
import { NFTCollection } from "../components/nft/NFTCollection";
import { BsGithub } from "react-icons/bs";

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
const connection = new anchor.web3.Connection(rpcHost);

const txTimeout = 30000;

const Index: NextPage = () => {
  const { walletAddress } = useWalletBalance();
  return (
    <div className="">
      <h1 className="text-3xl font-bold">Welcome</h1>
      <div className="min-h-[37vh] flex items-center justify-center py-16">
        <div className="inline-block w-full">
          <h3 className="text-pageText font-semibold text-xl text-center max-w-4xl m-auto mb-3">
            Cards by Update Settings is an NFT project to provide a working
            example of using the{" "}
            <a
              href="https://github.com/updatesettings/nextjs-candy-machine-v2"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:underline"
            >
              <BsGithub className="inline" /> Candy Machine v2 Next.js Template
            </a>
            .
          </h3>

          <p className="text-pageText opacity-60 text-center">
            Cards are the future designs for an NFT boardgame.
          </p>
        </div>
      </div>
      <div className="min-h-[35vh] flex items-center justify-center py-16">
        <div className="inline-block w-full">
          <MintMain
            candyMachineId={candyMachineId}
            connection={connection}
            txTimeout={txTimeout}
            rpcHost={rpcHost}
          />
        </div>
      </div>
      <div className="min-h-[60vh] flex items-center  px-4 md:px-8">
        <h3 className="text-pageText font-normal text-base max-w-4xl">
          Need web3 help? Support Update Settings by becoming a Cursor holder to
          receive exclusive access to projects and get hands on web3 dev help by
          our team.{" "}
          <a
            href="https://magiceden.io/marketplace/cursors_by_update_settings"
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 hover:underline font-semibold"
          >
            Get a cursor
          </a>
          .
        </h3>
      </div>
      {walletAddress && (
        <div className="mt-10">
          <NFTCollection />
        </div>
      )}
    </div>
  );
};

export default Index;
