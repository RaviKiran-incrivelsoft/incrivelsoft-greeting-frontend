import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaEye, FaRegEnvelope } from 'react-icons/fa';
import Dropdown from '../components/Dropdown';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import convertToUTC from "../utils/convertToUTC.js";

const options = {
	day: '2-digit',
	month: '2-digit',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
	hour12: true,
};
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const GreetingDashboard = () => {
	const navigate = useNavigate();
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [greetings, setGreetings] = useState([]);
	const [scheduleId, setScheduleId] = useState(null);
	const [popupVisible, setPopupVisible] = useState(false);
	const [selectedOption, setSelectedOption] = useState('');
	const [scheduleTime, setScheduleTime] = useState('');
	const [mediaOption, setMediaOption] = useState('');

	const fetchGreetings = () => {
		const token = localStorage.getItem("token");

		axios.get(`${backendUrl}/schedule`, { headers: { Authorization: `Bearer ${token}` } })
			.then(response => {
				setGreetings(response.data.schedules);
			})
			.catch(error => {
				console.error('Error fetching campaigns:', error);
				toast.error('Failed to fetch campaigns', {
					position: 'top-center',
					theme: "colored"
				})
			});
	}
	useEffect(() => {
		fetchGreetings();
	}, []);

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

	const handleSchedule = (row) => {
		setScheduleId(row._id);
		handlePopupToggle();
		setSelectedOption(row.schedule);
		setMediaOption(row.mode);
	}

	const handleScheduleSubmit = async () => {
		try {
			const token = localStorage.getItem("token");
			const data = {
				schedule: selectedOption,
				mode: mediaOption,
				time: scheduleTime
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
				fetchGreetings();
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
		<div className="py-10 px-32 bg-gray-100 min-h-screen">
			<div className="mb-8 text-center">
				<h2 className="text-3xl font-semibold text-gray-800">Greeting Dashboard</h2>
			</div>
			<div className="mb-4 flex items-center gap-2">
				<Dropdown fetchData={fetchGreetings}/>
				<button
					onClick={() => navigate('/templates')}
					className="flex items-center gap-1 py-1.5 px-4 border-2 rounded-md transition-all duration-300 ease-in-out text-blue-600 border-blue-600 hover:text-white hover:bg-blue-600 hover:border-transparent"
				>
					<FaRegEnvelope className='mr-2' />
					Templates
				</button>
			</div>
			{isPopupOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
					<div className="bg-white p-4 rounded-lg shadow-lg">
						<img src="https://via.placeholder.com/300" alt="Template" className="w-64 h-64 object-cover" />
						<button
							onClick={() => setIsPopupOpen(false)}
							className="mt-2 py-1 px-4 bg-red-500 text-white rounded-md"
						>
							Close
						</button>
					</div>
				</div>
			)}
			<div className="overflow-x-auto shadow-md rounded-lg">
				<table className="w-full bg-white">
					<thead>
						<tr className="border-b bg-gray-200 text-gray-600 uppercase text-sm">
							<th className="py-4 px-6 text-center">Greeting</th>
							<th className="py-4 px-6 text-center">Recipient Count</th>
							<th className="py-4 px-6 text-center">Created At</th>
							<th className="py-4 px-6 text-center">Status</th>
							<th className="py-4 px-6 text-center">Template</th>
							<th className="py-4 px-6 text-center">Actions</th>
						</tr>
					</thead>
					<tbody className="text-gray-700">
						{greetings.map((row) => {
							const key = Object.keys(row).find((key) => ['temple', 'event', 'marriage', 'festival', 'birthday'].includes(key));
							const greetingTitle = key ? key.charAt(0).toUpperCase() + key.slice(1) : 'New Year';
							
							return (
								<tr key={row._id} className="border-b border-gray-200 hover:bg-gray-100">
									<td className="py-4 px-6 text-center">{greetingTitle} Greetings</td>
									<td className="py-4 px-6 text-center">{row[key].csvData.length}</td>
									<td className="py-4 px-6 text-center">{new Date(row[key].createdAt).toLocaleString('en-GB', options)}</td>
									<td className="py-4 px-6 text-center">{row.schedule}</td>
									<td className="py-4 px-6 text-center">
										<button
											onClick={() => setIsPopupOpen(true)}
											className="text-blue-600"
											title="View Template"
										>
											<FaEye className="text-lg" />
										</button>
									</td>
									<td className="py-4 px-6 text-center">
										{row.schedule === "pause" && (
											<button
												className="flex items-center py-1.5 px-4 border-2 rounded-md transition-all duration-300 ease-in-out text-blue-600 border-blue-600 hover:text-white hover:bg-blue-600 hover:border-transparent"
												title="Schedule Greeting"
												onClick={() => handleSchedule(row)}
											>
												<FaCalendarAlt className="mr-2" /> Schedule
											</button>
										)}
										{(row.schedule === "schedule_later" || row.schedule === "schedule_now") && (
											<span className="inline-block bg-green-100 text-green-700 py-1 px-3 rounded-xl">Scheduled</span>
										)}
										{row.schedule === "automate" && (
											<span className="inline-block bg-green-100 text-green-700 py-1 px-3 rounded-xl">Automate</span>
										)}
										{row.schedule === "completed" && (
											<span className="inline-block bg-yellow-100 text-yellow-700 py-1 px-3 rounded-xl">Send</span>
										)}
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
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
									<option value="automate">Automate</option>
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
									<option value="email">Email</option>
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
		</div>
	);
};

export default GreetingDashboard;
