import React, { useState, useEffect, useMemo } from "react";
import { FiDownload } from "react-icons/fi";
import Papa from "papaparse";
import axios from "axios";
import Header from "./HeaderForNotifications";
import Footer from "./Footer";
import { format } from "date-fns";
import SuccessPopup from "./SuccessPopup";
const ProfilePage = ({ isAdmin, accountName }) => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    contactName: "",
    contactNumber: "",
    role: "",
    createdOn: "",
  });
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [logHistory, setLogHistory] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const API_URI = import.meta.env.VITE_API_URI;

  // Fetch user info and log history on component mount
  useEffect(() => {
    fetchUserInfo();
    fetchLogHistory();
  }, []);

  // Fetch user info from API
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get("/api/user-info"); // Replace with your API endpoint
      setUserInfo(response.data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  // Updated fetchLogHistory with console logs
  const fetchLogHistory = async () => {
    try {
      console.log("Fetching from:", `${API_URI}/log_history/`);
      const response = await axios.get(`${API_URI}/log_history/`);
      console.log("API Response:", response.data);

      const formattedLogs = response.data.log_history.map((log) => ({
        id: log.LogId,
        username: log.UserId,
        date: format(new Date(log.DateTime), "dd-MM-yyyy"),
        time: format(new Date(log.DateTime), "HH:mm:ss"),
        status: log.Status,
        remarks: log.Remarks,
      }));

      console.log("Formatted Logs:", formattedLogs);
      setLogHistory(formattedLogs);
    } catch (error) {
      console.error("Error fetching log history:", error);
    }
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setUploadedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Toggle edit info mode
  const toggleEditInfo = () => {
    setIsEditingInfo((prev) => !prev);
    setIsEditingPassword(false);
  };

  // Toggle edit password mode
  const toggleEditPassword = () => {
    setIsEditingPassword((prev) => !prev);
    setIsEditingInfo(false);
  };

  // Handle updating user info
  const handleUpdateInfo = async () => {
    try {
      await axios.put("/api/update-user-info", userInfo); // Replace with your API endpoint
      setIsEditingInfo(false);
      alert("User info updated successfully!");
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };
  const [isOpen, setIsOpen] = useState(true);
  const closeAllPopups = () => {
    setIsOpen(false);
    setShowSuccessPopup(false);
  };

  // Handle updating password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      await axios.put("/api/update-password", { newPassword }); // Replace with your API endpoint
      setIsEditingPassword(false);
      alert("Password updated successfully!");
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  // Add this to sort the log history
  const sortedLogHistory = useMemo(() => {
    return [...logHistory].sort((a, b) => {
      const dateA = new Date(a.date.split("-").reverse().join("-"));
      const dateB = new Date(b.date.split("-").reverse().join("-"));
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [logHistory, sortOrder]);

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Export log history to CSV
  const exportCSV = () => {
    const csv = Papa.unparse(sortedLogHistory);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "log_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen flex-col">
      <Header isAdmin={isAdmin} accountName={accountName} />
      <div className="flex-1 mx-auto">
        <div
          className="container mx-auto px-8 pr-16 max-w-7xl h-[calc(100vh-8rem)]"
          style={{ paddingTop: "2rem" }}
        >
          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
            {/* Left Column - Avatar and Role - Made smaller and closer */}
            <div className="flex flex-col items-center justify-start pt-2">
              {/* Profile Image - Smaller size */}
              <div className="relative mb-3 ml-52">
                <img
                  src={uploadedImage || "/avatar-placeholder.png"}
                  alt="Profile"
                  className="w-[120px] h-[120px] rounded-full bg-gray-200"
                />
                <div className="absolute bottom-0 right-0 bg-blue-950 p-1.5 rounded-full cursor-pointer">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              {/* Admin Role Box - Smaller width */}
              <div className="w-[202px] h-[78px] rounded-[8px] bg-gray-50 flex flex-col justify-center mb-3 ml-52">
                <div className="text-gray-700 text-lg font-medium text-center">
                  Admin
                </div>
              </div>

              {/* Created On Box - Smaller width */}
              <div className="w-[202px] h-[78px] rounded-[8px] bg-gray-50 p-4 ml-52">
                <div className="text-gray-600 text-sm">Created on</div>
                <div className="text-gray-700 text-base">
                  {userInfo.createdOn}
                </div>
              </div>
            </div>

            {/* Right side content */}
            <div className="lg:col-span-2">
              {/* Info Sections Row */}
              <div className="grid grid-cols-2 gap-8 mb-10">
                {/* My Info Section */}
                <div className="bg-white rounded-lg p-3 h-[150px]">
                  <div className="flex justify-between items-center mb-1">
                    <h2 className="text-xl font-semibold text-gray-700">
                      My Info
                    </h2>
                    <button className="p-1" onClick={toggleEditInfo}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.1665 3.33301H3.33317C2.89114 3.33301 2.46722 3.5086 2.15466 3.82116C1.8421 4.13372 1.6665 4.55765 1.6665 4.99967V16.6663C1.6665 17.1084 1.8421 17.5323 2.15466 17.8449C2.46722 18.1574 2.89114 18.333 3.33317 18.333H14.9998C15.4419 18.333 15.8658 18.1574 16.1783 17.8449C16.4909 17.5323 16.6665 17.1084 16.6665 16.6663V10.833"
                          stroke="#7E7E7F"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15.4165 2.0832C15.748 1.75168 16.1977 1.56543 16.6665 1.56543C17.1353 1.56543 17.585 1.75168 17.9165 2.0832C18.248 2.41472 18.4343 2.86436 18.4343 3.3332C18.4343 3.80204 18.248 4.25168 17.9165 4.5832L9.99984 12.4999L6.6665 13.3332L7.49984 9.99986L15.4165 2.0832Z"
                          stroke="#7E7E7F"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <hr className="border-gray-300 mb-1" />

                  <div className="grid grid-cols-2 gap-2 ]">
                    <div className="bg-gray-100 p-2 rounded-md">
                      <div className="text-xs text-gray-600 ">User Name</div>
                      <input
                        type="text"
                        value={userInfo.username}
                        onChange={(e) =>
                          setUserInfo({ ...userInfo, username: e.target.value })
                        }
                        className="w-full bg-transparent focus:outline-none text-xs"
                        disabled={!isEditingInfo}
                      />
                    </div>

                    <div className="bg-gray-100 p-2 rounded-md">
                      <div className="text-xs text-gray-600">Mail ID</div>
                      <input
                        type="text"
                        value={userInfo.email}
                        onChange={(e) =>
                          setUserInfo({ ...userInfo, email: e.target.value })
                        }
                        className="w-full bg-transparent focus:outline-none text-xs"
                        disabled={!isEditingInfo}
                      />
                    </div>

                    <div className="bg-gray-100 p-2 rounded-md">
                      <div className="text-xs text-gray-600">Contact Name</div>
                      <input
                        type="text"
                        value={userInfo.contactName}
                        onChange={(e) =>
                          setUserInfo({
                            ...userInfo,
                            contactName: e.target.value,
                          })
                        }
                        className="w-full bg-transparent focus:outline-none text-xs"
                        disabled={!isEditingInfo}
                      />
                    </div>

                    <div className="bg-gray-100 p-2 rounded-md">
                      <div className="text-xs text-gray-600">
                        Contact Number
                      </div>
                      <input
                        type="text"
                        value={userInfo.contactNumber}
                        onChange={(e) =>
                          setUserInfo({
                            ...userInfo,
                            contactNumber: e.target.value,
                          })
                        }
                        className="w-full bg-transparent focus:outline-none text-xs"
                        disabled={!isEditingInfo}
                      />
                    </div>
                  </div>

                  {isEditingInfo && (
                    <div className="flex justify-end mt-1">
                      <button
                        className="w-40 bg-yellow-500 text-black py-1.5 rounded-md hover:bg-yellow-600 text-xs"
                        onClick={handleUpdateInfo}
                      >
                        Update
                      </button>
                    </div>
                  )}
                </div>

                {/* Update Password Section - With exact width */}
                <div className="bg-white rounded-lg p-3 h-[150px] w-[304px]">
                  <div className="flex justify-between items-center mb-1">
                    <h2 className="text-xl font-semibold text-gray-700">
                      Update Password
                    </h2>
                    <button className="p-1" onClick={toggleEditPassword}>
                      {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg> */}
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.1665 3.33301H3.33317C2.89114 3.33301 2.46722 3.5086 2.15466 3.82116C1.8421 4.13372 1.6665 4.55765 1.6665 4.99967V16.6663C1.6665 17.1084 1.8421 17.5323 2.15466 17.8449C2.46722 18.1574 2.89114 18.333 3.33317 18.333H14.9998C15.4419 18.333 15.8658 18.1574 16.1783 17.8449C16.4909 17.5323 16.6665 17.1084 16.6665 16.6663V10.833"
                          stroke="#7E7E7F"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15.4165 2.0832C15.748 1.75168 16.1977 1.56543 16.6665 1.56543C17.1353 1.56543 17.585 1.75168 17.9165 2.0832C18.248 2.41472 18.4343 2.86436 18.4343 3.3332C18.4343 3.80204 18.248 4.25168 17.9165 4.5832L9.99984 12.4999L6.6665 13.3332L7.49984 9.99986L15.4165 2.0832Z"
                          stroke="#7E7E7F"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <hr className="border-gray-300 mb-1" />

                  <form className="space-y-2" onSubmit={handleUpdatePassword}>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                        placeholder="************"
                        disabled={!isEditingPassword}
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                        placeholder="************"
                        disabled={!isEditingPassword}
                      />
                    </div>

                    {isEditingPassword && (
                      <div className="absolute mt-1">
                        <button
                          type="submit"
                          className="w-40 bg-yellow-500 text-black py-1.5 rounded-md hover:bg-yellow-600 text-xs"
                        >
                          Update
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>

              {/* Log History Section - Added top margin */}
              <div
                className="bg-white rounded-lg p-3 mt-4"
                style={{ maxWidth: "95%" }}
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold text-gray-700">
                    Log History
                  </h2>
                  <button
                    onClick={() => {
                      exportCSV();
                      setShowSuccessPopup(true);
                    }}
                    className="flex items-center bg-gray-300 text-white px-2 py-1.5 rounded-md hover:bg-customYellow"
                  >
                    {/* <FiDownload className="mr-1 h-4 w-4" /> */}
                    <span className="mr-2"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.33345 12.4161C2.71432 11.7835 2.24726 11.0183 1.96765 10.1785C1.68804 9.33869 1.60321 8.44626 1.71959 7.5688C1.83597 6.69135 2.1505 5.85189 2.63937 5.114C3.12823 4.37611 3.77861 3.75915 4.54123 3.30985C5.30385 2.86054 6.15873 2.59068 7.04109 2.5207C7.92346 2.45072 8.81018 2.58246 9.63409 2.90594C10.458 3.22941 11.1975 3.73615 11.7966 4.38775C12.3956 5.03936 12.8386 5.81875 13.0918 6.66689H14.5835C15.388 6.66679 16.1713 6.92549 16.8176 7.40475C17.4639 7.88402 17.9389 8.55844 18.1724 9.32839C18.406 10.0983 18.3857 10.923 18.1146 11.6805C17.8434 12.4381 17.3359 13.0883 16.6668 13.5352" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10 10V17.5" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.6665 14.1665L9.99984 17.4998L13.3332 14.1665" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</span>
                    <span className="text-sm">Export</span>
                  </button>
                </div>

                <div className="overflow-x-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-200 sticky top-0">
                      <tr>
                        {/* <th className="p-1.5 text-center text-xs">Sr No</th> */}
                        <th
                          className="p-1.5 text-center text-xs cursor-pointer"
                          onClick={toggleSortOrder}
                        >
                          Date
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </th>
                        <th className="p-1.5 text-center text-xs">Status</th>
                        <th className="p-1.5 text-center text-xs">User Name</th>
                        <th className="p-1.5 text-center text-xs">Duration</th>
                        <th className="p-1.5 text-center text-xs">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      {sortedLogHistory.length > 0 ? (
                        sortedLogHistory.map((log, index) => (
                          <tr
                            key={log.id}
                            className="hover:bg-gray-100 border-b border-gray-300"
                          >
                            {/* <td className="p-1.5 text-center border-l border-gray-300 w-[80px] min-w-[80px] max-w-[80px] overflow-hidden">
                              <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                                {index + 1}
                              </span>
                            </td> */}
                            <td className="p-1.5 text-center w-[120px] min-w-[120px] max-w-[120px] overflow-hidden">
                              <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                                {log.date}
                              </span>
                            </td>
                            <td className="p-1.5 text-center w-[100px] min-w-[100px] max-w-[100px] overflow-hidden">
                              <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                                {log.time}
                              </span>
                            </td>
                            <td className="p-1.5 text-center w-[120px] min-w-[120px] max-w-[120px] overflow-hidden">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  log.status === "Log In"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {log.status}
                              </span>
                            </td>
                            <td className="p-1.5 text-center w-[150px] min-w-[150px] max-w-[150px] overflow-hidden">
                              <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                                {log.username}
                              </span>
                            </td>
                            <td className="p-1.5 text-center w-[200px] min-w-[200px] max-w-[200px] overflow-hidden">
                              <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                                {log.remarks}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            No log history available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {showSuccessPopup && (
        <SuccessPopup
          onClose={closeAllPopups}
          message="Exported the login history successfully."
        />
      )}
    </div>
  );
};

export default ProfilePage;
