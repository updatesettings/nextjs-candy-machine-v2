import React from "react";
import { NFTItem } from "./NFTItem";
import useWalletNFTs from "../../hooks/useWalletNFTs";

interface Props {
  //none currently
}

export const NFTCollection = (props: Props) => {
  const addresses = [
    "BWN1SApp93ghfMNDaHChPh6n5BiTHLpyj5E1y8twz6vw",
    "ApQZr1ynnGteyQf3zEs5hw9HZfqvULf2uTUNPiFM79kS",
    "4usK2SvdNtvfcKEwicjXaVxHPbh8KSRKzoVHM2EbYmDv",
  ];
  const { NFTs } = useWalletNFTs(addresses);
  return (
    <div>
      {NFTs &&
        NFTs.map((nft) => {
          return <NFTItem key={nft.onChain.mint} nft={nft} />;
        })}
    </div>
  );
};
