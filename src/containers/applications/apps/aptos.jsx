import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Aptos as _Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

// Import components
import CopyIcon from "../../../components/icons/CopyIcon";
import NFT from "../../../components/shared/NFT";

// Import hooks
import { useAccount } from "../../../hooks/useAccount";

// Import utils
import { aptosClient } from "../../../utils/aptos_client";

import { ToolBar } from "../../../utils/general";
import "./assets/fileexpo.scss";

export const Aptos = () => {
  const wnapp = useSelector((state) => state.apps.wallet);
  const dispatch = useDispatch();
  const { account, metadata, refreshBalance } = useAccount();

  const [tokens, setTokens] = React.useState(null);

  const hideAddress = (address) => {
    if (!address) return;
    const first4Digits = address.slice(0, 4);
    const last4Digits = address.slice(-4);
    return first4Digits + " .. " + last4Digits;
  };

  React.useEffect(() => {
    if (!account) return;
    aptosClient()
      .getAccountOwnedTokens({
        accountAddress: account.address,
      })
      .then((response) => {
        console.log("NFTs:", response);
        // Receive only five
        setTokens([
          response[0],
          response[1],
          response[2],
          response[3],
          response[4],
        ]);
      })
      .catch((error) => console.error("Collection Error:", error));
  }, [account]);

  React.useEffect(() => {
    if (!account) return;
    refreshBalance();
  }, [account]);

  return (
    <div
      className="blur-glass shadow-lg mini-fixed-window dpShad w-full top-[1rem] max-w-[420px]"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size == "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={false}
      id={wnapp.icon + "App"}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name={wnapp.name}
        fixed={true}
      />
      <section className="px-2 pb-2 overflow-hidden">
        <div className="mb-6">
          <header>
            <h1 className="text-2xl font-bold">Main account</h1>
          </header>
          <img className="my-3 w-full" src="/img/aptos_walnet.png" />
          <div>
            <div className="flex items-center">
              <span className="break-words">
                <span className="font-bold text-lg">Address:</span>{" "}
                {hideAddress(account?.address)}
              </span>
              <button className="flex items-center cursor-pointer bg-transparent border-none outline-none">
                <CopyIcon />
              </button>
            </div>
            <div>
              <span className="font-bold text-lg">Balance:</span>{" "}
              {metadata.balance}
            </div>
          </div>
        </div>
        <div>
          <header>
            <h1 className="text-2xl font-bold">My collections</h1>
          </header>
          <div className="mt-3">
            <div className="overflow-y-auto max-h-[250px] win11Scroll">
              {tokens &&
                tokens.map((token, index) => {
                  return (
                    <NFT
                      className="mb-3"
                      key={index}
                      data={token.current_token_data}
                    />
                  );
                })}
            </div>
            <button
              onClick={() => {
                dispatch({
                  type: "COLLECTION",
                  payload: "full",
                });
              }}
              className="px-3 py-2 mt-3 w-full border bg-slate-100 border border-black hover:bg-[#5BFFFC]"
            >
              View more
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
