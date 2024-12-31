import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const globalPostImages = {
	occasion: "https://res.cloudinary.com/dnl1wajhw/image/upload/v1735634498/Screenshot_2024-12-31_140252_yo7icy.png",
	anniversary: "https://res.cloudinary.com/dnl1wajhw/image/upload/v1735634498/Screenshot_2024-12-31_140340_gozefj.png",
	birthday: "https://res.cloudinary.com/dnl1wajhw/image/upload/v1735634497/Screenshot_2024-12-31_140507_s1u7da.png",
	event: "https://res.cloudinary.com/dnl1wajhw/image/upload/v1735634497/Screenshot_2024-12-31_140427_kfzfam.png",
};

const TemplateDashboard = () => {
	const navigate = useNavigate();
	const [globalTemplates, setGlobalTemplates] = useState([]);
	const [userPosts, setUserPosts] = useState([]);

	// Fetch posts and templates
	const fetchPosts = async () => {
		try {
			const token = localStorage.getItem("token");

			// Fetch global and user-created posts
			const response = await axios.get(`${backendUrl}/post`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			// Filter global posts based on type and isGlobal flag
			const globalPosts = response.data.posts.filter((post) => post.isGlobal);

			// Filter user-created posts for the active component
			const userCreatedPosts = response.data.posts.filter(
				(post) => !post.isGlobal
			);

			setGlobalTemplates(globalPosts);
			setUserPosts(userCreatedPosts);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchPosts();
	}, []);

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

			{/* Global Templates */}
			<h3 className="text-xl font-semibold mb-4">Preset Templates</h3>
			<div className="grid grid-cols-3 gap-x-6 gap-y-4 w-full mb-10">
				{globalTemplates.map((item, index) => (
					<div key={index} className="text-center">
						<div className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg">
							<img
								src={
									globalPostImages[item.type] || item.mediaURL
								}
								alt={item.postName}
								className="w-full h-full object-cover"
							/>
							<div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
								<p className="text-white text-center px-4">{item.postDescription}</p>
							</div>
						</div>
						<h3 className="text-lg font-semibold my-3">{item.postName}</h3>
					</div>
				))}
			</div>

			{/* User-Created Templates */}
			<h3 className="text-xl font-semibold mb-4">Your Custom Templates</h3>
			<div className="grid grid-cols-3 gap-x-6 gap-y-4 w-full">
				{userPosts.map((item, index) => (
					<div key={index} className="text-center">
						<div className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg">
							<img
								src={item.mediaURL}
								alt={item.postName}
								className="w-full h-full object-cover"
							/>
							<div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
								<p className="text-white text-center px-4">{item.postDescription}</p>
							</div>
						</div>
						<h3 className="text-lg font-semibold my-3">{item.postName}</h3>
					</div>
				))}
				<div
					onClick={() => navigate("/addpost")}
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
