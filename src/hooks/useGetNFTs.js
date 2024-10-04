import { useQuery } from "@tanstack/react-query";

// Import hooks
import { useAccount } from "./useAccount";

// Import utils
import { aptosClient } from "../utils/aptos_client";

export async function getNFTs(account) {
  try {
    if (!account) return null;

    const res = await aptosClient().queryIndexer({
      query: {
        variables: {
          address: account.address,
        },
        query: `
          query GetAccountNfts($address: String) {
            current_token_ownerships_v2(
              where: {owner_address: {_eq: $address}, amount: {_gt: "0"}}
            ) {
              current_token_data {
                collection_id
                largest_property_version_v1
                current_collection {
                  collection_id
                  collection_name
                  description
                  creator_address
                  uri
                  __typename
                }
                description
                token_name
                token_data_id
                token_standard
                token_uri
                __typename
              }
              owner_address
              amount
              __typename
            }
          }
        `,
      },
    });

    const nfts = res.current_token_ownerships_v2;
    if (!collection) return null;

    return nfts;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function useGetNFTs() {
  const { account } = useAccount();

  if (!account) return;

  return useQuery({
    queryKey: ["nfts", account.address],
    refetchInterval: 1000 * 30,
    queryFn: async () => await getNFTs(),
  });
}
