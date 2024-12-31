import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaEye, FaRegEnvelope } from 'react-icons/fa';
import Dropdown from '../components/Dropdown';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

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
	const [greetings, setGreetings] = useState([])

	useEffect(() => {
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
	}, []);

	return (
		<div className="py-10 px-32 bg-gray-100 min-h-screen">
			<div className="mb-8 text-center">
				<h2 className="text-3xl font-semibold text-gray-800">Greeting Dashboard</h2>
			</div>
			<div className="mb-4 flex items-center gap-2">
				<Dropdown />
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
							console.log(row.schedule);
							
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
										{row.schedule === "paused" && (
											<button
												className="flex items-center py-1.5 px-4 border-2 rounded-md transition-all duration-300 ease-in-out text-blue-600 border-blue-600 hover:text-white hover:bg-blue-600 hover:border-transparent"
												title="Schedule Greeting"
											>
												<FaCalendarAlt className="mr-2" /> Schedule
											</button>
										)}
										{row.schedule === "active" && (
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
			</div>
		</div>
	);
};

export default GreetingDashboard;
