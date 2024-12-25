import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlay, FaEdit, FaCalendarAlt, FaTrash, FaPlus } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';


const backendUrl = process.env.REACT_APP_BACKEND_URL;

const CampaignDashboard = () => {
	const navigate = useNavigate();
	const [campaigns, setCampaigns] = useState([]);
	const [mediaUrls, setMediaUrls] = useState({});
	const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
	const [selectedMedia, setSelectedMedia] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem("token");

		axios.get(`${backendUrl}/campaigns`, { headers: { Authorization: `Bearer ${token}` } })
			.then(response => {
				setCampaigns(response.data.campaigns);

				const mediaUrls = response.data.campaigns.reduce((acc, campaign) => {
					acc[campaign._id] = { mediaUrl: campaign.mediaURL };
					return acc;
				}, {});
				setMediaUrls(mediaUrls);
			})
			.catch(error => {
				console.error('Error fetching campaigns:', error);
			});
	}, []);

	const handlePlay = (mediaUrl) => {
		setSelectedMedia({ mediaUrl });
		setIsMediaModalOpen(true);
	};

	const handleCloseMediaModal = () => setIsMediaModalOpen(false);

	const handleDeleteCampaign = (id) => {
		const token = localStorage.getItem("token");
		axios.delete(`${backendUrl}/campaigns/${id}`, { headers: { Authorization: `Bearer ${token}` } })
			.then(response => {
				setCampaigns(campaigns.filter(campaign => campaign._id !== id));
			})
			.catch(error => {
				console.error('Error deleting campaign:', error);
			});
	};

	const handleEditCampaign = (id) => {
		console.log('Edit campaign', id);
	};

	const handleScheduleCampaign = (id) => {
		console.log('Schedule campaign', id);
	};

	return (
		<div className="py-10 px-32 bg-gray-100 min-h-screen">
			<div className="mb-8 text-center">
				<h2 className="text-3xl font-bold text-gray-800">Campaign Dashboard</h2>
				<p className="text-gray-600 pt-6">Manage Your Campaigns</p>
			</div>

			<div className="mb-4 flex justify-between items-center">
				<button
					onClick={() => navigate('/addpost')}
					className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
				>
					<FaPlus className="mr-2" />
					Add Campaign
				</button>
			</div>

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
							<tr key={campaign._id} className="border-b border-gray-200 hover:bg-gray-100">
								<td className="py-4 px-6">
									<div className="flex items-center">
										{mediaUrls[campaign._id]?.mediaUrl ? (
											mediaUrls[campaign._id].mediaUrl.endsWith(".mp4") ? (
												<video width="100" className="w-24 h-24 object-cover rounded">
													<source src={mediaUrls[campaign._id].mediaUrl} type="video/mp4" />
												</video>
											) : (
												<img
													src={mediaUrls[campaign._id].mediaUrl}
													alt="Media"
													className="w-24 h-24 object-cover rounded"
												/>
											)
										) : (
											"Loading..."
										)}
									</div>
								</td>

								<td className="py-4 px-6">
									<span className="inline-block bg-yellow-100 text-yellow-700 py-1 px-3 rounded-full text-xs">
										{campaign.status || "Pending"}
									</span>
								</td>

								<td className="py-4 px-6">{new Date(campaign.createdAt).toLocaleString()}</td>

								<td className="py-4 px-6 text-center">
									<div className="flex justify-center space-x-4">
										{campaign.status !== 'active' ?
											<>
												<button
													onClick={() => handlePlay(campaign.mediaURL)}
													className="text-green-600 hover:text-green-800"
													title="Play"
												>
													<FaPlay />
												</button>
												<button
													onClick={() => handleEditCampaign(campaign._id)}
													className="text-blue-600 hover:text-blue-800"
													title="Edit"
												>
													<FaEdit />
												</button>
												<button
													onClick={() => handleScheduleCampaign(campaign._id)}
													className="text-yellow-600 hover:text-yellow-800"
													title="Schedule"
												>
													<FaCalendarAlt />
												</button>
												<button
													onClick={() => handleDeleteCampaign(campaign._id)}
													className="text-red-600 hover:text-red-800"
													title="Delete"
												>
													<FaTrash />
												</button>
											</>
											:
											<>
												<button
													onClick={() => handlePlay(campaign.mediaURL)}
													className="text-green-600 hover:text-white hover:bg-green-600 hover:border-transparent py-2 px-4 border-2 border-green-600 rounded-md transition-all duration-300 ease-in-out"
													title="Play"
												>
													Play
												</button>
												<button
													// onClick={() => handleAddDetails(campaign._id)}
													className="text-blue-600 hover:text-white hover:bg-blue-600 hover:border-transparent py-2 px-4 border-2 border-blue-600 rounded-md transition-all duration-300 ease-in-out"
													title="Add Details"
												>
													Add Details
												</button>
											</>}
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Media Modal */}
			{isMediaModalOpen && selectedMedia && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="relative max-w-[600px] max-h-[600px] bg-white p-1 rounded shadow">
						<IoClose
							onClick={handleCloseMediaModal}
							className="absolute top-2 right-2 z-10 cursor-pointer bg-red-500 text-white text-xl rounded"
						/>
						{selectedMedia.mediaUrl.endsWith(".mp4") ? (
							<video autoPlay controls className="w-full h-auto">
								<source src={selectedMedia.mediaUrl} type="video/mp4" />
							</video>
						) : (
							<img src={selectedMedia.mediaUrl} alt="Media" width={"500px"} />
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default CampaignDashboard;
