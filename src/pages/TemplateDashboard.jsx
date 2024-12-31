import React from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const images = [
	{ image: "https://via.placeholder.com/300", title: "Happy Birthday", description: "Celebrate a joyous birthday with this special greeting!" },
	{ image: "https://via.placeholder.com/300", title: "Festival Greetings", description: "Wishing you a festive season filled with joy and happiness!" },
	{ image: "https://via.placeholder.com/300", title: "Marriage Blessings", description: "Wishing you a lifetime of love and happiness together." },
	{ image: "https://via.placeholder.com/300", title: "Event Celebration", description: "Join us for a memorable event filled with fun and excitement!" },
	{ image: "https://via.placeholder.com/300", title: "Temple Visit", description: "May your visit to the temple bring peace and blessings." },
	{ image: "https://via.placeholder.com/300", title: "Corporate Greetings", description: "Wishing you success and prosperity in all your business endeavors." },
];

const TemplateDashboard = () => {
	const navigate = useNavigate();

	return (
		<div className="py-10 px-32 bg-gray-100 min-h-screen flex flex-col items-center">
			<h2 className="text-2xl font-semibold mb-4 text-center">Our Templates</h2>
			<p className="text-gray-600 mb-10 w-2/3 text-center">
				Browse through a selection of beautifully designed greeting templates, or create your own to send personalized messages for every occasion.
			</p>
			<div className="flex items-center mb-6 w-full">
				<button
					onClick={() => navigate(-1)}
					className="flex items-center py-1.5 px-4 border-2 rounded-md transition-all duration-300 ease-in-out text-gray-600 border-gray-600 hover:text-white hover:bg-gray-600 hover:border-transparent"
				>
					Back
				</button>
				<button
					onClick={() => navigate('/addpost')}
					className="flex items-center ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
				>
					<FaPlus className="mr-2" />
					Create Template
				</button>
			</div>
			<div className="grid grid-cols-3 gap-x-6 gap-y-4 w-full">
				{images.map((item, index) => (
					<div key={index} className="text-center">
						<div className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg">
							<img
								src={item.image}
								alt={item.title}
								className="w-full h-full object-cover"
							/>
							<div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
								<p className="text-white text-center px-4">{item.description}</p>
							</div>
						</div>
						<h3 className="text-lg font-semibold my-3">{item.title}</h3>
					</div>
				))}
				<div
					onClick={() => navigate('/addpost')}
					className="w-72 h-72 cursor-pointer bg-white shadow-md rounded-lg border-dashed border-2 border-blue-500 flex flex-col justify-center items-center relative"
				>
					<div className="flex items-center justify-center w-14 h-14 bg-blue-500 text-white rounded-full text-4xl pb-2 font-bold">
						+
					</div>
					<p className="mt-4 text-blue-500 font-medium">Add Template</p>
				</div>
			</div>
		</div>
	);
};

export default TemplateDashboard;
