import Image from "next/image";
import { NFT } from "../../hooks/useWalletNFTs";

interface Props {
  nft: NFT;
}

export const NFTItem = (props: Props) => {
  const { nft } = props;
  const { onChain, offChain } = nft;
  return (
    <div style={{ background: "#f1f1f1", padding: 10, marginBottom: 10 }}>
      <div>
        <h5>{offChain.name}</h5>
        <Image
          width={100}
          height={100}
          alt={offChain.name}
          src={offChain.image}
        />
      </div>
      <div style={{ background: "#fff", padding: 10 }}>
        <a href={offChain.image} rel="noopener noreferrer" target="_blank">
          View image
        </a>
        <br />
        <a href={onChain.data.uri} rel="noopener noreferrer" target="_blank">
          View raw JSON
        </a>
      </div>
    </div>
  );
};
