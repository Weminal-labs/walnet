import React from "react";
import { useSelector } from "react-redux";
import { ToolBar } from "../../../utils/general";
import "./assets/fileexpo.scss";

export const SocialMove = () => {
  const wnapp = useSelector((state) => state.apps.socialmove);

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
      <iframe
        src="https://social-move-web.vercel.app/create"
        title="Algorand"
        width="100%"
        height="100%"
        style={{ border: "none" }}
      />
    </div>
  );
};
