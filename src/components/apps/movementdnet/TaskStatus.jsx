import React from "react";
// import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { MdOutlineComputer, MdSearch, MdInfoOutline } from "react-icons/md";
import { BiTask } from "react-icons/bi";
import { GiPowerLightning } from "react-icons/gi";
import { FaCoins } from "react-icons/fa";
import { AiOutlineFieldTime } from "react-icons/ai";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

// Import components
import { toast } from "../../shared/use-toast";

// Import hooks
import { useAccount } from "../../../hooks/useAccount";

// Import utils
import { MovementDNetABI } from "./utils/abi";
import { aptosClient } from "../../../utils/aptos_client";
import { AccountUtils } from "../../../utils/account";

export default function TaskStatus() {
  const { account } = useAccount();
  // const { signAndSubmitTransaction } = useAptosWallet();

  const [taskIndex, setTaskIndex] = React.useState("");
  const [showTaskInfo, setShowTaskInfo] = React.useState(false);
  const [taskAddress, setTaskAddress] = React.useState("");

  const handleSubmit = async function (e) {
    e.preventDefault();

    if (!account) {
      toast.error("Please connect your wallet first!");
      return;
    }

    const { target } = e;
    const taskIndex = target["task_index"].value;

    try {
      const response = await aptosClient().view({
        payload: {
          function: `${MovementDNetABI.address}::network::query_task_info`,
          typeArguments: [],
          functionArguments: [taskIndex],
        },
      });

      toast({
        title: "Task Query",
        description: "Get task information successfully",
      });

      // await aptosClient()
      //   .waitForTransaction({
      //     transactionHash: response.hash,
      //   })
      //   .then(() => {
      //     refreshBalance();
      //     toast({
      //       title: "Transaction Success",
      //       description: "Get task successfully",
      //     });
      //     setShowTaskInfo(true);
      //     setTaskIndex(taskIndex);
      //     setTaskAddress(response[0]);
      //   });
    } catch (error) {
      toast({
        title: "Unknown Error",
        description:
          "An error occurred while query the task. Please try again!",
      });
      console.error(error);
    } finally {
      console.log("End transaction");
    }
  };

  const handleQueryTask = () => {
    // Giả lập việc query thông tin task
    setShowTaskInfo(true);
  };

  return (
    <div className="grid grid-cols-1 gap-6 relative z-10 mt-6">
      <div className="bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4 flex items-center text-white">
          <MdSearch className="w-6 h-6 mr-2 text-blue-400" />
          Query Task
        </h2>

        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center text-white">
            <MdInfoOutline className="w-5 h-5 mr-2 text-yellow-400" />
            What You Can Do Here
          </h3>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Enter a task index to query specific task details</li>
            <li>View comprehensive information about the queried task</li>
            <li>Check the status, rewards, and compute units of your tasks</li>
            <li>Access a history of your recent tasks</li>
          </ul>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-gray-300">
              Task Index To Query
            </label>
            <input
              name="task_index"
              type="text"
              className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Enter task index"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 flex items-center justify-center"
          >
            <MdSearch className="w-5 h-5 mr-2" />
            Query Task
          </button>
        </form>

        {showTaskInfo && (
          <div className="mt-8 bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-white">
              <IoMdCheckmarkCircleOutline className="w-6 h-6 mr-2 text-green-400" />
              Task Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-gray-300">
              <div>
                <p className="font-semibold">Task Index:</p>
                <p>{taskIndex}</p>
              </div>
              <div>
                <p className="font-semibold">Status:</p>
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Completed
                </span>
              </div>
              <div>
                <p className="font-semibold">Node Address:</p>
                <div className="flex items-center">
                  <MdOutlineComputer className="w-4 h-4 mr-2 text-blue-400" />
                  {AccountUtils.hideAddress(taskAddress)}
                </div>
              </div>
              <div>
                <p className="font-semibold">Task Type:</p>
                <div className="flex items-center">
                  <BiTask className="w-4 h-4 mr-2 text-green-400" />
                  GPU Computation
                </div>
              </div>
              <div>
                <p className="font-semibold">Compute Units:</p>
                <div className="flex items-center">
                  <GiPowerLightning className="w-4 h-4 mr-2 text-yellow-400" />2
                  CU
                </div>
              </div>
              <div>
                <p className="font-semibold">Reward:</p>
                <div className="flex items-center">
                  <FaCoins className="w-4 h-4 mr-2 text-yellow-400" />
                  0.0005 APT
                </div>
              </div>
              <div>
                <p className="font-semibold">Compute Time:</p>
                <div className="flex items-center">
                  <AiOutlineFieldTime className="w-4 h-4 mr-2 text-blue-400" />2
                  hours 30 minutes
                </div>
              </div>
              <div>
                <p className="font-semibold">Completion Date:</p>
                <p>2023-05-15 14:30 UTC</p>
              </div>
            </div>
          </div>
        )}

        {/* <div className="text-gray-300 space-y-4 mt-10">
          <h3 className="text-xl font-semibold mb-4">Recent Tasks</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Node Address
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Task Type
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Compute Units
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Reward (APT)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <MdOutlineComputer className="w-4 h-4 mr-2 text-blue-400" />
                      0xf33e...64ba4
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <BiTask className="w-4 h-4 mr-2 text-green-400" />
                      GPU Computation
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <GiPowerLightning className="w-4 h-4 mr-2 text-yellow-400" />
                      500 CU
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaCoins className="w-4 h-4 mr-2 text-yellow-400" />
                      0.5 APT
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div> */}
      </div>
    </div>
  );
}
