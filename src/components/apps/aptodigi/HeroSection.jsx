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

export function HeroSection() {
  const { data } = useGetCollectionData(ABI.collection_id);

  const { collection } = data ?? {};

  console.log("Aptodigi Collection:", collection);
  console.log("Aptodigi Data:", data);

  return (
    <section className="hero-container flex flex-col md:flex-row gap-[60px] w-full">
      <Image
        src={
          collection?.cdn_asset_uris?.cdn_image_uri ??
          collection?.cdn_asset_uris?.cdn_animation_uri ??
          "/img/nft_placeholder.png"
        }
        rounded
        className="w-[400px] aspect-square object-cover self-center"
      />
      <div className="basis-3/5 flex flex-col flex-1 gap-6 h-auto justify-end">
        <h1 className="text-[40px] font-[500] text-black">
          {collection?.collection_name ?? "Aptos NFT"}
        </h1>
        <p className="body-sm">
          {collection?.description ?? "This is your Aptos NFT"}
        </p>
        <div className="flex gap-x-2 items-center flex-wrap justify-between uppercase">
          <p className="whitespace-nowrap opacity-70">Collection Address</p>

          <div className="flex gap-x-2">
            <AddressButton address={collection?.collection_id ?? ""} />
            <a
              className="px-3 py-2 border border-black rounded-lg text-black font-bold hover:bg-black hover:text-white transition-colors"
              target="_blank"
              href={`https://explorer.aptoslabs.com/account/${collection?.collection_id}?network=${NETWORK}`}
            >
              View on Explorer
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function AddressButton({ address }) {
  const { copied, copy } = useCopy();

  return (
    <Button
      onClick={() => copy(address)}
      className="whitespace-nowrap flex gap-1 px-0 py-0 h-auto justify-center align-center"
      variant="link"
    >
      {copied ? (
        "Copied!"
      ) : (
        <>
          {AccountUtils.hideAddress(address)}
          <CopyIcon />
        </>
      )}
    </Button>
  );
}
