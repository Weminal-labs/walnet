import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import store from "./reducers";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { BitgetWallet } from "@bitget-wallet/aptos-wallet-adapter";
import { Network } from "@aptos-labs/ts-sdk";

const queryClient = new QueryClient();
const wallets = [new BitgetWallet()];

const root = createRoot(document.getElementById("root"));

root.render(
  <Suspense
    fallback={
      <div id="sus-fallback">
        <h1>Loading</h1>
      </div>
    }
  >
    <QueryClientProvider client={queryClient}>
      <AptosWalletAdapterProvider
        plugins={wallets}
        autoConnect={true}
        dappConfig={{ network: Network.TESTNET, aptosConnectDappId: "dapp-id" }}
      >
        <Provider store={store}>
          <App />
        </Provider>
      </AptosWalletAdapterProvider>
    </QueryClientProvider>
  </Suspense>
);
