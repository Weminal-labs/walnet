import React from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

// Import components
import { Button } from "../../shared/button";
import { Card, CardContent } from "../../shared/card";
import { Input } from "../../shared/input";
import { toast } from "../../shared/use-toast";

// Import hooks
import { useGetCollectionData } from "../../../hooks/useGetCollectionData";
import { useAccount } from "../../../hooks/useAccount";

// Import utils
import { aptosClient } from "../../../utils/aptos_client";
import { OtherUtils } from "../../../utils/other";
import { ABI } from "./utils/abi";

export function StatsSection() {
  const queryClient = useQueryClient();
  const { signAndSubmitTransaction } = useWallet();

  const { account, metadata } = useAccount();
  const [nftCount, setNftCount] = useState(1);
  const [mintFee, setMintFee] = useState(0);

  const { data } = useGetCollectionData(ABI.collection_id);
  const {
    collection,
    maxSupply = 0,
    totalMinted = 0,
    uniqueHolders = 0,
  } = data ?? {};

  const getMintNFTConfig = function () {
    return {
      data: {
        function: `${ABI.address}::${ABI.name}::mint_nft`,
        typeArguments: [],
        functionArguments: [collection.collection_id, nftCount],
      },
    };
  };

  const getMintFee = async function () {
    const response = await aptosClient().view({
      payload: {
        function: `${ABI.address}::${ABI.name}::mint_fee`,
        typeArguments: [],
        functionArguments: [collection.collection_id],
      },
    });

    const responseValue = response[0].vec[0];

    const mintFee =
      responseValue !== undefined
        ? Number.parseInt(responseValue) / 100_000_000
        : undefined;

    return mintFee;
  };

  const handleSubmitMintNft = async (e) => {
    e.preventDefault();

    if (!collection?.collection_id) return;
    if (!account) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must connect a wallet before minting",
      });
      return;
    }
    if (metadata.balance !== undefined && metadata.balance < mintFee) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You do not have enough funds to mint",
      });
      return;
    }

    const response = await signAndSubmitTransaction(getMintNFTConfig());
    await aptosClient().waitForTransaction({ transactionHash: response.hash });
    queryClient.invalidateQueries();
    setNftCount(1);
  };

  React.useEffect(() => {
    if (collection) getMintFee().then((mintFee) => setMintFee(mintFee));
  }, [collection]);

  return (
    <section className="stats-container w-full justify-between flex-row flex">
      <ul className="flex flex-col md:flex-row gap-10 justify-left text-nowrap">
        {[
          { title: "CREATED NFTs", value: maxSupply },
          { title: "TOTAL MINTED", value: totalMinted },
          { title: "UNIQUE HOLDERS", value: uniqueHolders },
        ].map(({ title, value }) => (
          <li className="basis-1/3" key={title + " " + value}>
            <Card className="py-2 px-4 border-none">
              <p className="label-sm text-black opacity-70 font-[600]">
                {title}
              </p>
              <p className="text-[40px] font-[600] leading-10 tracking-tighter">
                {OtherUtils.clampNumber(value)}
              </p>
            </Card>
          </li>
        ))}
      </ul>

      <Card className="border-none">
        <CardContent
          fullPadding
          className="flex flex-col md:flex-row gap-4 md:justify-between items-start md:items-center flex-wrap "
        >
          <form
            onSubmit={handleSubmitMintNft}
            className="flex flex-col md:flex-row gap-4"
          >
            <Input
              type="number"
              value={nftCount}
              min="1"
              max="10"
              onChange={(e) => setNftCount(parseInt(e.currentTarget.value, 10))}
              className="px-10 py-5 h-full rounded-lg outline outline-1 outline-black"
            />
            <Button
              className="flex justify-center items-center h-full px-10 py-5 uppercase rounded-lg bg-black text-white hover:bg-[#5BFFFC] hover:text-black"
              type="submit"
            >
              Mint
            </Button>
            {!!mintFee && (
              <span className="whitespace-nowrap text-secondary-text body-sm self-center">
                {mintFee} APT
              </span>
            )}
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
