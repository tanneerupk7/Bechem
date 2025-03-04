import React, { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import pdf from "../assets/pdf.png";
import DatePicker from "react-datepicker";
import { FaFilter } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import Header from "./Header";
import { FiDownload } from "react-icons/fi";
import Papa from "papaparse";
import Footer from "./Footer";
import { BlinkBlur } from "react-loading-indicators";
import SuccessPopup from "./SuccessPopup";

const SOGTable = ({ accountId,isAdmin,accountName, selectedDistributor }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const itemsPerPage = 10;
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const popupRef = useRef(null);
  const API_URI = import.meta.env.VITE_API_URI;
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showNoDataPopup, setShowNoDataPopup] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.trim());
  };

  const formatDate = (date) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options).replace(/ /g, "-");
  };

  const parseDateInput = (dateStr) => {
    if (!dateStr) return null;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [day, monthAbbr, year] = dateStr.split("-");
    const monthIndex = months.indexOf(monthAbbr);
    if (monthIndex === -1 || !day || !year) return null;
    return new Date(year, monthIndex, day);
  };

  const handleFilterByDate = (data) => {
    const itemDate = parseDateInput(data.SOG_Order_Date);
    const from = fromDate ? parseDateInput(fromDate) : null;
    const to = toDate ? parseDateInput(toDate) : null;

    if (!itemDate) return false;
    if (from && itemDate < from) return false;
    if (to && itemDate > to) return false;

    return true;
  };

  useEffect(() => {
    const filtered = data.filter((data) => {
      const matchesSearch = Object.values(data).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesDate = handleFilterByDate(data);
      return matchesSearch && matchesDate;
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, fromDate, toDate, data]);

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
    doc.text(`SOG Details - ${data.SOG_Order_No || "N/A"}`, 14, 10);
    doc.autoTable({
      startY: 20,
      body: [
        ["Transaction Code", data.tran_cd || "N/A"],
        ["SOG Order Date", data.SOG_Order_Date || "N/A"],
        ["SOG Order No", data.SOG_Order_No || "N/A"],
        ["Consignee", data.Consignee || "N/A"],
        ["Item", data.ITEM || "N/A"],
        ["Quantity", data.qty || "N/A"],
        ["Price", data.Price || "N/A"],
        ["SOG Reason", data.SOG_REASON || "N/A"],
      ],
    });
    doc.save(`SOG_${data.SOG_Order_No || "Unknown"}.pdf`);
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
    link.setAttribute("download", "sog_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success popup
    setShowSuccessPopup(true);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col">
<<<<<<< HEAD
      <Header isAdmin={isAdmin} accountName={accountName} selectedDistributor={selectedDistributor}/>
      <div className="bg-white rounded-lg flex-1 p-4 md:p-6 ">
=======
      <Header isAdmin={isAdmin} accountName={accountName} />
      <div className="bg-white rounded-lg flex-1 pb-4 md:px-6  ">
>>>>>>> 5c060787c25ded16dcfed47cd15af6333b1614c8
        <div className="relative w-full md:w-1/4 ml-auto">
          <div className="flex">
            <div className="relative inline-block">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={exportCSV}
                className="flex items-center bg-gray-300 text-white px-3 py-2 rounded-md hover:bg-customYellow mr-2"
              >
                {/* <FiDownload className="mr-2" /> */}
                <span className="mr-2"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.33345 12.4161C2.71432 11.7835 2.24726 11.0183 1.96765 10.1785C1.68804 9.33869 1.60321 8.44626 1.71959 7.5688C1.83597 6.69135 2.1505 5.85189 2.63937 5.114C3.12823 4.37611 3.77861 3.75915 4.54123 3.30985C5.30385 2.86054 6.15873 2.59068 7.04109 2.5207C7.92346 2.45072 8.81018 2.58246 9.63409 2.90594C10.458 3.22941 11.1975 3.73615 11.7966 4.38775C12.3956 5.03936 12.8386 5.81875 13.0918 6.66689H14.5835C15.388 6.66679 16.1713 6.92549 16.8176 7.40475C17.4639 7.88402 17.9389 8.55844 18.1724 9.32839C18.406 10.0983 18.3857 10.923 18.1146 11.6805C17.8434 12.4381 17.3359 13.0883 16.6668 13.5352" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10 10V17.5" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.6665 14.1665L9.99984 17.4998L13.3332 14.1665" stroke="white" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</span>
                Export
              </button>
              
              {showTooltip && (
                <div className="absolute z-50 w-48 px-2 py-1 -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded shadow-lg">
                  Export Pending Approvals details to CSV file
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
              <FaFilter
                className="absolute right-3 text-gray-500 cursor-pointer"
                onClick={() => setShowFilterPopup(!showFilterPopup)}
              />
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

        <div className="overflow-x-auto mt-6" style={{ maxHeight: "500px", overflowY: "auto" }}>
          <table className="table-auto w-full border-collapse border-b border-gray-300 text-xs border-l border-r">
            <thead>
              <tr className="bg-tableHeaderColor border-b border-gray-300">
                <th className="p-2 font-normal border-l border-gray-300 text-left" style={{ width: "8%" }}>Transaction Code</th>
                <th className="p-2 font-normal text-left" style={{ width: "10%" }}>SOG Order Date</th>
                <th className="p-2 font-normal text-left" style={{ width: "10%" }}>SOG Order No</th>
                <th className="p-2 font-normal text-left" style={{ width: "15%" }}>Consignee</th>
                <th className="p-2 font-normal text-left" style={{ width: "15%" }}>Item</th>
                <th className="p-2 font-normal text-left" style={{ width: "8%" }}>Quantity</th>
                <th className="p-2 font-normal text-left" style={{ width: "8%" }}>Price</th>
                <th className="p-2 font-normal text-left border-r border-gray-300" style={{ width: "15%" }}>SOG Reason</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((data, index) => (
                <tr key={index} className="hover:bg-gray-100 border-b border-gray-300">
                  <td className="p-2 border-l border-gray-300 overflow-hidden whitespace-nowrap text-left">{data.tran_cd}</td>
                  <td className="p-2 text-left overflow-hidden whitespace-nowrap">{data.SOG_Order_Date}</td>
                  <td className="p-2 text-left overflow-hidden whitespace-nowrap">{data.SOG_Order_No}</td>
                  <td className="p-2 text-left overflow-hidden whitespace-nowrap">{data.Consignee}</td>
                  <td className="p-2 text-left overflow-hidden whitespace-nowrap">{data.ITEM}</td>
                  <td className="p-2 text-left overflow-hidden whitespace-nowrap">{data.qty}</td>
                  <td className="p-2 text-right overflow-hidden whitespace-nowrap">{data.Price}</td>
                  <td className="p-2 text-left border-r border-gray-300 overflow-hidden whitespace-nowrap">{data.SOG_REASON}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* <div className="flex justify-between items-center text-gray-700 text-sm mt-4">
          <p>
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
          </p>
          <div className="flex items-center gap-2">
            <button
              className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-white text-gray-500" : "bg-white hover:bg-paginationColor text-gray-700"}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt; Previous
            </button>
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
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next &gt;
              </button>
            )}
          </div>
        </div> */}
         <div className="flex justify-between items-center text-gray-700 text-sm mt-4">
          <p>
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries{" "}
            {fromDate && toDate && ` for last 2 months`}
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

      {/* Success Popup */}
      {showSuccessPopup && (
        <SuccessPopup 
          onClose={() => setShowSuccessPopup(false)} 
          message="Exported the Pending Approvals details successfully"
        />
      )}

      {/* No Data Popup */}
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

export default SOGTable;

