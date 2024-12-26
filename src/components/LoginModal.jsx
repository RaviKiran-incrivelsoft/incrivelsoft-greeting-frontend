import axios from "axios";
import React, { useState } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const LoginModal = ({ onClose, onSwitchToRegister }) => {

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			// Perform login
			const response = await axios.post(`${backendUrl}/users/login`, {
				email,
				password,
			});

			if (response.data.token) {
				console.log("Login successful:", response.data);
				toast.success('Login successful', {
					position: 'top-center',
					theme: "colored" 
				})

				// Save token to localStorage
				localStorage.setItem("token", response.data.token);
				localStorage.setItem("userName", response.data.userName);

				// Redirect to home
				navigate("/");

				// Close modal
				onClose();
			} else {
				console.error("Login Failed");
				toast.error('Login Failed', {
					position: 'top-center',
					theme: "colored" 
				})
			}
		} catch (err) {
			console.error("Error logging in:", err);
			toast.error(err.response.data.message, {
				position: 'top-center',
				theme: "colored" 
			})
		}
	};

	const handleGoogleLogin = () => {
		console.log("Google login");
	};

	const handleFacebookLogin = () => {
		console.log("Facebook login");
	};

	const handleOutsideClick = (e) => {
		if (e.target.id === 'modal-container') {
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
										<label htmlFor="email-address" className="sr-only">
											Email address
										</label>
										<input
											id="email-address"
											name="email"
											type="email"
											required
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
											placeholder="Email address"
										/>
									</div>
									<div>
										<label htmlFor="password" className="sr-only">
											Password
										</label>
										<input
											id="password"
											name="password"
											type="password"
											required
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
											placeholder="Password"
										/>
									</div>
								</div>

								<div className="flex items-center justify-between">
									<button
										type="submit"
										className="group w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
									>
										Sign in
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
