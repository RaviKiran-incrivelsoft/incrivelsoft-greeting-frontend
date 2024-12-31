import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaPlay, FaPlus, FaTrash } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import TempleGreetings from '../components/TempleGreetings';
import { toast } from 'react-toastify';


const backendUrl = process.env.REACT_APP_BACKEND_URL;

const CampaignDashboard = () => {
	const navigate = useNavigate();
	const [campaigns, setCampaigns] = useState([]);
	const [mediaUrls, setMediaUrls] = useState({});
	const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
	const [selectedMedia, setSelectedMedia] = useState(null);
	const [showTempleGreetings, setShowTempleGreetings] = useState(false);
	const [selectedCampaignId, setSelectedCampaignId] = useState(null);

	const handleAddDetails = (campaignId) => {
		setSelectedCampaignId(campaignId);
		setShowTempleGreetings(true);
	};
	const options = {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	};

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
				toast.error('Failed to fetch campaigns', {
					position: 'top-center',
					theme: "colored"
				})
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
				toast.success('Campaign Deleted', {
					position: 'top-center',
					theme: "colored"
				})
			})
			.catch(error => {
				console.error('Error deleting campaign:', error);
				toast.error('Failed to Delete', {
					position: 'top-center',
					theme: "colored"
				})
			});
	};

	return (
		<div className="py-10 px-32 bg-gray-100 min-h-screen">
			<div className="mb-8 text-center">
				<h2 className="text-3xl font-semibold text-gray-800">Campaign Dashboard</h2>
			</div>

			<div className="mb-4 flex items-center">
				<button
					onClick={() => navigate('/addpost')}
					className="flex items-center mr-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
				>
					<FaPlus className="mr-2" />
					Add Campaign
				</button>
				<button
					onClick={() => {
						navigate('/schedule')
					}}
					className="flex items-center py-1.5 px-4 border-2 rounded-md transition-all duration-300 ease-in-out text-blue-600 border-blue-600 hover:text-white hover:bg-blue-600 hover:border-transparent"
				>
					<FaCalendarAlt className="mr-2" />
					Schedule
				</button>
			</div>

			<div className="overflow-x-auto shadow-md rounded-lg">
				<table className="w-full bg-white">
					<thead>
						<tr className="border-b bg-gray-200 text-gray-600 uppercase text-sm">
							<th className="py-4 px-6 text-center">Media</th>
							<th className="py-4 px-6 text-center">Status</th>
							<th className="py-4 px-6 text-center">Created At</th>
							<th className="py-4 px-6 text-center">Actions</th>
						</tr>
					</thead>
					<tbody className="text-gray-700">
						{campaigns.length === 0 ? (
							<tr>
							<td colSpan="4" className="py-12 text-center text-sm text-gray-500">
								<div className="flex flex-col items-center justify-center space-y-4">
									<svg
										className="w-12 h-12 text-gray-300"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<circle cx="12" cy="12" r="10"></circle>
										<path d="M12 6v6l4 2"></path>
									</svg>
									<p className='font-semibold text-lg text-gray-400'>No Campaigns available</p>
								</div>
							</td>
						</tr>
						) : (campaigns.map((campaign) => (
							<tr key={campaign._id} className="border-b border-gray-200 hover:bg-gray-100">
								<td className="py-4">
									<div className="flex items-center justify-center">
										{mediaUrls[campaign._id]?.mediaUrl ? (
											mediaUrls[campaign._id].mediaUrl.endsWith(".mp4") ? (
												<video width="100" className="w-36 h-24 object-cover rounded">
													<source src={mediaUrls[campaign._id].mediaUrl} type="video/mp4" onError={(e) => e.target.src = "error.mp4"} />
												</video>
											) : (
												<img
													src={mediaUrls[campaign._id].mediaUrl}
													alt="Media"
													className="w-36 h-24 object-cover rounded"
													onError={(e) => e.target.src = "https://placehold.co/300/ddd/white?text=Error"}
												/>
											)
										) : (
											"Loading..."
										)}
									</div>
								</td>

								<td className="py-4 px-6 text-center">
									<span className="inline-block bg-yellow-100 text-yellow-700 py-1 px-3 rounded-full">
										{campaign.status || "Pending"}
									</span>
								</td>

								<td className="py-4 px-6 text-center">{new Date(campaign.createdAt).toLocaleString('en-GB', options)}</td>

								<td className="py-4 px-6 text-center">
									<div className="flex justify-center space-x-4">
										<>
											<button
												onClick={() => handlePlay(campaign.mediaURL)}
												className="flex items-center text-green-600 hover:text-white hover:bg-green-600 hover:border-transparent py-2 px-4 border-2 border-green-600 rounded-md transition-all duration-300 ease-in-out"
												title="Play"
											>
												<FaPlay className="mr-2" /> Play
											</button>
											<button
												onClick={() => handleAddDetails(campaign._id)}
												className="flex items-center text-blue-600 hover:text-white hover:bg-blue-600 hover:border-transparent py-2 px-4 border-2 border-blue-600 rounded-md transition-all duration-300 ease-in-out"
												title="Add Details"
											>
												<FaPlus className="mr-2" />Add Temple Details
											</button>
											<button
												onClick={() => handleDeleteCampaign(campaign._id)}
												className="text-red-600 hover:text-white hover:bg-red-600 hover:border-transparent py-2 px-4 border-2 border-red-600 rounded-md transition-all duration-300 ease-in-out"
												title="Delete"
											>
												<FaTrash />
											</button>
										</>
									</div>
								</td>
							</tr>
						)))}
					</tbody>
				</table>
			</div>

			{showTempleGreetings && selectedCampaignId && (
				<TempleGreetings campaignId={selectedCampaignId} closeModal={() => setShowTempleGreetings(false)} />
			)}

			{isMediaModalOpen && selectedMedia && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="relative max-w-[600px] max-h-[600px] bg-white p-1 rounded shadow">
						<IoClose
							onClick={handleCloseMediaModal}
							className="absolute top-2 right-2 z-10 cursor-pointer bg-red-500 text-white text-xl rounded"
						/>
						{selectedMedia.mediaUrl.endsWith(".mp4") ? (
							<video autoPlay controls className="w-full h-auto">
								<source src={selectedMedia.mediaUrl} type="video/mp4" onError={(e) => e.target.src = "https://placehold.co/300/aaa/white?text=Error"} />
							</video>
						) : (
							<img src={selectedMedia.mediaUrl} alt="Media"
								onError={(e) => e.target.src = "https://placehold.co/600x400/aaa/white?text=Failed+to+load+the+Image"}
							/>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default CampaignDashboard;
