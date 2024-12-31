import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const backendUrl = process.env.REACT_APP_BACKEND_URL;



const Template = ({ onSelect, closeModal }) => {
	const navigate = useNavigate();
	const [images, setImages] = useState([]);

	const handleSelect = useCallback(
		(id) => {
			console.log(id);
			onSelect(id);
			closeModal();
		},
		[onSelect, closeModal]
	);

	const fetchPosts = async () => {
		try {
			const token = localStorage.getItem("token");
			const response = await axios.get(
				`${backendUrl}/post`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setImages(response.data.posts)
		} catch (error) {
			console.log(error);
			toast.error(error.response.data.error, {
				position: "top-center",
				theme: "colored",
			});
		}
	}

	useEffect(() => {
		const id = sessionStorage.getItem('customPostId');
		if (id) {
			handleSelect(id);
			sessionStorage.removeItem('customPostId');
		}
	}, [handleSelect]);

	useEffect(() => {
		fetchPosts();
	}, [])

	return (
		<div className="p-4">
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
				<div className="bg-white rounded-lg w-3/4 p-6 relative ">
					<button
						onClick={closeModal}
						className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
					>
						✕
					</button>
					<h2 className="text-2xl font-semibold mb-6 text-center">Select your Post</h2>

					<div className="grid grid-cols-3 gap-x-6 gap-y-4 overflow-y-auto max-h-[70vh] [&::-webkit-scrollbar]:w-0">
						{images.map((item, index) => (
							<div key={index} className="text-center">
								<div onClick={() => handleSelect(item._id)} className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg">
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
							onClick={() => navigate('/addpost')}
							className="w-72 h-72 cursor-pointer bg-white shadow-md rounded-lg border-dashed border-2 border-blue-500 flex flex-col justify-center items-center relative"
						>
							<div className="flex items-center justify-center w-14 h-14 bg-blue-500 text-white rounded-full text-4xl pb-2 font-bold">
								+
							</div>
							<p className="mt-4 text-blue-500 font-medium">Add Post</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Template;
