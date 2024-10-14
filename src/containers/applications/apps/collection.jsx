import React from "react";
import { useSelector } from "react-redux";
import { ToolBar } from "../../../utils/general";
import "./assets/fileexpo.scss";

// import "../../../containers/applications/apps/assets/store.scss";

// Import components
import NFTCollection from "../../../components/shared/NFTCollection";

// Import hooks
import { useAccount } from "../../../hooks/useAccount";

// Import utils
import { aptosClient } from "../../../utils/aptos_client";
import { Spotlight } from "../../../components/shared/splotlight-preview";
import { cn } from "../../../utils/tailwind_merge";
import { DotPattern } from "../../../components/shared/dot-patern";
import NFTDemo from "../../../components/shared/NFTLens";

export const Collection = () => {
  const wnapp = useSelector((state) => state.apps.collection);
  const { account, metadata, refreshBalance } = useAccount();

  const [tokens, setTokens] = React.useState(null);

  React.useEffect(() => {
    if (!account) return;
    aptosClient()
      .getAccountOwnedTokens({
        accountAddress: account.address,
      })
      .then((response) => {
        // Receive only five
        setTokens(response);
      })
      .catch((error) => console.error("Collection Error:", error));
  }, [account]);

  return (
    <div
      className="blur-glass bg-neutral-800/50 floatTab dpShad overflow-hidden relative"
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
          "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
        )}
      />
      <Spotlight
        className={cn(
          "absolute top-0 left-[40%]",
          "h-[200%] w-[200%]"
        )}
        fill="white"
      />
      <Spotlight
        className={cn(
          "absolute -top-10 left-[80%]",
          "h-[200%] w-[100%]"
        )}
        fill="white"
      />

      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name={wnapp.name}
        icon_size={18}
        classname_title="text-xs"
      />

      <div className="w-full h-full p-6 overflow-y-auto win11Scroll win11ScrollDark">
        <h1 className="text-2xl font-bold mb-6 text-neutral-700 dark:text-gray-400">My collections</h1>
        <div className="grid grid-cols-1 gap-4 auto-rows-auto"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))'
          }}>
          {tokens && tokens.map((token, index) => (
            <NFTCollection
              key={index}
              data={token.current_token_data}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
