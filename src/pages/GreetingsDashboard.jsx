import React, { useState } from 'react';
import { FaCalendarAlt, FaEye, FaRegEnvelope } from 'react-icons/fa';
import Dropdown from '../components/Dropdown';
import { useNavigate } from 'react-router-dom';

const rows = [
	{
		greeting: "Welcome Greeting",
		recipientCount: 50,
		createdAt: "01/01/2024, 10:00 AM",
		status: "Active",
		template: "Template 1",
	},
	{
		greeting: "Holiday Greetings",
		recipientCount: 30,
		createdAt: "01/02/2024, 11:00 AM",
		status: "Pending",
		template: "Template 2",
	},
	{
		greeting: "Event Greetings",
		recipientCount: 100,
		createdAt: "01/03/2024, 12:00 PM",
		status: "Completed",
		template: "Template 3",
	},
];

const GreetingDashboard = () => {
	const navigate = useNavigate();
	const [isPopupOpen, setIsPopupOpen] = useState(false);

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
						{rows.map((row, index) => (
							<tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
								<td className="py-4 px-6 text-center">{row.greeting}</td>
								<td className="py-4 px-6 text-center">{row.recipientCount}</td>
								<td className="py-4 px-6 text-center">{row.createdAt}</td>
								<td className="py-4 px-6 text-center">{row.status}</td>
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
									{row.status === "Pending" && (
										<button
											className="flex items-center py-1.5 px-4 border-2 rounded-md transition-all duration-300 ease-in-out text-blue-600 border-blue-600 hover:text-white hover:bg-blue-600 hover:border-transparent"
											title="Schedule Greeting"
										>
											<FaCalendarAlt className="mr-2" /> Schedule
										</button>
									)}
									{row.status === "Active" && (
										<span className="inline-block bg-green-100 text-green-700 py-1 px-3 rounded-xl">Scheduled</span>
									)}
									{row.status === "Completed" && (
										<span className="inline-block bg-yellow-100 text-yellow-700 py-1 px-3 rounded-xl">Send</span>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default GreetingDashboard;
