import React from "react";
import Confetti from "react-confetti";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

// Import components
import { PetImage, QuestionMarkImage } from "./Pet";

// Import hooks
import { useAccount } from "../../../hooks/useAccount";

// Import utils
import { AccountUtils } from "../../../utils/account";
import { aptosClient } from "../../../utils/aptos_client";
import { ABI } from "./utils/abi";

export function Mint() {
  const [myPet, setMyPet] = React.useState();
  const [mintSucceeded, setMintSucceeded] = React.useState(false);
  const [transactionInProgress, setTransactionInProgress] =
    React.useState(false);

  const { account } = useAccount();
  const { signAndSubmitTransaction } = useWallet();
  const fetchPet = React.useCallback(async () => {
    if (!account?.address) return;

    const aptogotchiCollectionAddressResponse = await aptosClient().view({
      payload: {
        function: `${ABI.address}::aptogotchi::get_aptogotchi_collection_address`,
      },
    });

    const collectionAddress = AccountUtils.padAddressIfNeeded(
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

  React.useEffect(() => {
    if (!account?.address) return;

    fetchPet();
  }, [account?.address, fetchPet]);

  const handleMint = async () => {
    if (!account) return;

    setMintSucceeded(false);
    setTransactionInProgress(true);
    setMyPet(undefined);

    try {
      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${ABI.address}::aptogotchi::create_aptogotchi`,
          typeArguments: [],
          functionArguments: [
            "examples", // default name
            1, // default body
            1, // default ear
            1, // default face
          ],
        },
      });
      await aptosClient()
        .waitForTransaction({
          transactionHash: response.hash,
        })
        .then(() => {
          fetchPet();
          setMintSucceeded(true);
        });
    } catch (error) {
      console.error(error);
    } finally {
      setTransactionInProgress(false);
    }
  };

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
