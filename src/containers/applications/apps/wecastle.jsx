import React from "react";
import { useSelector } from "react-redux";
import { ToolBar } from "../../../utils/general";
import "./assets/fileexpo.scss";

export const Wecastle = () => {
  const wnapp = useSelector((state) => state.apps.wecastle);

  return (
    <div
      className="relative blur-glass shadow-lg mini-fixed-window dpShad left-[8%] w-full top-[1rem] max-w-[320px] rounded-lg overflow-hidden h-[calc(100%-75px)]"
      // className="wecastle-window relative blur-glass shadow-lg mini-fixed-window dpShad rounded-lg overflow-hidden top-[1rem] max-w-[320px] h-[calc(100%-75px)]"
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
        hidden_modify_screen={true}
        classname_title="text-xs"
      />
      <iframe
        className="overflow-y-auto win11Scroll"
        src="https://wecastle.vercel.app/"
        title="Wecastle Gameplay"
        width="100%"
        height="100%"
        style={{ border: "none" }}
      />
    </div>
  );
};
