import React, { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import pdf from "../assets/pdf.png"; // Ensure you have a PDF icon in your assets
import DatePicker from "react-datepicker";
import { FaCalendarAlt, FaFilter } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import { FiDownload } from "react-icons/fi";
import Papa from "papaparse";
import Header from "./Header";
import Footer from "./Footer";
import { BlinkBlur } from "react-loading-indicators";
import SuccessPopup from "./SuccessPopup";
import PurchaseOrderSummary from "./PurchaseOrderSummary";
import Filter from "../assets/filter.svg";
const PurchaseOrderList = ({
  accountId,
  isAdmin,
  accountName,
  selectedDistributor,
}) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const itemsPerPage = 12;
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const popupRef = useRef(null);
  const API_URI = import.meta.env.VITE_API_URI;
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showNoDataPopup, setShowNoDataPopup] = useState(false);
  const [showPOSummary, setShowPOSummary] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);

  useEffect(() => {
    if (accountId || selectedDistributor.ac_id) {
      const currentDate = new Date();
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

      setFromDate(String(formatDate(threeMonthsAgo)));
      setToDate(String(formatDate(currentDate)));

      const fetchData = async () => {
        setIsLoading(true); // Start loading
        try {
          const response = await fetch(`${API_URI}/po_list/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ACID: accountId || selectedDistributor.ac_id,
              search: "%",
              from_date: "",
              to_date: "",
            }),
          });

          const result = await response.json();

          setData(result);
        } catch (error) {
          console.error("Error fetching data:", error);
          setErrorMessage("An error occurred while fetching invoices.");
        } finally {
          setIsLoading(false); // Stop loading
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

  const parseDateInput = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    if (!day || !month || !year) return "Invalid Date";
    const formattedMonth =
      month[0].toUpperCase() + month.slice(1).toLowerCase();
    const date = new Date(`${formattedMonth} ${day}, ${year}`);
    return isNaN(date) ? "Invalid Date" : date;
  };

  const handleFilterByDate = (data) => {
    const itemDate = new Date(data.PODt);
    const from = fromDate ? parseDateInput(fromDate) : null;
    const to = toDate ? parseDateInput(toDate) : null;

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
    const doc = new jsPDF();
    doc.text(`Purchase Order Details - ${data.u_pono}`, 14, 10);
    doc.autoTable({
      startY: 20,
      body: [
        ["PO Number", data.u_pono],
        ["PO Date", data.PODt],
        ["Sales Order No", data.OrderNo],
        ["Sales Order Date", data.OrderDt],
        ["Consignee", data.Consignee],
        ["Order Amount", data.Amount],
        ["Tax Amount", data.taxamt],
        ["Order Status", data.order_status],
        ["Stock Allocation", data.StkAllocation],
        ["Shipment Status", data.ShipmentStatus],
        ["Account Status", data.AccStatus],
      ],
    });
    doc.save(`PurchaseOrder_${data.u_pono}.pdf`);
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
    link.setAttribute("download", "purchase_order_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowSuccessPopup(true);
  };

  const handleOutsideClick = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setShowFilterPopup(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handlePOClick = (poData) => {
    setSelectedPO(poData);
    setShowPOSummary(true);
  };

  return (
    <div className="h-screen flex flex-col">
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-50 z-50">
          <BlinkBlur color="#FBB900" size="large" />
          <p className="mt-4 text-white">Loading purchase orders...</p>
        </div>
      )}
      <Header
        className="fixed top-0 left-0"
        isAdmin={isAdmin}
        accountName={accountName}
        selectedDistributor={selectedDistributor}
      />
      <div className="bg-white rounded-lg flex-1 pb-2 pt-2 md:px-6 ">
        <div className="relative w-full md:w-1/4 ml-auto">
          <div className="flex">
            <div className="relative inline-block">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={exportCSV}
                className="flex items-center bg-gray-300 text-white px-2 py-2 rounded-md hover:bg-customYellow mr-2 "
              >
                {/* <FiDownload className="mr-2" /> */}
                <span className="mr-2">
                  <svg
                    className="w-5 h-5 stroke-white"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.33345 12.4161C2.71432 11.7835 2.24726 11.0183 1.96765 10.1785C1.68804 9.33869 1.60321 8.44626 1.71959 7.5688C1.83597 6.69135 2.1505 5.85189 2.63937 5.114C3.12823 4.37611 3.77861 3.75915 4.54123 3.30985C5.30385 2.86054 6.15873 2.59068 7.04109 2.5207C7.92346 2.45072 8.81018 2.58246 9.63409 2.90594C10.458 3.22941 11.1975 3.73615 11.7966 4.38775C12.3956 5.03936 12.8386 5.81875 13.0918 6.66689H14.5835C15.388 6.66679 16.1713 6.92549 16.8176 7.40475C17.4639 7.88402 17.9389 8.55844 18.1724 9.32839C18.406 10.0983 18.3857 10.923 18.1146 11.6805C17.8434 12.4381 17.3359 13.0883 16.6668 13.5352"
                      className="stroke-white stroke-[1.25] rounded-lg"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 10V17.5"
                      className="stroke-white stroke-[1.25]"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.6665 14.1665L9.99984 17.4998L13.3332 14.1665"
                      className="stroke-white stroke-[1.25]"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Export
              </button>

              {showTooltip && (
                <div className="absolute z-50 w-48 px-2 py-1 -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded shadow-lg">
                  Export purchase order details to CSV file
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
              <img
                src={Filter}
                alt="Filter Icon"
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
                <label className="block text-sm font-medium text-gray-700">
                  From Date:
                </label>
                <DatePicker
                  selected={fromDate ? new Date(fromDate) : null}
                  onChange={(date) => setFromDate(formatDate(date))}
                  className="border p-2 rounded w-full"
                  dateFormat="dd-MMM-yyyy"
                  placeholderText="Select a date"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  To Date:
                </label>
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
        <div
          className="overflow-x-auto mt-2"
          style={{ maxHeight: "500px", overflowY: "auto" }}
        >
          {/* <table className="table-auto w-full border-collapse border-b border-gray-300 text-xs border-l border-r"> */}
          <table className="table-auto w-full border-collapse border-b border-gray-300 text-xs border-l border-r">
            <thead>
              <tr className="bg-tableHeaderColor border-b border-gray-300">
                <th
                  className="p-2 font-normal border-l border-gray-300 text-left"
                  style={{ width: "8%" }}
                >
                  PO Number
                </th>
                <th
                  className="p-2 font-normal text-left "
                  style={{ width: "8%" }}
                >
                  PO Date
                </th>
                <th
                  className="p-2 font-normal text-left"
                  style={{ width: "8%" }}
                >
                  Sales Order No
                </th>
                <th
                  className="p-2 font-normal text-left"
                  style={{ width: "8%" }}
                >
                  Sales Order Date
                </th>
                <th
                  className="p-2 font-normal text-left"
                  style={{ width: "10%" }}
                >
                  Consignee
                </th>
                <th
                  className="p-2 font-normal text-left"
                  style={{ width: "8%" }}
                >
                  Order Amount
                </th>
                <th
                  className="p-2 font-normal text-left"
                  style={{ width: "8%" }}
                >
                  Tax Amount
                </th>
                <th
                  className="p-2 font-normal text-left"
                  style={{ width: "8%" }}
                >
                  Order Status
                </th>
                <th
                  className="p-2 font-normal text-left"
                  style={{ width: "8%" }}
                >
                  Stage 1 Approval
                </th>
                <th
                  className="p-2 font-normal text-left"
                  style={{ width: "8%" }}
                >
                  Stage 2 Approval
                </th>
                {/* <th
                  className="p-2 font-normal text-left"
                  style={{ width: "8%" }}
                >
                  Stock Allocation
                </th> */}
                <th
                  className="p-2 font-normal text-left"
                  style={{ width: "8%" }}
                >
                  Shipment Status
                </th>
                <th
                  className="p-2 font-normal text-left"
                  style={{ width: "8%" }}
                >
                  Account Status
                </th>
                {/* <th
                  className="p-2 font-normal text-left"
                  style={{ width: "8%" }}
                >
                  Invoices
                </th> */}
              </tr>
            </thead>

            <tbody>
              {currentData.map((data, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 border-b border-gray-300"
                >
                  <td className="p-2 text-center border-l border-gray-300 overflow-hidden whitespace-nowrap">
                    <button
                      onClick={() => handlePOClick(data)}
                      className="text-poListPONumberColor hover:underline focus:outline-none"
                    >
                      {data.u_pono}
                    </button>
                  </td>
                  <td className="p-2 text-left overflow-hidden whitespace-nowrap">
                    {data.PODt}
                  </td>
                  <td className="p-2 text-left overflow-hidden whitespace-nowrap">
                    {data.OrderNo}
                  </td>
                  <td className="p-2 text-left overflow-hidden whitespace-nowrap">
                    {data.OrderDt}
                  </td>
                  <td className="p-2 text-left overflow-hidden whitespace-nowrap">
                    {data.Consignee}
                  </td>
                  <td className="p-2 text-right overflow-hidden whitespace-nowrap">
                    {data.Amount}
                  </td>
                  <td className="p-2 text-right overflow-hidden whitespace-nowrap">
                    {data.taxamt}
                  </td>
                  <td className="p-2 text-left overflow-hidden whitespace-nowrap">
                    {data.order_status}
                  </td>
                  <td className="p-2 text-left overflow-hidden whitespace-nowrap">
                    {data.MGR_APPR}
                  </td>
                  <td className="p-2 text-left overflow-hidden whitespace-nowrap">
                    {data.FINAL_APPR}
                  </td>
                  {/* <td className="p-2 text-left overflow-hidden whitespace-nowrap">
                    {data.StkAllocation}
                  </td> */}
                  <td className="p-2 text-left overflow-hidden whitespace-nowrap">
                    {data.ShipmentStatus}
                  </td>
                  <td className="p-2 text-left overflow-hidden whitespace-nowrap">
                    {data.AccStatus}
                  </td>
                  {/* <td className="p-2 text-left">
                    <img
                      src={pdf}
                      alt="PDF Icon"
                      className="h-5 mx-auto cursor-pointer"
                      onClick={() => downloadPDF(data)}
                    />
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center text-gray-700 text-sm mt-4">
          <p>
            Showing{" "}
            {Math.min(
              (currentPage - 1) * itemsPerPage + 1,
              filteredData.length
            )}{" "}
            to {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
            {filteredData.length} entries{" "}
            {fromDate && toDate && ` for last 3 months`}
          </p>

          <div className="flex items-center gap-2">
            <button
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-white text-gray-500"
                  : "bg-white hover:bg-paginationColor text-gray-700"
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
                currentPage === totalPages
                  ? "bg-white text-gray-500"
                  : "bg-white hover:bg-paginationColor text-gray-700"
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
          message="Exported the purchase order details successfully"
        />
      )}
      {showNoDataPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <div className="flex flex-col items-center">
              <div className="mb-4 text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  No Data Available
                </h3>
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
      {showPOSummary && selectedPO && (
        <PurchaseOrderSummary
          poData={selectedPO}
          onClose={() => setShowPOSummary(false)}
        />
      )}
    </div>
  );
};

export default PurchaseOrderList;
