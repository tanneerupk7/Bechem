import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import headerImage from "../assets/bechemheader.jpeg";
import axios from 'axios';

const AddUserPopup = ({ onClose }) => {
  const [userStatus, setUserStatus] = useState(false); // Toggle for Active/Inactive
  const [distributor, setDistributor] = useState(""); // Distributor value
  const [userName, setUserName] = useState(""); // User Name value
  const [contactPerson, setContactPerson] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [mailId, setMailId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [distributorList, setDistributorList] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URI = import.meta.env.VITE_API_URI;

  useEffect(() => {
    const fetchDistributors = async () => {
      try {
        const response = await axios.get(`${API_URI}/distributors/`);
        const distributors = response.data.distributors.map(name => name.trim());
        setDistributorList(distributors);
      } catch (error) {
        console.error("Failed to fetch distributors:", error);
      }
    };

    fetchDistributors();
  }, []);

  const handleSave = () => {
    // Handle save logic here
    console.log({
      distributor,
      userName,
      contactPerson,
      contactPhone,
      mailId,
      newPassword,
      confirmPassword,
      userStatus,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-[800px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {/* Header */}
        {/* <div className="flex justify-between items-center bg-yellow-500 text-white px-6 py-2 rounded-t-lg"> */}
        {/* <div className="flex justify-between items-center text-white px-3 py-3 rounded-t-lg"
                  style={{
                    backgroundImage: `url(${headerImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Add New User</h2>
            <p className="text-gray-500" style={{ fontSize: '0.600rem' }}>
              Add new user here. Click save when you're done.
            </p>
          </div>
          <button className="text-white hover:text-gray-300" onClick={onClose}>
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div> */}
         <div 
          className="px-3 py-1 flex justify-between items-center bg-headerColor border-b border-customYellow h-[55px] w-full" 
          style={{ backgroundImage: 'url(header.svg)', backgroundSize: "contain", backgroundPosition: "left center", backgroundRepeat: 'no-repeat' }}
        >
          <div className="flex-1">
            <h2 className="font-bold text-slate-900 font-helvetica text-[22px] leading-none p-1 whitespace-nowrap">
            Add New User
            </h2>
            <p className="text-gray-500 text-[10px] leading-none m-0 px-1 font-helvetica">
            Add new user here. Click save when you're done.
            </p>
          </div>
          <button className="text-gray-500" onClick={onClose}>
            <XMarkIcon className="w-6 h-6" />
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

          {/* Grid Layout: Distributor */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Distributor
            </label>
            <select
              className="w-full sm:w-72 border border-gray-300 rounded-md shadow-sm focus:ring-gray-300 focus:ring-opacity-50 p-2"
              value={distributor}
              onChange={(e) => setDistributor(e.target.value)}
            >
              <option value="">Select a distributor</option>
              {distributorList.map((dist, index) => (
                <option key={index} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          {/* Grid Layout: User Name and Mail ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                User Name
              </label>
              <input
                type="text"
                className="w-full sm:w-72 border border-gray-300 rounded-md shadow-sm focus:ring-gray-300 focus:ring-opacity-50 p-2"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Mail ID
              </label>
              <input
                type="email"
                className="w-full sm:w-72 border border-gray-300 rounded-md shadow-sm focus:ring-gray-300 focus:ring-opacity-50 p-2"
                value={mailId}
                onChange={(e) => setMailId(e.target.value)}
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
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Contact Phone Number
              </label>
              <input
                type="text"
                className="w-full sm:w-72 border border-gray-300 rounded-md shadow-sm focus:ring-gray-300 focus:ring-opacity-50 p-2"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Grid Layout: New Password and Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="***************"
                className="w-full sm:w-72 border border-gray-300 rounded-md shadow-sm focus:ring-gray-300 focus:ring-opacity-50 p-2"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end sm:space-x-3 space-y-3 sm:space-y-0">
            <button
              className="px-14 py-2 text-sm font-medium text-white bg-gray-300 rounded-md hover:bg-customYellow"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-14 py-2 text-sm font-medium text-white bg-greenButtonColor rounded-md hover:bg-customYellow"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserPopup;
