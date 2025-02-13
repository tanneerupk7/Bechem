

import React, { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import pdf from "../assets/pdf.png";
import DatePicker from "react-datepicker";
import { FaFilter } from "react-icons/fa"; // Import Funnel icon
import "react-datepicker/dist/react-datepicker.css";
import Header from "./Header";
import { FiDownload } from "react-icons/fi";
import Papa from "papaparse";
import Filter from "../assets/filter.svg"
const InvoiceTable = ({ accountId }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const itemsPerPage = 10;
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const popupRef = useRef(null); // Reference for the popup
  const API_URI = import.meta.env.VITE_API_URI;

  useEffect(() => {
    if (accountId) {
      const currentDate = new Date();
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
  
      setFromDate(String(formatDate(threeMonthsAgo))); // Correctly set fromDate
      setToDate(String(formatDate(currentDate)));     // Correctly set toDate
  
      const fetchData = async () => {
        try {
          const response = await fetch(`${API_URI}/Invoice_details/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ACID: accountId,
              search: "%",
              from_date: fromDate, // Use correct fromDate
              to_date: toDate,
            }),
          });
  
          const result = await response.json();
          setData(result);
        } catch (error) {
          console.error("Error fetching data:", error);
          setErrorMessage("An error occurred while fetching invoices.");
        }
      };
  
      fetchData();
    }
  }, [accountId]);
  


  const handleSearch = (e) => {
    setSearchTerm(e.target.value.trim());
  };

  const formatDate = (date) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options).replace(/ /g, "-");
  };

  // const parseDateInput = (dateStr) => {
  //   const [day, month, year] = dateStr.split("-");
  //   if (!day || !month || !year) return "Invalid Date";
  //   const formattedMonth = month[0].toUpperCase() + month.slice(1).toLowerCase();
  //   const date = new Date(`${formattedMonth} ${day}, ${year}`);
  //   return isNaN(date) ? "Invalid Date" : date;
  // };

  const parseDateInput = (dateStr) => {
    if (!dateStr) return null;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [day, monthAbbr, year] = dateStr.split("-");
    const monthIndex = months.indexOf(monthAbbr);
    if (monthIndex === -1 || !day || !year) return null;
    return new Date(year, monthIndex, day);
  };
  



  const handleFilterByDate = (data) => {
  const itemDate = parseDateInput(data.invDt); // Use the correct date field
  const from = fromDate ? parseDateInput(fromDate) : null;
  const to = toDate ? parseDateInput(toDate) : null;

  if (!itemDate) return false; // Ignore invalid dates
  if (from && itemDate < from) return false;
  if (to && itemDate > to) return false;

  return true;
};


  useEffect(() => {
    const filtered = data.filter((data) => {
      const matchesSearch = Object.values(data).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesDate = handleFilterByDate(data); // Pass the item to the filter function
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
    doc.text(`Invoice Details - ${data.inv_no || "N/A"}`, 14, 10);
    doc.autoTable({
      startY: 20,
      body: [
        ["Invoice No", data.inv_no || "N/A"],
        ["Invoice Date", data.invDt || "N/A"],
        ["PO No", data.u_pono || "N/A"],
        ["PO Date", data.u_podt || "N/A"],
        ["Consignee", data.Consignee || "N/A"],
        ["LR Number", data.LRNumber || "N/A"],
        ["Transporter", data.Transporter || "N/A"],
        ["Transporter Code", data.tran_cd || "N/A"],
        ["Amount", data.Amount || "N/A"],
        ["ETA", data.eta || "N/A"],
        ["Sales Tax No", data.Sales_tax_No || "N/A"],
        ["CST", data.CST || "N/A"],
        ["Delivered Status", data.DELIVERED || "N/A"],
        ["Feedback Status", data.FEEDBACK || "N/A"],
        ["Expected Delivery Date", data.EDD || "N/A"],
        ["Actuals", data.Actuals || "N/A"]
      ],
    });
    doc.save(`Invoice_${data.inv_no || "Unknown"}.pdf`);
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
    link.setAttribute("download", "invoice_data.csv");
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
      {/* <div className="bg-gray-100 min-h-screen p-2 md:p-4"> */}
        <div className="bg-white rounded-lg w-full h-full p-4 md:p-6">
          <div className="relative w-full md:w-1/4 ml-auto ">
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
                <img src={Filter} alt="Filter Icon" 
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

          {/* <div className="overflow-x-auto mt-6"> */}
          <div className="overflow-x-auto mt-6" style={{ maxHeight: "500px", overflowY: "auto" }}>
            {/* <table className="table-auto w-full border-collapse border-b border-gray-300 text-xs border-l border-r"> */}
            <table className="table-auto w-full border-collapse border-b border-gray-300 text-xs border-l border-r">
            <thead>
                <tr className="bg-tableHeaderColor border-b border-gray-300">
                  <th className="p-2 font-normal border-l border-gray-300" style={{ width: "8%" }}>Invoice No</th>
                  <th className="p-2 font-normal" style={{ width: "8%" }}>Invoice Date</th>
                  <th className="p-2 font-normal" style={{ width: "8%" }}>PO No</th>
                  <th className="p-2 font-normal" style={{ width: "8%" }}>PO Date</th>
                  <th className="p-2 font-normal" style={{ width: "10%" }}>Consignee</th>
                  <th className="p-2 font-normal" style={{ width: "8%" }}>LR Number</th>
                  <th className="p-2 font-normal" style={{ width: "10%" }}>Transporter</th>
                  <th className="p-2 font-normal" style={{ width: "8%" }}>Transporter Code</th>
                  <th className="p-2 font-normal" style={{ width: "8%" }}>Amount</th>
                  <th className="p-2 font-normal" style={{ width: "8%" }}>Sales Tax No</th>
                  {/* <th className="p-2 font-normal" style={{ width: "8%" }}>Delivered Status</th> */}
                  <th className="p-2 font-normal" style={{ width: "8%" }}>ETA</th>
                  <th className="p-2 font-normal" style={{ width: "8%" }}>Actuals</th>
                  <th className="p-2 font-normal border-r border-gray-300" style={{ width: "8%" }}>Invoice</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((data, index) => (
                  <tr key={index} className="hover:bg-gray-100 border-b border-gray-300">
                    <td className="p-2 text-center border-l border-gray-300 overflow-hidden whitespace-nowrap">{data.inv_no}</td>
                    <td className="p-2 text-center overflow-hidden whitespace-nowrap">{data.invDt}</td>
                    <td className="p-2 text-center overflow-hidden whitespace-nowrap">{data.u_pono}</td>
                    <td className="p-2 text-center overflow-hidden whitespace-nowrap">{data.u_podt}</td>
                    <td className="p-2 text-center overflow-hidden whitespace-nowrap">{data.Consignee}</td>
                    <td className="p-2 text-center overflow-hidden whitespace-nowrap">{data.LRNumber}</td>
                    <td className="p-2 text-center overflow-hidden whitespace-nowrap">{data.Transporter}</td>
                    <td className="p-2 text-center overflow-hidden whitespace-nowrap">{data.tran_cd}</td>
                    <td className="p-2 text-center overflow-hidden whitespace-nowrap">{data.Amount}</td>
                    <td className="p-2 text-center overflow-hidden whitespace-nowrap">{data.Sales_tax_No}</td>
                    {/* <td className="p-2 text-center overflow-hidden whitespace-nowrap">{data.DELIVERED}</td> */}
                    <td className="p-2 text-center overflow-hidden whitespace-nowrap">{data.EDD}</td>
                    <td className="p-2 text-center overflow-hidden whitespace-nowrap">{data.Actuals}</td>
                    <td className="p-2 text-center border-r border-gray-300">
                      <img
                        src={pdf}
                        alt="PDF Icon"
                        className="h-5 mx-auto cursor-pointer"
                        onClick={() => downloadPDF(data)}
                      />
                    </td>
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
          <footer className="absolute bottom-5">
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
            </footer>
          </div>
      {/* </div> */}
    </>
  );
};

export default InvoiceTable;