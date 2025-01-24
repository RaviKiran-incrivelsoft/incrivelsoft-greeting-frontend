import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaFilter, FaTrashAlt } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import ConfirmationPopup from "../components/ConfirmationPopup";
import { toast } from "react-toastify";
import { IoMdArrowRoundBack } from "react-icons/io";

const globalPostImages = {
	occasion: "https://res.cloudinary.com/dnl1wajhw/image/upload/v1735634498/Screenshot_2024-12-31_140252_yo7icy.png",
	anniversary: "https://res.cloudinary.com/dnl1wajhw/image/upload/v1735634498/Screenshot_2024-12-31_140340_gozefj.png",
	birthday: "https://res.cloudinary.com/dnl1wajhw/image/upload/v1735634497/Screenshot_2024-12-31_140507_s1u7da.png",
	event: "https://res.cloudinary.com/dnl1wajhw/image/upload/v1735634497/Screenshot_2024-12-31_140427_kfzfam.png",
};

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const TemplateDashboard = () => {
	const navigate = useNavigate();
	const [filter, setFilter] = useState("all");
	const [templates, setTemplates] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [confirmPopup, setConfirmPopup] = useState(false);
	const [tempToRemove, setTempToRemove] = useState(null);

	const fetchPosts = async () => {
		try {
			const token = localStorage.getItem("token");
			const response = await axios.get(`${backendUrl}/post`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setTemplates(response.data.posts);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchPosts();
	}, []);

	const groupedData = {};
	templates?.forEach((item) => {
		const { _id, type, postName, postDescription, isGlobal, mediaURL, createdAt } = item;

		if (!groupedData[type]) {
			groupedData[type] = [];
		}

		groupedData[type].push({
			tempId: _id,
			postName,
			image: isGlobal ? globalPostImages[type] || mediaURL : mediaURL,
			description: postDescription,
			isGlobal,
			createdAt,
		});
	});

	const filteredData = (filter === "all"
		? Object.values(groupedData).flat()
		: groupedData[filter] || []
	).sort((a, b) => {
		const dateComparison = new Date(b.createdAt) - new Date(a.createdAt);
		if (dateComparison !== 0) return dateComparison;
		return b.isGlobal - a.isGlobal;
	});

	const handleDeleteTemplate = (id) => {
		setTempToRemove(id);
		setConfirmPopup(true);
	}

	const removeTemplate = async () => {
		try {
			const response = await axios.delete(`${backendUrl}/post/${tempToRemove}`, {
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${localStorage.getItem("token")}`
				}
			});

			if (response.status === 200) {
				toast.success(response.data.message, {
					position: "top-center",
					theme: "colored",
				});
				setConfirmPopup(false);
				fetchPosts();
			}
		} catch (error) {
			console.error("Error deleting post:", error);
			alert("Error deleting post. Please try again.");
		}
	};


	return (
		<div className="py-10 lg:px-32 px-10 bg-gray-100 min-h-screen">
			<h2 className="text-2xl font-semibold mb-4 text-center">Our Templates</h2>
			<p className="text-gray-600 mb-10 lg:w-2/3 lg:text-base text-sm mx-auto text-center">
				Browse through a selection of beautifully designed greeting templates, or create your own to send personalized messages for every occasion.
			</p>
			<div className="flex items-center mb-6 w-full">
				<button
					onClick={() => navigate(-1)}
					className="flex items-center p-1 text-xl border-2 rounded-full transition-all duration-300 ease-in-out text-gray-600 border-gray-600 hover:text-white hover:bg-gray-600 hover:border-transparent"
				>
					<IoMdArrowRoundBack />
				</button>
				<button
					onClick={() => navigate('/addpost')}
					className="flex items-center ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
				>
					<MdOutlineDashboardCustomize className="mr-2 text-lg" />
					Create <span className="lg:block hidden">Template</span>
				</button>
				<div className="relative group ml-auto">
					<button
						className="flex items-center gap-1 py-1.5 px-4 border-2 rounded-md transition-all duration-300 ease-in-out text-blue-600 border-blue-600 hover:text-white hover:bg-blue-600 hover:border-transparent"
					>
						<FaFilter className="mr-2" />
						Filter
					</button>
					<div className="absolute right-0 hidden group-hover:flex bg-white border border-gray-200 rounded-md shadow-lg z-10 flex-col">
						<ul className="py-1">
							<li
								className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
								onClick={() => setFilter("all")}
							>
								All
							</li>
							<li
								className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
								onClick={() => setFilter("birthday")}
							>
								Birthday
							</li>
							<li
								className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
								onClick={() => setFilter("anniversary")}
							>
								Anniversary
							</li>
							<li
								className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
								onClick={() => setFilter("occasion")}
							>
								Occasion
							</li>
							<li
								className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
								onClick={() => setFilter("event")}
							>
								Event
							</li>
						</ul>
					</div>
				</div>
			</div>
			<ConfirmationPopup
				isOpen={confirmPopup}
				onClose={() => setConfirmPopup(false)}
				onConfirm={() => {
					removeTemplate();
					return false
				}}
				content={"Are you sure you want to delete this Template? This action cannot be undone."}
			/>

			{isLoading ?
				<div className="relative py-24">
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="rotating-circles">
							<div></div>
							<div></div>
							<div></div>
						</div>
					</div>
				</div> :
				<div className="lg:columns-3 columns-1 gap-6">
					{filteredData.map((item, index) => (
						<div key={index} className="text-center mb-6">
							<div className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg">
								<img
									src={globalPostImages[item.type] || item.image}
									alt={item.postName}
									className="w-full h-full object-cover"
								/>
								<div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex flex-col gap-4 items-center justify-center transition-opacity">
									<p className="text-white text-center px-4">{item.description}</p>
									{!item.isGlobal && (<button
										className="flex items-center p-1.5 rounded-md transition-all duration-300 ease-in-out bg-red-600 text-white hover:bg-red-800"
										title="Delete template"
										onClick={() => handleDeleteTemplate(item.tempId)}
									>
										<FaTrashAlt className="mr-2" /> Delete
									</button>)}
								</div>
								{item.isGlobal && (
									<IoStar
										className="absolute top-4 right-4 bg-white rounded-lg p-1.5 text-yellow-400 text-3xl"
										title="Preset Posts"
									/>
								)}
								<h3 className="text-base font-semibold my-3">{item.postName}</h3>
							</div>
						</div>
					))}
				</div>
			}
		</div>
	);
};

export default TemplateDashboard;
