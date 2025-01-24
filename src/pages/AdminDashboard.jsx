import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminDashboard = () => {
	const [tickets, setTickets] = useState([]);
	const [loading, setLoading] = useState(false);
	const [content, setContent] = useState("");
	const [popupOpen, setPopupOpen] = useState(false);

	useEffect(() => {
		fetchTickets();
	}, []);

	const fetchTickets = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem("token");
			const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user-ticketing/all`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setTickets(response.data.data);
			console.log(response.data.data);

		} catch (error) {
			toast.error("Failed to fetch tickets.", {
				position: "top-center",
				theme: "colored",
			});
		} finally {
			setLoading(false);
		}
	};

	const updateTicketStatus = async (id, currentStatus) => {
		const statusMap = {
			pending: "reviewed",
			reviewed: "completed",
			completed: "completed",
		};

		const nextStatus = statusMap[currentStatus];
		const token = localStorage.getItem("token");

		try {
			const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/user-ticketing/${id}`, {
				status: nextStatus,
			}, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.status === 200) {
				toast.success("Status updated successfully.", {
					position: "top-center",
					theme: "colored",
				});
				fetchTickets();
			}
		} catch (error) {
			toast.error("Failed to update status.", {
				position: "top-center",
				theme: "colored",
			});
		}
	};
	const truncateText = (text, wordLimit) => {
		const words = text.split(" ");
		if (words.length > wordLimit) {
			return (
				<>
					{words.slice(0, wordLimit).join(" ")}....
					<button
						onClick={() => {
							setContent(text);
							setPopupOpen(true);
						}}
						className="text-blue-600"
						title="View Description"
					>
						<span>more</span>
					</button>
				</>
			);
		}
		return text;
	};

	return (
		<div className="py-10 lg:px-32 px-10 bg-gray-100 min-h-screen">
			{popupOpen &&
				<div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-10">
					<div className="bg-white lg:w-1/3 mx-8 w-full p-8 rounded-lg text-center flex flex-col">
						<p className="mb-6">{content}</p>
						<button
							onClick={() => setPopupOpen(false)}
							className="px-4 py-2 bg-red-500 text-white rounded self-end"
						>
							Close
						</button>
					</div>
				</div>
			}

			<h1 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h1>

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
			) : (
				<div className="overflow-x-auto shadow-md rounded-lg">
					<table className="w-full bg-white lg:text-base text-sm">
						<thead>
							<tr className="border-b bg-gray-200 text-gray-600 uppercase text-sm">
								<th className="py-4 px-6 lg:table-cell hidden text-center">S.No.</th>
								<th className="py-4 px-6 text-center">Issue</th>
								<th className="py-4 px-6 lg:table-cell hidden text-center">Phone Number</th>
								<th className="py-4 px-6 text-center">Description</th>
								<th className="py-4 px-6 text-center">Action</th>
							</tr>
						</thead>
						<tbody className="text-gray-700">
							{tickets.map((ticket, index) => (
								<tr key={ticket._id} className="border-b border-gray-200 hover:bg-gray-100 lg:text-base text-xs">
									<td className="py-4 lg:table-cell hidden pl-4 text-center">{index + 1}</td>
									<td className="py-4 pl-4 text-center">{ticket.sub}</td>
									<td className="py-4 lg:table-cell hidden text-center">{ticket.phoneNumber}</td>
									<td
										className="p-4 text-center"
									>
										{truncateText(ticket.complement, 4)}
									</td>
									<td className="px-4 text-center">
										<button
											onClick={() => {
												if (ticket.status !== "completed") {
													updateTicketStatus(ticket._id, ticket.status);
												}
											}}
											className={`px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 
												${ticket.status === "pending"
													? "bg-yellow-500 hover:bg-yellow-600"
													: ticket.status === "reviewed"
														? "bg-blue-500 hover:bg-blue-600"
														: "bg-green-500 cursor-not-allowed opacity-50"
												}`}
										>
											{ticket.status === "pending" && "Review"}
											{ticket.status === "reviewed" && "Resolve"}
											{ticket.status === "completed" && "Completed"}
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default AdminDashboard;
