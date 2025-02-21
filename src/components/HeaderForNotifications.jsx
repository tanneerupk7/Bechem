import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import UserIcon from "../assets/user.png";
import BellIcon from "../assets/notification-bell.png";
import Logo from "../assets/bechem-logo.png";
import HomeIcon from "../assets/home.svg";
import headerImage from "../assets/bechemheader.jpeg"

const Header = ({ accountName }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [showAddNewUserPopup,setShowAddNewUserPopup]=useState(false);
  // const menuItems = [
  //   { id: 1, name: "Add New User", path: "/Add_New_User" },
  // ];

  const location = useLocation();
  const [userStatus, setUserStatus] = useState(false); // Toggle for Active/Inactive
  const [distributor, setDistributor] = useState(""); // Distributor value
  const [userName, setUserName] = useState(""); // User Name value
  const [contactPerson, setContactPerson] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [mailId, setMailId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  return (
    <>
      {/* Header Section */}
      <header className="bg-customYellow flex justify-between max-h-20 relative ">
        {/* Left Section: Logo and Company Name */}
        <div className="flex items-center space-x-4 ml-2">
          <div className="flex flex-col">
            <span className="text-base md:text-lg font-bold">BECHEM INDIA</span>
            <span className="text-xs md:text-sm">Lubrication Technology</span>
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
          <img src={Logo} alt="Company Logo" className="h-12 md:h-20" />
        </div>
      </header>
      
    </>
  );
};

export default Header;