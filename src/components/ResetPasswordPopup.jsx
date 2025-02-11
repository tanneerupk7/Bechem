import React, { useState } from "react";

const ResetPasswordPopup = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = () => {
    // Handle save logic here
    console.log("New Password:", newPassword);
    console.log("Confirm Password:", confirmPassword);
  };

  return (
    <div className="  flex justify-center items-center min-h-screen bg-black bg-opacity-80 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-[800px] relative" style={{ minHeight: "450px" }}>
        {/* Header */}
        <div className="flex justify-between items-center bg-yellow-500 text-white px-6 py-2 rounded-t-lg">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Reset Password</h2>
            <p className="text-gray-500" style={{ fontSize: "0.600rem" }}>
              Make changes to user profile here. Click save when you're done.
            </p>
          </div>
          <button className="text-white hover:text-gray-300">X</button>
        </div>

        {/* Content */}
        <div className="p-6 pl-24 pr-12 "style={{marginTop:"30px"}}>
          {/* User Name */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              User Name
            </label>
            <input
              type="text"
              className="w-full sm:w-72 border border-gray-300 rounded-md shadow-sm focus:ring-gray-300 focus:ring-opacity-50 p-2 bg-gray-100 cursor-not-allowed"
              value="Akhil25"
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
              value="************"
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
          <div className="flex flex-col sm:flex-row justify-end sm:space-x-3 space-y-3 sm:space-y-0 "style={{marginTop:'40px'}}>
            <button className="px-14 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
              Cancel
            </button>
            <button
              className="px-8 py-2 text-sm font-medium text-white bg-green-700 rounded-md hover:bg-green-800"
              onClick={handleSave}
            >
              Save & Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPopup;