import React, { useState, useEffect } from 'react';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  FaCloudUploadAlt,
  FaMicrochip,
  FaCoins,
  FaInfoCircle,
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
  FaFlag,
  FaApple,
  // FaNvidia,
} from "react-icons/fa";
import ReactCountryFlag from "react-country-flag";

// Import components
import { toast } from "../../shared/use-toast";

// Import hooks
import { useAccount } from "../../../hooks/useAccount";

// Import utils
import { MovementDNetABI } from "./utils/abi";
import { aptosClient } from "../../../utils/aptos_client";

export default function WalnetProvider() {
  const { account, metadata, refreshBalance } = useAccount();
  const { signAndSubmitTransaction } = useWallet();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClusterType, setSelectedClusterType] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProcessor, setSelectedProcessor] = useState(null);
  const [searchProcessor, setSearchProcessor] = useState('');
  const [selectedType, setSelectedType] = useState('all');

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

  const steps = [
    'Cluster Type',
    'Location',
    'Select Your Cluster Processor',
    'Summary'
  ];

  const clusterTypes = [
    { id: 1, name: 'General', description: 'Best for prototyping or general E2E Workloads' },
    { id: 2, name: 'Train', description: 'Production ready clusters for machine learning models training and fine tuning' },
    { id: 3, name: 'Inference', description: 'Production ready clusters for low latency inference and heavy workloads' },
  ];

  const countries = [
    { code: 'vn', name: 'Vietnam' },
    { code: 'th', name: 'Thailand' },
    { code: 'sg', name: 'Singapore' },
    { code: 'my', name: 'Malaysia' },
    { code: 'id', name: 'Indonesia' },
    { code: 'ph', name: 'Philippines' },
    { code: 'mm', name: 'Myanmar' },
    { code: 'kh', name: 'Cambodia' },
    { code: 'la', name: 'Laos' },
    { code: 'bn', name: 'Brunei' },
    { code: 'tl', name: 'East Timor' },
  ];

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleClusterTypeSelect = (id) => {
    setSelectedClusterType(id);
  };

  const handleLocationSelect = (countryCode) => {
    setSelectedLocations(prev => {
      if (prev.includes(countryCode)) {
        return prev.filter(code => code !== countryCode);
      } else {
        return [...prev, countryCode];
      }
    });
  };

  const handleSelectAllCountries = () => {
    if (selectedLocations.length === countries.length) {
      setSelectedLocations([]);
    } else {
      setSelectedLocations(countries.map(country => country.code));
    }
  };

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProcessors = processors.filter(
    (processor) =>
      processor.name.toLowerCase().includes(searchProcessor.toLowerCase()) &&
      (selectedType === 'all' || processor.type === selectedType)
  );

  // const handleSubmit = async function (e) {
  //   e.preventDefault();

  //   if (!account) {
  //     toast.error("Please connect your wallet first!");
  //     return;
  //   }

  //   const { target } = e;
  //   const taskType = target["task_type"].value;
  //   const computeUnits = target["compute_units"].value;
  //   const reward = target["reward"].value;

  //   if (reward >= metadata.balance) {
  //     toast({
  //       title: "Transaction Error",
  //       description: "Insufficient balance!",
  //     });
  //     return;
  //   }

  //   try {
  //     const response = await signAndSubmitTransaction({
  //       sender: account.address,
  //       data: {
  //         function: `${MovementDNetABI.address}::network::submit_task`,
  //         typeArguments: [],
  //         functionArguments: [taskType, computeUnits, reward],
  //       },
  //     });
  //     await aptosClient()
  //       .waitForTransaction({
  //         transactionHash: response.hash,
  //       })
  //       .then(() => {
  //         refreshBalance();
  //         toast({
  //           title: "Transaction Success",
  //           description: "Task submitted successfully!",
  //         });
  //       });
  //   } catch (error) {
  //     console.error(error);
  //     toast({
  //       title: "Unknown Error",
  //       description:
  //         "An error occurred while submitting the task. Please try again!",
  //     });
  //   }
  // };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDeployCluster = async () => {
    if (!account) {
      toast.error("Please connect your wallet first!");
      return;
    }

    // Convert selectedClusterType to uint256


    // Combine selected locations into a string
    const location = selectedLocations.join(',');

    if (!selectedClusterType || !location || !selectedProcessor) {

      toast({
        title: "Input Error",
        description: "Please fill in all cluster information!",
      });
      return;
    }

    try {
      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${MovementDNetABI.address}::network::register_cluster`,
          typeArguments: [],
          functionArguments: [selectedClusterType, selectedProcessor, location],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: response.hash });

      refreshBalance();
      toast({
        title: "Transaction Success",
        description: "Ray cluster has been registered successfully!",
      });

      // Reset states after successful registration
      setSelectedClusterType('');
      setSelectedLocations([]);
      setSelectedProcessor('');
      setCurrentStep(1); // Go back to the first step
    } catch (error) {
      console.error(error);
      toast({
        title: "Unknown Error",
        description: "An error occurred while registering the cluster. Please try again!",
      });
    }
  };

  const renderNavigationButtons = () => {
    return (
      <div className="flex space-x-4">
        {currentStep > 1 && (
          <button
            className="bg-white bg-opacity-10 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300 flex items-center"
            onClick={handlePreviousStep}
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
        )}
        {currentStep < steps.length && (
          <button
            className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 flex items-center"
            onClick={handleNextStep}
            disabled={(currentStep === 1 && !selectedClusterType) || (currentStep === 2 && selectedLocations.length === 0)}
          >
            Next <FaArrowRight className="ml-2" />
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow min-h-[600px]">
        <div className="mx-auto flex h-full">
          {/* Creation Steps */}
          <div className="w-80 border-r border-gray-500 pr-6 pl-8 h-full">
            <h3 className="text-xl font-bold mb-6 text-white">Creation Steps</h3>
            <div className="space-y-4 relative">
              <div
                className="absolute left-[-16px] top-0 bottom-0 w-[2px] bg-blue-500"
                style={{ height: `${((currentStep - 1) / steps.length) * 100 + 10}%` }}
              ></div>
              {steps.map((step, index) => (
                <div key={index} className="flex items-center relative">
                  <div className={`absolute left-[-26px] w-6 h-6 rounded-full 
                    ${index + 1 < currentStep ? 'bg-blue-500' :
                      index + 1 === currentStep ? 'bg-blue-500' :
                        'bg-white bg-opacity-10 border-gray-600'} 
                    flex items-center justify-center`}>
                    {index + 1 < currentStep ? (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-xs text-white">{index + 1}</span>
                    )}
                  </div>
                  <span className={index + 1 <= currentStep ? 'text-blue-500 ml-2' : 'text-gray-300 ml-2'}>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-grow ms-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{currentStep}. {steps[currentStep - 1]}</h2>
              {renderNavigationButtons()}
            </div>

            {currentStep === 1 && (
              <>
                <p className="text-gray-300 mb-6">Select the type of nodes aggregated in your cluster.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clusterTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`border ${selectedClusterType === type.id ? 'border-blue-500' : 'border-gray-600'} rounded-lg p-4 bg-white bg-opacity-5 hover:bg-opacity-10 transition-all duration-300 cursor-pointer`}
                      onClick={() => handleClusterTypeSelect(type.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg text-white">{type.name}</h3>
                        <div className={`w-6 h-6 rounded-full border-2 ${selectedClusterType === type.name ? 'border-blue-500 bg-blue-500' : 'border-gray-400'} flex items-center justify-center`}>
                          {selectedClusterType === type.id && <div className="w-3 h-3 rounded-full bg-white"></div>}
                        </div>
                      </div>
                      <p className="text-sm text-gray-300">{type.description}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {currentStep === 2 && (
              <div >
                <div className="mb-6 flex flex-col lg:flex-row items-center gap-4">
                  <div className="relative flex-grow w-full">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search"
                      className="w-full bg-white bg-opacity-10 border border-gray-600 rounded-md py-2 pl-10 pr-4 text-white placeholder-gray-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button
                    className="bg-blue-600 text-white px-1 py-2 rounded hover:bg-blue-700 transition duration-300 w-40"
                    onClick={handleSelectAllCountries}
                  >
                    {selectedLocations.length === countries.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCountries.map((country) => (
                    <div
                      key={country.code}
                      className={`flex items-center justify-between p-4 rounded-md cursor-pointer ${selectedLocations.includes(country.code)
                        ? 'bg-blue-600 bg-opacity-70'
                        : 'bg-white bg-opacity-5 hover:bg-opacity-10'
                        } transition-all duration-300`}
                      onClick={() => handleLocationSelect(country.code)}
                    >
                      <div className="flex items-center">
                        <ReactCountryFlag
                          countryCode={country.code}
                          svg
                          style={{
                            width: '1.5em',
                            height: '1.5em',
                            marginRight: '0.5em'
                          }}
                          title={country.name}
                        />
                        <span className="text-white">{country.name}</span>
                      </div>
                      {selectedLocations.includes(country.code) && (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="">
                <div className="flex mb-6 space-x-2">
                  <button
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${selectedType === 'all' ? 'bg-blue-600 text-white' : 'bg-white bg-opacity-10 text-gray-300 hover:bg-opacity-30'
                      }`}
                    onClick={() => setSelectedType('all')}
                  >
                    All
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg flex items-center transition-all duration-300 ${selectedType === 'nvidia' ? 'bg-blue-600 text-white' : 'bg-white bg-opacity-10 text-gray-300 hover:bg-opacity-30'
                      }`}
                    onClick={() => setSelectedType('nvidia')}
                  >
                    <img src={"/img/icon/nvidia.png"} className="mr-2 h-auto w-6" /> NVIDIA
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg flex items-center transition-all duration-300 ${selectedType === 'apple' ? 'bg-blue-600 text-white' : 'bg-white bg-opacity-10 text-gray-300 hover:bg-opacity-30'
                      }`}
                    onClick={() => setSelectedType('apple')}
                  >
                    <FaApple className="mr-2 w-6 h-6" /> Apple
                  </button>
                </div>

                <div className="relative mb-6">
                  <input
                    type="text"
                    placeholder="Search for GPU..."
                    className="w-full bg-white bg-opacity-10 border border-gray-600 rounded-md py-2 pl-10 pr-4 text-white placeholder-gray-400"
                    value={searchProcessor}
                    onChange={(e) => setSearchProcessor(e.target.value)}
                  />
                  <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
                </div>

                <div className="grid gap-4 lg:grid-cols-2 custom-scrollbar max-h-[400px] overflow-y-auto pr-2">
                  {filteredProcessors.map((processor) => (
                    <div
                      key={processor.id}
                      className={`flex items-center justify-between p-4 rounded-md cursor-pointer ${selectedProcessor === processor.id
                        ? 'bg-blue-600 bg-opacity-70'
                        : 'bg-white bg-opacity-5 hover:bg-opacity-10'
                        } transition-all duration-300`}
                      onClick={() => setSelectedProcessor(processor.id)}
                    >
                      <div className="flex items-center">
                        {processor.type === 'apple' ? (
                          <FaApple className="text-white mr-3 w-6 h-6" />
                        ) : (
                          <img src={"/img/icon/nvidia.png"} className="text-white mr-3 w-6 h-auto" />
                          // <FaApple className="text-white mr-3 w-5 h-5" />
                        )}
                        <div>
                          <div className="text-sm text-white font-medium">{processor.name}</div>
                          <div className="text-xs text-gray-400">
                            {processor.type === 'apple' ? 'Apple Silicon' : 'NVIDIA GPU'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className={`font-semibold mr-3 ${processor.count > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {processor.count}
                        </div>
                        {selectedProcessor === processor.id && (
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="bg-white bg-opacity-10 border border-gray-600 text-white p-6 rounded-lg">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Cluster Overview</h2>
                  <button
                    className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 flex items-center"
                    onClick={handleDeployCluster}
                  >
                    Deploy Cluster
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Cluster Type */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Cluster Type</h3>
                    <div className="flex items-center space-x-2 bg-gray-800 bg-opacity-50 p-2 px-4 rounded">
                      <span>{clusterTypes.find(p => p.id === selectedClusterType)?.name || 'Not selected'}</span>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Location</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedLocations.slice(0, 5).map((locationCode) => {
                        const country = countries.find(c => c.code === locationCode);
                        return (
                          <div key={locationCode} className="flex items-center space-x-2 bg-gray-800 bg-opacity-50 px-3 py-1 rounded text-sm">
                            <ReactCountryFlag
                              countryCode={locationCode}
                              svg
                              style={{
                                width: '1em',
                                height: '1em',
                              }}
                              title={country ? country.name : locationCode}
                            />
                            <span>{country ? country.name : locationCode}</span>
                          </div>
                        );
                      })}
                      {selectedLocations.length > 5 && (
                        <div className="bg-gray-800 bg-opacity-50 px-2 py-1 rounded text-sm">
                          +{selectedLocations.length - 5} more
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Select Your Cluster Processor */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Cluster Processor</h3>
                    <div className="bg-gray-800 bg-opacity-50 p-2 px-4 rounded flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {selectedProcessor && (
                          <>
                            {processors.find(p => p.id === selectedProcessor)?.type === 'apple' ? (
                              <FaApple className="text-white w-4 h-4" />
                            ) : (
                              <img src={"/img/icon/nvidia.png"} className="text-white w-6 h-auto mt-1" />
                            )}
                            <span>{processors.find(p => p.id === selectedProcessor)?.name || 'Not selected'}</span>
                          </>
                        )}
                        {!selectedProcessor && <span>Not selected</span>}
                      </div>
                      {selectedProcessor && (
                        <span className="text-gray-400">
                          {processors.find(p => p.name === selectedProcessor)?.count || 0}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Summary</h3>
                    <div className="space-y-2 bg-gray-800 bg-opacity-50 p-4 rounded">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Duration:</span>
                        <span>168 Hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Cluster Purpose:</span>
                        <span>Ray</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Security:</span>
                        <span>End-to-End Encrypted</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Cost:</span>
                        <span>3.039 APT</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}