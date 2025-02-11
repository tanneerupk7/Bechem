

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ground from "../assets/bechem-background.jpg";
import logo from "../assets/bechem-logoy.jpeg"
import { XMarkIcon } from "@heroicons/react/24/outline";
import SuccessPopup from "./successPopup"; 
import Success from "../assets/Successful.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import BackgroundImage from "../assets/LandingScreen.svg"; // Add your background image path
import headerImage from "../assets/bechemheader.jpeg";
import ForgotPassword from "./forgetPassword";

export const Login = ({ setAccountId, setAccountName }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);
  const API_URI = import.meta.env.VITE_API_URI;

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URI}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserName: username,
          Passwrd: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        const { ac_id, ac_name } = data.data;
        if (typeof setAccountId === "function") {
          setAccountId(ac_id);
        }

        if (typeof setAccountName === "function") {
          setAccountName(ac_name);
        }

        navigate("/Invoice_Table");
      } else {
        setErrorMessage(data.message || "Invalid username or password.");
      }
    } catch (error) {
      setErrorMessage("An error occurred during login. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleSend = (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page
    if (username.trim() === "" || email.trim() === "") {
      alert("Please fill out both fields.");
      return;
    }
    setShowSuccessPopup(true)
  };

  const [isOpen, setIsOpen] = useState(true);

  const closeAllPopups = () => {
    setIsOpen(false);
    setShowSuccessPopup(false);
    setShowForgotPasswordPopup(false);
  };


  return (
    <div className="">
      <div
        className="h-screen bg-cover bg-center flex flex-col justify-between"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        {/* Login Form Section */}
        <div className="flex items-center justify-center h-full desktop:justify-end">
          <div className="bg-white bg-opacity-45 backdrop-blur-lg rounded-2xl shadow-lg p-8 pb-20 w-[26rem] mr-20">
            <h2 className="text-3xl font-bold text-gray-800 mb-1">Login</h2>
            <p className="text-gray-600 mb-6">Welcome to BECHEM</p>

            {errorMessage && (
              <div className="text-red-600 text-sm mb-4">{errorMessage}</div>
            )}

            <form>
              <label
                htmlFor="user-id"
                className="block text-gray-700 font-medium mb-2"
              >
                User ID
              </label>
              <input
                type="text"
                id="user-id"
                placeholder="Enter user ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 h-11 placeholder-green-800 bg-white bg-opacity-0 backdrop-blur-lg rounded-xl mb-4 focus:outline-none"
              />

              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 h-11 placeholder-green-800 bg-white bg-opacity-0 border-gray-400 backdrop-blur-lg rounded-xl mb-4 focus:outline-none"
              />

              <div className="flex justify-end items-center mb-6">
                <button
                  type="button"
                  className="text-green-800 text-sm hover:underline hover:text-hoverBlue"
                  onClick={() => setShowForgotPasswordPopup(true)}
                >
                  Forgot password?
                </button>
              </div>
            </form>
            
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-customYellow transition duration-300 text-sm h-11"
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </div>
        </div>
        
        {/* Footer Section */}
        <footer className="pr-6 pl-1 pt-4 pb-3 flex justify-between items-center">
          <div className="flex items-center bg-white bg-opacity-0">
            <span className="text-gray-700" style={{ fontSize: "0.700rem" }}>
              Copyrights @2025 All rights reserved | Sales Order Gateway |
            </span>
            <a
              href="https://www.bechemindia.com/"
              className="text-yellow-600 font-medium hover:underline ml-1 hover:text-hoverBlue"
              style={{ fontSize: "0.700rem" }}
              target="_blank"
            >
              Bechem India
            </a>
            <div className="flex space-x-4 ml-16">
              <a href="#" className="text-gray-600 hover:text-blue-800 text-xl">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-400 text-xl">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="#" className="text-gray-600 hover:text-pink-500 text-xl">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="#" className="text-gray-600 hover:text-red-600 text-xl">
                <FontAwesomeIcon icon={faYoutube} />
              </a>
            </div>
          </div>
            <div className="mr-28">
            <a
              href="#"
              className="text-yellow-600 font-medium text-xs hover:text-hoverBlue hover:underline"
            >
              Privacy Policy
            </a>{" "}
            |{" "}
            <a
              href="#"
              className="text-yellow-600 font-medium text-xs hover:text-hoverBlue hover:underline"
            >
              Terms & Conditions
            </a>
          </div>
        </footer>
      </div>

      {showForgotPasswordPopup && (
        // <div className="flex justify-center items-center min-h-screen absolute top-0 left-0 bg-black bg-opacity-80 px-4 ">
        //   <div className="relative bg-white rounded-lg shadow-lg w-[62%] h-auto md:h-[520px] flex flex-col ">
        //     {/* Header Bar */}
        //     <div
        //       className="flex justify-between items-center text-white px-3 py-3 rounded-t-lg"
        //       style={{
        //         backgroundImage: `url(${headerImage})`,
        //         backgroundSize: "cover",
        //         backgroundPosition: "center",
        //       }}
        //     >
        //       <div>
        //         <h2 className="text-xl font-bold text-slate-900">Notify Admin</h2>
        //         <p className="text-gray-500" style={{ fontSize: "0.600rem" }}>
        //           Enter the below fields here, click save when you’re done will notify admin.
        //         </p>
        //       </div>
        //       {/* Close Button (Cross Mark) */}
        //       <button
        //         onClick={() => setShowForgotPasswordPopup(false)}
        //         className="text-gray-700 hover:text-gray-900 focus:outline-none"
        //       >
        //         <svg
        //           xmlns="http://www.w3.org/2000/svg"
        //           className="h-6 w-6"
        //           fill="none"
        //           viewBox="0 0 24 24"
        //           stroke="currentColor"
        //         >
        //           <path
        //             strokeLinecap="round"
        //             strokeLinejoin="round"
        //             strokeWidth={2}
        //             d="M6 18L18 6M6 6l12 12"
        //           />
        //         </svg>
        //       </button>
        //     </div>
 
        //     {/* Main Content */}
        //     <div className="flex flex-col md:flex-row flex-grow">
        //       {/* Left Side Image */}
        //       <div className="md:w-[54%] w-full p-4">
        //         <img
        //           src={ground}
        //           alt="Company Building"
        //           className="object-cover rounded-lg h-full"
        //         />
        //       </div>
 
        //       {/* Right Side Content */}
        //       <div className="md:w-[60%] w-full p-8 flex flex-col justify-between mt-20">
        //         <form className="space-y-6">
        //           <div>
        //             <label
        //               htmlFor="username"
        //               className="block text-sm font-medium text-gray-700 mb-2"
        //             >
        //               User Name
        //             </label>
        //             <input
        //               type="text"
        //               id="username"
        //               value={username}
        //               onChange={(e) => setUsername(e.target.value)}
        //               className="w-full md:w-72 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
        //               placeholder="Akhil25"
        //             />
        //           </div>
        //           <div>
        //             <label
        //               htmlFor="email"
        //               className="block text-sm font-medium text-gray-700 mb-0"
        //             >
        //               Mail Id
        //             </label>
        //             <input
        //               type="email"
        //               id="email"
        //               value={email}
        //               onChange={(e) => setEmail(e.target.value)}
        //               className="w-full md:w-72 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
        //               placeholder="xxxxxxxxxxxxxxxx@gmail.com"
        //             />
        //           </div>
        //         </form>
 
        //         {/* Buttons */}
        //         <div className="flex justify-end space-x-4 mb-10 mr-14">
        //           <button
        //             type="button"
        //             className="w-28 md:w-36 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 rounded-md"
        //             onClick={() => setShowForgotPasswordPopup(false)}
        //           >
        //             Cancel
        //           </button>
        //           <button
        //             type="submit"
        //             className="w-28 md:w-36 bg-green-700 hover:bg-green-800 text-white font-medium py-2 rounded-md"
        //             onClick={handleSend && (() => setShowSuccessPopup(true))}
        //           >
        //             Send
        //           </button>
                 
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // </div>
        <>
      {(
        <div className="flex justify-center items-center min-h-screen absolute top-0 left-0 bg-black bg-opacity-80 px-4 ">
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
                    onClick={closeAllPopups}
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
      )}
    </div>
  );
};