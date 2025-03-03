import React from "react";
import Success from "../assets/Successful.png";

const SuccessPopup = ({ onClose, message }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-white rounded-lg shadow-lg p-4 w-96 text-center relative">
        {/* Close icon in the top-right corner */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex items-center mb-3">
          {/* Custom icon from uploaded file */}
          <img
            src={Success}
            alt="Success Icon"
            className="w-8 h-8 mr-3"
          />
          {/* Text aligned vertically */}
          <div className="text-left">
            <h3 className="text-lg font-bold text-gray-800">Successful</h3>
            <p className="text-sm text-gray-600">
              {message}
            </p>
          </div>
        </div>
        {/* OK button */}
        <button
          className="w-36 py-2 bg-greenButtonColor text-white rounded-md hover:bg-customYellow text-sm font-medium"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessPopup;
