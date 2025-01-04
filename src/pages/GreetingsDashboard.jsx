import React, { useCallback, useEffect, useState } from 'react';
import { FaEye, FaRegEnvelope, FaEdit, FaTrashAlt, FaFilter, FaCalendarAlt } from 'react-icons/fa';
import TablePagination from '@mui/material/TablePagination';
import Dropdown from '../components/Dropdown';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import convertToUTC from "../utils/convertToUTC.js";
import { deleteMarriageDetails, deleteTempleDetails, deleteFestivalDetails, deleteEventDetails, deleteBirthDatDetails } from "../utils/deleteMethods.js";

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
	const [isLoading, setIsLoading] = useState(false);
	const [greetings, setGreetings] = useState([]);
	const [scheduleId, setScheduleId] = useState(null);
	const [popupVisible, setPopupVisible] = useState(false);
	const [selectedOption, setSelectedOption] = useState('');
	const [scheduleTime, setScheduleTime] = useState('');
	const [mediaOption, setMediaOption] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [totalRows, setTotalRows] = useState(10);
	const [filter, setFilter] = useState("none");

	const token = localStorage.getItem("token");

	const fetchGreetings = useCallback(() => {
		setIsLoading(true);
		console.log("schedule type: ", filter);

		axios
			.get(`${backendUrl}/schedule?page=${currentPage}&limit=${limit}&status=${filter}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then(response => {
				setGreetings(response.data.schedules);
				setTotalRows(response.data.totalSchedules);
			})
			.catch(error => {
				console.error("Error fetching greetings:", error);
				toast.error("Failed to fetch greetings", {
					position: "top-center",
					theme: "colored",
				});
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [currentPage, limit, filter, token]);

	useEffect(() => {
		fetchGreetings();
	}, [fetchGreetings]);

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

	const deleteScheduleAndCampaign = async (scheduleId, templateId, type) => {
		console.log("delete schedule details ..", scheduleId, templateId, type);
		try {
			const res = await axios.delete(
				`${backendUrl}/schedule/${scheduleId}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			if (res.status === 200) {
				toast.success("Schedule and its template details are deleted.", {
					position: 'top-center',
					theme: "colored"
				});
				switch (type) {
					case "temple":
						deleteTempleDetails(templateId);
						break;
					case "birthday":
						deleteBirthDatDetails(templateId);
						break;
					case 'event':
						deleteEventDetails(templateId);
						break;
					case 'marriage':
						deleteMarriageDetails(templateId);
						break;
					case 'festival':
						deleteFestivalDetails(templateId);
						break;
					default:
						console.log("Invalid type...");
						toast.error(
							"Failed to delete the Template details...",
							{
								"position": "top-center",
								"theme": "colored"
							}
						);
				}
				fetchGreetings();
			}

			else {
				throw new Error(res.data.error);
			}
		} catch (error) {
			console.log(error);
			toast.error('Error while deletig', {
				position: 'top-center',
				theme: "colored"
			});
		}
	}

	const handleChangeRowsPerPage = (event) => {
		setLimit(parseInt(event.target.value, 10));
		setCurrentPage(1);
	};

	return (
		<div className="py-10 px-32 bg-gray-100 min-h-screen">
			<div className="mb-8 text-center">
				<h2 className="text-3xl font-semibold text-gray-800">Greeting Dashboard</h2>
			</div>
			<div className="mb-4 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Dropdown fetchData={fetchGreetings} />
					<button
						onClick={() => navigate('/templates')}
						className="flex items-center gap-1 py-1.5 px-4 border-2 rounded-md transition-all duration-300 ease-in-out text-blue-600 border-blue-600 hover:text-white hover:bg-blue-600 hover:border-transparent"
					>
						<FaRegEnvelope className="mr-2" />
						Templates
					</button>
				</div>
				<div className="relative group ml-auto">
					<button
						className="flex items-center gap-1 py-1.5 px-4 border-2 rounded-md transition-all duration-300 ease-in-out text-blue-600 border-blue-600 hover:text-white hover:bg-blue-600 hover:border-transparent"
					>
						<FaFilter className="mr-2" />
						Filter
					</button>
					<div className="absolute right-0 hidden group-hover:flex bg-white border border-gray-200 rounded-md shadow-lg z-10 flex-col">
						<ul className="py-1">
							<li
								className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
								onClick={() => setFilter("none")}
							>
								All
							</li>
							<li
								className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
								onClick={() => setFilter("completed")}
							>
								Completed
							</li>
							<li
								className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
								onClick={() => setFilter("schedule_now")}
							>
								Schedule Now
							</li>
							<li
								className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
								onClick={() => setFilter("schedule_later")}
							>
								Schedule Later
							</li>
							<li
								className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
								onClick={() => setFilter("automate")}
							>
								Automate
							</li>
							<li
								className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
								onClick={() => setFilter("pause")}
							>
								pause
							</li>
						</ul>
					</div>
				</div>
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
							<th className="py-4 px-6 text-center">Edit/ Delete</th>
						</tr>
					</thead>
					<tbody className="text-gray-700">
						{isLoading ? (
							<tr>
								<td colSpan="7" className="relative py-24">
									<div className="absolute inset-0 flex items-center justify-center">
										<div className="rotating-circles">
											<div></div>
											<div></div>
											<div></div>
										</div>
									</div>
								</td>
							</tr>
						) : (
							<>
								{greetings.length === 0 ? (
									<tr>
										<td colSpan="7" className="py-12 text-center text-sm text-gray-500">
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
												<p className='font-semibold text-lg text-gray-400'>No Greetings available</p>
											</div>
										</td>
									</tr>
								) : (greetings.map((row) => {
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
												{(row.schedule === "pause") && (
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
													<span className="inline-block bg-yellow-100 text-yellow-700 py-1 px-3 rounded-xl">Sent</span>
												)}
											</td>
											<td>
												<div className="flex gap-4 justify-center items-center">
													<button
														className={row.schedule === "completed" ? "flex items-center p-1.5 border-2 rounded-md transition-all duration-300 ease-in-out text-yellow-500 border-yellow-500 bg-yellow-100 cursor-not-allowed" :
															"flex items-center p-1.5 border-2 rounded-md transition-all duration-300 ease-in-out text-yellow-500 border-yellow-500 hover:text-white hover:bg-yellow-500 hover:border-transparent"
														}
														title={row.schedule === "completed" ? "Edit (Disabled)" : "Edit"}
														disabled
													>
														<FaEdit />
													</button>
													<button
														className={row.schedule === "completed" ? "flex items-center p-1.5 border-2 rounded-md transition-all duration-300 ease-in-out text-red-600 border-red-600 bg-red-100 cursor-not-allowed" :
															"flex items-center p-1.5 border-2 rounded-md transition-all duration-300 ease-in-out text-red-600 border-red-600 hover:text-white hover:bg-red-600 hover:border-transparent"
														}
														title="Delete (Disabled)"
														disabled
														onClick={() => {
															deleteScheduleAndCampaign(
																row._id,
																row[greetingTitle.toLowerCase()]._id,
																greetingTitle.toLowerCase()
															);
														}}
													>
														<FaTrashAlt />
													</button>
												</div>
											</td>
										</tr>
									)
								}))}
							</>
						)}
					</tbody>
				</table>
				<TablePagination
					component="div"
					count={totalRows}             // Total items count
					page={currentPage - 1}        // Convert to zero-based index
					onPageChange={(event, newPage) => setCurrentPage(newPage + 1)}  // Correct page logic
					rowsPerPage={limit}           // Rows per page
					onRowsPerPageChange={handleChangeRowsPerPage}  // Handle rows per page change
				/>
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
		</div >
	);
};

export default GreetingDashboard;
