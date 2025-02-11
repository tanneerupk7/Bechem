import { useState } from "react";
import Header from "./HeaderForUsersDetails";
import { FaFilter } from "react-icons/fa"; // Import Funnel icon
import { Link } from "react-router-dom";
import ResetPasswordPopup from "./ResetPasswordPopup";

const notifications = [
  { id: 1, name: "Adithya Mankal", date: "Yesterday", message: "A distributor wants to reset password would you like to...", time: "13:55" },
  { id: 2, name: "Adithya Mankal", date: "09-01-2025", message: "A distributor wants to reset password would you like to..." },
  { id: 3, name: "Adithya Mankal", date: "05-01-2025", message: "A distributor Hai I am Pavan Kumar " },
  { id: 4, name: "Adithya Mankal", date: "02-01-2025", message: "A distributor Hai I am Pavan Kumar " },
  { id: 5, name: "Adithya Mankal", date: "25-12-2024", message: "A distributor Hai I am Pavan Kumar " },
  { id: 1, name: "Adithya Mankal", date: "Yesterday", message: "A distributor wants to reset password would you like to...", time: "13:55" },
  { id: 2, name: "Adithya Mankal", date: "09-01-2025", message: "A distributor wants to reset password would you like to..." },
  { id: 3, name: "Adithya Mankal", date: "05-01-2025", message: "A distributor wants to reset password would you like to..." },
  { id: 4, name: "Adithya Mankal", date: "02-01-2025", message: "A distributor wants to reset password would you like to..." },
  { id: 5, name: "Adithya Mankal", date: "25-12-2024", message: "A distributor wants to reset password would you like to..." },
  { id: 1, name: "Adithya Mankal", date: "Yesterday", message: "A distributor wants to reset password would you like to...", time: "13:55" },
  { id: 2, name: "Adithya Mankal", date: "09-01-2025", message: "A distributor wants to reset password would you like to..." },
  { id: 3, name: "Adithya Mankal", date: "05-01-2025", message: "A distributor wants to reset password would you like to..." },
  { id: 4, name: "Adithya Mankal", date: "02-01-2025", message: "A distributor wants to reset password would you like to..." },
  { id: 5, name: "Adithya Mankal", date: "25-12-2024", message: "A distributor wants to reset password would you like to..." },
  { id: 1, name: "Adithya Mankal", date: "Yesterday", message: "A distributor wants to reset password would you like to...", time: "13:55" },
  { id: 2, name: "Adithya Mankal", date: "09-01-2025", message: "A distributor wants to reset password would you like to..." },
  { id: 3, name: "Adithya Mankal", date: "05-01-2025", message: "A distributor wants to reset password would you like to..." },
  { id: 4, name: "Adithya Mankal", date: "02-01-2025", message: "A distributor wants to reset password would you like to..." },
  { id: 5, name: "Adithya Mankal", date: "25-12-2024", message: "A distributor wants to reset password would you like to..." },
  { id: 1, name: "Adithya Mankal", date: "Yesterday", message: "A distributor wants to reset password would you like to...", time: "13:55" },
  { id: 2, name: "Adithya Mankal", date: "09-01-2025", message: "A distributor wants to reset password would you like to..." },
  { id: 3, name: "Adithya Mankal", date: "05-01-2025", message: "A distributor wants to reset password would you like to..." },
  { id: 4, name: "Adithya Mankal", date: "02-01-2025", message: "A distributor wants to reset password would you like to..." },
  { id: 5, name: "Adithya Mankal", date: "25-12-2024", message: "A distributor wants to reset password would you like to..." },
  { id: 1, name: "Adithya Mankal", date: "Yesterday", message: "A distributor wants to reset password would you like to...", time: "13:55" },
  { id: 2, name: "Adithya Mankal", date: "09-01-2025", message: "A distributor wants to reset password would you like to..." },
  { id: 3, name: "Adithya Mankal", date: "05-01-2025", message: "A distributor wants to reset password would you like to..." },
  { id: 4, name: "Adithya Mankal", date: "02-01-2025", message: "A distributor wants to reset password would you like to..." },
  { id: 5, name: "Adithya Mankal", date: "25-12-2024", message: "A distributor wants to reset password would you like to..." },
];

export default function NotificationsPanel() {
  const [selectedNotification, setSelectedNotification] = useState(notifications[0]);
  const [showResetPassword,setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // const handleSave = () => {
  //   // Handle save logic here
  //   console.log("New Password:", newPassword);
  //   console.log("Confirm Password:", confirmPassword);
  // };


  return (
    <div>
    <Header />
    <div className="p-6">
    <div className="flex space-x-2 max-w-5xl ml-5">
          <button className="bg-yellow-500 text-white px-4 py-2 rounded">All</button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">Unread</button>
          <div className="relative flex w-full items-center border rounded-xl">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full p-1.5 text-sm rounded outline-none "
                />
                <FaFilter
                  className="absolute right-3 text-gray-500 cursor-pointer"
                />
          </div>
          {/* <div>
            <button className="bg-gray-50 flex">
                <label for="data">Group by : Date</label>
                <select >
                <option>
                  Pavan
                </option>
              </select>
            </button>
          </div> */}
          <div className="inline-block relative">
        <button className="flex items-center justify-between w-40 px-4 py-1 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-200">
          Group by: Date
          <svg className="w-4 h-4 ml-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

          
    </div>
    <div className="flex p-4 " style={{ maxHeight: "550px", overflowY: "auto" }}>
      {/* Sidebar */}
      
      <div className="w-1/3 bg-white border rounded-lg p-4 overflow-y-auto">
       
        <div className="">
            {notifications.map((item,index) => (
              <div
                key={index}
                className={`p-3 rounded cursor-pointer ${
                  selectedNotification.id === item.id ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedNotification(item)}
              >
                <p className="font-semibold text-gray-800">Request for Password Change</p>
                <p className="text-sm text-gray-600">From: {item.name}</p>
                <p className="text-sm text-gray-500">{item.message}</p>
                <p className="text-xs text-gray-400">{item.date}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="w-2/3 bg-white shadow rounded-lg p-6 ml-4">
        <p className="font-semibold text-gray-800 text-lg">Request for Password Reset</p>
        <p className="text-sm text-gray-600">From: {selectedNotification.name}</p>
        <p className="text-gray-700 mt-2">
          A distributor wants to reset password of {selectedNotification.name}, would you like to change password?
        </p>

            <button 
              className="mt-4 bg-gray-500 text-white px-6 py-2 hover:bg-customYellow rounded"
              onClick={() => setShowResetPassword(!showResetPassword)}
            >
              Reset
            </button>
           
        <p className="text-xs text-gray-400 mt-2">{selectedNotification.date} {selectedNotification.time || ""}</p>
      </div>
    </div>
    <span className="text-gray-700" style={{fontSize:"0.700rem"}}>
        Copyrights @2025 All rights reserved | Sales Order Gateway |
      </span>
        <a
        href="https://www.bechemindia.com/"
        className="text-yellow-600 font-medium hover:underline ml-1 hover:text-hoverBlue" 
        style={{fontSize:"0.700rem"}}
        target="_blank"
      >
        Bechem India
      </a>
    </div>
    
    {showResetPassword && ( 
              <div className="  flex justify-center absolute left-0 top-0 w-full items-center min-h-screen bg-black bg-opacity-80 px-4">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-[800px] relative" style={{ minHeight: "450px" }}>
                {/* Header */}
                <div className="flex justify-between items-center bg-yellow-500 text-white px-6 py-2 rounded-t-lg">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Reset Password</h2>
                    <p className="text-gray-500" style={{ fontSize: "0.600rem" }}>
                      Make changes to user profile here. Click save when you're done.
                    </p>
                  </div>
                  <button 
                  className="text-white hover:text-gray-300"
                  onClick={() => setShowResetPassword(false)}
                  >
                    X
                  </button>
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
                    <button 
                      className="px-14 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                      onClick={() => setShowResetPassword(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-8 py-2 text-sm font-medium text-white bg-green-700 rounded-md hover:bg-green-800"
                      // onClick={handleSave}
                    >
                      Save & Email
                    </button>
                  </div>
                </div>
              </div>
            </div>
            // <ResetPasswordPopup />
            )}
  </div>
  
  );
}
