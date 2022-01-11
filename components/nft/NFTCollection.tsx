import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";

const rpcHost = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!;
const connection = new anchor.web3.Connection(rpcHost);

interface Props {
  //none currently
}

export const NFTCollection = (props: Props) => {
  const wallet = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      {isLoading ? (
        <p>Loading....</p>
      ) : (
        <div>
          <p>NFTS NOT WORKING YES</p>
        </div>
      )}
    </div>
  );
};
