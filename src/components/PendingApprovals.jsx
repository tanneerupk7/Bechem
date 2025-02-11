

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

const SOGTable = ({ accountId }) => {
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
    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "sog_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <>
      <Header />
      <div className="bg-white rounded-lg w-full h-full p-4 md:p-6">
        <div className="relative w-full md:w-1/4 ml-auto">
          <div className="flex">
            <button
              onClick={exportCSV}
              className="flex items-center bg-gray-300 text-white px-3 py-2 rounded-md hover:bg-customYellow mr-2"
            >
              <FiDownload className="mr-2" />
              Export
            </button>
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
                <th className="p-2 font-normal border-l border-gray-300" style={{ width: "8%" }}>Transaction Code</th>
                <th className="p-2 font-normal" style={{ width: "10%" }}>SOG Order Date</th>
                <th className="p-2 font-normal" style={{ width: "10%" }}>SOG Order No</th>
                <th className="p-2 font-normal" style={{ width: "15%" }}>Consignee</th>
                <th className="p-2 font-normal" style={{ width: "15%" }}>Item</th>
                <th className="p-2 font-normal" style={{ width: "8%" }}>Quantity</th>
                <th className="p-2 font-normal" style={{ width: "8%" }}>Price</th>
                <th className="p-2 font-normal border-r border-gray-300" style={{ width: "15%" }}>SOG Reason</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((data, index) => (
                <tr key={index} className="hover:bg-gray-100 border-b border-gray-300">
                  <td className="p-2 text-center border-l border-gray-300 overflow-hidden whitespace-nowrap">{data.tran_cd}</td>
                  <td className="p-2 text-center overflow-hidden whitespace-nowrap">{data.SOG_Order_Date}</td>
                  <td className="p-2 text-center overflow-hidden whitespace-nowrap">{data.SOG_Order_No}</td>
                  <td className="p-2 text-center overflow-hidden whitespace-nowrap">{data.Consignee}</td>
                  <td className="p-2 text-center overflow-hidden whitespace-nowrap">{data.ITEM}</td>
                  <td className="p-2 text-center overflow-hidden whitespace-nowrap">{data.qty}</td>
                  <td className="p-2 text-center overflow-hidden whitespace-nowrap">{data.Price}</td>
                  <td className="p-2 text-center border-r border-gray-300 overflow-hidden whitespace-nowrap">{data.SOG_REASON}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center text-gray-700 text-sm mt-4">
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
        </div>
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
    </>
  );
};

export default SOGTable;

