

import React, { useState } from "react";
import ground from "../assets/bechem-background.jpeg";
import headerImage from "../assets/bechemheader.jpeg"; // Import the header image
import SuccessPopup from "./SuccessPopup";

const ForgotPassword = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);
  const closeAllPopups = () => {
    setIsOpen(false);
    setShowSuccessPopup(false);
    setShowForgotPasswordPopup(false)
  };

  const handleSend = (e) => {
    e.preventDefault();

    if (username.trim() === "" || email.trim() === "") {
      alert("Please fill out both fields.");
      return;
    }

    setShowSuccessPopup(true);
  };

  return (
    // <>
    //   {(
    //     <div className="flex justify-center items-center min-h-screen bg-black bg-opacity-80 px-4 ">
    //       <div className="relative bg-white rounded-lg shadow-lg w-[62%] h-auto md:h-[520px] flex flex-col ">
    //         {/* Header Bar */}
    //         <div
    //           className="flex justify-between items-center text-white px-3 py-3 rounded-t-lg"
    //           style={{
    //             backgroundImage: `url(${headerImage})`,
    //             backgroundSize: "cover",
    //             backgroundPosition: "center",
    //           }}
    //         >
    //           <div>
    //             <h2 className="text-xl font-bold text-slate-900">Notify Admin</h2>
    //             <p className="text-gray-500" style={{ fontSize: "0.600rem" }}>
    //               Enter the below fields here, click save when you’re done will notify admin.
    //             </p>
    //           </div>
    //           {/* Close Button (Cross Mark) */}
    //           <button
    //             onClick={closeAllPopups}
    //             className="text-gray-700 hover:text-gray-900 focus:outline-none"
    //           >
    //             <svg
    //               xmlns="http://www.w3.org/2000/svg"
    //               className="h-6 w-6"
    //               fill="none"
    //               viewBox="0 0 24 24"
    //               stroke="currentColor"
    //             >
    //               <path
    //                 strokeLinecap="round"
    //                 strokeLinejoin="round"
    //                 strokeWidth={2}
    //                 d="M6 18L18 6M6 6l12 12"
    //               />
    //             </svg>
    //           </button>
    //         </div>

    //         {/* Main Content */}
    //         <div className="flex flex-col md:flex-row flex-grow">
    //           {/* Left Side Image */}
    //           <div className="md:w-[54%] w-full p-4">
    //             <img
    //               src={ground}
    //               alt="Company Building"
    //               className="object-cover rounded-lg h-full"
    //             />
    //           </div>

    //           {/* Right Side Content */}
    //           <div className="md:w-[60%] w-full p-8 flex flex-col justify-between mt-20">
    //             <form className="space-y-6">
    //               <div>
    //                 <label
    //                   htmlFor="username"
    //                   className="block text-sm font-medium text-gray-700 mb-2"
    //                 >
    //                   User Name
    //                 </label>
    //                 <input
    //                   type="text"
    //                   id="username"
    //                   value={username}
    //                   onChange={(e) => setUsername(e.target.value)}
    //                   className="w-full md:w-72 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
    //                   placeholder="Akhil25"
    //                 />
    //               </div>
    //               <div>
    //                 <label
    //                   htmlFor="email"
    //                   className="block text-sm font-medium text-gray-700 mb-0"
    //                 >
    //                   Mail Id
    //                 </label>
    //                 <input
    //                   type="email"
    //                   id="email"
    //                   value={email}
    //                   onChange={(e) => setEmail(e.target.value)}
    //                   className="w-full md:w-72 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
    //                   placeholder="xxxxxxxxxxxxxxxx@gmail.com"
    //                 />
    //               </div>
    //             </form>

    //             {/* Buttons */}
    //             <div className="flex justify-end space-x-4 mb-10 mr-14">
    //               <button
    //                 type="button"
    //                 className="w-28 md:w-36 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 rounded-md"
    //                 onClick={closeAllPopups}
    //               >
    //                 Cancel
    //               </button>
    //               <button
    //                 type="submit"
    //                 className="w-28 md:w-36 bg-green-700 hover:bg-green-800 text-white font-medium py-2 rounded-md"
    //                 onClick={handleSend}
    //               >
    //                 Send
    //               </button>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   )}

    //   {showSuccessPopup && <SuccessPopup onClose={closeAllPopups} />}
    // </>
    <>
    {(
      <div className="flex justify-center items-center min-h-screen w-full absolute top-0 left-0 bg-black bg-opacity-80">
        <div className="relative bg-white rounded-lg shadow-lg w-[62%] h-auto md:h-[520px] flex flex-col ">
          {/* Header Bar */}
          <div
            className="flex justify-between items-center text-white px-3 py-3 rounded-t-lg"
            style={{
              backgroundImage: `url(${headerImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div>
              <h2 className="text-xl font-bold text-slate-900">Notify Admin</h2>
              <p className="text-gray-500" style={{ fontSize: "0.600rem" }}>
                Enter the below fields here, click save when you’re done will notify admin.
              </p>
            </div>
            {/* Close Button (Cross Mark) */}
            <button
              onClick={closeAllPopups}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Main Content */}
          <div className="flex flex-col md:flex-row flex-grow">
            {/* Left Side Image */}
            <div className="md:w-[54%] w-full p-4">
              <img
                src={ground}
                alt="Company Building"
                className="object-cover rounded-lg h-full"
              />
            </div>

            {/* Right Side Content */}
            <div className="md:w-[60%] w-full p-8 flex flex-col justify-between mt-20">
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    User Name
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full md:w-72 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder="Akhil25"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-0"
                  >
                    Mail Id
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full md:w-72 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder="xxxxxxxxxxxxxxxx@gmail.com"
                  />
                </div>
              </form>

              {/* Buttons */}
              <div className="flex justify-end space-x-4 mb-10 mr-14">
                <button
                  type="button"
                  className="w-28 md:w-36 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 rounded-md"
                  onClick={() => setShowForgotPasswordPopup(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-28 md:w-36 bg-green-700 hover:bg-green-800 text-white font-medium py-2 rounded-md"
                  onClick={handleSend}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    {showSuccessPopup && <SuccessPopup onClose={closeAllPopups} />}
  </>
  );
};

export default ForgotPassword;