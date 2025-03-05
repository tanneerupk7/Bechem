import React, { useState, useEffect } from "react";
import profileImg from "../assets/images/profile.png"; // Ensure you have the correct image path
import { XMarkIcon } from "@heroicons/react/24/outline";
import SuccessPopup from "./successPopup"; 

const PurchaseOrderSummary = ({ poData, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [poDetails, setPoDetails] = useState(null);
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const API_URI = import.meta.env.VITE_API_URI;

  useEffect(() => {
    const fetchPODetails = async () => {
      try {
        const response = await fetch(`${API_URI}/po_view/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tran_cd: poData.tran_cd,
          }),
        });

        const data = await response.json();
        if (data) {
          setPoDetails(data["PO Details"]?.[0] || {});
          setProductList(data["Product List"] || []);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching PO details:", error);
        setIsLoading(false);
      }
    };

    if (poData?.tran_cd) {
      fetchPODetails();
    }
  }, [poData?.tran_cd]);

  const handleDownload = () => {
    // Your download logic here
    setShowSuccessPopup(true); // Show success popup after download
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white w-full max-w-[90vw] h-[90vh] relative rounded-lg flex flex-col">
        {/* Header - Made Responsive */}
        <div
          className="px-3 py-1 flex justify-between items-center bg-headerColor border-b border-customYellow h-[55px] w-full"
          style={{
            backgroundImage: "url(header.svg)",
            backgroundSize: "contain",
            backgroundPosition: "left center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="flex-1">
            <h2 className="font-bold text-slate-900 font-helvetica text-[22px] leading-none p-1 whitespace-nowrap">
              Purchase Order Summary
            </h2>
            <p className="text-gray-500 text-[10px] leading-none m-0 px-1 font-helvetica">
              Click on export if you want to download as pdf
            </p>
          </div>
       
          <button onClick={onClose} className="ml-4">
  <XMarkIcon className="w-6 h-6" />
</button>
        </div>

        {/* Content section with adjusted PO details */}
        <div className="flex justify-between p-4 h-[calc(45vh-55px)]">
          {/* Shipment Details - Added margin bottom */}
          <div className="w-[150px] ml-[124px] mb-8">
            <h3 className="text-[#455A5C] text-sm font-bold mb-2 font-helvetica">
              Shipment Details
            </h3>
            <div className="border-t-2 border-gray-300 w-full">
              <div className="flex flex-col space-y-2 mt-2 font-helvetica">
                <div className="flex items-center gap-2">
                  <span className="text-[#395977] w-[50px] ml-2 text-xs">
                    Consignee
                  </span>
                  <span className="text-[#D1D5DB] text-xs">
                    {poDetails?.CONS_NM?.trim()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#395977] w-[50px] ml-2 text-xs">
                    End Customer
                  </span>
                  <span className="text-[#D1D5DB] text-xs">
                    {poDetails?.end_customer}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#395977] w-[50px] ml-2 text-xs">
                    Delivery
                  </span>
                  <span className="text-[#D1D5DB] text-xs">
                    {poDetails?.u_deli?.trim()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#395977] w-[50px] ml-2 text-xs">
                    Remarks
                  </span>
                  <span className="text-[#D1D5DB] text-xs">
                    {poDetails?.mainnarr}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* PO Details - Moved right and increased size */}
          <div className="w-[400px] absolute right-[180px] top-[70px] p-6 bg-white rounded-lg">
            <h2 className="text-[#455A5C] text-sm font-bold border-b-2 pb-2 font-helvetica">
              PO NO: {poDetails?.U_PONO}
            </h2>
            <div className="mt-2 flex flex-wrap gap-4">
              <div className="w-[60px] h-[60px] rounded-full bg-[#E5EFF9] overflow-hidden">
                <img
                  src={profileImg}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-2 font-helvetica min-w-[200px]">
                <div className="flex gap-2">
                  <span className="text-[#395977] w-24 text-sm">Date</span>
                  <span className="text-[#D1D5DB] text-sm">
                    {poDetails?.DATE}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#395977] w-24 text-sm">
                    Party Name
                  </span>
                  <span className="text-[#D1D5DB] text-sm">
                    {poDetails?.party_nm?.trim()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#395977] w-24 text-sm">
                    Price Type
                  </span>
                  <span className="text-[#D1D5DB] text-sm">
                    {poDetails?.Price_ty}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section with adjusted padding and column widths */}
        <div
          className="overflow-x-auto px-8 mt-8"
          style={{ maxHeight: "500px", overflowY: "auto" }}
        >
          <table className="table-auto w-full border-collapse border-b border-gray-300 text-xs border-l border-r">
            <thead>
              <tr className="bg-tableHeaderColor border-b text-left border-gray-300">
                <th className="p-3 font-normal text-left w-[120px]">
                  Product Name
                </th>
                <th className="p-3 font-normal text-left w-[120px]">
                  End Customer
                </th>
                <th className="p-3 font-normal text-left w-[60px]">Qty</th>
                <th className="p-3 font-normal text-left w-[80px]">
                  Pack Size
                </th>
                <th className="p-3 font-normal text-left w-[80px]">
                  Total Qty
                </th>
                <th className="p-3 font-normal text-left w-[80px]">Rate</th>
                <th className="p-3 font-normal text-left w-[60px]">Disc %</th>
                <th className="p-3 font-normal text-left w-[80px]">Discount</th>
                <th className="p-3 font-normal text-left w-[100px]">
                  Assess. Amt.
                </th>
                <th className="p-3 font-normal text-left w-[80px]">
                  Del. Status
                </th>
                <th className="p-3 font-normal text-left w-[80px]">Vertical</th>
                <th className="p-3 font-normal border-r border-gray-300 w-[80px]">
                  Engineer
                </th>
              </tr>
            </thead>
            <tbody>
              {productList.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 border-b border-gray-300"
                >
                  <td className="p-3 text-left">
                    <div
                      className="overflow-hidden whitespace-nowrap truncate max-w-[120px]"
                      title={item.IT_NAME}
                    >
                      {item.IT_NAME}
                    </div>
                  </td>
                  <td className="p-3 text-left">
                    <div
                      className="overflow-hidden whitespace-nowrap truncate max-w-[120px]"
                      title={item.END_CUSTOMER}
                    >
                      {item.END_CUSTOMER}
                    </div>
                  </td>
                  <td className="p-3 text-left overflow-hidden whitespace-nowrap">
                    {item.QTY}
                  </td>
                  <td className="p-3 text-left overflow-hidden whitespace-nowrap">
                    {item.packsize}
                  </td>
                  <td className="p-3 text-left overflow-hidden whitespace-nowrap">
                    {item.TOT_QTY}
                  </td>
                  <td className="p-3 text-right overflow-hidden whitespace-nowrap">
                    {item.RATE}
                  </td>
                  <td className="p-3 text-left overflow-hidden whitespace-nowrap">
                    {item.U_DPER}
                  </td>
                  <td className="p-3 text-left overflow-hidden whitespace-nowrap">
                    {item.U_DISC}
                  </td>
                  <td className="p-3 text-right overflow-hidden whitespace-nowrap">
                    {item.u_asseamt}
                  </td>
                  <td className="p-3 text-left">
                    <div
                      className="overflow-hidden whitespace-nowrap truncate max-w-[80px]"
                      title={item.SOG_DELIVERY}
                    >
                      {item.SOG_DELIVERY}
                    </div>
                  </td>
                  <td className="p-3 text-left">
                    <div
                      className="overflow-hidden whitespace-nowrap truncate max-w-[80px]"
                      title={item.U_VERTICAL}
                    >
                      {item.U_VERTICAL}
                    </div>
                  </td>
                  <td className="p-3 text-left border-r border-gray-300">
                    <div
                      className="overflow-hidden whitespace-nowrap truncate max-w-[80px]"
                      title={item.U_ENGNAME}
                    >
                      {item.U_ENGNAME}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Download Button - Made Responsive */}
        <button
          onClick={handleDownload}
          className="fixed lg:absolute top-16 right-4 bg-[#15460B] text-slate-200 px-4 py-2 text-sm rounded-md flex items-center gap-2 w-[124px] h-[32px] mr-8 hover:bg-customYellow font-helvetica z-10"
        >
          {/* <span>
            <svg
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.33333 12.8125C2.7142 12.18 2.24714 11.4148 1.96753 10.575C1.68792 9.73517 1.60309 8.84274 1.71946 7.96529C1.83584 7.08784 2.15038 6.24837 2.63924 5.51048C3.12811 4.7726 3.77848 4.15563 4.54111 3.70633C5.30373 3.25703 6.1586 2.98717 7.04097 2.91719C7.92334 2.84721 8.81006 2.97894 9.63397 3.30242C10.4579 3.6259 11.1974 4.13263 11.7964 4.78424C12.3955 5.43584 12.8384 6.21523 13.0917 7.06337H14.5833C15.3879 7.06328 16.1712 7.32197 16.8175 7.80124C17.4638 8.2805 17.9388 8.95492 18.1723 9.72488C18.4059 10.4948 18.3856 11.3195 18.1144 12.077C17.8433 12.8346 17.3357 13.4848 16.6667 13.9317"
                stroke="white"
                stroke-width="1.25"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 10.3965V17.8965"
                stroke="white"
                stroke-width="1.25"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66663 14.563L9.99996 17.8963L13.3333 14.563"
                stroke="white"
                stroke-width="1.25"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span> */}
                         <span >
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
          <span>Download</span>
        </button>

        {/* Success Popup */}
        {showSuccessPopup && (
          <SuccessPopup
            message="Downloading your Reports"
            onClose={() => setShowSuccessPopup(false)}
          />
        )}
      </div>
    </div>
  );
};

export default PurchaseOrderSummary;
