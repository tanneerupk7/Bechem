import React, { useState } from "react";
import axios from "axios";
import sim from "../assets/card.png";
import pdf from "../assets/pdf.png";
import excel from "../assets/sheet.png";
import { BlinkBlur } from "react-loading-indicators";
import SuccessPopup from "./SuccessPopup";

const API_URI = import.meta.env.VITE_API_URI; // Define the API_URI constant

const Card = ({
  icon,
  title,
  description,
  buttonText,
  format,
  bgImage,
  onDownload,
}) => {
  return (
    <div className="h-72 max-w-[230px] bg-gray-50/90 border border-gray-200 rounded-lg overflow-hidden flex flex-col">
      <div
        className="h-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <img
            src={icon}
            alt="icon"
            className="w-20 h-20 bg-white rounded-full p-3 shadow-md"
          />
        </div>
      </div>
      {/* Content Section */}
      <div className="h-1/3 px-4 py-2 text-center flex flex-col justify-center items-center">
        <h2 className="text-lg font-semibold text-gray-800 leading-tight mt-14">
          {title}
        </h2>
        <p className="text-sm text-gray-500 mt-1 whitespace-nowrap">
          Download as {format}
        </p>
      </div>

      {/* Download Button Section */}
      <div className="h-1/3 p-4 text-center flex items-center justify-center">
        <button
          onClick={onDownload}
          className="px-6 py-2 bg-darkGreen text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-customYellow focus:outline-none focus:ring focus:ring-green-300"
        >
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

          {buttonText}
        </button>
      </div>
    </div>
  );
};

const Cards = ({ isAdmin, accountName, selectedDistributor }) => {
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleDownloadPendingSalesOrder = async () => {
    const buyer = accountName || selectedDistributor?.ac_name; // Use accountName or selectedDistributor.ac_name
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URI}/pending_sales_order/`,
        {
          buyer: buyer,
        },
        {
          responseType: "blob", // Set response type to blob
        }
      );

      // Create a URL for the PDF blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary link to download the file
      const link = document.createElement("a");
      link.href = url; // Set the href to the blob URL
      link.setAttribute("download", "pending_sales_order_report.pdf"); // Set the download attribute
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      // Show success popup
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error downloading pending sales order:", error);
      alert("Failed to download pending sales order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPaymentsOutstanding = async () => {
    const buyer = accountName || selectedDistributor?.ac_name; // Use accountName or selectedDistributor.ac_name
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URI}/payment_outstanding/`,
        {
          buyer: buyer,
        },
        {
          responseType: "blob", // Set response type to blob
        }
      );

      console.log("Response from payment_outstanding API:", response.data); // Log the response for debugging

      // Create a URL for the PDF blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary link to download the file
      const link = document.createElement("a");
      link.href = url; // Set the href to the blob URL
      link.setAttribute("download", "payments_outstanding_report.pdf"); // Set the download attribute
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      // Show success popup
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error downloading payments outstanding:", error);
      alert("Failed to download payments outstanding. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cardData = [
    {
      icon: excel,
      title: "Performance Dashboard",
      description: "Download as Excel",
      buttonText: "Download",
      format: "Excel",
      bgImage: sim,
    },
    {
      icon: pdf,
      title: "Payments Outstanding",
      description: "Download as PDF",
      buttonText: "Download",
      format: "PDF",
      bgImage: sim,
      onDownload: handleDownloadPaymentsOutstanding, // Set the download function for this card
    },
    {
      icon: pdf,
      title: "Pending Sales Order Details",
      description: "Download as PDF",
      buttonText: "Download",
      format: "PDF",
      bgImage: sim,
      onDownload: handleDownloadPendingSalesOrder, // Set the download function for this card
    },
  ];

  return (
    <div className="bg-white flex items-center justify-center mt-28 p-6">
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-50 z-50">
          <BlinkBlur color="#FBB900" size="large" />
          <p className="mt-4 text-white">Downloading...</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cardData.map((card, index) => (
          <Card
            key={index}
            icon={card.icon}
            title={card.title}
            description={card.description}
            buttonText={card.buttonText}
            format={card.format}
            bgImage={card.bgImage}
            onDownload={
              card.onDownload || (() => alert("No download function available"))
            } // Use the specific download function if provided
          />
        ))}
      </div>
      {showSuccessPopup && (
        <SuccessPopup
          onClose={() => setShowSuccessPopup(false)}
          message="Download completed successfully!"
        />
      )}
    </div>
  );
};

export default Cards;
