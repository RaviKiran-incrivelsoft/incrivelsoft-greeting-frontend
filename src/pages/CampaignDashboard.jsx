import React, { useEffect, useState } from "react";
import { FaPlay, FaEdit, FaCalendarAlt, FaTrash, FaPlus } from "react-icons/fa";
import AddCampaign from "../components/AddCampaign";
import DeliverySettings from "../components/DeliverySettings";
import axios from "axios";
import { IoClose } from "react-icons/io5";

const CampaignDashboard = () => {

	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [campaigns, setCampaigns] = useState([]);
	const [mediaUrls, setMediaUrls] = useState({});
	const [campaignStatuses, setCampaignStatuses] = useState({});
	const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
	const [selectedMedia, setSelectedMedia] = useState(null);
	const [selectedSchedule, setSelectedSchedule] = useState(null);

	const fetchCampaigns = async () => {
		try {
			const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/campaigns`);
			if (response.data) {
				setCampaigns(response.data);
				console.log(response.data);

				response.data.forEach((campaign) => {
					fetchMediaUrls(campaign.campaignId);
					fetchCampaignStatus(campaign.campaignId);
				});
			}
		} catch (error) {
			console.error("Error fetching campaigns:", error);
		}
	};
	useEffect(() => {
		fetchCampaigns();
	}, []);

	const fetchMediaUrls = async (campaignId) => {
		try {
			const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/cloudinaryurls/${campaignId}`);
			setMediaUrls((prev) => ({
				...prev,
				[campaignId]: response.data,
			}));
		} catch (error) {
			console.error("Error fetching media URLs:", error);
		}
	};

	const fetchCampaignStatus = async (campaignId) => {
		try {
			const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/campaigns/${campaignId}`);
			const { scheduleDate, scheduleTime, status } = response.data;
			setCampaignStatuses((prev) => ({
				...prev,
				[campaignId]: { scheduleDate, scheduleTime, status },
			}));
			console.log(response.data);
			
		} catch (error) {
			console.error("Error fetching campaign status:", error);
		}
	};

	const handleOpenPopup = () => setIsPopupOpen(true);
	const handleClosePopup = () => setIsPopupOpen(false);

	const handleDelete = async (id) => {
		try {
			await axios.delete(`http://localhost:3001/api/deletecampaign/${id}`);
			setCampaigns((prev) => prev.filter((campaign) => campaign.id !== id));
			fetchCampaigns();
		} catch (error) {
			console.error("Error deleting campaign:", error);
		}
	};

	const handlePlay = (campaignId) => {
		setSelectedMedia(mediaUrls[campaignId]);
		setIsMediaModalOpen(true);
	};

	const handleSchedule = (campaignId) => {
		setSelectedSchedule(campaignId);
	};

	const handleEdit = (campaignId) => {
		// Implement edit functionality
		console.log(`Edit campaign ${campaignId}`);
	};

	return (
		<div className="py-10 px-32 bg-gray-100 min-h-screen">
			{/* Title */}
			<div className="mb-8 text-center">
				<h2 className="text-3xl font-bold text-gray-800">Campaign Dashboard</h2>
				<p className="text-gray-600 pt-6">Manage Your Campaigns</p>
			</div>

			{/* Add Campaign Button */}
			<div className="mb-4 flex justify-between items-center">
				<button
					onClick={handleOpenPopup}
					className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
				>
					<FaPlus className="mr-2" />
					Add Campaign
				</button>
			</div>

			<AddCampaign isOpen={isPopupOpen} onClose={handleClosePopup} />
			{/* Table */}
			<div className="overflow-x-auto">
				<table className="w-full bg-white shadow-lg rounded-lg">
					<thead>
						<tr className="bg-gray-200 text-gray-600 uppercase text-sm">
							<th className="py-4 px-6 text-left">Media</th>
							<th className="py-4 px-6 text-left">Status</th>
							<th className="py-4 px-6 text-left">Created At</th>
							<th className="py-4 px-6 text-center">Actions</th>
						</tr>
					</thead>
					<tbody className="text-gray-700 text-sm">
						{campaigns.map((campaign) => (
							<tr
								key={campaign.id}
								className="border-b border-gray-200 hover:bg-gray-100"
							>
								{/* Media */}
								<td className="py-4 px-6">
									<div className="flex items-center">
										{mediaUrls[campaign.campaignId]?.mediaUrl ? (
											mediaUrls[campaign.campaignId].mediaUrl.endsWith(".mp4") ? (
												<video width="100" className="w-24 h-24 object-cover rounded">
													<source src={mediaUrls[campaign.campaignId].mediaUrl} type="video/mp4" />
												</video>
											) : (
												<img
													src={mediaUrls[campaign.campaignId].mediaUrl}
													alt="Media"
													className="w-24 h-24 object-cover rounded"
												/>
											)
										) : (
											"Loading..."
										)}
									</div>
								</td>

								{/* Status */}
								<td className="py-4 px-6">
									<span className="inline-block bg-yellow-100 text-yellow-700 py-1 px-3 rounded-full text-xs">
										{campaign.status || "Pending"}
									</span>
								</td>

								{/* Created At */}
								<td className="py-4 px-6">{new Date(campaign.createdAt).toLocaleString()}</td>

								{/* Actions */}
								<td className="py-4 px-6 text-center">
									<div className="flex justify-center space-x-4">
										<button
											className="text-green-600 hover:text-green-800"
											title="Play"
											onClick={() => handlePlay(campaign.campaignId)}
										>
											<FaPlay />
										</button>
										<button
											className="text-blue-600 hover:text-blue-800"
											title="Edit"
											onClick={() => handleEdit(campaign.campaignId)}
										>
											<FaEdit />
										</button>
										<button
											className="text-yellow-600 hover:text-yellow-800"
											title="Schedule"
											onClick={() => handleSchedule(campaign.campaignId)}
										>
											<FaCalendarAlt />
										</button>
										<button
											className="text-red-600 hover:text-red-800"
											title="Delete"
											onClick={() => handleDelete(campaign.campaignId)}
										>
											<FaTrash />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{selectedSchedule && (
				<DeliverySettings
					campaignId={selectedSchedule}
					onClose={() => setSelectedSchedule(null)}
					setCampaignStatus={setCampaignStatuses}
				/>
			)}

			{/* Media Modal */}
			{isMediaModalOpen && selectedMedia && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="relative max-w-[800px] max-h-[600px] bg-white p-1 rounded shadow">
						<IoClose
							onClick={() => setIsMediaModalOpen(false)}
							className="absolute top-2 right-2 z-10 cursor-pointer bg-red-500 text-white text-xl rounded"
						/>
						{selectedMedia.mediaUrl.endsWith(".mp4") ? (
							<video autoPlay controls className="w-full h-auto">
								<source src={selectedMedia.mediaUrl} type="video/mp4" />
							</video>
						) : (
							<img src={selectedMedia.mediaUrl} alt="Media" width={"500px"}/>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default CampaignDashboard;
