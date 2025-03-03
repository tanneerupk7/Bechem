
import React from "react";
import axios from "axios";
import sim from "../assets/sim2.png";
import pdf from "../assets/pdf.png";
import excel from "../assets/excel1.png";
 
const Card = ({ icon, title, description, buttonText, format, bgImage, onDownload }) => {
  return (
    <div className=" h-72 max-w-[230px] bg-gray-50/90 border border-gray-200 rounded-lg overflow-hidden flex flex-col">
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
        <h2 className="text-lg font-semibold text-gray-800 leading-tight mt-14">{title}</h2>
        <p className="text-sm text-gray-500 mt-1 whitespace-nowrap">Download as {format}</p>
      </div>
 
      {/* Download Button Section */}
      <div className="h-1/3 p-4 text-center flex items-center justify-center">
        <button
          onClick={onDownload}
          className="px-6 py-2 bg-green-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-green-800 focus:outline-none focus:ring focus:ring-green-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M18.992 10.688a5.5 5.5 0 10-10.684 1.046A5.002 5.002 0 006 20h12a4.5 4.5 0 00.992-9.312zm-6.494 6.493l-3-3a.75.75 0 111.06-1.06l1.72 1.72V12a.75.75 0 011.5 0v2.84l1.72-1.72a.75.75 0 111.06 1.06l-3 3a.75.75 0 01-1.06 0z"
              clipRule="evenodd"
            />
          </svg>
          {buttonText}
        </button>
      </div>
    </div>
  );
};
 
const Cards = () => {
  const handleDownload = async (format, title) => {
    try {
      const response = await axios.get(`/api/download`, {
        params: { format, title },
        responseType: "blob", // for downloading files
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${title}.${format.toLowerCase()}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file. Please try again.");
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
    },
    {
      icon: pdf,
      title: "Pending Sales Order Details",
      description: "Download as PDF",
      buttonText: "Download",
      format: "PDF",
      bgImage: sim,
    },
  ];
 
  return (
    <div className=" bg-white flex items-center justify-center mt-28 p-6">
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
            onDownload={() => handleDownload(card.format, card.title)}
          />
        ))}
      </div>
    </div>
  );
};
 
export default Cards;
 