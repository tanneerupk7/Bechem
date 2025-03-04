import React, { useState } from "react";
import { BlinkBlur } from 'react-loading-indicators';
import HeaderImage from "../assets/bechemheader.jpeg"
import SuccessPopup from "./SuccessPopup";
import { XMarkIcon } from "@heroicons/react/24/outline";

const ResetPasswordPopup = ({ onClose, selectedUser }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  
  const API_URI = import.meta.env.VITE_API_URI;

  const handleSave = async () => {
    try {
      setError("");

      // Validation checks
      if (!newPassword || !confirmPassword) {
        setError("Please fill in all fields");
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      // if (newPassword.length < 6) {
      //   setError("Password must be at least 6 characters long");
      //   return;
      // }

      setIsLoading(true);

      const response = await fetch(`${API_URI}/reset_mail/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserName: selectedUser.ac_name,
          NewPasswrd: newPassword,
          RetypeNewPasswrd: confirmPassword,
          email: selectedUser.distributor_mailid
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
        }, 2000);
      } else {
        throw new Error(data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setError(error.message || "An error occurred while resetting the password");
    } finally {
      setIsLoading(false);
    }
  };

  const closeAllPopups = () => {
    setIsOpen(false);
    setShowSuccess(false);
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-black bg-opacity-80 px-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-[800px] relative" style={{ minHeight: "450px" }}>
          {/* Header */}
        
           <div 
                  className="px-3 py-1 flex justify-between items-center bg-headerColor border-b border-customYellow h-[55px] w-full" 
                  style={{ backgroundImage: 'url(header.svg)', backgroundSize: "contain", backgroundPosition: "left center", backgroundRepeat: 'no-repeat' }}
                >
                  <div className="flex-1">
                    <h2 className="font-bold text-slate-900 font-helvetica text-[22px] leading-none p-1 whitespace-nowrap">
                    Reset Password
                    </h2>
                    <p className="text-gray-500 text-[10px] leading-none m-0 px-1 font-helvetica">
                    Make changes to user profile here. Click save when you're done.
                    </p>
                  </div>
                  <button onClick={onClose}>
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
                </div>

          {/* Content */}
          <div className="p-6 pl-24 pr-12" style={{marginTop:"30px"}}>
            {/* User Name */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                User Name
              </label>
              <input
                type="text"
                className="w-full sm:w-72 border border-gray-300 rounded-md shadow-sm focus:ring-gray-300 focus:ring-opacity-50 p-2 bg-gray-100 cursor-not-allowed"
                value={selectedUser?.ac_name || ""}
                readOnly
              />
            </div>

            {/* Mail ID */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Mail ID
              </label>
              <input
                type="email"
                className="w-full sm:w-72 border border-gray-300 rounded-md shadow-sm focus:ring-gray-300 focus:ring-opacity-50 p-2 bg-gray-100 cursor-not-allowed"
                value={selectedUser?.distributor_mailid || ""}
                readOnly
              />
            </div>

            {/* New Password and Confirm Password */}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm mb-4">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end sm:space-x-3 space-y-3 sm:space-y-0" style={{marginTop:'40px'}}>
              <button 
                className="px-14 py-2 text-sm font-medium bg-gray-300 rounded-md hover:bg-customYellow text-white disabled:opacity-50"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="px-8 py-2 text-sm font-medium text-white bg-greenButtonColor rounded-md hover:bg-customYellow disabled:opacity-50 flex items-center justify-center"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="inline-block animate-spin mr-2">↻</span>
                ) : null}
                Save & Email
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-50 z-50">
          <BlinkBlur 
            color="#FBB900"
            size="large"
          />
          <p className="mt-4 text-white">
            Processing...
          </p>
        </div>
      )}

      {/* Success Popup */}
      {showSuccess && (
        <SuccessPopup 
        onClose={closeAllPopups} 
        message="Password updated, email sent to user successfully."
        />
      )}
    </>
  );
};

export default ResetPasswordPopup;