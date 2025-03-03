import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const EditUserPopup = () => {
  const [userStatus, setUserStatus] = useState(false); // Toggle for Active/Inactive
  const [distributor, setDistributor] = useState(""); // Distributor value
  const [userName, setUserName] = useState(""); // User Name value

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("YOUR_API_ENDPOINT"); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setDistributor(data.distributor); // Update with actual response field
        setUserName(data.userName); // Update with actual response field
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-black bg-opacity-80 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-[800px] relative">
        {/* Header */}
        <div className="flex justify-between items-center bg-yellow-500 text-white px-6 py-2 rounded-t-lg">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Edit User</h2>
            <p className="text-gray-500" style={{ fontSize: '0.600rem' }}>
              Make changes to user profile here. Click save when you're done.
            </p>
          </div>
          <button className="text-white hover:text-gray-300">
            <XMarkIcon className="w-5 h-5 mb-" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 pl-24 pr-12">
          {/* User Status */}
          <div className="flex justify-end items-center mb-4 w-full">
            <h1 className="text-sm font-medium text-gray-700 mr-4">
              User Status
            </h1>
            <div className="flex items-center w-28 justify-end">
              <div
                className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                  userStatus ? "bg-green-500" : ""
                }`}
                onClick={() => setUserStatus(!userStatus)}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${
                    userStatus ? "translate-x-6" : ""
                  }`}
                ></div>
              </div>
              <label className="ml-3 text-sm font-medium text-gray-700">
                {userStatus ? "Active" : "Inactive"}
              </label>
            </div>
          </div>

          {/* Grid Layout: Distributor and User Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Distributor
              </label>
              <input
                type="text"
                className="w-full sm:w-72 border border-gray-300 rounded-md shadow-sm focus:ring-gray-300 focus:ring-opacity-50 p-2 bg-gray-200 cursor-not-allowed"
                value={distributor}
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                User Name
              </label>
              <input
                type="text"
                className="w-full sm:w-72 border border-gray-300 rounded-md shadow-sm focus:ring-gray-300 focus:ring-opacity-50 p-2 bg-gray-200 cursor-not-allowed"
                value={userName}
                readOnly
              />
            </div>
          </div>

          {/* Grid Layout: Contact Person and Contact Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Contact Person
              </label>
              <input
                type="text"
                className="w-full sm:w-72 border border-gray-300 rounded-md shadow-sm focus:ring-gray-300 focus:ring-opacity-50 p-2"
                placeholder="Akhil Deshmukh"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Contact Phone Number
              </label>
              <input
                type="text"
                className="w-full sm:w-72 border border-gray-300 rounded-md shadow-sm focus:ring-gray-300 focus:ring-opacity-50 p-2"
                placeholder="+919999999999"
              />
            </div>
          </div>  

          {/* Mail ID */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Mail ID
            </label>
            <input
              type="email"
              className="w-full sm:w-72 border border-gray-300 rounded-md shadow-sm focus:ring-gray-300 focus:ring-opacity-50 p-2"
              placeholder="xxxxxxxxxx@gmail.com"
            />
          </div>

          {/* Reset Password */}
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            Reset Password
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="***************"
                className="w-full sm:w-72 border border-gray-300 rounded-md shadow-sm focus:ring-gray-300 focus:ring-opacity-50 p-2"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="***************"
                className="w-full sm:w-72 border border-gray-300 rounded-md shadow-sm focus:ring-gray-300 focus:ring-opacity-50 p-2"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end sm:space-x-3 space-y-3 sm:space-y-0">
            <button className="px-14 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
              Cancel
            </button>
            <button className="px-14 py-2 text-sm font-medium text-white bg-green-700 rounded-md hover:bg-green-800">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserPopup;
