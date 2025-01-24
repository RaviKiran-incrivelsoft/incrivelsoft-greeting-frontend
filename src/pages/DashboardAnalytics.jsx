import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { FaBirthdayCake, FaRegCalendarAlt, FaHeart, FaCalendarCheck, FaChurch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const DashboardAnalytics = () => {
	const navigate = useNavigate();
	const [analytics, setAnalytics] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAnalytics = async () => {
			try {
				const token = localStorage.getItem("token"); // Retrieve token from localStorage
				const response = await axios.post(`${backendUrl}/analytics`, {}, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setAnalytics(response.data);
			} catch (err) {
				console.error("Error fetching analytics data:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchAnalytics();
	}, []);

	const categoryIcons = {
		birthday: <FaBirthdayCake className="text-4xl text-pink-500" />,
		occasion: <FaRegCalendarAlt className="text-4xl text-blue-500" />,
		anniversary: <FaHeart className="text-4xl text-red-500" />,
		events: <FaCalendarCheck className="text-4xl text-green-500" />,
		temple: <FaChurch className="text-4xl text-purple-500" />,
	};

	// Bar Chart for Greetings Created
	const barChartData = {
		labels: analytics?.schedules ? Object.keys(analytics.schedules) : [],
		datasets: [
			{
				label: "Greetings Created",
				data: analytics?.schedules
					? Object.values(analytics.schedules).map((schedule) =>
						Object.values(schedule).reduce((total, value) => total + value, 0)
					)
					: [],
				backgroundColor: "rgba(75, 192, 192, 0.6)",
				borderColor: "rgba(75, 192, 192, 1)",
				borderWidth: 1,
			},
		],
	};

	const colors = [
		{ background: "rgba(255, 206, 86, 0.6)", border: "rgba(255, 206, 86, 1)" },
		{ background: "rgba(255, 99, 132, 0.6)", border: "rgba(255, 99, 132, 1)" },
		{ background: "rgba(75, 192, 192, 0.6)", border: "rgba(75, 192, 192, 1)" },
		{ background: "rgba(54, 162, 235, 0.6)", border: "rgba(54, 162, 235, 1)" },
	];

	const scheduleBarChartData = {
		labels: analytics?.schedules ? Object.keys(analytics.schedules) : [],
		datasets: analytics?.schedules?.birthday
			? Object.keys(analytics.schedules.birthday)
				.filter((status) => status !== "schedule_now")
				.map((status, index) => ({
					label: status.replace("_", " ").toUpperCase(),
					data: Object.values(analytics.schedules).map((category) => category[status] || 0),
					backgroundColor: colors[index % colors.length].background,
					borderColor: colors[index % colors.length].border,
					borderWidth: 1,
				}))
			: [],
	};

	const barChartTemplatesData = {
		labels: analytics?.templatesCreated ? Object.keys(analytics.templatesCreated) : [],
		datasets: [
			{
				data: analytics?.templatesCreated
					? Object.values(analytics.templatesCreated)
					: [],
				backgroundColor: ["#FF573388", "#FFC30088", "#DAF7A688", "#C7003988", "#900C3F88", "#1F618D88"],
				borderColor: ["#FF5733", "#FFC300", "#DAF7A6", "#C70039", "#900C3F", "#1F618D"],
				borderWidth: 1,
			},
		],
	};

	return (
		<div className="py-6 lg:px-32 px-10 bg-gray-50 min-h-screen">
			<h1 className="text-3xl text-center font-bold text-gray-800 mb-6">Dashboard Analytics</h1>
			<div className="flex items-center mb-6 w-full">
				<button
					onClick={() => navigate(-1)}
					className="flex items-center py-1.5 px-4 border-2 rounded-md transition-all duration-300 ease-in-out text-gray-600 border-gray-600 hover:text-white hover:bg-gray-600 hover:border-transparent"
				>
					Back
				</button>
			</div>
			<div className="flex lg:flex-row flex-col lg:gap-10">
				{/* Bar Chart for Greetings Created */}
				<div className="mb-8 w-full">
					<h2 className="text-2xl font-semibold text-gray-700 mb-4">Greetings Created</h2>
					<div className="bg-white p-4 rounded-lg shadow-md">
						{loading ?
							<div className="relative py-24">
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="rotating-circles">
										<div></div>
										<div></div>
										<div></div>
									</div>
								</div>
							</div>
							: <Bar data={barChartData} options={{
								responsive: true, maintainAspectRatio: false,
								plugins: {
									legend: {
										display: false, // Disable the legend if you don't want a dataset title
									},
								},
							}} height={300} />}
					</div>
				</div>

				{/* Templates Created Pie Chart */}
				<div className="mb-8 w-full">
					<h2 className="text-2xl font-semibold text-gray-700 mb-4">Templates Created</h2>
					<div className="bg-white p-6 rounded-lg shadow-md">
						{loading ?
							<div className="relative py-24">
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="rotating-circles">
										<div></div>
										<div></div>
										<div></div>
									</div>
								</div>
							</div>
							:
							<Bar
								data={barChartTemplatesData}
								options={{
									responsive: true,
									maintainAspectRatio: false,
									plugins: {
										legend: {
											display: false,
										},
									},
								}}
								height={300}
							/>
						}
					</div>
				</div>
			</div>

			{/* Bar Chart for Schedules */}
			<div className="mb-8">
				<h2 className="text-2xl font-semibold text-gray-700 mb-4">Schedule Distribution</h2>
				<div className="bg-white p-4 rounded-lg shadow-md">
					{loading ?
						<div className="relative py-24">
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="rotating-circles">
									<div></div>
									<div></div>
									<div></div>
								</div>
							</div>
						</div>
						:
						<Bar
							data={scheduleBarChartData}
							options={{
								responsive: true,
								maintainAspectRatio: false,
							}}
							height={300}
						/>
					}
				</div>
			</div>

			{/* Greetings Analysis with Pie Charts */}
			<div className="mb-8">
				<h2 className="text-2xl font-semibold text-gray-700 mb-4">Greetings Analysis</h2>
				<div className="grid lg:grid-cols-2 gap-6">
					{loading ?
						<div className="relative py-24">
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="rotating-circles">
									<div></div>
									<div></div>
									<div></div>
								</div>
							</div>
						</div>
						: <>
							{Object.entries(analytics?.schedules).map(([category, scheduleData]) => {
								// Calculate total count for each category
								const totalCount = Object.values(scheduleData).reduce((total, value) => total + value, 0);

								// Mock success and failed data (You can adjust this based on actual success/failure logic)
								const successful = Math.floor(totalCount * 0.9); // Assuming 90% success rate
								const pending = totalCount - successful;
								const failed = 0;

								return (
									<div
										key={category}
										className="p-8 bg-white rounded-lg shadow-md flex lg:flex-row flex-col items-center gap-4"
									>
										{/* Left side: Custom Labels */}
										<div className="flex flex-col justify-between w-1/2">
											<div className="flex items-center gap-2">
												<div>{categoryIcons[category] || <FaRegCalendarAlt className="text-4xl text-gray-500" />}</div>
												<p className="text-lg font-medium text-gray-700 capitalize">{category}</p>
											</div>
											<p className="text-xl font-bold text-blue-500">{totalCount} Greetings</p>
											<p className="text-sm text-gray-600">Success Rate: {totalCount > 0 ? (((successful + pending - failed) / totalCount) * 100).toFixed(2) : 0}%</p>

											{/* Custom Success/Failed Labels */}
											<div className="mt-4">
												<p className="text-sm text-gray-700">Successful: {successful}</p>
												<p className="text-sm text-gray-700">Pending: {pending}</p>
												<p className="text-sm text-gray-700">Failed: {failed}</p>
											</div>
										</div>

										{/* Right side: Pie Chart for Success vs Failed */}
										<div className="w-48 h-48">
											<Pie
												data={{
													labels: ["Successful", "Pending", "Failed"],
													datasets: [
														{
															data: [successful, pending, failed],
															backgroundColor: ["#00ff0a88", "#f200ff88", "#f4433688"],
															borderColor: ["#00ff0a", "#f200ffb0", "#f44336"],
															borderWidth: 1,
														},
													],
												}}
												options={{
													responsive: true,
													plugins: {
														legend: {
															display: false, // Disable default legend
														},
													},
												}}
											/>
										</div>
									</div>
								);
							})}
						</>
					}
				</div>

			</div>
		</div>
	);
};

export default DashboardAnalytics;
