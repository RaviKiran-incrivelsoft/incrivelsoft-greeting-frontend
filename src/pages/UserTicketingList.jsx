import React, { useEffect, useState } from "react";
import { FaClock, FaCheckCircle, FaExclamationCircle, FaInbox } from "react-icons/fa";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const UserTicketingCard = ({ ticket }) => {
	// Determine the status color and icon
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

	return (
		<div className="bg-white shadow-md rounded-lg p-6 border border-gray-300">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-semibold text-gray-800">{ticket.sub}</h2>
				<div className={`flex items-center ${color}`}>
					{icon}
					<span className="ml-2 capitalize font-medium">{ticket.status}</span>
				</div>
			</div>
			<div className="space-y-2">
				<p className="text-gray-700">
					<span className="font-semibold">Phone Number:</span> {ticket.phoneNumber}
				</p>
				<p className="text-gray-700">
					<span className="font-semibold">Complement:</span> {ticket.complement}
				</p>
				<p className="text-gray-500 text-sm">
					<span className="font-semibold">Created At:</span> {new Date(ticket.createdAt).toLocaleDateString()} {" "}
					{new Date(ticket.createdAt).toLocaleTimeString()}
				</p>
			</div>
		</div>
	);
};

const UserTicketingList = () => {
	const [tickets, setTickets] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

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
				setError("Failed to load tickets.");
			} finally {
				setLoading(false);
			}
		};

		fetchTickets();
	}, []);

	if (loading) return <p>Loading tickets...</p>;
	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="py-6 lg:px-32 px-10 space-y-6">
			<div className="flex flex-col items-center justify-center text-center">
				<h1 className="text-4xl font-semibold text-gray-800 mb-4">Track your Feedbacks</h1>
				<p className="text-lg text-gray-600 max-w-2xl">
				Manage and Monitor your feedback. Stay informed about the progress of your feedbacks and ensure every detail is accounted for.
				</p>
			</div>
			{tickets.length === 0 ? (
				<div className="flex flex-col items-center justify-center h-64 text-gray-500">
					<FaInbox className="text-6xl mb-4" />
					<p className="text-xl">No Feedbacks Available</p>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{tickets.map((ticket) => (
						<UserTicketingCard key={ticket._id} ticket={ticket} />
					))}
				</div>
			)}
		</div>
	);
};

export default UserTicketingList;
