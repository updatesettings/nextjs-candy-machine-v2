import Image from "next/image";
import { NFT } from "../../hooks/useWalletNFTs";

interface Props {
  nft: NFT;
}

export const NFTItem = (props: Props) => {
  const { nft } = props;
  const { onChain, offChain } = nft;
  return (
    <div className="collection-item">
      <div className="collection-item--img">
        <Image
          width={1000}
          height={1000}
          alt={offChain.name}
          src={offChain.image}
        />
      </div>
      <h5 className="collection-item--title">{offChain.name}</h5>
      <div className="collection-item--links">
        <a
          className="btn btn--sm"
          href={offChain.image}
          rel="noopener noreferrer"
          target="_blank"
        >
          View Image
        </a>
        <br />
        <a
          className="btn-outline btn--sm"
          href={onChain.data.uri}
          rel="noopener noreferrer"
          target="_blank"
        >
          View JSON
        </a>
      </div>
    </div>
  );
};
