import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { FaGoogle } from "react-icons/fa";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const LoginModal = ({ onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const stableOnClose = useCallback(onClose, [onClose]); // Memoize onClose

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
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userName", response.data.userName);
        localStorage.setItem("role", response.data.role);
        stableOnClose();
        toast.success("Login successful", {
          position: "top-center",
          theme: "colored",
        });
        if (response.data.role === 'admin') {
          navigate("/admin/dashboard");
        }
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

  // Handle Google Login
  const handleGoogleLogin = () => {
    window.location.href = `${backendUrl}/users/google`;
  };

  // Extract token and userName from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const userName = params.get("userName");

    if (token && userName) {
      console.log("OAuth response received:", { token, userName });

      // Save token and userName to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userName", userName);

      toast.success("Google login successful!", {
        position: "top-center",
        theme: "colored",
      });

      // Clear the query parameters from the URL
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);

      // Close modal only after successful login
      stableOnClose();
    }
  }, [location.search, stableOnClose]);

  return (
    <div
      id="modal-container"
      className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50"
      onClick={(e) => e.target.id === "modal-container" && stableOnClose()}
    >
      <div
        className="bg-white rounded-lg overflow-hidden"
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
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="relative block w-full px-3 py-2 border border-gray-400 rounded-md placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      placeholder="Email address"
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
                        className="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400"
                      >
                        <svg
                          className="shrink-0 size-4"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path className={isPasswordVisible ? 'hidden' : 'hs-password-active:hidden'} d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                          <path className={isPasswordVisible ? 'hidden' : 'hs-password-active:hidden'} d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                          <path className={isPasswordVisible ? 'hidden' : 'hs-password-active:hidden'} d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                          <line className={isPasswordVisible ? 'hidden' : 'hs-password-active:hidden'} x1="2" x2="22" y1="2" y2="22"></line>
                          <path className={isPasswordVisible ? 'hs-password-active:block' : 'hidden'} d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                          <circle className={isPasswordVisible ? 'hs-password-active:block' : 'hidden'} cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full h-10 flex items-center justify-center px-4 rounded text-white ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                      }`}
                  >
                    {loading ? (
                      <div className="flex space-x-1 p-1.5">
                        <span className="dot bg-white"></span>
                        <span className="dot bg-white"></span>
                        <span className="dot bg-white"></span>
                      </div>
                    ) : (
                      "Login"
                    )}
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
                {/* <button
                  onClick={handleFacebookLogin}
                  className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                >
                  <FaFacebook className="text-xl text-blue-600" />
                </button> */}
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
