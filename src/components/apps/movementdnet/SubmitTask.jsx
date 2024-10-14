import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  FaCloudUploadAlt,
  FaMicrochip,
  FaCoins,
  FaInfoCircle,
} from "react-icons/fa";

// Import components
import { toast } from "../../shared/use-toast";

// Import hooks
import { useAccount } from "../../../hooks/useAccount";

// Import utils
import { MovementDNetABI } from "./utils/abi";
import { aptosClient } from "../../../utils/aptos_client";

export default function SubmitTask() {
  const { account, metadata, refreshBalance } = useAccount();
  const { signAndSubmitTransaction } = useWallet();

  const handleSubmit = async function (e) {
    e.preventDefault();

    if (!account) {
      toast.error("Please connect your wallet first!");
      return;
    }

    const { target } = e;
    const taskType = target["task_type"].value;
    const computeUnits = target["compute_units"].value;
    const reward = target["reward"].value;

    if (reward >= metadata.balance) {
      toast({
        title: "Transaction Error",
        description: "Insufficient balance!",
      });
      return;
    }

    try {
      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${MovementDNetABI.address}::network::submit_task`,
          typeArguments: [],
          functionArguments: [taskType, computeUnits, reward],
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
            description: "Task submitted successfully!",
          });
        });
    } catch (error) {
      console.error(error);
      toast({
        title: "Unknown Error",
        description:
          "An error occurred while submitting the task. Please try again!",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 relative z-10 mt-6 overflow-y-auto">
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4 flex items-center text-white">
          <FaCloudUploadAlt className="mr-2 text-blue-400" /> Submit New Task
        </h2>

        <div className="text-gray-300 space-y-4 mb-6">
          <p>
            Need extra computing power? Let dpin's distributed network handle
            your resource-intensive tasks. Our global network of GPU nodes is
            ready to tackle your computational challenges quickly and
            efficiently.
          </p>
          <p>Benefits of submitting tasks to dpin:</p>
          <ul className="list-none space-y-2">
            <li className="flex items-center">
              <FaMicrochip className="mr-2 text-blue-400" />
              Access to high-performance GPU computing power on demand
            </li>
            <li className="flex items-center">
              <FaCoins className="mr-2 text-blue-400" />
              Cost-effective solution for resource-intensive tasks
            </li>
            <li className="flex items-center">
              <FaCloudUploadAlt className="mr-2 text-blue-400" />
              Faster processing times compared to traditional methods
            </li>
            <li className="flex items-center">
              <FaMicrochip className="mr-2 text-blue-400" />
              Scalable resources to meet your project needs
            </li>
          </ul>
          <p>
            Simply fill out the form below to submit your task. Choose the task
            type, specify the required compute units, and set your reward in APT
            tokens.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-gray-300">Task Type</label>
            <select
              name="task_type"
              className="w-full p-2 border rounded bg-white bg-opacity-10 border-gray-600 text-white"
            >
              <option value={1}>Machine Learning</option>
              <option value={2}>Data Processing</option>
              <option value={3}>Rendering</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-gray-300">Compute Units</label>
            <input
              name="compute_units"
              type="number"
              className="w-full p-2 border rounded bg-white bg-opacity-10 border-gray-600 text-white"
              placeholder="Enter required compute units"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300">Reward (APT)</label>
            <input
              name="reward"
              type="number"
              className="w-full p-2 border rounded bg-white bg-opacity-10 border-gray-600 text-white"
              placeholder="Enter reward amount in APT"
            />
          </div>
          <button className="bg-blue-500 bg-opacity-80 text-white px-4 py-2 rounded hover:bg-blue-600 w-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">
            Submit Task
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-400 flex items-start">
          <FaInfoCircle className="mr-2 mt-1 flex-shrink-0" />
          <p>
            Task completion time may vary based on network availability and task
            complexity. Larger rewards may incentivize faster processing. For
            more information on task types and pricing, please refer to our
            documentation.
          </p>
        </div>
      </div>
    </div>
  );
}
