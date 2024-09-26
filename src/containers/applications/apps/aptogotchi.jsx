import React from "react";
import { useSelector } from "react-redux";
import { ToolBar } from "../../../utils/general";
import "./assets/fileexpo.scss";

// Import components
import { Mint } from "../../../components/apps/aptogotchi/Mint";

export const Aptogotchi = () => {
  const wnapp = useSelector((state) => state.apps.aptogotchi);

  return (
    <div
      className="aptogotchi floatTab dpShad"
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
      <Mint />
    </div>
  );
};
