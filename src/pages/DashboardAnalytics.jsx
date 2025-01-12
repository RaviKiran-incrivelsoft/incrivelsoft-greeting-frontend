import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { FaBirthdayCake, FaRegCalendarAlt, FaHeart, FaCalendarCheck, FaChurch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const DashboardAnalytics = () => {
	const navigate = useNavigate();
	const analytics = {
		greetings: {
			birthday: { count: 12, successRate: 95, successful: 12, failed: 0 },
			occasion: { count: 8, successRate: 90, successful: 7, failed: 1 },
			anniversary: { count: 5, successRate: 85, successful: 4, failed: 1 },
			events: { count: 10, successRate: 93, successful: 9, failed: 1 },
			temple: { count: 3, successRate: 80, successful: 2, failed: 1 },
		},
		templatesCreated: 18,
		schedules: {
			birthday: { schedule_now: 6, schedule_later: 3, pause: 2, completed: 1, automate: 0 },
			occasion: { schedule_now: 4, schedule_later: 2, pause: 1, completed: 1, automate: 0 },
			anniversary: { schedule_now: 3, schedule_later: 1, pause: 0, completed: 1, automate: 0 },
			events: { schedule_now: 7, schedule_later: 2, pause: 1, completed: 0, automate: 0 },
			temple: { schedule_now: 2, schedule_later: 0, pause: 1, completed: 0, automate: 0 },
		},
	};

	const categoryIcons = {
		birthday: <FaBirthdayCake className="text-4xl text-pink-500" />,
		occasion: <FaRegCalendarAlt className="text-4xl text-blue-500" />,
		anniversary: <FaHeart className="text-4xl text-red-500" />,
		events: <FaCalendarCheck className="text-4xl text-green-500" />,
		temple: <FaChurch className="text-4xl text-purple-500" />,
	};

	// Bar Chart for Greetings Created
	const barChartData = {
		labels: Object.keys(analytics.greetings),
		datasets: [
			{
				label: "Greetings Created",
				data: Object.values(analytics.greetings).map((data) => data.count),
				backgroundColor: "rgba(75, 192, 192, 0.6)",
				borderColor: "rgba(75, 192, 192, 1)",
				borderWidth: 1,
			},
		],
	};

	// Bar Chart for Schedules
	const scheduleBarChartData = {
		labels: Object.keys(analytics.greetings),
		datasets: [
			{
				label: "Schedule Now",
				data: Object.values(analytics.schedules).map((data) => data.schedule_now),
				backgroundColor: "rgba(255, 99, 132, 0.6)",
				borderColor: "rgba(255, 99, 132, 1)",
				borderWidth: 1,
			},
			{
				label: "Schedule Later",
				data: Object.values(analytics.schedules).map((data) => data.schedule_later),
				backgroundColor: "rgba(54, 162, 235, 0.6)",
				borderColor: "rgba(54, 162, 235, 1)",
				borderWidth: 1,
			},
			{
				label: "Pause",
				data: Object.values(analytics.schedules).map((data) => data.pause),
				backgroundColor: "rgba(255, 206, 86, 0.6)",
				borderColor: "rgba(255, 206, 86, 1)",
				borderWidth: 1,
			},
			{
				label: "Completed",
				data: Object.values(analytics.schedules).map((data) => data.completed),
				backgroundColor: "rgba(75, 192, 192, 0.6)",
				borderColor: "rgba(75, 192, 192, 1)",
				borderWidth: 1,
			},
			{
				label: "Automate",
				data: Object.values(analytics.schedules).map((data) => data.automate),
				backgroundColor: "rgba(153, 102, 255, 0.6)",
				borderColor: "rgba(153, 102, 255, 1)",
				borderWidth: 1,
			},
		],
	};

	// Pie Chart Data for Successful vs. Failed
	const pieChartData = (category) => {
		const { successful, failed } = analytics.greetings[category];
		return {
			labels: ["Successful", "Failed"],
			datasets: [
				{
					data: [successful, failed],
					backgroundColor: ["#00ff0a88", "#f4433688"],
					borderColor: ["#00ff0a", "#f44336"],
					borderWidth: 1
				},
			],
		};
	};

	// Pie Chart Data for Templates Created
	const barChartTemplatesData = {
		labels: Object.keys(analytics.greetings),
		datasets: [
			{
				label: "Templates Created",
				data: Object.values(analytics.greetings).map((data) => data.count),
				backgroundColor: ["#FF573388", "#FFC30088", "#DAF7A688", "#C7003988", "#900C3F88"],
				borderColor: ["#FF5733", "#FFC300", "#DAF7A6", "#C70039", "#900C3F"],
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
					<Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
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
					{Object.entries(analytics.greetings).map(([category, data]) => (
						<div
							key={category}
							className="p-8 bg-white rounded-lg shadow-md flex lg:flex-row flex-col items-center gap-4"
						>
							{/* Left side: Custom Labels */}
							<div className="flex flex-col justify-between w-1/2">
								<div className="flex items-center gap-2">
									<div>{categoryIcons[category]}</div>
									<p className="text-lg font-medium text-gray-700 capitalize">{category}</p>
								</div>
								<p className="text-xl font-bold text-blue-500">{data.count} Greetings</p>
								<p className="text-sm text-gray-600">Success Rate: {data.successRate}%</p>

								{/* Custom Success/Failed Labels */}
								<div className="mt-4">
									<p className="text-sm text-gray-700">Successful: {data.successful}</p>
									<p className="text-sm text-gray-700">Failed: {data.failed}</p>
								</div>
							</div>

							{/* Right side: Pie Chart for Success vs Failed */}
							<div className="w-48 h-48">
								<Pie
									data={pieChartData(category)}
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
					))}
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
