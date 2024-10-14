import React from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQueryClient } from "@tanstack/react-query";

// Import components
import { Button } from "../../shared/button";
import { Input } from "../../shared/input";
import { toast } from "../../shared/use-toast";

// Import hooks
import { useGetCollectionData } from "../../../hooks/useGetCollectionData";
import { useAccount } from "../../../hooks/useAccount";

// Import utils
import { aptosClient } from "../../../utils/aptos_client";
import { OtherUtils } from "../../../utils/other";
import { ABI } from "./utils/abi";

import "./stats-section.css";

export function StatsSection() {
  const queryClient = useQueryClient();
  const { signAndSubmitTransaction } = useWallet();

  const { account, metadata } = useAccount();
  const [nftCount, setNftCount] = React.useState(1);
  const [mintFee, setMintFee] = React.useState(0);

  const { data } = useGetCollectionData(ABI.collection_id);
  const {
    collection,
    maxSupply = 0,
    totalMinted = 0,
    uniqueHolders = 0,
  } = data ?? {};

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

    console.log("Collection:", collection);
    console.log("Account:", account);
    console.log("Metadata:", metadata);
    console.log("Mintfee:", mintFee);

    if (!collection?.collection_id) return;
    if (!account) {
      toast({
        variant: "destructive",
        title: "Aptodigi Error",
        description:
          "You have to connect to wallet before to do this transaction",
      });
      return;
    }
    if (metadata.balance !== undefined && metadata.balance < mintFee) {
      toast({
        variant: "destructive",
        title: "Aptodigi Error",
        description: "Insufficient fund",
      });
      return;
    }

    const response = await signAndSubmitTransaction({
      data: {
        function: `${ABI.address}::${ABI.name}::mint_nft`,
        typeArguments: [],
        functionArguments: [collection.collection_id, nftCount],
      },
    });
    await aptosClient().waitForTransaction({ transactionHash: response.hash });
    queryClient.invalidateQueries();
    setNftCount(1);
  };

  React.useEffect(() => {
    if (collection) getMintFee().then((mintFee) => setMintFee(mintFee));
  }, [collection]);

  return (
    <section>
      <div className="stats-container">
        <div className="stat-item">
          <span className="stat-title">Total Supply</span>
          <span className="stat-value">
            {OtherUtils.clampNumber(maxSupply)}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-title">Total Minted</span>
          <span className="stat-value">
            {OtherUtils.clampNumber(totalMinted)}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-title">Unique Holders</span>
          <span className="stat-value">
            {OtherUtils.clampNumber(uniqueHolders)}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <form onSubmit={handleSubmitMintNft} className="mint-form">
          <Input
            type="number"
            value={nftCount}
            min="1"
            max="10"
            onChange={(e) => setNftCount(parseInt(e.currentTarget.value, 10))}
            className="mint-input"
          />
          <Button type="submit" className="mint-button cursor-pointer">
            Mint
          </Button>
        </form>
        {!!mintFee && <span className="mint-fee">{mintFee} APT</span>}
      </div>
    </section>
  );
}
