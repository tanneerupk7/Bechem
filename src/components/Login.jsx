import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ground from "../assets/forget.svg";
import logo from "../assets/bechem-logoy.jpeg";
import { XMarkIcon } from "@heroicons/react/24/outline";
import SuccessPopup from "./SuccessPopup";
import Success from "../assets/Successful.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import BackgroundImage from "../assets/LandingScreen.svg"; // Add your background image path
import headerImage from "../assets/bechemheader.jpeg";
import ForgotPassword from "./forgetPassword";
import { BlinkBlur } from "react-loading-indicators";

export const Login = ({ setAccountId, setAccountName, setIsAdmin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPasswordUsername, setFogotPasswordUsername] = useState("");
  const [forgotPasswordMailId, setFogotPasswordMailId] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);
  const API_URI = import.meta.env.VITE_API_URI;
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);

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
        const isAdmin = Array.isArray(data.data) && data.data.length > 1;
        setIsAdmin(isAdmin);

        if (isAdmin) {
          // For admin, don't set specific account details
          setAccountId(null);
          setAccountName(null);
        } else {
          // For regular users, set their account details
          const { ac_id, ac_name } = Array.isArray(data.data)
            ? data.data[0]
            : data.data;
          setAccountId(ac_id);
          setAccountName(ac_name);
        }

        navigate("/Dashboard");
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

  const handleSend = async (e) => {
    e.preventDefault();
    if (
      forgotPasswordUsername.trim() === "" ||
      forgotPasswordMailId.trim() === ""
    ) {
      alert("Please fill out both fields.");
      return;
    }

    setIsForgotPasswordLoading(true); // Start loading

    try {
      const response = await fetch(`${API_URI}/forget_password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: forgotPasswordUsername,
          email: forgotPasswordMailId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setShowSuccessPopup(true);
      } else {
        setForgotPasswordError(
          data.message || "Failed to process request. Please try again."
        );
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setForgotPasswordError("An error occurred. Please try again.");
    } finally {
      setIsForgotPasswordLoading(false);
      setFogotPasswordUsername("");
      setFogotPasswordMailId("");
      // Stop loading
    }
  };

  // Added missing closing brace here

  const [isOpen, setIsOpen] = useState(true);

  const closeAllPopups = () => {
    setIsOpen(false);
    setShowSuccessPopup(false);
    setShowForgotPasswordPopup(false);
  };

  // ... rest of the code ...

  return (
    <div className="">
      {(loading || isForgotPasswordLoading) && (
        <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-50 z-50">
          <BlinkBlur color="#FBB900" size="large" />
          <p className="mt-4 text-white">
            {loading ? "Logging in..." : "Processing..."}
          </p>
        </div>
      )}
      <div
        className="h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <div className="absolute inset-0 md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-black/45 md:to-[70%] pointer-events-none"></div>
        <div className="h-full flex flex-col justify-between">
          {/* Login Form Section */}
          <div className="flex items-center h-full justify-center md:justify-end relative">
            <div className="flex flex-col mx-4 md:mr-20 w-full max-w-[26rem]">
              <div className="bg-slate-200 bg-opacity-45 backdrop-blur-lg pb-20 rounded-3xl shadow-lg p-8 w-full">
                <h2 className="text-3xl font-bold text-black mb-1">Login</h2>
                <p className="text-black mb-6">Welcome to BECHEM</p>

                {errorMessage && (
                  <div className="text-red-600 text-sm mb-4">
                    {errorMessage}
                  </div>
                )}

                <form>
                  <label
                    htmlFor="user-id"
                    className="block text-black font-medium mb-2"
                  >
                    User ID
                  </label>
                  <input
                    type="text"
                    id="user-id"
                    placeholder="enter user ID"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 h-11 placeholder-green-800 bg-white bg-opacity-0 border-gray-400 backdrop-blur-lg rounded-xl mb-4 focus:outline-none"
                  />

                  <label
                    htmlFor="password"
                    className="block text-black font-medium mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="enter your password"
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
                      forgot password?
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

              {/* Privacy Policy Links */}
              <div
                className="flex justify-end mt-3 mr-5 space-x-2"
                style={{ fontSize: "0.700rem" }}
              >
                <a
                  href="https://www.bechemindia.com/privacy-policy/"
                  className="text-yellow-600 hover:text-hoverBlue text-sm"
                  target="_blank"
                >
                  Privacy Policy
                </a>
                <span className="text-yellow-600">|</span>
                <a
                  href="https://www.bechemindia.com/disclaimer"
                  className="text-yellow-600 hover:text-hoverBlue text-sm"
                  target="_blanki"
                >
                  Disclaimer
                </a>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <footer className="pr-6 pl-1 pt-4 pb-3 flex justify-between items-center bg-white md:bg-transparent">
            <div className="flex items-center">
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
                <a
                  href="https://www.linkedin.com/company/bechem-india"
                  target="_blank"
                  className="text-gray-600 hover:text-blue-800 text-xl "
                >
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
                <a
                  href="https://www.instagram.com/carlbechem_india/"
                  target="_blank"
                  className="text-gray-600 hover:text-pink-500 text-xl"
                >
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
              </div>
            </div>
          </footer>
         
        </div>
      </div>

      {showForgotPasswordPopup && (
        <>
          {
            <div className="flex justify-center items-center min-h-screen w-full absolute top-0 left-0 bg-black bg-opacity-80">
              <div className="relative bg-white rounded-lg shadow-lg w-[62%] h-auto md:h-[520px] flex flex-col ">
                {/* Header Bar */}
                {/* <div
                  className="flex justify-between items-center text-white px-3 py-3 rounded-t-lg"
                  style={{
                    backgroundImage: `url(${headerImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Notify Admin
                    </h2>
                    <p
                      className="text-gray-500"
                      style={{ fontSize: "0.600rem" }}
                    >
                      Enter the below fields here, click save when you're done
                      will notify admin.
                    </p>
                  </div> */}
                  {/* Close Button (Cross Mark) */}
                  {/* <button
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
                </div> */}
                       <div 
                              className="px-3 py-1 flex justify-between items-center bg-headerColor border-b-2 border-customYellow h-[55px] w-full" 
                              style={{ backgroundImage: 'url(header.svg)', backgroundSize: "contain", backgroundPosition: "left center", backgroundRepeat: 'no-repeat' }}
                            >
                              <div className="flex-1">
                                <h2 className="font-bold text-slate-900 font-helvetica text-[22px] leading-none p-1 whitespace-nowrap">
                                Notify Admin
                                </h2>
                                <p className="text-gray-500 text-[9px] leading-none m-0 px-1 font-helvetica">
                                Enter the below fields here, click save when you're done will notify admin.
                                </p>
                              </div>
                              <button onClick={closeAllPopups}>
                          <XMarkIcon className="w-6 h-6 text-gray-500" />
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
                          className="block text-sm font-medium text-nameColor mb-2"
                        >
                          User Name
                        </label>
                        <input
                          type="text"
                          id="username"
                          value={forgotPasswordUsername} // Changed from username
                          onChange={(e) =>
                            setFogotPasswordUsername(e.target.value)
                          }
                          // className="w-full md:w-72 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500"
                          // placeholder="Akhil25"
                          className="w-full md:w-72 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500 placeholder:text-gray-400"

                          placeholder="Akhil25"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-nameColor mb-0"
                        >
                          Mail Id
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={forgotPasswordMailId} // Changed from email
                          onChange={(e) =>
                            setFogotPasswordMailId(e.target.value)
                          }
                          className="w-full md:w-72 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500"
                          placeholder="xxxxxxxxxxxxxxxx@gmail.com"
                        />
                      </div>
                    </form>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-4 mb-10 mr-14">
                      <button
                        type="button"
                        className="w-28 md:w-36 bg-gray-300 hover:bg-customYellow text-white font-medium py-2 rounded-md"
                        onClick={closeAllPopups}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-28 md:w-36 bg-greenButtonColor hover:bg-customYellow text-white font-medium py-2 rounded-md"
                        onClick={handleSend}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

          {showSuccessPopup && (
            <SuccessPopup
              onClose={closeAllPopups}
              message="Notification sent to admin, please check your mail soon."
            />
          )}
        </>
        // <ForgotPassword />
      )}
    </div>
  );
};
