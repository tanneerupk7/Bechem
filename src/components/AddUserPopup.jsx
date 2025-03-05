import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { BlinkBlur } from "react-loading-indicators";
import headerImage from "../assets/bechemheader.jpeg";
import SuccessPopup from "./SuccessPopup";

const AddUserPopup = ({
  distributorData,
  onClose,
  accountId,
  selectedDistributor,
}) => {
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
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const API_URI = import.meta.env.VITE_API_URI;

  useEffect(() => {
    const fetchDistributors = async () => {
      try {
        const response = await fetch(`${API_URI}/distributors/`);
        const result = await response.json();
        const distributors = result.distributors.map((name) => name.trim());
        setDistributorList(distributors);
      } catch (error) {
        console.error("Failed to fetch distributors:", error);
      }
    };

    fetchDistributors();
  }, []);

  const addNewUser = async () => {
    setIsLoading(true);
    const payload = {
      UserName: userName,
      Passwrd: newPassword,
      ac_name: distributor,
      ac_id: accountId || selectedDistributor.ac_id,
      Contactperson: contactPerson,
      ContactNum: contactPhone,
      active: userStatus,
      UserMail: mailId,
    };

    try {
      const response = await fetch(`${API_URI}/add_new_user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const result = await response.json();
      console.log("Payload:", payload);
      console.log("API Response:", result);

      if (result.status === "success") {
        setShowSuccessPopup(true);
        resetFormFields();
      } else {
        console.error("Error:", result.message);
        setErrorMessage(result.message || "Failed to add user.");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      setErrorMessage("An error occurred while adding the user.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to reset form fields after successful submission
  const resetFormFields = () => {
    setDistributor("");
    setUserName("");
    setContactPerson("");
    setContactPhone("");
    setMailId("");
    setNewPassword("");
    setConfirmPassword("");
    setUserStatus(false); // Reset to inactive
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50">
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-50 z-50">
          <BlinkBlur color="#FBB900" size="large" />
          <p className="mt-4 text-white">Adding user...</p>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-[800px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div
          className="px-3 py-1 flex justify-between items-center bg-headerColor border-b border-customYellow h-[55px] w-full"
          style={{
            backgroundImage: "url(header.svg)",
            backgroundSize: "contain",
            backgroundPosition: "left center",
            backgroundRepeat: "no-repeat",
          }}
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
              onClick={addNewUser}
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {showSuccessPopup && (
        <SuccessPopup
          onClose={() => setShowSuccessPopup(false)}
          message="User registered successfully!"
        />
      )}
    </div>
  );
};

export default AddUserPopup;
