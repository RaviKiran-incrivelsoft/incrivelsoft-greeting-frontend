import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AddSchedule = ({ isOpen, onClose }) => {
	const [formData, setFormData] = useState({
		schedule: "",
		time: "",
		temple: "",
		mode: "",
	});
	const [temples, setTemples] = useState([]);

	useEffect(() => {
		const fetchTemples = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get(`${backendUrl}/temple`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setTemples(response.data.templesData || []);
			} catch (error) {
				toast.error("Failed to fetch temples", {
					position: "top-center",
					theme: "colored",
				});
				console.error("Error fetching temples:", error);
			}
		};

		if (isOpen) fetchTemples();
	}, [isOpen]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const { schedule, time, temple, mode } = formData;
		const localDate = new Date(time); // Create a Date object in local timezone
		const utcDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000); // Convert to UTC
        formData.time = utcDate;

		if (!schedule || !time || !temple || !mode) {
			toast.error("Please fill all fields.", {
				position: "top-center",
				theme: "colored",
			});
			return;
		}

		try {
			const token = localStorage.getItem("token");
			const response = await axios.post(
				`${backendUrl}/schedule`,
				formData,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setFormData({
				schedule: "",
				time: "",
				temple: "",
				mode: "",
			})
			toast.success(response.data.message || "Schedule created successfully!", {
				position: "top-center",
				theme: "colored",
				autoClose: 3000,
				onClose: () => {
					onClose();
				},
			});
		} catch (error) {
			toast.error(
				error.response?.data?.error || "Failed to create schedule",
				{
					position: "top-center",
					theme: "colored",
				}
			);
			console.error("Error creating schedule:", error);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
			<div className="bg-white rounded-lg w-1/3 p-6 shadow-lg">
				<h2 className="text-xl font-bold mb-4">Add Schedule</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">Schedule</label>
						<select
							name="schedule"
							value={formData.schedule}
							onChange={handleChange}
							className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
						>
							<option value="" disabled>Select Schedule</option>
							<option value="schedule_now">Schedule Now</option>
							<option value="schedule_later">Schedule Later</option>
							<option value="automate">Automate</option>
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">Time</label>
						<input
							type="datetime-local"
							name="time"
							value={formData.time}
							onChange={handleChange}
							className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">Temple</label>
						<select
							name="temple"
							value={formData.temple}
							onChange={handleChange}
							className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
						>
							<option value="">Select Temple</option>
							{temples.map((temple) => (
								<option key={temple._id} value={temple._id}>
									{temple.templeName}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">Mode</label>
						<select
							name="mode"
							value={formData.mode}
							onChange={handleChange}
							className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
						>
							<option value="" disabled>Select Mode</option>
							<option value="whatsapp">WhatsApp</option>
							<option value="email">Email</option>
							<option value="both">Both</option>
						</select>
					</div>

					<div className="flex justify-end space-x-4">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 focus:outline-none"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
						>
							Create
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddSchedule;
