import axios from "axios";
import React, { useState } from "react";

const RegisterPopup = ({ onClose, onSwitchToLogin }) => {
	const handleOutsideClick = (e) => {
		if (e.target.id === 'modal-container') {
			onClose();
		}
	};

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: null,
		confirmPassword: null,
	});

	const [isEmailSignup, setIsEmailSignup] = useState(false);
	const isPasswordMatch = formData.password === formData.confirmPassword;
	// Handle form input changes
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
		try {
			const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/user_register`, formData);
			console.log(response.data.message);

			const fullName = `${formData.firstName} ${formData.lastName}`;
			localStorage.setItem("userName", fullName);
			onSwitchToLogin();
		} catch (err) {
			console.error('Error registering user:', err);
		}
	};

	return (
		<div id="modal-container" onClick={handleOutsideClick} className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
			<div onClick={(e) => e.stopPropagation()} className="flex items-center justify-center w-full max-w-xl overflow-hidden bg-white rounded-lg shadow-lg">
				<div className="flex w-1/2">
					<img src="/images/loginbg.png" alt="Promotion" className="w-full object-cover" />
				</div>
				<div className="w-1/2 p-6">
					<div className="space-y-8 text-black">
						{!isEmailSignup ? (
							<>
								<h2 className="text-3xl font-bold text-center">Sign up</h2>
								<ul className="text-center">
									<li>Free forever</li>
									<li>Professional results in minutes</li>
									<li>Loved by 20+ million users</li>
								</ul>
								<div className="space-y-4">
									<button className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
										Continue with Google
									</button>
									<button className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
										Continue with Facebook
									</button>
									<div className="relative flex justify-center">
										<span className="text-sm text-gray-500">or</span>
									</div>
									<button
										onClick={() => setIsEmailSignup(true)}
										className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
									>
										Sign up with email
									</button>
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
								<h2 className="text-3xl font-bold text-center">Register</h2>
								<form className="space-y-6" onSubmit={handleSubmit}>
									<div className="space-y-4">
										<input
											id="first-name"
											name="firstName"
											type="text"
											required
											value={formData.firstName}
											onChange={handleChange}
											className="block w-full px-4 py-2 border border-gray-300 rounded-md"
											placeholder="First Name"
										/>
										<input
											id="last-name"
											name="lastName"
											type="text"
											required
											value={formData.lastName}
											onChange={handleChange}
											className="block w-full px-4 py-2 border border-gray-300 rounded-md"
											placeholder="Last Name"
										/>
										<input
											id="email-address"
											name="email"
											type="email"
											required
											value={formData.email}
											onChange={handleChange}
											className="block w-full px-4 py-2 border border-gray-300 rounded-md"
											placeholder="Email address"
										/>
										<input
											id="password"
											name="password"
											type="password"
											required
											value={formData.password}
											onChange={handleChange}
											className="block w-full px-4 py-2 border border-gray-300 rounded-md"
											placeholder="Password"
										/>
										<input
											id="confirm-password"
											name="confirmPassword"
											type="password"
											required
											value={formData.confirmPassword}
											onChange={handleChange}
											className="block w-full px-4 py-2 border border-gray-300 rounded-md"
											placeholder="Confirm Password"
										/>
									</div>
									<button
										type="submit"
										className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
										disabled={!isPasswordMatch}
									>
										Register
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
