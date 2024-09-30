import React from "react";
import { useSelector } from "react-redux";
import { Aptos as _Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

// Import components
import CopyIcon from "../../../components/icons/CopyIcon";

// Import hooks
import { useAccount } from "../../../hooks/useAccount";

// Import utils
import { aptosClient } from "../../../utils/aptos_client";

import { ToolBar } from "../../../utils/general";
import "./assets/fileexpo.scss";

export const Aptos = () => {
  const wnapp = useSelector((state) => state.apps.wallet);
  const { account, metadata, refreshBalance } = useAccount();

  const hideAddress = (address) => {
    if (!address) return;
    const first4Digits = address.slice(0, 4);
    const last4Digits = address.slice(-4);
    return first4Digits + " .. " + last4Digits;
  };

  React.useEffect(() => {
    if (account) refreshBalance();
  }, [account]);

  return (
    <div
      className="blur-glass shadow-lg fixedTRTab dpShad w-full max-w-[375px]"
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
        <header>
          <h1 className="font-bold">Main account</h1>
        </header>
        <div>
          <div className="flex items-center">
            <span className="break-words">
              <span className="font-bold">Address:</span>{" "}
              {hideAddress(account?.address)}
            </span>
            <button className="flex items-center cursor-pointer bg-transparent border-none outline-none">
              <CopyIcon />
            </button>
          </div>
          <div>
            <span className="font-bold">Balance:</span> {metadata.balance}
          </div>
        </div>
      </section>
    </div>
  );
};
