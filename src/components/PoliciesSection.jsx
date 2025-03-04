import React, { useState, useEffect } from "react";
import axios from "axios";
import sim from "../assets/sim2.png";
import pdf from "../assets/pdf.png";
import Header from "./Header";

const Card = ({ icon, title, description, buttonText, format, bgImage, onDownload }) => {
  return (
    <div>
        
        <div className="   h-[301px] w-[230] max-w-[230px] bg-gray-50/90 border border-gray-200 rounded-lg overflow-hidden flex flex-col">
          {/* Image Section */}
          <div
            className="h-1/2 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              <img
                src={icon}
                alt="icon"
                className="w-20 h-20 bg-white rounded-full p-3 "
              />
            </div>
          </div>

    {/* Content Section */}
    <div className="h-1/3 px-4 py-2 text-center flex flex-col justify-center items-center">
      <h2 className="text-[14px] font-semibold text-gray-800 leading-tight mt-14">{title}</h2>
      <p className="text-[15px] text-gray-500 mt-1 whitespace-nowrap">Download as {format}</p>
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
    </div>
  );
};

const Cards = ({isAdmin,accountName, selectedDistributor}) => {
  const [policies, setPolicies] = useState([]);
  const API_URI = import.meta.env.VITE_API_URI;

  useEffect(() => {
    // Fetch policies list
    const fetchPolicies = async () => {
      try {
        const response = await axios.get(`${API_URI}/policy_load/`);
        setPolicies(response.data);
      } catch (error) {
        console.error("Error fetching policies:", error);
      }
    };

    fetchPolicies();
  }, []);

  const handleDownload = async (id, title) => {
    try {
      // First get the policy path
      const policyResponse = await axios.get(`${API_URI}/policy/`, {
        params: { id: id }
      });

      // Then download the file
      const response = await axios.get(`${API_URI}/download_policy/`, {
        params: { path: policyResponse.data.path },
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  const cardData = policies.map(policy => ({
    icon: pdf,
    title: policy.path,
    description: "Download as PDF",
    buttonText: "Download",
    format: "PDF",
    bgImage: sim,
    id: policy.id
  }));

  return (
    <div>
      <Header isAdmin={isAdmin} accountName={accountName} selectedDistributor={selectedDistributor}/>
      <div className="bg-white flex flex-col items-center mt-32">
        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 bg-white gap-6">
          {cardData.map((card, index) => (
            <Card
              key={index}
              icon={card.icon}
              title={card.title}
              description={card.description}
              buttonText={card.buttonText}
              format={card.format}
              bgImage={card.bgImage}
              onDownload={() => handleDownload(card.id, card.title)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cards;