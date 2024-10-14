// Import constants
import { NETWORK } from "../../../../utils/constants";

export const ABI = {
  address:
    NETWORK === "mainnet"
      ? "0x96c192a4e3c529f0f6b3567f1281676012ce65ba4bb0a9b20b46dec4e371cccd"
      : "0x7768e9bcb09adfe6dbbee3a103951ad6199ea2eaa2e7cf78c5feae7a55a0e9d3",
  name: "launchpad",
  collection_id:
    "0xbd96bde626a510145af0a845ac45174f5e111dff40ae9c1622bba59c01c82a92",
};
