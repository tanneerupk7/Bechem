import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import UserIcon from "../assets/user.png";
import BellIcon from "../assets/notification-bell.png";
import Logo from "../assets/bechem-logo.png";
import HomeIcon from "../assets/home.svg";
import headerImage from "../assets/bechemheader.jpeg";
import { XMarkIcon } from "@heroicons/react/24/outline";
import AddUserPopup from "./AddUserPopup";

const HeaderForDashboard = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [showAddNewUserPopup, setShowAddNewUserPopup] = useState(false);
  const location = useLocation();
  const [userStatus, setUserStatus] = useState(false); // Toggle for Active/Inactive
  const [distributor, setDistributor] = useState(""); // Distributor value
  const [userName, setUserName] = useState(""); // User Name value
  const [contactPerson, setContactPerson] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [mailId, setMailId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedDistributor, setSelectedDistributor] = useState("");
  const [distributors, setDistributors] = useState([]);
  const API_URI = import.meta.env.VITE_API_URI;

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

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);

  useEffect(() => {
    const fetchDistributors = async () => {
      try {
        const response = await fetch(`${API_URI}/distributors/`);
        const data = await response.json();
        console.log('API Response:', data); // Debug log
        
        if (data && data.distributors) {
          // Clean the distributor names by trimming whitespace
          const cleanedDistributors = data.distributors.map(dist => dist.trim());
          console.log('Cleaned distributors:', cleanedDistributors); // Debug log
          setDistributors(cleanedDistributors);
        }
      } catch (error) {
        console.error("Error fetching distributors:", error);
      }
    };

    fetchDistributors();
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = (e) => {
    if (e.target.closest(".dropdown-container")) return;
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    window.addEventListener("click", closeDropdown);
    return () => {
      window.removeEventListener("click", closeDropdown);
    };
  }, []);

  const handleDistributorChange = (e) => {
    const selected = e.target.value;
    setSelectedDistributor(selected);
    console.log('Selected distributor:', selected); // Debug log
  };

  return (
    <>
      {/* Header Section */}
      <header className="bg-customYellow flex justify-between max-h-16 relative">
        {/* Left Section: Logo and Company Name */}
        <div className="flex items-center space-x-4 ml-2">
          <div className="flex flex-col ">
            <span className="text-base md:text-lg font-bold ">BECHEM INDIA</span>
            <span className="text-xs md:text-sm ">Lubrication Technology</span>
          </div>
        </div>

        {/* Right Section: Icons and Dropdown */}
        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          {/* Notification Bell Icon */}
          <Link to={"/Notifications"}>
            <img
              className="cursor-pointer h-6 md:h-10"
              src={BellIcon}
              alt="Notification Bell"
            />
          </Link>
          {/* User Icon and Dropdown */}
          <div className="relative dropdown-container">
            <img
              className="cursor-pointer h-6 md:h-8"
              src={UserIcon}
              alt="User Icon"
              onClick={toggleDropdown}
            />
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 md:w-48 bg-gray-100 rounded-lg shadow-lg z-50">
                <ul className="flex flex-col">
                  <Link
                    className="px-3 md:px-4 py-2 hover:bg-gray-200 rounded-lg"
                    to={"/Profile"}
                  >
                    Profile
                  </Link>
                  <Link
                    className="px-3 md:px-4 py-2 hover:bg-gray-200 rounded-lg"
                    to={"/UsersDetails"}
                  >
                    User Details
                  </Link>
                  <Link
                    to={"/"}
                    className="px-3 md:px-4 py-2 hover:bg-gray-200 rounded-lg"
                  >
                    Log Out
                  </Link>
                </ul>
              </div>
            )}
          </div>
          <Link to={"/Dashboard"}>
            <img
              className="cursor-pointer h-6 md:h-9"
              src={HomeIcon}
              alt="Notification Bell"
            />
          </Link>
          {/* Company Logo */}
          <Link to={"/Header"}>
          <img src={Logo} alt="Company Logo" className="cursor-pointer h-12 md:h-20" />
          </Link>
        </div>
      </header>

      {/* Navigation Menu with Distributor Dropdown */}
      <div className="c-lg:px-[20%]">
        <nav className="w-full bg-gradient-to-r from-neutral-200 to-[#d9d9d9] shadow-m border px-4 py-4 rounded-br-full rounded-bl-full">
          <ul className="flex flex-wrap justify-center gap-4 md:gap-8">
            <li className="relative">
              <select
                value={selectedDistributor}
                onChange={handleDistributorChange}
                className="text-sm font-light cursor-pointer transition-all text-slate-700 bg-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 max-w-[400px] w-full"
              >
                <option value="">Select Distributor</option>
                {distributors.map((distributor, index) => (
                  <option key={index} value={distributor}>
                    {distributor}
                  </option>
                ))}
              </select>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default HeaderForDashboard;
