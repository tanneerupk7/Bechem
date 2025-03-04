import React, { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import pdf from "../assets/pdf.png";
import DatePicker from "react-datepicker";
import { FaFilter } from "react-icons/fa"; // Import Funnel icon
import "react-datepicker/dist/react-datepicker.css";
import Header from "./HeaderForUsersDetails";
import { FiDownload, } from "react-icons/fi";
import Papa from "papaparse";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "../assets/bechem-logo.png";
import { Link, useLocation } from "react-router-dom";
import UserIcon from "../assets/user.png";
import BellIcon from "../assets/notification-bell.png";
import headerImage from "../assets/bechemheader.jpeg"
import HomeIcon from "../assets/home.svg";
import Footer from "./Footer";
import { BlinkBlur } from "react-loading-indicators";
import SuccessPopup from "./SuccessPopup";

const UsersDetails = ({ accountName,isAdmin }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [showEditUsersPopup,setShowEditUsersPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userStatus, setUserStatus] = useState(false); // Toggle for Active/Inactive
  const [distributor, setDistributor] = useState(""); // Distributor value
  const [userName, setUserName] = useState(""); // User Name value
  const [contactPerson, setContactPerson] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [mailId, setMailId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const popupRef = useRef(null); // Reference for the popup
  const API_URI = import.meta.env.VITE_API_URI;
  const [showAddNewUserPopup,setShowAddNewUserPopup]=useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showNoDataPopup, setShowNoDataPopup] = useState(false);

  useEffect(() => {
    if (isAdmin) {
        const currentDate = new Date();
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
    
        setFromDate(String(formatDate(threeMonthsAgo))); // Correctly set fromDate
        setToDate(String(formatDate(currentDate)))

      const fetchData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`${API_URI}/users/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              UserName: "",
            }),
          });

          const result = await response.json();
          setData(Array.isArray(result) ? result : []);
          setFilteredData(Array.isArray(result) ? result : []);
        } catch (error) {
          console.error("Error fetching data:", error);
          setErrorMessage("An error occurred while fetching users.");
          setData([]);
          setFilteredData([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [accountName]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.trim());
  };

  const formatDate = (date) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options).replace(/ /g, "-");
  };

  useEffect(() => {
    const filtered = data.filter((item) => {
      const matchesSearch = Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );
      return matchesSearch;
    });
 // Debugging: Log the filtered data
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, data]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const downloadPDF = (data) => {
    if (!data) {
      console.error("No data available for PDF generation");
      return;
    }

    const doc = new jsPDF();
    doc.text(`User Details - ${data.UserName || "N/A"}`, 14, 10);
    doc.autoTable({
      startY: 20,
      body: [
        ["User ID", data.U_id || "N/A"],
        ["User Name", data.UserName || "N/A"],
        ["Distributor Name", data.ac_name || "N/A"],
        ["Account ID", data.ac_id || "N/A"],
        ["Contact Person", data.Contactperson || "N/A"],
        ["Contact Number", data.ContactNum || "N/A"],
      ],
    });
    doc.save(`User_${data.UserName || "Unknown"}.pdf`);
  };

  const handleOutsideClick = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setShowFilterPopup(false);
    }
  };

  const exportCSV = () => {
    if (!filteredData || filteredData.length === 0) {
      setShowNoDataPopup(true);
      return;
    }

    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "users_details.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowSuccessPopup(true);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

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
      <div className="h-screen flex flex-col">
        {isLoading && (
          <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-50 z-50">
            <BlinkBlur 
              color="#FBB900"
              size="large"
            />
            <p className="mt-4 text-white">Loading user details...</p>
          </div>
        )}
        <Header className="fixed top-0 left-0"/>
          <div className="bg-white rounded-lg pb-4 md:px-6  flex-1">
            <div className="relative w-full md:w-1/4 ml-auto ">
              <div className="flex  ">
                <div className="relative inline-block ">
                  <button
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={exportCSV}
                    className="flex items-center bg-gray-300 text-white px-3 py-2 rounded-md hover:bg-customYellow mr-2"
                  >
                    <FiDownload className="mr-2" />
                    Export
                  </button>
                  
                  {showTooltip && (
                    <div className="absolute z-50 w-48 px-2 py-1 -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded shadow-lg">
                      Export user details to CSV file
                    </div>
                  )}
                </div>
                <div className="relative flex items-center border rounded-xl">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full p-1.5 text-sm rounded outline-none pr-8"
                    onChange={handleSearch}
                  />
                  {/* <FaFilter
                    className="absolute right-3 text-gray-500 cursor-pointer"
                    onClick={() => setShowFilterPopup(!showFilterPopup)}
                  /> */}
                </div>
              </div>

              {showFilterPopup && (
                  <div
                    ref={popupRef}
                    className="absolute top-full mt-2 right-0 bg-white shadow-lg p-4 rounded-lg z-10 w-80"
                  >
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">From Date:</label>
                      <DatePicker
                        selected={fromDate ? new Date(fromDate) : null}
                        onChange={(date) => setFromDate(formatDate(date))}
                        className="border p-2 rounded w-full"
                        dateFormat="dd-MMM-yyyy"
                        placeholderText="Select a date"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">To Date:</label>
                      <DatePicker
                        selected={toDate ? new Date(toDate) : null}
                        onChange={(date) => setToDate(formatDate(date))}
                        className="border p-2 rounded w-full"
                        dateFormat="dd-MMM-yyyy"
                        placeholderText="Select a date"
                      />
                    </div>
                  </div>
                )}
              
            </div>

            <div className="overflow-x-auto pt-5">
              <table className="table-auto w-full border-collapse border-b border-gray-300 text-xs border-l border-r">
                <thead>
                  <tr className="bg-tableHeaderColor border-b border-gray-300">
                    <th className="p-2 font-normal border-l border-gray-300 w-[200px] min-w-[200px] max-w-[200px]">
                      Distributor Name
                    </th>
                    <th className="p-2 font-normal w-[150px] min-w-[150px] max-w-[150px]">
                      User Name
                    </th>
                    <th className="p-2 font-normal w-[150px] min-w-[150px] max-w-[150px]">
                      Contact Person
                    </th>
                    <th className="p-2 font-normal w-[150px] min-w-[150px] max-w-[150px]">
                      Contact Number
                    </th>
                    <th className="p-2 font-normal w-[200px] min-w-[200px] max-w-[200px]">
                      Mail ID
                    </th>
                    <th className="p-2 font-normal w-[100px] min-w-[100px] max-w-[100px]">
                      Status
                    </th>
                    <th className="p-2 font-normal w-[80px] min-w-[80px] max-w-[80px]">
                      Edit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((data, index) => (
                    <tr key={index} className="hover:bg-gray-100 border-b border-gray-300">
                      <td className="p-2 text-center border-l border-gray-300 w-[200px] min-w-[200px] max-w-[200px] overflow-hidden">
                        <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                          {data.ac_name}
                        </span>
                      </td>
                      <td className="p-2 text-center w-[150px] min-w-[150px] max-w-[150px] overflow-hidden">
                        <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                          {data.UserName}
                        </span>
                      </td>
                      <td className="p-2 text-center w-[150px] min-w-[150px] max-w-[150px] overflow-hidden">
                        <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                          {data.Contactperson}
                        </span>
                      </td>
                      <td className="p-2 text-center w-[150px] min-w-[150px] max-w-[150px] overflow-hidden">
                        <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                          {data.ContactNum}
                        </span>
                      </td>
                      <td className="p-2 text-center w-[200px] min-w-[200px] max-w-[200px] overflow-hidden">
                        <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                          {"xxxxxxxxxxxx@gmail.com"}
                        </span>
                      </td>
                      <td className="p-2 text-center w-[100px] min-w-[100px] max-w-[100px] overflow-hidden">
                        <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                          {"True"}
                        </span>
                      </td>
                      <td className="p-2 text-center w-[80px] min-w-[80px] max-w-[80px]">
                        <button onClick={() => setShowEditUsersPopup(!showEditUsersPopup)}>
                          <FontAwesomeIcon icon={faEdit} className="text-gray-600 cursor-pointer" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {showEditUsersPopup && (
              <div className="flex absolute w-full top-0 left-0 justify-center items-center min-h-screen bg-black bg-opacity-80 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-[800px] relative">
            {/* Header */}
            {/* <div className="flex justify-between items-center bg-yellow-500 text-white px-6 py-2 rounded-t-lg"> */}
            {/* <div className="flex justify-between items-center text-white px-3 py-3 rounded-t-lg"
                  style={{
                    backgroundImage: `url(${headerImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Edit User</h2>
                <p className="text-gray-500" style={{ fontSize: '0.600rem' }}>
                  Make changes to user profile here. Click save when you're done.
                </p>
              </div>
              <button 
              className="text-white hover:text-gray-300"
              onClick={() => setShowEditUsersPopup(!showEditUsersPopup)}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div> */}
                    <div 
                              className="px-3 py-1 flex justify-between items-center bg-headerColor border-b border-customYellow h-[55px] w-full" 
                              style={{ backgroundImage: 'url(header.svg)', backgroundSize: "contain", backgroundPosition: "left center", backgroundRepeat: 'no-repeat' }}
                            >
                              <div className="flex-1">
                                <h2 className="font-bold text-slate-900 font-helvetica text-[22px] leading-none p-1 whitespace-nowrap">
                                Distributor Feedback
                                </h2>
                                <p className="text-gray-500 text-[10px] leading-none m-0 px-1 font-helvetica">
                                Rate the delivery experience, click save when you're done.
                                </p>
                              </div>
                              <button 
              className="text-gray-500"
              onClick={() => setShowEditUsersPopup(!showEditUsersPopup)}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
                            </div>

            {/* Content */}
            <div className="p-6 pl-24 pr-12">
              {/* User Status */}
              <div className="flex justify-end items-center mb-4 w-full">
                <h1 className="text-sm font-medium text-gray-700 mr-4">
                  User Status
                </h1>
                <div className="flex items-center w-28 justify-end">
                  <div
                    className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                      userStatus ? "bg-green-500" : ""
                    }`}
                    onClick={() => setUserStatus(!userStatus)}
                  >
                    <div
                      className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${
                        userStatus ? "translate-x-6" : ""
                      }`}
                    ></div>
                  </div>
                  <label className="ml-3 text-sm font-medium text-gray-700">
                    {userStatus ? "Active" : "Inactive"}
                  </label>
                </div>
              </div>

              {/* Grid Layout: Distributor and User Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Distributor
                  </label>
                  <input
                    type="text"
                    className="w-full sm:w-72 border border-gray-300 rounded-md shadow-sm focus:ring-gray-300 focus:ring-opacity-50 p-2 bg-gray-200 cursor-not-allowed"
                    value={distributor}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    User Name
                  </label>
                  <input
                    type="text"
                    className="w-full sm:w-72 border border-gray-300 rounded-md shadow-sm focus:ring-gray-300 focus:ring-opacity-50 p-2 bg-gray-200 cursor-not-allowed"
                    value={userName}
                    readOnly
                  />
                </div>
              </div>

              {/* Grid Layout: Contact Person and Contact Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    className="w-full sm:w-72 border border-gray-300 rounded-md shadow-sm focus:ring-gray-300 focus:ring-opacity-50 p-2"
                    placeholder="Akhil Deshmukh"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    className="w-full sm:w-72 border border-gray-300 rounded-md shadow-sm focus:ring-gray-300 focus:ring-opacity-50 p-2"
                    placeholder="+919999999999"
                  />
                </div>
              </div>  

              {/* Mail ID */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Mail ID
                </label>
                <input
                  type="email"
                  className="w-full sm:w-72 border border-gray-300 rounded-md shadow-sm focus:ring-gray-300 focus:ring-opacity-50 p-2"
                  placeholder="xxxxxxxxxx@gmail.com"
                />
              </div>

              {/* Reset Password */}
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                Reset Password
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="***************"
                    className="w-full sm:w-72 border border-gray-300 rounded-md shadow-sm focus:ring-gray-300 focus:ring-opacity-50 p-2"
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
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-end sm:space-x-3 space-y-3 sm:space-y-0">
                <button 
                className="px-14 py-2 text-sm font-medium text-white bg-gray-300 rounded-md hover:bg-customYellow"
                onClick={() => setShowEditUsersPopup(!showEditUsersPopup)}
                >
                  Cancel
                </button>
                <button className="px-14 py-2 text-sm font-medium text-white bg-greenButtonColor rounded-md hover:bg-customYellow">
                  Save
                </button>
              </div>
            </div>
          </div>
              </div>)
        
              }
              {showAddNewUserPopup && (
                  <div className="flex absolute top-0 left-0 w-full justify-center items-center min-h-screen bg-black bg-opacity-80 px-4">
                  <div className="bg-white rounded-lg shadow-lg w-full max-w-[800px] relative">
                    {/* Header */}
                    <div className="flex justify-between items-center text-white px-3 py-3 rounded-t-lg"
                          style={{
                            backgroundImage: `url(${headerImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">Add New User</h2>
                        <p className="text-gray-500" style={{ fontSize: '0.600rem' }}>
                          Add new user here. Click save when you're done.
                        </p>
                      </div>
                      <button 
                      className="text-white hover:text-gray-300"
                      onClick={() => setShowAddNewUserPopup(!showAddNewUserPopup)}
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
            
                    {/* Content */}
                    <div className="p-6 pl-24 pr-12">
                      {/* User Status */}
                      <div className="flex justify-end items-center mb-4 w-full">
                        <h1 className="text-sm font-medium text-gray-700 mr-4">
                          User Status
                        </h1>
                        <div className="flex items-center w-28 justify-end">
                          <div
                            className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
                              userStatus ? "bg-green-500" : ""
                            }`}
                            onClick={() => setUserStatus(!userStatus)}
                          >
                            <div
                              className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${
                                userStatus ? "translate-x-6" : ""
                              }`}
                            ></div>
                          </div>
                          <label className="ml-3 text-sm font-medium text-gray-700">
                            {userStatus ? "Active" : "Inactive"}
                          </label>
                        </div>
                      </div>
            
                      {/* Grid Layout: Distributor */}
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Distributor
                        </label>
                        <select
                          className="w-full sm:w-72 border border-gray-300 rounded-md shadow-sm focus:ring-gray-300 focus:ring-opacity-50 p-2"
                          value={distributor}
                          onChange={(e) => setDistributor(e.target.value)}
                        >
                          <option value="">Select a distributor</option>
                          <option value="Distributor 1">Distributor 1</option>
                          <option value="Distributor 2">Distributor 2</option>
                          <option value="Distributor 3">Distributor 3</option>
                        </select>
                      </div>
            
                      {/* Grid Layout: User Name and Mail ID */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">
                            User Name
                          </label>
                          <input
                            type="text"
                            className="w-full sm:w-72 border border-gray-300 rounded-md shadow-sm focus:ring-gray-300 focus:ring-opacity-50 p-2"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">
                            Mail ID
                          </label>
                          <input
                            type="email"
                            className="w-full sm:w-72 border border-gray-300 rounded-md shadow-sm focus:ring-gray-300 focus:ring-opacity-50 p-2"
                            value={mailId}
                            onChange={(e) => setMailId(e.target.value)}
                          />
                        </div>
                      </div>
            
                      {/* Grid Layout: Contact Person and Contact Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">
                            Contact Person
                          </label>
                          <input
                            type="text"
                            className="w-full sm:w-72 border border-gray-300 rounded-md shadow-sm focus:ring-gray-300 focus:ring-opacity-50 p-2"
                            value={contactPerson}
                            onChange={(e) => setContactPerson(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">
                            Contact Phone Number
                          </label>
                          <input
                            type="text"
                            className="w-full sm:w-72 border border-gray-300 rounded-md shadow-sm focus:ring-gray-300 focus:ring-opacity-50 p-2"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                          />
                        </div>
                      </div>
            
                      {/* Grid Layout: New Password and Confirm Password */}
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
                      <div className="flex flex-col sm:flex-row justify-end sm:space-x-3 space-y-3 sm:space-y-0">
                        <button
                          className="px-14 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                          onClick={() => setShowAddNewUserPopup(!showAddNewUserPopup)}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-14 py-2 text-sm font-medium text-white bg-green-700 rounded-md hover:bg-green-800"
                          onClick={handleSave}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                )}
            <div className="flex justify-between items-center text-gray-700 text-sm mt-4">
          <p>
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries{" "}
            {fromDate && toDate && ` for last 3 months`}
          </p>

          <div className="flex items-center gap-2">
            <button
              className={`px-4 py-2 rounded ${
                currentPage === 1 ? "bg-white text-gray-500" : "bg-white hover:bg-paginationColor text-gray-700"
              }`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt; Previous
            </button>

            {currentPage > 1 && (
              <button
                className="px-3 py-1 rounded-full bg-white text-gray-700 hover:bg-paginationColor"
                onClick={() => handlePageChange(1)}
              >
                1
              </button>
            )}
            <button className="px-3 py-1 rounded-full bg-gray-200 text-gray-700">
              {currentPage}
            </button>
            {currentPage + 1 <= totalPages && (
              <button
                className="px-3 py-1 rounded-full bg-paginationColor text-gray-700 hover:bg-paginationColor"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                {currentPage + 1}
              </button>
            )}
            {currentPage !== totalPages && (
              <button
                className="px-3 py-1 rounded-full bg-white text-gray-700 hover:bg-paginationColor"
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </button>
            )}

            <button
              className={`px-4 py-2 rounded ${
                currentPage === totalPages ? "bg-white text-gray-500" : "bg-white hover:bg-paginationColor text-gray-700"
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next &gt;
            </button>
          </div>
        </div>
          </div>
        <Footer />
        {showSuccessPopup && (
          <SuccessPopup 
            onClose={() => setShowSuccessPopup(false)} 
            message="Exported the user details successfully"
          />
        )}
        {showNoDataPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <div className="flex flex-col items-center">
                <div className="mb-4 text-center">
                  <h3 className="text-lg font-medium text-gray-900">No Data Available</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    There is no data available to export at this moment.
                  </p>
                </div>
                <button
                  onClick={() => setShowNoDataPopup(false)}
                  className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default UsersDetails;