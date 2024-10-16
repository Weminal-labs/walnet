import React, { useState, useEffect, useRef } from "react";

export default function CustomSelect({ options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="w-full p-2 border rounded bg-white bg-opacity-10 text-gray-400 border-gray-600 cursor-pointer "
        onClick={() => setIsOpen(!isOpen)}
      >
        {value ? `Cluster ${value}` : "Select a cluster"}
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-600 border text-gray-300 border-gray-600 rounded shadow-lg">
          {options.map((option) => (
            <div
              key={option}
              className="p-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                onChange(parseInt(option));
                setIsOpen(false);
              }}
            >
              Cluster {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
