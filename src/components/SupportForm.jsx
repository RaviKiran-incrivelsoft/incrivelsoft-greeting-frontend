import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

const SupportForm = ({ isOpen, onClose }) => {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		sub: "",
		phoneNumber: "",
		complement: "",
	});

	if (!isOpen) return null;

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem("token");
		setLoading(true)
		try {
			const response = await axios.post(
				`${process.env.REACT_APP_BACKEND_URL}/user-ticketing`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			console.log(response.data);

			toast.success("Issue submitted successfully!", {
				position: "top-center",
				theme: "colored",
			});
			onClose();
			setFormData({ sub: "", phoneNumber: "", complement: "" });
		} catch (error) {
			console.error("Error submitting Issue:", error);
			toast.error("Failed to submit Issue. Please try again.", {
				position: "top-center",
				theme: "colored",
			});
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white p-8 shadow-lg rounded-lg lg:w-1/3">
				<h2 className="lg:text-3xl text-2xl text-center font-semibold text-gray-800 mb-6">Raise a Ticket</h2>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label htmlFor="sub" className="block text-gray-700 font-medium mb-2">
							Issue About *
						</label>
						<input
							type="text"
							id="sub"
							name="sub"
							value={formData.sub}
							onChange={handleInputChange}
							className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
							required
						/>
					</div>

					<div className="mb-4">
						<label
							htmlFor="phoneNumber"
							className="block text-gray-700 font-medium mb-2"
						>
							Phone Number *
						</label>
						<input
							type="tel"
							id="phoneNumber"
							name="phoneNumber"
							value={formData.phoneNumber}
							onChange={handleInputChange}
							className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
							required
						/>
					</div>

					<div className="mb-4">
						<label
							htmlFor="complement"
							className="block text-gray-700 font-medium mb-2"
						>
							Description *
						</label>
						<textarea
							id="complement"
							name="complement"
							value={formData.complement}
							onChange={handleInputChange}
							className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
							rows="4"
							required
						></textarea>
					</div>
					<div className="flex items-center justify-end gap-4 mt-6 w-full">
						<button
							onClick={onClose}
							className="px-6 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							className={`bg-blue-600 text-white px-6 py-2 rounded-md ${loading ? "bg-blue-400 cursor-not-allowed py-4" : "bg-blue-600 hover:bg-blue-700"
								}`}
						>
							{loading ? (
								<div className="flex space-x-1">
									<span className="dot bg-white"></span>
									<span className="dot bg-white"></span>
									<span className="dot bg-white"></span>
								</div>
							) : (
								"Submit"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default SupportForm