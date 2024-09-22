import React from "react";
import { useSelector } from "react-redux";
import { Aptos as _Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

// Import resources
import { ToolBar } from "../../../utils/general";
import "./assets/fileexpo.scss";

export const Aptos = () => {
  const wnapp = useSelector((state) => state.apps.aptos);
  const account = useSelector((state) => state.account.data);
  const [aptos, setAptos] = React.useState(null);
  const [coin, setCoin] = React.useState(0);

  const getCoin = async (aptos) => {
    const resource = await aptos.getAccountResource({
      accountAddress: account.address,
      resourceType: "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>",
    });

    return resource;
  };

  React.useEffect(() => {
    if (aptos) {
      getCoin(aptos).then((resource) => {
        const value = resource.coin.value;
        console.log("Resource: ", resource);
        setCoin(value);
      });
    }
  }, [aptos]);

  React.useEffect(() => {
    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    setAptos(new _Aptos(aptosConfig));
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
      <section className="w-full h-full p-3">
        <header>
          <h1 className="font-bold">Welcome to Aptos</h1>
          <div>
            <p>Your account information</p>
            <p>Address: {account.address}</p>
            <p>Coin: {coin}</p>
          </div>
        </header>
      </section>
    </div>
  );
};
