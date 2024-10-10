import React from "react";
import { useQueryClient } from "@tanstack/react-query";

// Import components
import { HeroSection } from "./HeroSection";

// Import hooks
import { useAccount } from "../../../hooks/useAccount";

export default function AptodigiMint() {
  const queryClient = useQueryClient();
  const { account } = useAccount();
  React.useEffect(() => {
    queryClient.invalidateQueries();
  }, [account, queryClient]);

  return (
    <div className="overflow-hidden">
      <main className="flex flex-col space-y-4 mt-6 px-12 py-6 ">
        <HeroSection />
        {/* <div className="h-[1px] w-full border border-black opacity-50"></div> */}
      </main>

      {/* <footer className="footer-container px-4 pb-6 w-full max-w-screen-xl mx-auto mt-6 md:mt-16 flex items-center justify-between">
        <p>{data?.collection.collection_name}</p>
        <Socials />
      </footer> */}
    </div>
  );
}
