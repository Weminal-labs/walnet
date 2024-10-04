import React from "react";
import { useSelector } from "react-redux";
import { ToolBar } from "../../../utils/general";
import "./assets/fileexpo.scss";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

// Import components
import AptodigiMint from "../../../components/apps/aptodigi/Min";

// Import hooks
import { useAccount } from "../../../hooks/useAccount";

export const Aptodigi = () => {
  const wnapp = useSelector((state) => state.apps.aptodigi);

  return (
    <div
      className="msfiles floatTab dpShad"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size == "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
      id={wnapp.icon + "App"}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name={wnapp.name}
      />
      <section>
        <AptodigiMint />
      </section>
    </div>
  );
};
