import { createSurfClient } from "@thalalabs/surf";

// Import utils
import { aptosClient } from "../../../../utils/aptos_client";
import { ABI } from "./abi";

const surf = createSurfClient(aptosClient()).useABI(ABI);

export function surfClient() {
  return surf;
}
