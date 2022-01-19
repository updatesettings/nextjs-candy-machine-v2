import { Metadata } from "../lib/metadata";
import { useEffect, useState } from "react";

import useMetadataAccounts from "./useMetadataAccounts";
import siteData from "../data/siteData";

// const DEFAULT_CANDY_MACHINES: string[] | null = null;
const DEFAULT_CANDY_MACHINES: string[] | null = siteData.addresses.creators;

export type NFT = {
  onChain: Metadata;
  offChain: {
    attributes: Array<any>;
    collection: any;
    description: string;
    edition: number;
    external_url: string;
    image: string;
    name: string;
    properties: {
      files: Array<string>;
      category: string;
      creators: Array<string>;
    };
    seller_fee_basis_points: number;
  };
};

/** Returns all NFTs a wallet is holding based on candy machine addresses */
const useWalletNFTs = (candyMachineAddresses = DEFAULT_CANDY_MACHINES) => {
  const { metadataAccounts } = useMetadataAccounts();
  const [NFTs, setNFTs] = useState<NFT[]>();

  useEffect(() => {
    const fetchNFTs = async () => {
      /**
       * Filter accounts which one of the creators is a candy machine address
       * Otherwise, the NFT doesn't belong to the desired collection
       */
      const filteredMetadataAccounts = candyMachineAddresses
        ? metadataAccounts?.filter((metadataAccount) => {
            const { data } = metadataAccount;
            const address: string[] = candyMachineAddresses;

            const creator = data?.creators?.find(
              (creator) => address.indexOf(creator.address) !== -1
            );

            /** Make sure it's verified to prevent exploiters */
            // if (creator && creator.verified) {
            //   return metadataAccount;
            // }

            // disabled the creator section
            if (creator) {
              return metadataAccount;
            }

            return false;
          })
        : metadataAccounts;

      if (!filteredMetadataAccounts || !filteredMetadataAccounts.length)
        return [];

      /**
       * Fetch JSON file for each metadata:
       *
       *
       * At this point, we have the token info and metadata from on-chain request.
       * But we also want to fetch external JSON metadata from the uri.
       */
      const metadataPromises = filteredMetadataAccounts.map(
        async (metadata) => {
          const {
            data: { uri },
          } = metadata;
          const content = await (await fetch(uri)).json();

          return {
            onChain: metadata,
            offChain: content,
          };
        }
      );

      const metadatas = await Promise.all(metadataPromises);

      return metadatas;
    };

    if (metadataAccounts) {
      (async () => {
        const fetched = await fetchNFTs();

        setNFTs(fetched);
      })();
    }
  }, [metadataAccounts]);

  return { NFTs };
};

export default useWalletNFTs;
