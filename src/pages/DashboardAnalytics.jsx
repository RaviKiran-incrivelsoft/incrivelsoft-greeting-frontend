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
	const [analytics, setAnalytics] = useState();
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

	if (loading) {
		return <div className="py-6 lg:px-32 px-10 bg-gray-50 min-h-screen">Loading...</div>;
	}

	const categoryIcons = {
		birthday: <FaBirthdayCake className="text-4xl text-pink-500" />,
		occasion: <FaRegCalendarAlt className="text-4xl text-blue-500" />,
		anniversary: <FaHeart className="text-4xl text-red-500" />,
		events: <FaCalendarCheck className="text-4xl text-green-500" />,
		temple: <FaChurch className="text-4xl text-purple-500" />,
	};

	// Bar Chart for Greetings Created
	const barChartData = {
		labels: Object.keys(analytics?.schedules),
		datasets: [
			{
				label: "Greetings Created",
				data: Object.values(analytics?.schedules).map((schedule) =>
					Object.values(schedule).reduce((total, value) => total + value, 0)
				),
				backgroundColor: "rgba(75, 192, 192, 0.6)",
				borderColor: "rgba(75, 192, 192, 1)",
				borderWidth: 1,
			},
		],
	};

	// Bar Chart for Schedules
	const scheduleBarChartData = {
		labels: Object.keys(analytics.schedules),
		datasets: Object.keys(analytics.schedules.birthday).map((status, index) => ({
			label: status.replace("_", " ").toUpperCase(),
			data: Object.values(analytics.schedules).map((category) => category[status]),
			backgroundColor: `rgba(${index * 50}, ${200 - index * 40}, ${index * 30}, 0.6)`,
			borderColor: `rgba(${index * 50}, ${200 - index * 40}, ${index * 30}, 1)`,
			borderWidth: 1,
		})),
	};

	// Pie Chart Data for Templates Created
	const barChartTemplatesData = {
		labels: Object.keys(analytics.templatesCreated),
		datasets: [
			{
				data: Object.values(analytics.templatesCreated),
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
			{/* Bar Chart for Greetings Created */}
			<div className="mb-8">
				<h2 className="text-2xl font-semibold text-gray-700 mb-4">Greetings Created</h2>
				<div className="bg-white p-4 rounded-lg shadow-md">
					<Bar data={barChartData} options={{
						responsive: true, maintainAspectRatio: false,
						plugins: {
							legend: {
								display: false, // Disable the legend if you don't want a dataset title
							},
						},
					}} height={300} />
				</div>
			</div>

			{/* Bar Chart for Schedules */}
			<div className="mb-8">
				<h2 className="text-2xl font-semibold text-gray-700 mb-4">Schedule Distribution</h2>
				<div className="bg-white p-4 rounded-lg shadow-md">
					<Bar
						data={scheduleBarChartData}
						options={{
							responsive: true,
							maintainAspectRatio: false,
							scales: {
								x: {
									title: {
										display: true,
										text: "Greetings",
									},
								},
								y: {
									title: {
										display: true,
										text: "Count",
									},
								},
							},
						}}
						height={300}
					/>
				</div>
			</div>

			{/* Greetings Analysis with Pie Charts */}
			<div className="mb-8">
				<h2 className="text-2xl font-semibold text-gray-700 mb-4">Greetings Analysis</h2>
				<div className="grid lg:grid-cols-2 gap-6">
					{Object.entries(analytics.schedules).map(([category, scheduleData]) => {
						// Calculate total count for each category
						const totalCount = Object.values(scheduleData).reduce((total, value) => total + value, 0);

						// Mock success and failed data (You can adjust this based on actual success/failure logic)
						const successful = Math.floor(totalCount * 0.9); // Assuming 90% success rate
						const failed = totalCount - successful;

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
									<p className="text-sm text-gray-600">Success Rate: {totalCount > 0 ? ((successful / totalCount) * 100).toFixed(2) : 0}%</p>

									{/* Custom Success/Failed Labels */}
									<div className="mt-4">
										<p className="text-sm text-gray-700">Successful: {successful}</p>
										<p className="text-sm text-gray-700">Failed: {failed}</p>
									</div>
								</div>

								{/* Right side: Pie Chart for Success vs Failed */}
								<div className="w-48 h-48">
									<Pie
										data={{
											labels: ["Successful", "Failed"],
											datasets: [
												{
													data: [successful, failed],
													backgroundColor: ["#00ff0a88", "#f4433688"],
													borderColor: ["#00ff0a", "#f44336"],
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
				</div>

			</div>

			{/* Templates Created Pie Chart */}
			<div className="mb-8">
				<h2 className="text-2xl font-semibold text-gray-700 mb-4">Templates Created</h2>
				<div className="bg-white p-6 rounded-lg shadow-md">
					<Bar
						data={barChartTemplatesData}
						options={{
							responsive: true,
							maintainAspectRatio: false,
							plugins: {
								legend: {
									display: false, // Disable the legend if you don't want a dataset title
								},
							},
							scales: {
								x: {
									title: {
										display: true,
										text: "Greeting Categories",
									},
								},
								y: {
									title: {
										display: true,
										text: "Templates Created",
									},
								},
							},
						}}
						height={300}
					/>
				</div>
			</div>
		</div>
	);
};

export default DashboardAnalytics;
