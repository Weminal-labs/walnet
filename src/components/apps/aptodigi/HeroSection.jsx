import React from "react";

// Import components
import { Button } from "../../shared/button";
import { Image } from "../../shared/image";
import CopyIcon from "../../icons/CopyIcon";

// Import hooks
import { useGetCollectionData } from "../../../hooks/useGetCollectionData";
import { useCopy } from "../../../hooks/useCopy";

// Import utils
import { AccountUtils } from "../../../utils/account";
import { NETWORK } from "../../../utils/constants";
import { ABI } from "./utils/abi";
import "./hero-section.css";
import { StatsSection } from "./StatsSection";

export function HeroSection() {
  const { data } = useGetCollectionData(ABI.collection_id);
  const { collection } = data ?? {};

  console.log("Collection Data:", data);

  return (
    <section className="space-y-8 py-10 hero-container relative overflow-hidden p-6 rounded-xl shadow-lg bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg text-gray-800 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 opacity-20 z-0"></div>
      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-2/5 flex justify-center">
          <Image
            src={
              collection?.cdn_asset_uris?.cdn_image_uri ??
              collection?.cdn_asset_uris?.cdn_animation_uri ??
              "/img/nft_placeholder.png"
            }
            rounded
            className="w-full max-w-[300px] aspect-square object-cover shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl"
          />
        </div>
        <div className="w-full md:w-3/5 flex flex-col gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {collection?.collection_name ?? "Move NFT"}
            </h1>
            <p className="text-base text-gray-700">
              {collection?.description ?? "This is your Move NFT"}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-gray-600 uppercase font-medium">
              Collection Address
            </p>
            <div className="flex flex-wrap gap-3">
              <AddressButton address={collection?.collection_id ?? ""} />
              <ExplorerButton address={collection?.collection_id ?? ""} />
            </div>
          </div>
        </div>
      </div>

      <StatsSection />
    </section>
  );
}

function AddressButton({ address }) {
  const { copied, copy } = useCopy();

  return (
    <Button
      onClick={() => copy(address)}
      className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-all duration-300 bg-white bg-opacity-20 hover:bg-opacity-30 text-gray-800 hover:shadow-md backdrop-filter backdrop-blur-sm"
    >
      {copied ? (
        "Copied!"
      ) : (
        <>
          {AccountUtils.hideAddress(address)}
          <CopyIcon className="text-gray-600 w-4 h-4" />
        </>
      )}
    </Button>
  );
}

function ExplorerButton({ address }) {
  return (
    <a
      className="inline-flex items-center px-3 py-1.5 text-sm rounded-md font-medium transition-all duration-300 bg-blue-500 bg-opacity-80 text-white hover:bg-opacity-90 hover:shadow-md backdrop-filter backdrop-blur-sm"
      target="_blank"
      rel="noopener noreferrer"
      href={`https://explorer.aptoslabs.com/account/${address}?network=${NETWORK}`}
    >
      View on Explorer
    </a>
  );
}
