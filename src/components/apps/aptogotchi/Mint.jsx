import React from "react";
import Confetti from "react-confetti";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

// Import components
import { PetImage, QuestionMarkImage } from "./Pet";

// Import hooks
import { useAccount } from "../../../hooks/useAccount";

// Import utils
import { aptosClient, surfClient } from "../../../utils/aptos_client";
import { padAddressIfNeeded } from "../../../utils/address";
import { ABI } from "../../../utils/abi";

export function Mint() {
  const [myPet, setMyPet] = React.useState();
  const [mintSucceeded, setMintSucceeded] = React.useState(false);
  const [transactionInProgress, setTransactionInProgress] =
    React.useState(false);

  const { account, network, signAndSubmitTransaction } = useWallet();
  const { refreshBalance } = useAccount();

  const fetchPet = React.useCallback(async () => {
    if (!account?.address) return;

    const aptogotchiCollectionAddressResponse = await aptosClient().view({
      payload: {
        function: `${ABI.address}::aptogotchi::get_aptogotchi_collection_address`,
      },
    });

    const collectionAddress = padAddressIfNeeded(
      aptogotchiCollectionAddressResponse[0]
    );

    const myLatestAptogotchiResponse =
      await aptosClient().getAccountOwnedTokensFromCollectionAddress({
        collectionAddress,
        accountAddress: account.address,
        options: {
          limit: 1,
          orderBy: [
            {
              last_transaction_version: "desc",
            },
          ],
        },
      });

    if (myLatestAptogotchiResponse.length === 0) {
      setMyPet(undefined);
    } else {
      setMyPet(
        await getAptogotchiByAddress(
          myLatestAptogotchiResponse[0].token_data_id
        )
      );
    }
  }, [account?.address]);

  const getAptogotchiByAddress = async (address) => {
    return surfClient()
      .view.get_aptogotchi({
        functionArguments: [address],
        typeArguments: [],
      })
      .then((response) => {
        return {
          live: response[0],
          health: response[1],
          parts: response[2],
        };
      });
  };

  const handleMint = async () => {
    if (!account || !network) return;

    setMintSucceeded(false);
    setTransactionInProgress(true);
    setMyPet(undefined);

    try {
      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${ABI.address}::aptogotchi::create_aptogotchi`,
          typeArguments: [],
          functionArguments: [],
        },
      });
      await aptosClient()
        .waitForTransaction({
          transactionHash: response.hash,
        })
        .then(() => {
          fetchPet();
          setMintSucceeded(true);
          refreshBalance();
        });
    } catch (error) {
      console.error(error);
    } finally {
      setTransactionInProgress(false);
    }
  };

  React.useEffect(() => {
    if (!account?.address || !network) return;

    fetchPet();
  }, [account?.address, fetchPet, network]);

  return (
    <div className="flex flex-col gap-6 max-w-md self-center m-4">
      {mintSucceeded && (
        <Confetti
          className="w-full h-full"
          recycle={false}
          numberOfPieces={3000}
          tweenDuration={15000}
        />
      )}
      <h2 className="text-xl w-full text-center">Create your pet!</h2>
      <p className="w-full text-center">
        Use on chain randomness to create a random look Aptogotchi.
      </p>
      <div className="flex flex-col gap-6 self-center">
        <div
          className={
            "bg-[hsl(104,40%,75%)] border-double border-8 border-black p-2 relative h-80 w-80"
          }
          style={{ paddingTop: "1rem" }}
        >
          {myPet && !transactionInProgress ? (
            <PetImage petParts={myPet.parts} />
          ) : (
            <QuestionMarkImage />
          )}
        </div>
      </div>
      <button
        type="button"
        className="font-pixel cursor-pointer py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-4 border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
        disabled={transactionInProgress}
        onClick={handleMint}
      >
        {transactionInProgress
          ? "Minting..."
          : myPet
          ? "Mint a new Aptogotchi!"
          : "Mint your first Aptogotchi"}
      </button>
      <br />
    </div>
  );
}
