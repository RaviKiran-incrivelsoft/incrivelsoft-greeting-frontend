import React, { useEffect, useState } from 'react';
import { IoSettingsOutline } from 'react-icons/io5';
import { TbEdit } from "react-icons/tb";
import EmailConfigPopup from '../components/EmailConfigPopup';
import axios from 'axios';
import { toast } from 'react-toastify';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [configPopup, setConfigPopup] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${backendUrl}/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to fetch Data..!", {
          position: 'top-center',
          theme: "colored"
        })
      }
    };

    fetchUserProfile();
  }, []);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await axios.put(`${backendUrl}/users`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setIsEditing(false);
      toast.success("Profile updated successfully!", {
        position: 'top-center',
        theme: "colored"
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile", {
        position: 'top-center',
        theme: "colored"
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await axios.put(
        `${backendUrl}/users/newpassword`,
        { newPassword: passwordData.newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Password updated successfully!", {
        position: 'top-center',
        theme: "colored"
      });
      setIsPasswordModalOpen(false);
      setPasswordData({ newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password", {
        position: 'top-center',
        theme: "colored"
      });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/circles-light.png')] bg-cover bg-center">
      <div className="bg-white mt-[5%] p-10 w-full max-w-xl rounded-2xl shadow-lg flex flex-col justify-between backdrop-blur-md bg-opacity-90">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">Profile Information</h2>

        {isEditing ? (
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">First Name</label>
                <p className="w-full p-2 border rounded-lg bg-gray-100">{formData.first_name}</p>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Last Name</label>
                <p className="w-full p-2 border rounded-lg bg-gray-100">{formData.last_name}</p>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Email</label>
              <p className="w-full p-2 border rounded-lg bg-gray-100">{formData.email}</p>
            </div>
          </div>
        )}

        {/* Buttons Section */}
        <div className="flex gap-4 mt-6">
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : <span className='flex items-center'><TbEdit className='text-lg mr-2' />Edit</span>}
          </button>
          {!isEditing &&
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Set New Password
            </button>
          }
          {isEditing &&
            <button
              onClick={handleSubmit}
              disabled={formLoading}
              className={`h-10 flex items-center justify-center px-4 rounded-lg text-white ${formLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {formLoading ? (
                <div className="flex space-x-1 p-1.5">
                  <span className="dot bg-white"></span>
                  <span className="dot bg-white"></span>
                  <span className="dot bg-white"></span>
                </div>
              ) : (
                "Save"
              )}
            </button>
          }
        </div>
        {!isEditing &&
          <button
            onClick={() => setConfigPopup(true)}
            className='w-fit flex mt-4 items-center gap-1 py-0 lg:py-1.5 lg:px-4 px-2 border-2 rounded-md transition-all duration-300 ease-in-out text-blue-600 border-blue-600 hover:text-white hover:bg-blue-600 hover:border-transparent'
          >
            <IoSettingsOutline className='lg:mr-1 text-xl' />
            <span className='lg:block hidden'>Email Configure</span>
          </button>
        }
      </div>
      {configPopup && <EmailConfigPopup onClose={() => setConfigPopup(false)} />}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className='relative'>
                <label className="block text-gray-700 font-semibold mb-1">New Password</label>
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute bottom-3 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400"
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
              <div className='relative'>
                <label className="block text-gray-700 font-semibold mb-1">Confirm Password</label>
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute bottom-3 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400"
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
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => { setIsPasswordModalOpen(false); setPasswordData({ newPassword: "", confirmPassword: "" }) }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className={`h-10 flex items-center justify-center px-4 rounded-lg text-white ${formLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                  {formLoading ? (
                    <div className="flex space-x-1 p-1.5">
                      <span className="dot bg-white"></span>
                      <span className="dot bg-white"></span>
                      <span className="dot bg-white"></span>
                    </div>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
