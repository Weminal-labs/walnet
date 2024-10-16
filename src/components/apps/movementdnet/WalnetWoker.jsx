import React, { useState, useEffect } from 'react';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  FaDesktop,
  FaMobileAlt,
  FaApple,
  FaWindows,
  FaLinux,
  FaAndroid,
  FaCheck,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

// Import components
import { toast } from "../../shared/use-toast";

// Import hooks
import { useAccount } from "../../../hooks/useAccount";

// Import utils
import { MovementDNetABI } from "./utils/abi";
import { aptosClient } from "../../../utils/aptos_client";

export default function WalnetWorker() {
  const { account, metadata, refreshBalance } = useAccount();
  const { signAndSubmitTransaction } = useWallet();
  const [currentStep, setCurrentStep] = useState(1);
  const [deviceName, setDeviceName] = useState('');
  const [selectedOS, setSelectedOS] = useState('');
  const [selectedDeviceType, setSelectedDeviceType] = useState('');

  const steps = [
    'Connect New Worker',
    'Name Your Device',
    'Select Operating System',
    'Select Device Type',
    'Script',
    'Authorize your device',
    "You're all set!"
  ];

  const stepDescriptions = [
    'Connect running walnet services, you can install more service packages to have more earnings and hiring rate.',
    'Give your device a unique name to identify it in your network.',
    'Choose the operating system your device is running.',
    'Specify whether your device is a desktop or mobile device.',
    'Run this script on your device to set up the worker.',
    'Authorize your device to connect it to the network.',
    'Congratulations! Your device is now connected and ready to work.'
  ];

  const operatingSystems = [
    { name: 'Windows', icon: <FaWindows /> },
    { name: 'macOS', icon: <FaApple /> },
    { name: 'Linux', icon: <FaLinux /> },
    { name: 'Android', icon: <FaAndroid /> },
    { name: 'iOS', icon: <FaApple /> },
  ];

  const deviceTypes = [
    { name: 'Desktop', icon: <FaDesktop /> },
    { name: 'Mobile', icon: <FaMobileAlt /> },
  ];

  const isNextDisabled = () => {
    if (currentStep === 1) return false; // Luôn cho phép chuyển từ bước 1 sang bước 2
    if (currentStep === 2) return !deviceName; // Kiểm tra xem đã nhập tên thiết bị chưa
    if (currentStep === 3) return !selectedOS; // Kiểm tra xem đã chọn hệ điều hành chưa
    if (currentStep === 4) return !selectedDeviceType; // Kiểm tra xem đã chọn loại thiết bị chưa
    return false; // Các bước còn lại không có điều kiện đặc biệt
  };

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderNavigationButtons = () => {
    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === steps.length;
    const isAuthStep = currentStep === 6;

    return (
      <div className="flex justify-end space-x-4">
        {!isFirstStep && !isLastStep && !isAuthStep && (
          <button
            className="bg-white bg-opacity-10 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300 flex items-center"
            onClick={handlePreviousStep}
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
        )}
        {!isFirstStep && !isLastStep && !isAuthStep && (
          <button
            className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 flex items-center"
            onClick={handleNextStep}
            disabled={isNextDisabled()}
          >
            Next <FaArrowRight className="ml-2" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow min-h-[600px]">
      <div className="mx-auto flex h-full">
        {/* Creation Steps */}
        <div className="w-80 border-r border-gray-500 pr-6 pl-8 h-full">
          <h3 className="text-xl font-bold mb-6 text-white">Creation Steps</h3>
          <div className="space-y-4 relative">
            <div
              className="absolute left-[-16px] top-0 bottom-0 w-[2px] bg-blue-500"
              style={{ height: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
            {steps.map((step, index) => (
              <div key={index} className="flex items-center relative">
                <div className={`absolute left-[-26px] w-6 h-6 rounded-full 
                  ${index + 1 <= currentStep ? 'bg-blue-500' : 'bg-white bg-opacity-10 border-gray-600'} 
                  flex items-center justify-center`}>
                  {index + 1 < currentStep ? (
                    <FaCheck className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-xs text-white">{index + 1}</span>
                  )}
                </div>
                <span className={index + 1 <= currentStep ? 'text-blue-500 ml-2' : 'text-gray-300 ml-2'}>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-grow pl-6">
          <div className='flex flex-row items-center justify-between mb-6'>
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold">{currentStep}. {steps[currentStep - 1]}</h2>
              <p className="text-gray-400 mt-2">{stepDescriptions[currentStep - 1]}</p>
            </div>
            {renderNavigationButtons()}
          </div>

          {/* Nội dung của các bước */}
          {currentStep === 1 && (
            <div className="text-center">
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-300"
                onClick={handleNextStep}
              >
                Connect New Worker +
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <input
                type="text"
                placeholder="Enter device name"
                className="w-full bg-white bg-opacity-10 border border-gray-600 rounded-md py-2 px-4 text-white placeholder-gray-400 mb-4"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
              />
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <div className="grid grid-cols-2 gap-4">
                {operatingSystems.map((os) => (
                  <div
                    key={os.name}
                    className={`flex items-center p-4 rounded-md cursor-pointer ${selectedOS === os.name ? 'bg-blue-600 bg-opacity-70' : 'bg-white bg-opacity-5 hover:bg-opacity-10'
                      } transition-all duration-300`}
                    onClick={() => setSelectedOS(os.name)}
                  >
                    {os.icon}
                    <span className="ml-2">{os.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <div className="grid grid-cols-2 gap-4">
                {deviceTypes.map((type) => (
                  <div
                    key={type.name}
                    className={`flex items-center p-4 rounded-md cursor-pointer ${selectedDeviceType === type.name ? 'bg-blue-600 bg-opacity-70' : 'bg-white bg-opacity-5 hover:bg-opacity-10'
                      } transition-all duration-300`}
                    onClick={() => setSelectedDeviceType(type.name)}
                  >
                    {type.icon}
                    <span className="ml-2">{type.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div>
              <p className="text-gray-300 mb-4">Copy and run the following script on your device:</p>
              <pre className="bg-gray-800 p-4 rounded-md overflow-x-auto">
                <code className="text-white">
                  {`curl -sSL https://walnet/install.sh | bash
walnet-worker start --name "${deviceName}" --os "${selectedOS}" --type "${selectedDeviceType}"`}
                </code>
              </pre>
            </div>
          )}

          {currentStep === 6 && (
            <div className="text-center">
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-300"
                onClick={handleNextStep}
              >
                Authorize Device
              </button>
            </div>
          )}

          {currentStep === 7 && (
            <div className="text-center">
              <p className="text-gray-300 mb-4">Your device has been successfully connected and authorized.</p>
              <FaCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-300"
                onClick={() => setCurrentStep(1)}
              >
                Connect Another Device
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
