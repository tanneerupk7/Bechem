import React, { useState, useEffect, useMemo } from 'react';
import { FiDownload } from 'react-icons/fi';
import Papa from 'papaparse';
import axios from 'axios';
import Header from './HeaderForNotifications';
import Footer from './Footer';
import { format } from 'date-fns';
import SuccessPopup from './SuccessPopup';
const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    contactName: '',
    contactNumber: '',
    role: '',
    createdOn: '',
  });
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [logHistory, setLogHistory] = useState([]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
      const response = await axios.get('/api/user-info'); // Replace with your API endpoint
      setUserInfo(response.data);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  // Updated fetchLogHistory with console logs
  const fetchLogHistory = async () => {
    try {
      console.log('Fetching from:', `${API_URI}/log_history/`);
      const response = await axios.get(`${API_URI}/log_history/`);
      console.log('API Response:', response.data);
      
      const formattedLogs = response.data.log_history.map(log => ({
        id: log.LogId,
        username: log.UserId,
        date: format(new Date(log.DateTime), 'dd-MM-yyyy'),
        time: format(new Date(log.DateTime), 'HH:mm:ss'),
        status: log.Status,
        remarks: log.Remarks
      }));
      
      console.log('Formatted Logs:', formattedLogs);
      setLogHistory(formattedLogs);
    } catch (error) {
      console.error('Error fetching log history:', error);
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
      await axios.put('/api/update-user-info', userInfo); // Replace with your API endpoint
      setIsEditingInfo(false);
      alert('User info updated successfully!');
    } catch (error) {
      console.error('Error updating user info:', error);
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
      alert('Passwords do not match!');
      return;
    }
    try {
      await axios.put('/api/update-password', { newPassword }); // Replace with your API endpoint
      setIsEditingPassword(false);
      alert('Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  // Add this to sort the log history
  const sortedLogHistory = useMemo(() => {
    return [...logHistory].sort((a, b) => {
      const dateA = new Date(a.date.split('-').reverse().join('-'));
      const dateB = new Date(b.date.split('-').reverse().join('-'));
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [logHistory, sortOrder]);

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Export log history to CSV
  const exportCSV = () => {
    const csv = Papa.unparse(sortedLogHistory);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'log_history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className='flex h-screen flex-col'>
      <Header />
      <div className='flex-1 relative'>
        <div className="mx-auto p-6" style={{ paddingTop: '5rem' }}>
          <div className="grid grid-cols-3 gap-8 mb-8">
            {/* Left Column - Avatar and Role */}
            <div className="col-span-1">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <img
                    src={uploadedImage || '/avatar-placeholder.png'}
                    alt="Profile"
                    className="w-32 h-32 rounded-full bg-gray-200"
                  />
                  <div className="absolute bottom-0 right-0 bg-blue-950 p-2 rounded-full cursor-pointer">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white"
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

                <div className="bg-gray-100 p-5 rounded-md w-40  text-center">
                  <div className="text-xl font-semibold">{userInfo.role}</div>
                </div>
                <div className="bg-gray-100 p-3 rounded-md w-40">
                  <div className="text-gray-500">Created on</div>
                  <div className="font-medium">{userInfo.createdOn}</div>
                </div>
              </div>
            </div>

            {/* Middle Column - My Info */}
            <div className="col-span-1 w-96">
              <div className="h-full">
                <div>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">My Info</h2>
                    <button className="p-2" onClick={toggleEditInfo}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  </div>
                  <hr className="border-gray-300 mb-4" />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-100 p-4 rounded-md">
                      <div className="text-gray-600">User Name</div>
                      <input
                        type="text"
                        value={userInfo.username}
                        onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
                        className="w-full bg-transparent focus:outline-none"
                        disabled={!isEditingInfo}
                      />
                    </div>

                    <div className="bg-gray-100 p-4 rounded-md">
                      <div className="text-gray-600">Mail ID</div>
                      <input
                        type="text"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                        className="w-full bg-transparent focus:outline-none"
                        disabled={!isEditingInfo}
                      />
                    </div>

                    <div className="bg-gray-100 p-4 rounded-md">
                      <div className="text-gray-600">Contact Name</div>
                      <input
                        type="text"
                        value={userInfo.contactName}
                        onChange={(e) => setUserInfo({ ...userInfo, contactName: e.target.value })}
                        className="w-full bg-transparent focus:outline-none"
                        disabled={!isEditingInfo}
                      />
                    </div>

                    <div className="bg-gray-100 p-4 rounded-md">
                      <div className="text-gray-600">Contact Number</div>
                      <input
                        type="text"
                        value={userInfo.contactNumber}
                        onChange={(e) => setUserInfo({ ...userInfo, contactNumber: e.target.value })}
                        className="w-full bg-transparent focus:outline-none"
                        disabled={!isEditingInfo}
                      />
                    </div>
                  </div>

                  {isEditingInfo && (
                    <div className="absolute mt-2">
                      <button
                        className="w-40 bg-yellow-500 text-black py-2 rounded-md hover:bg-yellow-600"
                        onClick={handleUpdateInfo}
                      >
                        Update
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Update Password */}
            <div className="col-span-1 w-96">
              <div className="h-full">
                <div>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Update Password</h2>
                    <button className="p-2" onClick={toggleEditPassword}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  </div>
                  <hr className="border-gray-300 mb-4" />

                  <form className="space-y-4" onSubmit={handleUpdatePassword}>
                    <div>
                      <label className="block text-gray-600 mb-2">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={`w-72 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none ${
                          !isEditingPassword ? 'bg-white cursor-not-allowed' : ''
                        }`}
                        placeholder="************"
                        disabled={!isEditingPassword}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-600 mb-2">Confirm Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-72 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none ${
                          !isEditingPassword ? 'bg-white cursor-not-allowed' : ''
                        }`}
                        placeholder="************"
                        disabled={!isEditingPassword}
                      />
                    </div>

                    {isEditingPassword && (
                      <div className="absolute mt-2">
                        <button
                          type="submit"
                          className="w-40 bg-yellow-500 text-black py-2 rounded-md hover:bg-yellow-600"
                        >
                          Update
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Log History Section */}
          <div
            className="fixed"
            style={{
              width: '865px',
              height: '220px',
              top: '440px',
              right: '80px'
            }}
          >
            <div className="flex justify-between items-center mr-4 mb-3">
              <h2 className="text-xl font-semibold">Log History</h2>
              <button
                onClick={() => {
                  exportCSV();  // First export the CSV
                  setShowSuccessPopup(true);  // Then show the popup
                }}
                className="flex items-center bg-gray-300 text-white px-3 py-2 rounded-md hover:bg-customYellow mr-2"
              >
                <FiDownload className="mr-2" />
                Export
              </button>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: '220px' }}>
              <table className="w-full">
                <thead className="bg-gray-200 sticky top-0">
                  <tr>
                    <th className="p-3 text-left">Sr No</th>
                    <th className="p-3 text-left cursor-pointer" onClick={toggleSortOrder}>
                      Date {sortOrder === 'asc' ? '↑' : '↓'}
                    </th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">User Name</th>
                    <th className="p-3 text-left">Duration</th>
                    <th className="p-3 text-left">I.P Address</th>
                    <th className="p-3 text-left">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLogHistory.length > 0 ? (
                    sortedLogHistory.map((log, index) => (
                      <tr key={log.id} className="hover:bg-gray-100 border-b border-gray-300">
                        <td className="p-2 text-center border-l border-gray-300 w-[80px] min-w-[80px] max-w-[80px] overflow-hidden">
                          <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                            {index + 1}
                          </span>
                        </td>
                        <td className="p-2 text-center w-[120px] min-w-[120px] max-w-[120px] overflow-hidden">
                          <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                            {log.date}
                          </span>
                        </td>
                        <td className="p-2 text-center w-[100px] min-w-[100px] max-w-[100px] overflow-hidden">
                          <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                            {log.time}
                          </span>
                        </td>
                        <td className="p-2 text-center w-[120px] min-w-[120px] max-w-[120px] overflow-hidden">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            log.status === 'Log In' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="p-2 text-center w-[150px] min-w-[150px] max-w-[150px] overflow-hidden">
                          <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                            {log.username}
                          </span>
                        </td>
                        <td className="p-2 text-center w-[200px] min-w-[200px] max-w-[200px] overflow-hidden">
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