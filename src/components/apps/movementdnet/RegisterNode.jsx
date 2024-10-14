import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { FaUsers } from "react-icons/fa";
import { BsGpuCard } from "react-icons/bs";
import { MdOutlineComputer } from "react-icons/md";
import { GiReceiveMoney } from "react-icons/gi";
import { RiSecurePaymentLine } from "react-icons/ri";

// Import
import { toast } from "../../shared/use-toast";

// Import hooks
import { useAccount } from "../../../hooks/useAccount";

// Import utils
import { MovementDNetABI } from "./utils/abi";
import { aptosClient } from "../../../utils/aptos_client";

export default function RegisterNode() {
  const { account, refreshBalance } = useAccount();
  const { signAndSubmitTransaction } = useWallet();

  const handleSubmit = async function (e) {
    e.preventDefault();

    if (!account) {
      toast.error("Please connect your wallet first!");
      return;
    }

    try {
      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${MovementDNetABI.address}::network::register_node`,
          typeArguments: [],
          functionArguments: [],
        },
      });
      await aptosClient()
        .waitForTransaction({
          transactionHash: response.hash,
        })
        .then(() => {
          refreshBalance();
          toast({
            title: "Transaction Success",
            description: "GPU Node registered successfully!",
          });
        });
    } catch (error) {
      console.error(error);
      toast({
        title: "Unknown Error",
        description:
          "An error occurred while query the task. Please try again!",
      });
    } finally {
      console.log("End transaction");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 relative z-10 mt-6 overflow-y-auto">
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4 flex items-center text-white">
          <BsGpuCard className="w-6 h-6 mr-2 text-blue-400" />
          Register GPU Node
        </h2>

        <div className="text-gray-300 space-y-4 mb-6">
          <p>
            Join the dpin network by registering your GPU node. Our distributed
            computing system harnesses the power of GPUs worldwide to process
            complex calculations and maintain blockchain integrity.
          </p>
          <p>By participating, you'll:</p>
          <ul className="list-none space-y-2">
            <li className="flex items-center">
              <MdOutlineComputer className="w-5 h-5 mr-2 text-blue-400" />
              Contribute to a cutting-edge distributed computing network
            </li>
            <li className="flex items-center">
              <GiReceiveMoney className="w-5 h-5 mr-2 text-blue-400" />
              Earn rewards based on your GPU's performance and uptime
            </li>
            <li className="flex items-center">
              <RiSecurePaymentLine className="w-5 h-5 mr-2 text-blue-400" />
              Help validate transactions and secure the blockchain
            </li>
            <li className="flex items-center">
              <FaUsers className="w-5 h-5 mr-2 text-blue-400" />
              Be part of a global community of GPU contributors
            </li>
          </ul>
          <p>
            To get started, simply enter your signer address below. This address
            will be used to identify your node and send your earned rewards.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-gray-300">Signer Address</label>
            <input
              type="text"
              name="signer_address"
              className="w-full p-2 border rounded bg-white bg-opacity-10 border-gray-600 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Enter your signer address"
              defaultValue={account?.address}
              disabled
            />
          </div>
          <button className="bg-blue-500 bg-opacity-80 text-white px-4 py-2 rounded hover:bg-blue-600 w-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">
            Register GPU Node
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-400">
          <p>
            Note: Ensure your GPU meets the minimum requirements for
            participation. For more information on hardware specifications and
            expected rewards, please visit our FAQ section.
          </p>
        </div>
      </div>
    </div>
  );
}
