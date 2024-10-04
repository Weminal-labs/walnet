import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

import { HeroSection } from "./HeroSection";
import { StatsSection } from "./StatsSection";

export default function AptodigiMint() {
  const queryClient = useQueryClient();
  const { account } = useWallet();
  React.useEffect(() => {
    queryClient.invalidateQueries();
  }, [account, queryClient]);

  return (
    <div className="overflow-hidden">
      <main className="flex flex-col gap-10 md:gap-16 mt-6 px-[60px]">
        <HeroSection />
        <div className="h-[1px] w-full border border-black opacity-50"></div>
        <StatsSection />
      </main>

      {/* <footer className="footer-container px-4 pb-6 w-full max-w-screen-xl mx-auto mt-6 md:mt-16 flex items-center justify-between">
          <p>{data?.collection.collection_name}</p>
          <Socials />
        </footer> */}
    </div>
  );
}
