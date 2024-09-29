import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { BitgetWallet } from "@bitget-wallet/aptos-wallet-adapter";
import { Network } from "@aptos-labs/ts-sdk";

import App from "./App";
import store from "./reducers";

import { Toaster } from "./components/shared/toaster";

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
        dappConfig={{
          network: Network.TESTNET,
          aptosConnect: { dappId: "57fa42a9-29c6-4f1e-939c-4eefa36d9ff5" },
        }}
        onError={(error) => {
          console.error("Provider error:", error);
        }}
      >
        <Provider store={store}>
          <App />
        </Provider>
        <Toaster />
      </AptosWalletAdapterProvider>
    </QueryClientProvider>
  </Suspense>
);
