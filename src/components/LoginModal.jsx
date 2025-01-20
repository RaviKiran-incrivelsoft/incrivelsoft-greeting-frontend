import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { toast } from "react-toastify";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const LoginModal = ({ onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${backendUrl}/users/login`, {
        email,
        password,
      });

      if (response.data.token) {
        // Save token and userName to localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userName", response.data.userName);

        onClose(); // Close modal
        toast.success("Login successful", {
          position: "top-center",
          theme: "colored",
        });
      } else {
        toast.error("Login Failed", {
          position: "top-center",
          theme: "colored",
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to Login", {
        position: "top-center",
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const popup = window.open(
      `${backendUrl}/users/google`,
      "GoogleLogin",
      "width=600,height=600"
    );
    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const userName = params.get("userName");

        if (token && userName) {
          localStorage.setItem("token", token);
          localStorage.setItem("userName", userName);
          onClose();
          toast.success("Google login successful!", {
            position: "top-center",
            theme: "colored",
          });
        } else {
          toast.error("Google login failed. Please try again.", {
            position: "top-center",
            theme: "colored",
          });
        }
      }
    }, 500);
  };

  const handleFacebookLogin = () => {
    console.log("Facebook login");
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-container") {
      onClose();
    }
  };

  return (
    <div
      id="modal-container"
      className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50"
      onClick={handleOutsideClick}
    >
      <div
        className="bg-white p-[0.5rem] rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center min-h-[36vh] bg-gray-100">
          <div className="flex w-full max-w-[40rem] shadow-md">
            <div className="hidden md:flex w-[20rem] bg-blue-100 items-center justify-center">
              <img
                src="/images/loginbg.png"
                alt="Promotional Banner"
                className="max-h-full object-cover w-[25rem] h-[30rem]"
              />
            </div>

            <div className="w-full md:w-1/2 bg-white p-8 space-y-6 rounded-lg">
              <h2 className="text-3xl font-extrabold text-gray-900 text-center">
                Welcome back!
              </h2>

              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="rounded-md shadow-sm space-y-4">
                  <div>
                    <input
                      id="email-address"
                      name="email"
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="relative block w-full px-3 py-2 border border-gray-400 rounded-md placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      placeholder="Email address or phone number"
                    />
                  </div>
                  <div>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={isPasswordVisible ? "text" : "password"}
                        className="py-2 ps-4 pe-10 block w-full border border-gray-400 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500"
                      >
                        {/* Eye Icon */}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`group w-full h-10 flex items-center justify-center px-4 border border-transparent text-sm font-medium rounded-md text-white ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                      }`}
                  >
                    {loading ? "Loading..." : "Sign in"}
                  </button>
                </div>
              </form>

              <div className="relative flex justify-center text-sm text-gray-500">
                <span>Or continue with</span>
              </div>

              <div className="flex justify-center space-x-4 mt-2">
                <button
                  onClick={handleGoogleLogin}
                  className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                >
                  <FaGoogle className="text-xl text-gray-700" />
                </button>
                <button
                  onClick={handleFacebookLogin}
                  className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                >
                  <FaFacebook className="text-xl text-blue-600" />
                </button>
              </div>

              <p className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <button
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                  onClick={onSwitchToRegister}
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
