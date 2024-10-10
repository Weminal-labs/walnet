import React from "react";
import { useSelector } from "react-redux";
import { ToolBar } from "../../../utils/general";
import "./assets/fileexpo.scss";

// Import components
import AptodigiMint from "../../../components/apps/aptodigi/Min";

// Import hooks
import { useAccount } from "../../../hooks/useAccount";
import { DotPattern } from "../../../components/shared/dot-patern";
import { cn } from "../../../utils/tailwind_merge";

export const Aptodigi = () => {
  const wnapp = useSelector((state) => state.apps.aptodigi);

  return (
    <div
      className="blur-glass floatTab dpShad"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size == "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
      id={wnapp.icon + "App"}
    >
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(100%_circle_at_center,white,transparent)]",
        )}
      />
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name={wnapp.name}
      />
      <section className="overflow-y-auto win11Scroll">
        <AptodigiMint />
      </section>
    </div>
  );
};
