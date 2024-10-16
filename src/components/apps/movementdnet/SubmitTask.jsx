import React, { useState, useEffect, useRef } from 'react';
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
import CustomSelect from "./CustomSelect";

export default function SubmitTask() {
  const { account, metadata, refreshBalance } = useAccount();
  const { signAndSubmitTransaction } = useWallet();
  const [clusterIds, setClusterIds] = useState([]);
  const [selectedClusterId, setSelectedClusterId] = useState('');
  const [selectedClusterInfo, setSelectedClusterInfo] = useState(null);

  const clusterTypes = [
    { id: 1, name: 'General', description: 'Best for prototyping or general E2E Workloads' },
    { id: 2, name: 'Train', description: 'Production ready clusters for machine learning models training and fine tuning' },
    { id: 3, name: 'Inference', description: 'Production ready clusters for low latency inference and heavy workloads' },
  ];

  const processors = [
    { id: 1, name: 'M2 Pro', count: 38, type: 'apple' },
    { id: 2, name: 'M2 Max', count: 27, type: 'apple' },
    { id: 3, name: 'M3 Pro', count: 22, type: 'apple' },
    { id: 4, name: 'M3', count: 18, type: 'apple' },
    { id: 5, name: 'M3 Max', count: 11, type: 'apple' },
    { id: 6, name: 'M2 Ultra', count: 6, type: 'apple' },
    { id: 7, name: 'GeForce RTX 3080', count: 64, type: 'nvidia' },
    { id: 8, name: 'H100 PCIe', count: 60, type: 'nvidia' },
    { id: 9, name: 'GeForce RTX 4090', count: 56, type: 'nvidia' },
    { id: 10, name: 'A100-PCIE-40GB', count: 24, type: 'nvidia' },
    { id: 11, name: 'Tesla V100-SXM2-16GB', count: 0, type: 'nvidia' },
  ];

  useEffect(() => {
    if (account) {
      queryClustersId();
    }
  }, [account]);
  console.log("account.address", account.address);

  const queryClustersId = async () => {
    try {
      const response = await aptosClient().view({
        payload: {
          function: `${MovementDNetABI.address}::network::query_clusters_id`,
          typeArguments: [],
          functionArguments: [account.address],
        },
      });
      setClusterIds(response[0]);
      console.log("response", response);
    } catch (error) {
      console.error("Error querying cluster IDs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch cluster IDs. Please try again.",
      });
    }
  };

  const handleClusterSelect = async (clusterId) => {
    setSelectedClusterId(clusterId);
    // if (clusterId) {
    //   try {
    //     const response = await aptosClient().view({
    //       payload: {
    //         function: `${MovementDNetABI.address}::network::query_cluster_info`,
    //         typeArguments: [],
    //         functionArguments: [clusterId],
    //       },
    //     });
    //     setSelectedClusterInfo(response);
    //   } catch (error) {
    //     console.error("Error querying cluster info:", error);
    //     toast({
    //       title: "Error",
    //       description: "Failed to fetch cluster information. Please try again.",
    //     });
    //   }
    // } else {
    //   setSelectedClusterInfo(null);
    // }
  };

  const handleSubmit = async function (e) {
    e.preventDefault();

    if (!account) {
      toast.error("Please connect your wallet first!");
      return;
    }

    const { target } = e;
    const cluster_type = 1;
    const cluster_processor = 1;
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
          functionArguments: [selectedClusterId, cluster_processor, cluster_type, reward],
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
            type, select the cluster and set your reward in APT
            tokens.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-gray-300">Select Cluster</label>
            <CustomSelect
              options={clusterIds}
              value={selectedClusterId}
              onChange={handleClusterSelect}
            />
          </div>

          {selectedClusterInfo && (
            <div className="mt-4 p-4 bg-gray-800 bg-opacity-50 rounded">
              <p className="text-gray-300">
                Cluster Type: {clusterTypes.find(t => t.id === selectedClusterInfo.cluster_type)?.name || 'Unknown'}
              </p>
              <p className="text-gray-300">
                Processor: {processors.find(p => p.id === selectedClusterInfo.processor_id)?.name || 'Unknown'}
              </p>
            </div>
          )}

          <div>
            <label className="block mb-1 text-gray-300">Reward (APT)</label>
            <input
              name="reward"
              type="number"
              className="w-full p-2 border rounded bg-white bg-opacity-10 border-gray-600 text-white"
              placeholder="Enter reward amount in APT"
            />
          </div>

          <button
            className="bg-blue-500 bg-opacity-80 text-white px-4 py-2 rounded hover:bg-blue-600 w-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">
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
