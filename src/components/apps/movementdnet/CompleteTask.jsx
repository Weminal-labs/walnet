import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { FaUserCheck } from "react-icons/fa";
import { MdTaskAlt } from "react-icons/md";
import { RiNodeTree } from "react-icons/ri";
import { GiPowerLightning } from "react-icons/gi";

// Import components
import { toast } from "../../shared/use-toast";

// Import hooks
import { useAccount } from "../../../hooks/useAccount";

// Import utils
import { MovementDNetABI } from "./utils/abi";
import { aptosClient } from "../../../utils/aptos_client";

export default function CompleteTask() {
  const { account } = useAccount();
  const { signAndSubmitTransaction } = useWallet();

  const handleSubmit = async function (e) {
    e.preventDefault();

    if (!account) {
      toast({
        title: "Unanthentication",
        description: "Please connect your wallet first!",
      });
      return;
    }

    const { target } = e;
    const taskIndex = target["task_index"].value;
    const computeTime = target["compute_time"].value;

    try {
      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${MovementDNetABI.address}::network::complete_task`,
          typeArguments: [],
          functionArguments: [taskIndex, computeTime],
        },
      });
      await aptosClient()
        .waitForTransaction({
          transactionHash: response.hash,
        })
        .then(() => {
          toast({
            title: "Transaction Success",
            description: "Task completed successfully!",
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
    <div className="grid grid-cols-1 gap-6 relative z-10 mt-6">
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4 flex items-center text-white">
          <MdTaskAlt className="w-6 h-6 mr-2 text-blue-400" />
          Complete Task
        </h2>

        <div className="text-gray-300 space-y-4 mb-6">
          <p>
            You've reached the final step of the job process. Before completing
            this task, ensure you've gone through the following stages:
          </p>
          <ul className="list-none space-y-2">
            <li className="flex items-center">
              <RiNodeTree className="w-5 h-5 mr-2 text-blue-400" />
              Selected appropriate nodes matching the job criteria
            </li>
            <li className="flex items-center">
              <GiPowerLightning className="w-5 h-5 mr-2 text-blue-400" />
              Resolved energy-related issues for optimal performance
            </li>
            <li className="flex items-center">
              <FaUserCheck className="w-5 h-5 mr-2 text-blue-400" />
              Verified that all assigned jobs have been completed successfully
            </li>
          </ul>
          <p>
            Now, you can finalize the task by providing the required information
            below.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-gray-300">Signer Address</label>
            <input
              disabled
              name="signer_address"
              type="text"
              className="w-full p-2 border rounded bg-white bg-opacity-10 border-gray-600 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Enter your signer address"
              defaultValue={account?.address}
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Task Index</label>
            <input
              name="task_index"
              type="text"
              className="w-full p-2 border rounded bg-white bg-opacity-10 border-gray-600 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Enter your task index"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Compute Time</label>
            <input
              name="compute_time"
              type="text"
              className="w-full p-2 border rounded bg-white bg-opacity-10 border-gray-600 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Enter compute time"
            />
          </div>

          <button className="bg-blue-500 bg-opacity-80 text-white px-4 py-2 rounded hover:bg-blue-600 w-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">
            Complete Task
          </button>
        </form>
      </div>
    </div>
  );
}
