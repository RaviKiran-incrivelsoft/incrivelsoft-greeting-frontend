import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AddSchedule from './AddSchedule';
import convertToUTC from "../utils/convertToUTC.js";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ScheduleDashboard = () => {
	const [schedules, setSchedules] = useState([]);
	const [scheduleId, setScheduleId] = useState(null);
	const [popupVisible, setPopupVisible] = useState(false);
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState('');
	const [scheduleTime, setScheduleTime] = useState('');
	const [mediaOption, setMediaOption] = useState('');
	const navigate = useNavigate();

	const fetchSchedules = async () => {
		try {
			const token = localStorage.getItem("token");
			const response = await axios.get(`${backendUrl}/schedule`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			setSchedules(response.data.schedules);
		} catch (error) {
			console.error('Error fetching schedules', error);
			toast.error('Failed to fetch schedules', {
				position: 'top-center',
				theme: "colored"
			})
		}
	};
	useEffect(() => {
		fetchSchedules();
	}, [isPopupOpen]);

	const handlePopupToggle = () => {
		setPopupVisible(!popupVisible);
		setSelectedOption('');
		setMediaOption('');
		setScheduleTime('');
	};

	const handleDropdownChange = (e) => {
		setSelectedOption(e.target.value);
	};

	const handleMediaChange = (e) => {
		setMediaOption(e.target.value);
	};

	const handleScheduleSubmit = async () => {
		try {
			const token = localStorage.getItem("token");
			const data = {
				schedule: selectedOption,
				media: mediaOption,
			};

			if (selectedOption === "schedule_later" && scheduleTime) {
				data.time = convertToUTC(scheduleTime);
			} else {
				data.time = convertToUTC(new Date());
			}

			const response = await axios.put(
				`${backendUrl}/schedule/${scheduleId}`,
				data,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			if (response.status === 200) {
				console.log("Schedule updated successfully:", response.data);
				fetchSchedules();
				toast.success('Schedule updated successfully', {
					position: 'top-center',
					theme: "colored"
				})
			} else {
				console.error("Error updating schedule:", response.data);
				toast.error('Failed to schedule', {
					position: 'top-center',
					theme: "colored"
				})
			}

			handlePopupToggle();
		} catch (error) {
			console.error("Error in handleScheduleSubmit:", error);
			toast.error('Error while scheduling', {
				position: 'top-center',
				theme: "colored"
			})
		}
	};

	return (
		<div className="container mx-auto py-10 px-32 bg-gray-100">
			<h1 className="text-center text-3xl font-semibold mb-6">Schedule Dashboard</h1>

			<div className="flex items-center mb-6">
				<button
					onClick={() => navigate(-1)}
					className="flex items-center py-1.5 px-4 border-2 rounded-md transition-all duration-300 ease-in-out text-gray-600 border-gray-600 hover:text-white hover:bg-gray-600 hover:border-transparent"
				>
					Back
				</button>
				<button
					onClick={() => setIsPopupOpen(true)}
					className="flex items-center ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
				>
					<FaPlus className="mr-2" />
					Add Schedule
				</button>
				<AddSchedule
					isOpen={isPopupOpen}
					onClose={() => setIsPopupOpen(false)}
				/>
			</div>
			<div className="overflow-x-auto shadow-md rounded-lg">
				<table className="min-w-full bg-white">
					<thead>
						<tr className="border-b bg-gray-200 text-gray-600 uppercase text-sm">
							<th className="px-6 py-3 text-sm text-gray-500">Temple</th>
							<th className="px-6 py-3 text-sm text-gray-500">Time</th>
							<th className="px-6 py-3 text-sm text-gray-500">Status</th>
							<th className="px-6 py-3 text-sm text-gray-500">Action</th>
						</tr>
					</thead>
					<tbody>
						{schedules.length === 0 ? (
							<tr>
								<td colSpan="4" className="py-12 text-center text-sm text-gray-500">
									<div className="flex flex-col items-center justify-center space-y-4">
										<svg
											className="w-12 h-12 text-gray-300"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<circle cx="12" cy="12" r="10"></circle>
											<path d="M12 6v6l4 2"></path>
										</svg>
										<p className='font-semibold text-lg text-gray-400'>No schedules available</p>
									</div>
								</td>
							</tr>
						) : (schedules.map((schedule) => (
							<tr key={schedule._id} className="border-b hover:bg-gray-50">
								<td className="px-6 py-4 text-center text-gray-900">{schedule.temple?.templeName || "TempleName"}</td>
								<td className="px-6 py-4 text-center text-gray-900">{new Date(schedule.time).toLocaleString()}</td>
								<td className="px-6 py-4 text-center text-gray-900">{schedule.schedule}</td>
								<td className="px-6 py-4 flex justify-center text-gray-900">
									<button
										onClick={() => {
											setScheduleId(schedule._id);
											handlePopupToggle()
										}}
										disabled={schedule.schedule === "completed"}
										className={`flex items-center py-2 px-4 border-2 rounded-md transition-all duration-300 ease-in-out ${schedule.schedule === "completed"
											? "text-gray-400 border-gray-400 cursor-not-allowed"
											: "text-yellow-600 border-yellow-600 hover:text-white hover:bg-yellow-600 hover:border-transparent"
											}`}
									>
										<FaCalendarAlt className="mr-2" />
										Schedule
									</button>
								</td>
							</tr>
						)))}
					</tbody>
				</table>
			</div>

			{/* Popup */}
			{popupVisible && (
				<div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
					<div className="bg-white p-8 rounded-lg shadow-xl w-96">
						<h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Schedule Action</h2>

						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700">Select Action</label>
							<select
								value={selectedOption}
								onChange={handleDropdownChange}
								className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="" disabled>Select action</option>
								<option value="schedule_now">Schedule Now</option>
								<option value="schedule_later">Schedule Later</option>
								<option value="pause">Pause</option>
							</select>
						</div>
						<div className="mb-6">
							<label className="block text-sm font-medium text-gray-700">Send Via</label>
							<select
								value={mediaOption}
								onChange={handleMediaChange}
								className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="" disabled>Select mode</option>
								<option value="whatsapp">WhatsApp</option>
								<option value="mail">Mail</option>
								<option value="both">Both</option>
							</select>
						</div>
						{/* Conditional input fields based on selected option */}
						{selectedOption === 'schedule_later' && (
							<div className="mb-6">
								<label className="block text-sm font-medium text-gray-700">Date & Time</label>
								<input
									type="datetime-local"
									value={scheduleTime}
									onChange={(e) => setScheduleTime(e.target.value)}
									className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
						)}

						{/* Action Buttons */}
						<div className="flex justify-between items-center">
							<button
								onClick={handlePopupToggle}
								className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-all duration-300"
							>
								Close
							</button>

							{selectedOption === 'schedule_now' && (
								<button
									onClick={handleScheduleSubmit}
									className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-all duration-300"
								>
									Schedule
								</button>
							)}
							{selectedOption === 'schedule_later' && (
								<button
									onClick={handleScheduleSubmit}
									className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-all duration-300"
								>
									Schedule
								</button>
							)}
							{selectedOption === 'pause' && (
								<button
									onClick={handleScheduleSubmit}
									className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-all duration-300"
								>
									Submit
								</button>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ScheduleDashboard;
