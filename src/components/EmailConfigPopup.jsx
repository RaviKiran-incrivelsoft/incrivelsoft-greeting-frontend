import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsEnvelopeExclamation, BsEnvelopePlus } from "react-icons/bs";
import ConfirmationPopup from "./ConfirmationPopup";
import { toast } from "react-toastify";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const EmailConfigPopup = ({ onClose }) => {
	const [loading, setLoading] = useState(true);
	const [formLoading, setFormLoading] = useState(false);
	const [confirmPopup, setConfirmPopup] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		passkey: "",
		displayName: "",
		emailType: "",
		status: "",
	});
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [hasConfig, setHasConfig] = useState(false);

	useEffect(() => {
		const fetchEmailConfig = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get(`${backendUrl}/email-config`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				
				if (response.data?.emailConfig) {
					setFormData(response.data.emailConfig);
					setHasConfig(true);
				} else {
					setHasConfig(false);
				}
			} catch (error) {
				console.error("Error fetching email configuration: ", error);
			} finally {
				setLoading(false)
			}
		};

		fetchEmailConfig();
	}, [hasConfig, isEditing]);

	const togglePasswordVisibility = () => {
		setIsPasswordVisible(!isPasswordVisible);
	};
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};
	const handleDelete = async () => {
		const token = localStorage.getItem("token");
		try {
			await axios.delete(`${backendUrl}/email-config`, {
				headers: {
					'Authorization': `Bearer ${token}`,
				},
			});
			toast.success('Email Configuration Deleted..!', {
				position: 'top-center',
				theme: "colored"
			})
			setConfirmPopup(false);
			onClose();
		} catch (error) {
			toast.error('Failed to delete email configuration', {
				position: 'top-center',
				theme: "colored"
			})
			console.error('Error deleting email configuration:', error.response ? error.response.data : error.message);
		}
	}
	const handleSubmit = async (e) => {
		e.preventDefault();
		setFormLoading(true);
		
		const token = localStorage.getItem("token");
		try {
			if (hasConfig) {
				// Update existing email configuration
				const response = await axios.put(`${backendUrl}/email-config`, formData, {
					headers: {
						'Authorization': `Bearer ${token}`,
					},
				});
				toast.success('Email configuration updated..!', {
					position: 'top-center',
					theme: "colored"
				})
				console.log('Email configuration updated:', response.data);
			} else {
				const response = await axios.post(`${backendUrl}/email-config`, formData, {
					headers: {
						'Authorization': `Bearer ${token}`,
					},
				});
				toast.success('Email configuration created..!', {
					position: 'top-center',
					theme: "colored"
				})
				console.log('Email configuration created:', response.data);
			}
			setIsEditing(false);
		} catch (error) {
			toast.error(error.response ? error.response.data.message : error.message, {
				position: 'top-center',
				theme: "colored"
			})
			console.error('Error submitting email configuration:', error.response ? error.response.data : error.message);
		} finally {
			setFormLoading(false)
		}
	};

	return (
		<div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-20">
			<div className="bg-white p-6 rounded-lg shadow-md lg:w-1/3 w-full mx-4">
				<h2 className="text-xl font-bold mb-8 text-gray-700 text-center">
					{isEditing ? "Edit Email Configuration" :
						!hasConfig ? "No Email Configuration Found" :
							"Email Configuration Details"}
				</h2>
				{loading
					?
					<div className="relative py-24">
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="rotating-circles">
								<div></div>
								<div></div>
								<div></div>
							</div>
						</div>
					</div>
					:
					<>
						{!hasConfig && !isEditing &&
							<div className="text-center">
								<BsEnvelopeExclamation className="text-yellow-500 text-5xl mx-auto mb-4" />
								<div className="flex justify-center">
									<button
										onClick={() => setIsEditing(true)}
										className="px-4 py-2 mr-2 flex justify-center items-center gap-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
									>
										<BsEnvelopePlus className="text-lg" /> Add Configurations
									</button>
									<button
										onClick={onClose}
										className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 shadow-sm"
									>
										Close
									</button>
								</div>
							</div>
						}
						{isEditing &&
							<form onSubmit={handleSubmit}>
								<div className="mb-4 flex lg:flex-row flex-col gap-4 lg:text-base text-sm">
									<div className="w-full">
										<label className="block font-semibold text-gray-600">Email</label>
										<input
											type="email"
											name="email"
											value={formData.email}
											onChange={handleChange}
											className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300"
											required
										/>
									</div>
									<div className="w-full">
										<label className="block font-semibold text-gray-600">Display Name</label>
										<input
											type="text"
											name="displayName"
											value={formData.displayName}
											onChange={handleChange}
											className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300"
											required
										/>
									</div>
								</div>
								<div className="mb-4 relative">
									<label className="block font-semibold text-gray-600">Passkey</label>
									<input
										type={isPasswordVisible ? "text" : "password"}
										name="passkey"
										value={formData.passkey}
										onChange={handleChange}
										className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300"
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
								<div className="mb-4 flex lg:flex-row flex-col gap-4">
									<div className="w-full">
										<label className="block font-semibold text-gray-600">Email Type</label>
										<select
											name="emailType"
											value={formData.emailType}
											onChange={handleChange}
											className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300"
											required
										>
											<option>Select type</option>
											<option value="gmail">Gmail</option>
											<option value="outlook">Outlook</option>
											<option value="zoho">Zoho</option>
											<option value="postmark">Postmark</option>
											<option value="sendgrid">SendGrid</option>
											<option value="mailgun">Mailgun</option>
											<option value="proton">Proton</option>
											<option value="yandex">Yandex</option>
											<option value="icloud">iCloud</option>
											<option value="yahoo">Yahoo</option>
										</select>
									</div>
									<div className="w-full">
										<label className="block font-semibold text-gray-600">Status</label>
										<select
											name="status"
											value={formData.status}
											onChange={handleChange}
											className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300"
											required
										>
											<option>Select State</option>
											<option value="active">Active</option>
											<option value="pause">Pause</option>
										</select>
									</div>
								</div>
								<div className="flex justify-end space-x-4">
									<button
										type="button"
										onClick={() => setIsEditing(false)}
										className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
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
											"Save"
										)}
									</button>
								</div>
							</form>
						}
						{hasConfig && !isEditing && (
							<>
								<div className="space-y-3 lg:text-base text-sm">
									<div className="flex justify-between items-center">
										<span className="font-semibold text-gray-600">Email:</span>
										<span className="text-gray-800">{formData.email}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="font-semibold text-gray-600">Display Name:</span>
										<span className="text-gray-800">{formData.displayName}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="font-semibold text-gray-600">Passkey:</span>
										<div className="flex items-center">
											<span className="text-gray-800">
												{isPasswordVisible ? formData.passkey : "●".repeat(formData.passkey.length)}
											</span>
											<button
												type="button"
												onClick={togglePasswordVisibility}
												className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
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
									{/* <div className="flex justify-between items-center">
										<span className="font-semibold text-gray-600">Email Type:</span>
										<span className="text-gray-800 capitalize">{formData.emailType}</span>
									</div> */}
									<div className="flex justify-between items-center">
										<span className="font-semibold text-gray-600">Status:</span>
										<span
											className={`px-2 py-1 text-sm rounded-full ${formData.status === "active"
												? "bg-green-100 text-green-700"
												: "bg-yellow-100 text-yellow-700"
												}`}
										>
											{formData.status}
										</span>
									</div>
								</div>
								<div className="flex justify-end space-x-3 mt-6 lg:text-base text-sm">
									<button
										onClick={() => setIsEditing(true)}
										className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-sm"
									>
										Edit
									</button>
									<button
										onClick={() => setConfirmPopup(true)}
										className="text-white px-4 py-2 rounded-md bg-red-500 hover:bg-red-700"
									>
										Remove
									</button>
									<button
										onClick={onClose}
										className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 shadow-sm"
									>
										Close
									</button>
								</div>
							</>
						)}
					</>
				}
			</div>
			<ConfirmationPopup
				isOpen={confirmPopup}
				onClose={() => setConfirmPopup(false)}
				onConfirm={() => {
					handleDelete()
					return false;
				}}
				content={"Are you sure you want to delete your Email configurations? This action cannot be undone."}
			/>
		</div >
	);
};

export default EmailConfigPopup;
