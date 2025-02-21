import { useState, useEffect } from "react";
import Header from "./HeaderForNotifications";
import { FaFilter } from "react-icons/fa";
import Footer from "./Footer";
import { FaUserCircle } from 'react-icons/fa';
import ResetPasswordPopup from './ResetPasswordPopup';
import { useAuth } from "../contexts/AuthContext";
import { BlinkBlur } from "react-loading-indicators";
import UserIcon from "../assets/icons/Avatar.svg"
export default function NotificationsPanel({ accountName }) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [data, setData] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const API_URI = import.meta.env.VITE_API_URI;

  useEffect(() => {
    fetch(`${API_URI}/notifications`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        const notifications = Array.isArray(responseData.data) 
          ? responseData.data 
          : Array.isArray(responseData) 
            ? responseData 
            : [];

        const sortedNotifications = [...notifications].sort((a, b) => {
          return new Date(b.request_date) - new Date(a.request_date);
        });
        
        setData(sortedNotifications);
        if (sortedNotifications.length > 0) {
          setSelectedNotification(sortedNotifications[0]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // Filter notifications based on current filters
  const filteredNotifications = data.filter(notification => {
    // First apply read/unread filter
    if (filter === 'unread' && !notification.flag) {
      return false;
    }

    // Then apply search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        notification.ac_name.toLowerCase().includes(searchLower) ||
        notification.distributor_mailid.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  // Format date helper function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '-');
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    
    // Add 5 hours and 30 minutes (IST offset)
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);

    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };



  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-50 z-50">
          <BlinkBlur 
            color="#FBB900"
            size="large"
          />
          <p className="mt-4 text-white">Loading notifications...</p>
        </div>
      )}
      <Header accountName={accountName} />
      <main className="flex-1 py-6">
        <div className="max-w-7xl mx-auto px-4">
          {/* Filter Section - Made Responsive */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* All/Unread Buttons */}
            <div className="flex rounded-lg overflow-hidden bg-white border border-gray-200">
              <button
                className={`px-4 md:px-6 py-2 text-sm font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`px-4 md:px-6 py-2 text-sm font-medium transition-colors ${
                  filter === 'unread' 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setFilter('unread')}
              >
                Unread
              </button>
            </div>

            {/* Search Bar with Filter Icon */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Filter notifications"
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Group By Dropdown */}
            <div className="relative">
              <button className="w-full md:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                <span className="text-sm text-gray-700">Group by: Date</span>
                <svg 
                  className="w-4 h-4 text-gray-500"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Notifications Content - Made Responsive */}
          <div className="flex flex-col md:flex-row gap-4" style={{ maxHeight: "calc(100vh - 240px)" }}>
            {/* Sidebar - Notification List */}
            <div className="w-full md:w-1/3 bg-white border-gray-700 rounded-lg  overflow-hidden ">
              <div className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 240px)" }}>
                {loading ? (
                  <p className="text-gray-500 text-center py-4">Loading notifications...</p>
                ) : error ? (
                  <p className="text-red-500 text-center py-4">Error: {error}</p>
                ) : filteredNotifications.length > 0 ? (
                  filteredNotifications.map((item, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg cursor-pointer border border-gray-100 transition-all ${
                        selectedNotification?.id === item.id 
                          ? "bg-gray-200" 
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedNotification(item)}
                    >
                      <div className="flex items-start">
                        <img src={UserIcon}  className="mr-3 mt-1"/>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-medium text-gray-900 truncate">
                              Request for Password Change
                            </h3>
                            <span className="text-sm text-gray-500 ml-2 flex-shrink-0">
                              {formatDate(item.request_date)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            From: {item.ac_name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            A distributor wants to reset password would you like to...
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No notifications found</p>
                )}
              </div>
            </div>

            {/* Content Area - Notification Detail */}
            <div className="w-full md:w-2/3 bg-white border border-gray-200 rounded-lg p-4 md:p-6">
              {selectedNotification ? (
                <div className="flex flex-col h-full">
                  <div className="flex items-start mb-6">
                    {/* <FaUserCircle className="text-gray-400 text-4xl mr-4 flex-shrink-0" /> */}
                    <img src={UserIcon} className="mr-4 mt-2"/>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h2 className="text-xl font-semibold text-gray-900 truncate">
                          Request for Password Reset
                        </h2>
                        <span className="text-sm text-gray-500 ml-2 flex-shrink-0">
                          {formatDate(selectedNotification.request_date)} {formatTime(selectedNotification.request_date)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        From: {selectedNotification.ac_name}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-6 pl-12">
                    A distributor wants to reset password of {selectedNotification.ac_name}, 
                    would you like to change password?
                  </p>

                  <button 
                    className="w-full max-w-[120px] bg-gray-500 text-white py-2 px-6 rounded-md transition-colors mx-auto hover:bg-customYellow"
                    onClick={() => setShowResetPassword(true)}
                  >
                    Reset
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 text-center">Select a notification to view details</p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Reset Password Popup */}
      {showResetPassword && (
        <div className="w-screen h-screen absolute top-0 left-0">
        <ResetPasswordPopup 
          onClose={() => setShowResetPassword(false)}
          selectedUser={selectedNotification}
        />
        </div>
      )}
    </div>
  );
}