import React, { useEffect, useState } from "react";
import { FaClock, FaCheckCircle, FaExclamationCircle, FaInbox, FaEdit, FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdOutlineReportProblem } from "react-icons/md";
import SupportForm from "../components/SupportForm";
import ConfirmationPopup from '../components/ConfirmationPopup.jsx';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const UserTicketingList = () => {
	const [tickets, setTickets] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedTicket, setSelectedTicket] = useState(true);
	const [confirmPopup, setConfirmPopup] = useState(false);
	const [supportVisible, setSupportVisible] = useState(false);
	const navigate = useNavigate();

	const options = {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	};

	useEffect(() => {
		const fetchTickets = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get(`${backendUrl}/user-ticketing`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setTickets(response.data.data);
			} catch (err) {
				console.error("Error fetching tickets:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchTickets();
	}, [supportVisible]);

	const handleDelete = async () => {
		try {
			const token = localStorage.getItem("token");
			await axios.delete(`${backendUrl}/user-ticketing/${selectedTicket}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setConfirmPopup(false)
			setTickets((prev) => prev.filter((ticket) => ticket._id !== selectedTicket));
		} catch (err) {
			console.error("Error deleting ticket:", err);
			alert("Failed to delete ticket.");
		}
	};

	return (
		<div className="py-10 lg:px-32 px-10">
			<SupportForm isOpen={supportVisible} onClose={() => setSupportVisible(false)} />
			<ConfirmationPopup
				isOpen={confirmPopup}
				onClose={() => setConfirmPopup(false)}
				onConfirm={() => {
					handleDelete()
					return false;
				}}
				content={"Are you sure you want to remove this Issue? This action cannot be undone."}
			/>
			<div className="flex flex-col items-center justify-center text-center">
				<h1 className="lg:text-4xl text-2xl font-semibold text-gray-800 mb-4">Track your Issues</h1>
				<p className="lg:text-lg text-sm text-gray-600 max-w-2xl">
					Manage and Monitor your Issues. Stay informed about the progress of your Issuess and ensure every detail is accounted for.
				</p>
			</div>

			<div className="flex items-center gap-4 my-6 w-full lg:text-base text-sm">
				<button
					onClick={() => navigate(-1)}
					className="flex items-center py-1.5 px-4 border-2 rounded-md transition-all duration-300 ease-in-out text-gray-600 border-gray-600 hover:text-white hover:bg-gray-600 hover:border-transparent"
				>
					Back
				</button>
				<button
					className='flex items-center bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700'
					onClick={() => setSupportVisible(true)}
				>
					<MdOutlineReportProblem className="mr-2" />
					<span>Raise Issue</span>
				</button>
			</div>
			{loading ? (
				<div className="relative py-24">
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="rotating-circles">
							<div></div>
							<div></div>
							<div></div>
						</div>
					</div>
				</div>
			) : tickets.length === 0 ? (
				<div className="flex flex-col items-center justify-center h-64 text-gray-500">
					<FaInbox className="text-6xl mb-4" />
					<p className="text-xl">No Issues Available</p>
				</div>
			) : (
				<div className="overflow-x-auto shadow-md rounded-lg">
					<table className="w-full bg-white lg:text-base text-sm">
						<thead>
							<tr className="border-b bg-gray-200 text-gray-600 uppercase lg:text-sm text-xs">
								<th className="py-4 px-6 text-center">Issue</th>
								<th className="py-4 px-6 lg:table-cell hidden text-center">Phone Number</th>
								<th className="py-4 px-6 lg:table-cell hidden text-center">Description</th>
								<th className="py-4 px-6 text-center">Created At</th>
								<th className="py-4 px-6 text-center">Status</th>
								<th className="py-4 px-6 text-center">Actions</th>
							</tr>
						</thead>
						<tbody className="text-gray-700">
							{tickets.map((ticket) => {
								const getStatusDetails = (status) => {
									switch (status) {
										case "pending":
											return { color: "text-yellow-500", icon: <FaClock /> };
										case "reviewed":
											return { color: "text-blue-500", icon: <FaExclamationCircle /> };
										case "completed":
											return { color: "text-green-500", icon: <FaCheckCircle /> };
										default:
											return { color: "text-gray-500", icon: <FaClock /> };
									}
								};

								const { color, icon } = getStatusDetails(ticket.status);
								const truncateText = (text, wordLimit) => {
									const words = text.split(" ");
									return words.length > wordLimit
										? words.slice(0, wordLimit).join(" ") + "..."
										: text;
								};

								return (
									<tr key={ticket._id} className="border-b hover:bg-gray-100">
										<td className="py-4 px-6 text-center">{ticket.sub}</td>
										<td className="py-4 px-6 text-center lg:table-cell hidden">{ticket.phoneNumber}</td>
										<td className="py-4 px-6 text-center lg:table-cell hidden">{truncateText(ticket.complement, 4)}</td>
										<td className="py-4 px-6 text-center">
											{new Date(ticket.createdAt).toLocaleString('en-GB', options)}
										</td>
										<td className={`py-4 text-center ${color}`}>
											<div className="flex justify-center items-center gap-2">
												{icon}
												<span className="capitalize font-medium">{ticket.status}</span>
											</div>
										</td>
										<td className="py-4 px-6 text-center">
											<div className="flex gap-4 justify-center items-center">
												<button
													className="flex items-center p-1.5 border-2 rounded-md transition-all duration-300 ease-in-out text-yellow-500 border-yellow-500 hover:text-white hover:bg-yellow-500 hover:border-transparent cursor-pointer"
													title="Edit"
												>
													<FaEdit />
												</button>
												<button
													className="flex items-center p-1.5 border-2 rounded-md transition-all duration-300 ease-in-out text-red-600 border-red-600 hover:text-white hover:bg-red-600 hover:border-transparent"
													title="Delete"
													onClick={() => { setConfirmPopup(true); setSelectedTicket(ticket._id) }}
												>
													<FaTrashAlt />
												</button>
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default UserTicketingList;
