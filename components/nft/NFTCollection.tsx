import React from "react";
import { NFTItem } from "./NFTItem";
import useWalletNFTs from "../../hooks/useWalletNFTs";

interface Props {
  //none currently
}

export const NFTCollection = (props: Props) => {
  const { NFTs } = useWalletNFTs();
  return (
    <div className="collection">
      {NFTs &&
        NFTs.map((nft) => {
          return <NFTItem key={nft.onChain.mint} nft={nft} />;
        })}
    </div>
  );
};
