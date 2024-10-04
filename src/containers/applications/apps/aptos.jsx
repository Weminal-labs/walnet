import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Aptos as _Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import "../../../utils/aptos.scss";

// Import components
import CopyIcon from "../../../components/icons/CopyIcon";
import NFT from "../../../components/shared/NFT";

// Import hooks
import { useAccount } from "../../../hooks/useAccount";

// Import utils
import { AccountUtils } from "../../../utils/account";
import { aptosClient } from "../../../utils/aptos_client";
import { ToolBar } from "../../../utils/general";

import "./assets/fileexpo.scss";
import { Spotlight } from "../../../components/shared/splotlight-preview";
import { cn } from "../../../utils/tailwind_merge";
import GridPattern from "../../../components/shared/animated-grid-pattern";
import { PlusIcon } from "lucide-react";

const BlurCard = ({ account, hideAddress, metadata }) => {
  return (
    <div className="bg-white bg-opacity-[0.01] backdrop-filter backdrop-blur-3xl rounded-xl shadow-2xl p-6 max-w-sm mx-auto">
      <h2 className="text-xl font-semibold text-gray-200 mb-4">Main Account</h2>
      <div className="flex flex-row justify-between border-b border-gray-300 border-opacity-30 pb-2 mb-4">
        <p className="text-sm text-gray-400 font-medium">BALANCE</p>
        <p className="text-sm text-gray-400 font-medium">{metadata?.balance} APT</p>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src="/img/icon/ui/google.png" alt="Google" className="w-6 h-6" />
          <div>
            <p className="text-sm font-medium text-gray-200">{account?.email || '162001605@dntu.edu.vn'}</p>
            <p className="text-xs text-gray-400">{hideAddress(account?.address) || '0x205f...62a8'}</p>
          </div>
        </div>
        <button className="text-blue-400 hover:text-blue-300 transition-colors">
          <CopyIcon />
        </button>
      </div>
    </div>
  );
};

export const Aptos = () => {
  const wnapp = useSelector((state) => state.apps.wallet);
  const dispatch = useDispatch();
  const { account, metadata, refreshBalance } = useAccount();

  const [tokens, setTokens] = React.useState(null);

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
      className="relative blur-glass shadow-lg mini-fixed-window dpShad w-full top-[1rem] max-w-[380px] rounded-lg overflow-hidden h-[calc(100%-75px)]"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size == "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={false}
      id={wnapp.icon + "App"}
    >
      <GridPattern
        numSquares={30}
        maxOpacity={0.05}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-20%] h-[150%] skew-y-12",
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
        fixed={true}
        // hidden_minimize={true}
        // hidden_close={true}
        hidden_modify_screen={true}
        icon_size={18}
        classname_title="text-xs"
      />
      <section
        className={cn(
          "w-full h-[calc(100%-2rem)] flex flex-col items-center justify-start",
          "antialiased bg-grid-white/[0.02] relative overflow-y-auto px-4",
          "win11Scroll"
        )}
      >
        {/* Header */}

        <div className="relative z-10 w-full mx-auto">
          <img className="w-[70%] m-auto" src="/img/aptos_walnet.png" alt="Aptos Wallet" />
        </div>

        <div className="w-full">
          <BlurCard account={account} hideAddress={hideAddress} metadata={metadata} />
        </div>

        <div className="my-4 w-full">
          <h1 className="text-2xl font-bold text-white mb-4">My collections</h1>
          <div className="space-y-4">
            {tokens && tokens.length > 0 ? (
              <>
                {tokens.map((token, index) => (
                  <NFT
                    key={index}
                    data={token}
                  />
                ))}
                <button
                  onClick={() => {
                    dispatch({
                      type: "COLLECTION",
                      payload: "full",
                    });
                  }}
                  className="group relative w-full mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 backdrop-blur text-white/80 font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-white/5 overflow-hidden"
                >
                  <span className="relative z-10">View more</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4 bg-white/5 backdrop-blur-md rounded-xl p-8 text-center">
                <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <PlusIcon className="w-10 h-10 text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">No collections yet</h2>
                <p className="text-gray-400 max-w-md">Start building your NFT collection by adding your first item.</p>
                <button
                  onClick={() => console.log("Add collection")}
                  className="group relative w-full mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 backdrop-blur text-white/80 font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-white/5 overflow-hidden"
                >
                  <span className="relative z-10">Add collection</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};