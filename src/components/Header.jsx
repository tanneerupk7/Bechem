
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import UserIcon from "../assets/user.png";
import BellIcon from "../assets/notification-bell.png";
import Logo from "../assets/bechem-logo.png";
import HomeIcon from "../assets/home.svg"
const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");

  const menuItems = [
    { id: 1, name: "Place Order", path: "/Place_Order" },
    { id: 2, name: "PO List", path: "/Product_Order_List" },
    { id: 3, name: "Invoice Details", path: "/Invoice_Table" },
    { id: 4, name: "Pending Approvals", path: "/Pending_Approvals" },
    { id: 5, name: "Reports", path: "/Reports" },
    { id: 6, name: "Policies", path: "/Policy" },
  ];

  const location = useLocation();

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
      <header className="bg-customYellow flex justify-between max-h-20 relative z-50">
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

      {/* Navigation Menu */}
      <div className="c-lg:px-[20%]">
        <nav className="w-full bg-gradient-to-r from-neutral-200 to-[#d9d9d9] shadow-m border px-4 py-4 rounded-br-full rounded-bl-full  ">
          <ul className="flex flex-wrap justify-center gap-4 md:gap-8">
            {menuItems.map(({ name, id, path }) => (
              <li key={id} className="relative">
                <Link
                  to={path}
                  className={`text-sm font-light cursor-pointer transition-all ${
                    activeTab === path ? "font-bold text-black" : "text-slate-500"
                  }`}
                  onClick={() => setActiveTab(path)}
                >
                  {name}
                </Link>
                {activeTab === path && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black mt-2"></div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
    </>
  );
};

export default Header;