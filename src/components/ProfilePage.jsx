import React, { useState, useEffect } from 'react';
import { FiDownload } from 'react-icons/fi';
import Papa from 'papaparse';
import axios from 'axios';
import Header from './HeaderForUsersDetails';
import Footer from './Footer';
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

  // Fetch log history from API
  const fetchLogHistory = async () => {
    try {
      const response = await axios.get('/api/log-history'); // Replace with your API endpoint
      setLogHistory(response.data);
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

  // Sort log history by date
  const sortedLogHistory = [...logHistory].sort((a, b) => {
    const dateA = new Date((a.date || '').split('-').reverse().join('-'));
    const dateB = new Date((b.date || '').split('-').reverse().join('-'));
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

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
    <>
    <Header />
    <div className="mx-auto p-6" style={{ paddingTop: '5rem' }}>
      <div className="grid grid-cols-3 gap-8">
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
              <div className="mt-4">
                <button
                  className="w-40 bg-yellow-500 text-black py-2 rounded-md hover:bg-yellow-600 ml-56"
                  onClick={handleUpdateInfo}
                >
                  Update
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Update Password */}
        <div className="col-span-1 w-96">
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
                <button
                  type="submit"
                  className="w-40 bg-yellow-500 text-black py-2 rounded-md hover:bg-yellow-600"
                >
                  Update
                </button>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Log History Section */}
      <div
        style={{
          width: '865px',
          height: '220px',
        }}
        className='absolute right-20'
      >
        <div className="flex justify-between items-center mr-4 mb-3">
          <h2 className="text-xl font-semibold">Log History</h2>
          <button
            onClick={exportCSV}
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
              {sortedLogHistory.map((log, index) => (
                <tr key={log.id} className="border-b">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{log.date || 'N/A'}</td>
                  <td className="p-3">{log.status}</td>
                  <td className="p-3">{log.username}</td>
                  <td className="p-3">{log.duration}</td>
                  <td className="p-3">{log.ipAddress}</td>
                  <td className="p-3">{log.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
    <div>
      <div className='absolute bottom-6 left-3'>
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
    </div>
    </>
  );
};
  
export default ProfilePage;