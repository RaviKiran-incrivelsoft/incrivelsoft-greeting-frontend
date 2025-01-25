import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const RegisterPopup = ({ onClose, onSwitchToLogin }) => {
	const [loading, setLoading] = useState(false);
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const location = useLocation();

	const stableOnClose = useCallback(onClose, [onClose]);

	const togglePasswordVisibility = () => {
		setIsPasswordVisible(!isPasswordVisible);
	};

	const handleOutsideClick = (e) => {
		if (e.target.id === 'modal-container') {
			onClose();
		}
	};
	const [formData, setFormData] = useState({
		first_name: "",
		last_name: "",
		email: "",
		password: null,
		confirm_password: null,
	});
	const [isEmailSignup, setIsEmailSignup] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true)
		try {
			const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/register`, formData);
			console.log(response.data.message);

			toast.success(response.data.message, {
				position: 'top-center',
				theme: "colored"
			})
			onSwitchToLogin();
		} catch (err) {
			console.error('Error registering user:', err);
			toast.error(err.response?.data?.message || "Failed to Register", {
				position: 'top-center',
				theme: "colored"
			})
		} finally {
			setLoading(false);
		}
	};

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
		<div id="modal-container" onClick={handleOutsideClick} className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
			<div onClick={(e) => e.stopPropagation()} className="flex items-center justify-center lg:w-full w-4/5 max-w-xl overflow-hidden bg-white rounded-lg shadow-lg">
				<div className="lg:flex hidden w-1/2">
					<img src="/images/loginbg.png" alt="Promotion" className="w-full object-cover" />
				</div>
				<div className="lg:w-1/2 p-6">
					<div className="space-y-8 text-black relative">
						{!isEmailSignup ? (
							<>
								<h2 className="text-3xl font-bold text-center">Sign up</h2>
								<ul className="text-center">
									<li>Free forever</li>
									<li>Professional results in minutes</li>
									<li>Loved by 20+ million users</li>
								</ul>
								<div className="space-y-4">
									<button
										onClick={() => setIsEmailSignup(true)}
										className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
									>
										Sign up with email or Phone
									</button>
									<div className="flex justify-center">
										<span className="text-sm text-gray-500">or</span>
									</div>
									<button
										className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
										onClick={handleGoogleLogin}>
										Continue with Google
									</button>
									{/* <button className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
										Continue with Facebook
									</button> */}
									<p className="text-center text-sm text-gray-500">
										By continuing, you agree to our <span className="text-blue-600 hover:cursor-pointer">Terms of Service</span> and <span href="#" className="text-blue-600 hover:cursor-pointer">Privacy Policy</span>.
									</p>
								</div>
								<p className="text-center text-gray-600">
									Already have an account? <button className="text-blue-600" onClick={onSwitchToLogin}>Log In</button>
								</p>
							</>
						) : (
							<>
								<button
									onClick={() => setIsEmailSignup(false)}
									className="absolute top-0 flex items-center p-1 text-xl border-2 rounded-full transition-all duration-300 ease-in-out text-gray-600 border-gray-600 hover:text-white hover:bg-gray-600 hover:border-transparent"
								>
									<IoMdArrowRoundBack />
								</button>
								<h2 className="text-3xl font-bold text-center">Register</h2>
								<form className="space-y-6" onSubmit={handleSubmit}>
									<div className="space-y-4">
										<input
											id="first-name"
											name="first_name"
											type="text"
											required
											value={formData.first_name}
											onChange={handleChange}
											className="py-2 ps-4 pe-10 block w-full border border-gray-400 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
											placeholder="First Name"
										/>
										<input
											id="last-name"
											name="last_name"
											type="text"
											required
											value={formData.last_name}
											onChange={handleChange}
											className="py-2 ps-4 pe-10 block w-full border border-gray-400 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
											placeholder="Last Name"
										/>
										<input
											id="email-address"
											name="email"
											type="text"
											required
											value={formData.email}
											onChange={handleChange}
											className="py-2 ps-4 pe-10 block w-full border border-gray-400 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
											placeholder="Email address Or Phone number"
										/>
										<div className="relative">
											<input
												id="password"
												name="password"
												type={isPasswordVisible ? 'text' : 'password'}
												className="py-2 ps-4 pe-10 block w-full border border-gray-400 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
												placeholder="Enter password"
												value={formData.password}
												onChange={handleChange}
												required
											/>
											<button
												type="button"
												onClick={togglePasswordVisibility}
												className="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500"
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
										<div className="relative">
											<input
												id="confirm-password"
												name="confirm_password"
												type={isPasswordVisible ? 'text' : 'password'}
												className="py-2 ps-4 pe-10 block w-full border border-gray-400 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
												placeholder="Enter confirm password"
												value={formData.confirm_password}
												onChange={handleChange}
												required
											/>
											<button
												type="button"
												onClick={togglePasswordVisibility}
												className="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500"
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
									<button
										type="submit"
										disabled={loading}
										className={`group w-full h-10 flex items-center justify-center px-4 border border-transparent text-sm font-medium rounded-md text-white ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
											}`}
									>
										{loading ? (
											<div className="flex space-x-1">
												<span className="dot bg-white"></span>
												<span className="dot bg-white"></span>
												<span className="dot bg-white"></span>
											</div>
										) : (
											"Register"
										)}
									</button>
								</form>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default RegisterPopup;
