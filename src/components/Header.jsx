import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import UserIcon from "../assets/user.png";
import BellIcon from "../assets/notification-bell.png";
import Logo from "../assets/bechem-logo.png";
import HomeIcon from "../assets/home.svg";

const Header = ({ accountName, isAdmin, name }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const location = useLocation();

  const menuItems = [
    { id: 1, name: "Place Order", path: "/Place_Order" },
    { id: 2, name: "PO List", path: "/Product_Order_List" },
    { id: 3, name: "Invoice Details", path: "/Invoice_Table" },
    { id: 4, name: "Pending Approvals", path: "/Pending_Approvals" },
    { id: 5, name: "Reports", path: "/Reports" },
    { id: 6, name: "Policies", path: "/Policy" },
  ];

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
      <header className="bg-customYellow flex justify-between max-h-16 relative">
        {/* Left Section: Logo and Company Name */}
        <div className="flex items-center space-x-4 ml-2">
          <div className="flex flex-col">
            {isAdmin ? (
              <>
                <span className="text-base md:text-lg font-bold">
                  BECHEM INDIA
                </span>
                <span className="text-xs md:text-sm">
                  Lubrication Technology
                </span>
              </>
            ) : (
              <div className="flex flex-col">
                <span className="text-base md:text-lg font-bold text-headerFontColor">
                  {accountName}
                </span>
                <span className="text-xs md:text-sm text-headerFontColor">
                  Welcome to Carl Bechem Sales Order Gateway portal
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Icons and Dropdown */}
        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          {/* Notification Bell Icon */}

          <div className="relative dropdown-container">
            {/* <img
              className="cursor-pointer h-6 md:h-8"
              src={UserIcon}
              alt="User Icon"
              onClick={toggleDropdown}
            /> */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="cursor-pointer"
              onClick={toggleDropdown}
            >
              <rect
                x="0.5"
                y="0.5"
                width="23"
                height="23"
                rx="11.5"
                stroke="#242424"
              />
              <path
                d="M19 21V19C19 17.9391 18.5786 16.9217 17.8284 16.1716C17.0783 15.4214 16.0609 15 15 15H9C7.93913 15 6.92172 15.4214 6.17157 16.1716C5.42143 16.9217 5 17.9391 5 19V21"
                stroke="#242424"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                stroke="#242424"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 md:w-48 bg-gray-100 rounded-lg shadow-lg z-50">
                <ul className="flex flex-col">
                  <Link
                    className="px-3 md:px-4 py-2 hover:bg-gray-200 rounded-lg"
                    to={"/Profile"}
                  >
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      className="px-3 md:px-4 py-2 hover:bg-gray-200 rounded-lg"
                      to={"/UsersDetails"}
                    >
                      User Details
                    </Link>
                  )}
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

          {isAdmin && (
            <Link to={"/Notifications"}>
              {/* <img
                className="cursor-pointer h-6 md:h-10"
                src={BellIcon}
                alt="Notification Bell"
              /> */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                  stroke="#242424"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.7295 21C13.5537 21.3031 13.3014 21.5547 12.9978 21.7295C12.6941 21.9044 12.3499 21.9965 11.9995 21.9965C11.6492 21.9965 11.3049 21.9044 11.0013 21.7295C10.6977 21.5547 10.4453 21.3031 10.2695 21"
                  stroke="#242424"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          )}

          {/* User Icon and Dropdown */}

          <Link to={"/Dashboard"}>
            {/* <img
              className="cursor-pointer h-6 md:h-9"
              src={HomeIcon}
              alt="Home Icon"
            /> */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="cursor-pointer"
            >
              <path
                d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                stroke="#242424"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 22V12H15V22"
                stroke="#242424"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          {/* Company Logo */}
          <img src={Logo} alt="Company Logo" className="h-12 md:h-20" />
        </div>
      </header>

      {/* Navigation Menu */}
      <div className="c-lg:px-[20%]">
        <nav className="w-full bg-gradient-to-r from-neutral-200 to-[#d9d9d9] shadow-m border px-4 py-4 rounded-br-full rounded-bl-full">
          <ul className="flex flex-wrap justify-center gap-4 md:gap-8">
            {menuItems.map((item) => (
              <li key={item.name} className="relative">
                <Link
                  to={item.path}
                  className={`text-sm font-light cursor-pointer transition-all ${
                    activeTab === item.path ? "text-black" : "text-slate-500"
                  }`}
                >
                  {item.name}
                </Link>
                {activeTab === item.path && (
                  <div className="absolute bottom-[-17px] left-0 w-full h-0.5 bg-black"></div>
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
