import React from "react";
import { useSelector } from "react-redux";
import { ToolBar } from "../../../utils/general";
import "./assets/fileexpo.scss";

// Import components
import NFT from "../../../components/shared/NFT";

// Import hooks
import { useAccount } from "../../../hooks/useAccount";

// Import utils
import { aptosClient } from "../../../utils/aptos_client";

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
      <section className="px-2 pb-2 h-full contentarea">
        <header>
          <h1 className="text-2xl font-bold mb-3">My collections</h1>
        </header>
        <div className="win11Scroll">
          <div className="w-full grid grid-cols-7">
            {tokens &&
              tokens.map((token, index) => {
                return <NFT className="mb-3 mx-3" key={index} data={token} />;
              })}
          </div>
        </div>
      </section>
    </div>
  );
};
