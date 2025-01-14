import React, { useCallback, useEffect, useState } from 'react';
import { FaEye, FaRegEnvelope, FaEdit, FaTrashAlt, FaFilter, FaCalendarAlt } from 'react-icons/fa';
import TablePagination from '@mui/material/TablePagination';
import Dropdown from '../components/Dropdown';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import convertToUTC from "../utils/convertToUTC.js";
import { deleteMarriageDetails, deleteTempleDetails, deleteFestivalDetails, deleteEventDetails, deleteBirthDatDetails } from "../utils/deleteMethods.js";
import ConfirmationPopup from '../components/ConfirmationPopup.jsx';
import { BsGraphUpArrow } from 'react-icons/bs';
import TempleModal from '../components/EditModals/TempleModal.jsx';
import EventModal from '../components/EditModals/EventModal.jsx';
import BirthdayModal from '../components/EditModals/BirthdayModal.jsx';
import MarriageModal from '../components/EditModals/MarriageModal.jsx';
import FestivalModal from '../components/EditModals/FestivalModal.jsx';

const options = {
	day: '2-digit',
	month: '2-digit',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
	hour12: true,
};
const backendUrl = process.env.REACT_APP_BACKEND_URL;
const globalPostImages = {
	occasion: "https://res.cloudinary.com/dnl1wajhw/image/upload/v1735634498/Screenshot_2024-12-31_140252_yo7icy.png",
	marriage: "https://res.cloudinary.com/dnl1wajhw/image/upload/v1735634498/Screenshot_2024-12-31_140340_gozefj.png",
	birthday: "https://res.cloudinary.com/dnl1wajhw/image/upload/v1735634497/Screenshot_2024-12-31_140507_s1u7da.png",
	event: "https://res.cloudinary.com/dnl1wajhw/image/upload/v1735634497/Screenshot_2024-12-31_140427_kfzfam.png",
	festival: "https://res.cloudinary.com/dnl1wajhw/image/upload/v1735657868/duyp9meidk3cji7zrqdm.png"
};

const GreetingDashboard = () => {
	const navigate = useNavigate();
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [schLoading, setSchLoading] = useState(false);
	const [greetings, setGreetings] = useState([]);
	const [posts, setPosts] = useState([]);
	const [postDetailsAndTemplates, setPostDetailsAndTemplates] = useState([]);
	const [templateImage, setTemplateImage] = useState('https://placehold.co/300X400/orange/white?text=Image+Failed\nto+Load');
	const [scheduleId, setScheduleId] = useState(null);
	const [popupVisible, setPopupVisible] = useState(false);
	const [selectedOption, setSelectedOption] = useState('');
	const [scheduleTime, setScheduleTime] = useState('');
	const [mediaOption, setMediaOption] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [totalRows, setTotalRows] = useState(10);
	const [filter, setFilter] = useState("none");
	const [confirmPopup, setConfirmPopup] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);

	const token = localStorage.getItem("token");

	const handleDeleteClick = (row, greetingTitle) => {
		setSelectedRow({
			greetingId: row._id,
			campaignId: row[greetingTitle.toLowerCase()]._id,
			type: greetingTitle.toLowerCase(),
		});
		setConfirmPopup(true);
	};

	const handleEditClick = (row) => {
		const category = Object.keys(row).find((key) =>
			['temple', 'event', 'marriage', 'festival', 'birthday'].includes(key)
		);

		setSelectedRow(row);
		setSelectedCategory(category);
		setIsModalOpen(true);
	};

	const fetchPosts = async () => {
		try {
			const token = localStorage.getItem("token");
			const response = await axios.get(`${backendUrl}/post`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			setPosts(response.data.posts);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchPosts();
	}, []);

	const fetchGreetings = useCallback(() => {
		setIsLoading(true);
		axios
			.get(`${backendUrl}/schedule?page=${currentPage}&limit=${limit}&status=${filter}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then(response => {

				const scheduleData = response.data.schedules;

				setGreetings(response.data.schedules);
				setTotalRows(response.data.totalSchedules);
				const extractedData = [];
				const scheduleTypes = ['occasion', 'marriage', 'birthday', 'event', 'festival'];

				for (const scheduleItem of scheduleData) {
					// Loop through each schedule type and check if the field exists in the current scheduleItem
					for (const type of scheduleTypes) {
						if (scheduleItem[type] && scheduleItem[type].postDetails) {
							const postDetailsId = scheduleItem[type].postDetails;
							const postDetail = posts.find(post => post._id === postDetailsId);

							// Determine the template URL: if isGlobal, use global image, otherwise use mediaURL from post
							const templateUrl = postDetail?.isGlobal
								? globalPostImages[type]  // Use global image if isGlobal is true
								: postDetail?.mediaURL;          // Otherwise, use mediaURL from the post

							// Only add data if there's a valid template URL and postDetails
							if (templateUrl && postDetail) {
								extractedData.push({
									schId: scheduleItem._id,
									template: templateUrl,  // Use the corresponding template URL
								});
							}
						}
					}
				}
				setPostDetailsAndTemplates(extractedData);
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
	}, [currentPage, limit, filter, token, posts]);

	useEffect(() => {
		fetchGreetings();
	}, [fetchGreetings]);

	const renderModal = () => {
		if (!isModalOpen || !selectedRow || !selectedCategory) return null;

		switch (selectedCategory) {
			case 'temple':
				return (
					<TempleModal
						data={selectedRow.temple}
						onClose={() => { setIsModalOpen(false) }}
						onFetch={fetchGreetings}
					/>
				);
			case 'event':
				return (
					<EventModal
						data={selectedRow.event}
						onClose={() => { setIsModalOpen(false) }}
						onFetch={fetchGreetings}
					/>
				);
			case 'marriage':
				return (
					<MarriageModal
						data={selectedRow.marriage}
						onClose={() => { setIsModalOpen(false) }}
						onFetch={fetchGreetings}
					/>
				);
			case 'festival':
				return (
					<FestivalModal
						data={selectedRow.festival}
						onClose={() => { setIsModalOpen(false) }}
						onFetch={fetchGreetings}
					/>
				);
			case 'birthday':
				return (
					<BirthdayModal
						data={selectedRow.birthday}
						onClose={() => { setIsModalOpen(false) }}
						onFetch={fetchGreetings}
					/>
				);
			default:
				return null;
		}
	};

	const handleTemplate = (id) => {
		setIsPopupOpen(true);
		setTemplateImage(postDetailsAndTemplates.find(item => item.schId === id)?.template || "https://placehold.co/300X400/orange/white?text=Image+Failed\nto+Load");
	}
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
		setSchLoading(true)
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
				throw new Error(response.data.error);
			}

			handlePopupToggle();
		} catch (error) {
			console.error("Error in handleScheduleSubmit:", error);
			toast.error(error.response.data.error || 'Error while scheduling', {
				position: 'top-center',
				theme: "colored"
			})
		} finally {
			setSchLoading(false)
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
				switch (type) {
					case "temple":
						deleteTempleDetails(templateId);
						setConfirmPopup(false);
						break;
					case "birthday":
						deleteBirthDatDetails(templateId);
						setConfirmPopup(false);
						break;
					case 'event':
						deleteEventDetails(templateId);
						setConfirmPopup(false);
						break;
					case 'marriage':
						deleteMarriageDetails(templateId);
						setConfirmPopup(false);
						break;
					case 'festival':
						deleteFestivalDetails(templateId);
						setConfirmPopup(false);
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
						setConfirmPopup(false);
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
		<div className="py-10 lg:px-32 px-10 bg-gray-100 min-h-screen">
			<div className="mb-8 text-center">
				<h2 className="text-3xl font-semibold text-gray-800">Greeting Dashboard</h2>
			</div>
			<div className="mb-4 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Dropdown fetchData={fetchGreetings} />
					<button
						onClick={() => navigate('/templates')}
						className="flex items-center gap-1 py-1.5 lg:px-4 px-2 border-2 rounded-md transition-all duration-300 ease-in-out text-blue-600 border-blue-600 hover:text-white hover:bg-blue-600 hover:border-transparent"
					>
						<FaRegEnvelope className="lg:mr-2" />
						<span className='lg:block hidden'>Templates</span>
					</button>
				</div>
				<div className="flex gap-4">
					<button
						className='flex items-center gap-1 py-0 lg:py-1.5 lg:px-4 px-2 border-2 rounded-md transition-all duration-300 ease-in-out text-blue-600 border-blue-600 hover:text-white hover:bg-blue-600 hover:border-transparent'
						onClick={() => navigate('/analytics')}
					>
						<BsGraphUpArrow className="lg:mr-2" />
						<span className='lg:block hidden'>Analytics</span>
					</button>
					<div className="relative group ml-auto">
						<button
							className="flex items-center gap-1 py-1.5 lg:px-4 px-2 border-2 rounded-md transition-all duration-300 ease-in-out text-blue-600 border-blue-600 hover:text-white hover:bg-blue-600 hover:border-transparent"
						>
							<FaFilter className="lg:mr-2" />
							<span className='lg:block hidden'>Filter</span>
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
			</div>


			{isPopupOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
					<div className="bg-white p-4 rounded-lg shadow-lg">
						<img src={templateImage} alt="Template" className="w-64 h-auto object-cover" />
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
				<table className="w-full bg-white lg:text-base text-sm">
					<thead>
						<tr className="border-b bg-gray-200 text-gray-600 uppercase text-sm">
							<th className="py-4 px-6 text-center">Greeting</th>
							<th className="py-4 px-6 lg:table-cell hidden text-center">Recipient Count</th>
							<th className="py-4 px-6 text-center">Created At</th>
							<th className="py-4 px-6 lg:table-cell hidden text-center">Status</th>
							<th className="py-4 px-6 lg:table-cell hidden text-center">Template</th>
							<th className="py-4 px-6 text-center">Actions</th>
							<th className="py-4 px-6 text-center">Edit/ Delete</th>
						</tr>
					</thead>
					<tbody className="text-gray-700">
						{isLoading ? (
							<tr>
								<td colSpan={window.innerWidth >= 1024 ? 7 : 4} className="relative py-24">
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
											<td className="py-4 pl-4 text-center">{greetingTitle === "Festival" ? "Occasion" : greetingTitle} Greetings</td>
											<td className="py-4 lg:table-cell hidden text-center">{row[key].csvData.length}</td>
											<td className="py-4 text-center">{new Date(row[key].createdAt).toLocaleString('en-GB', options)}</td>
											<td className="py-4 lg:table-cell hidden text-center">{row.schedule}</td>
											<td className="py-4 lg:table-cell hidden text-center">
												<button
													onClick={() => handleTemplate(row._id)}
													className="text-blue-600"
													title="View Template"
												>
													<FaEye className="text-lg" />
												</button>
											</td>
											<td className="py-4 text-center">
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
														className={row.schedule === "completed" ? "flex items-center p-1.5 border-2 rounded-md transition-all duration-300 ease-in-out text-gray-300 border-gray-300 bg-gray-100 cursor-not-allowed" :
															"flex items-center p-1.5 border-2 rounded-md transition-all duration-300 ease-in-out text-yellow-500 border-yellow-500 hover:text-white hover:bg-yellow-500 hover:border-transparent cursor-pointer"
														}
														disabled={row.schedule === "completed"}
														title={row.schedule === "completed" ? "Edit (Disabled)" : "Edit"}
														onClick={() => handleEditClick(row)}
													>
														<FaEdit />
													</button>
													<button
														className="flex items-center p-1.5 border-2 rounded-md transition-all duration-300 ease-in-out text-red-600 border-red-600 hover:text-white hover:bg-red-600 hover:border-transparent"
														title="Delete (Disabled)"
														onClick={() => handleDeleteClick(row, greetingTitle)}
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
				{isModalOpen && renderModal()}
				<ConfirmationPopup
					isOpen={confirmPopup}
					onClose={() => setConfirmPopup(false)}
					onConfirm={() => {
						deleteScheduleAndCampaign(
							selectedRow.greetingId,
							selectedRow.campaignId,
							selectedRow.type
						)
						return false;
					}}

				/>
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
						<div className="bg-white p-8 rounded-lg shadow-xl lg:w-96 w-4/5">
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
								<button
									onClick={handleScheduleSubmit}
									disabled={schLoading}
									className={`bg-blue-600 text-white px-6 py-2 rounded-md ${schLoading ? "bg-blue-400 cursor-not-allowed py-4" : "bg-blue-600 hover:bg-blue-700"
										}`}
								>
									{schLoading ? (
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
						</div>
					</div>
				)}
			</div>
		</div >
	);
};

export default GreetingDashboard;
