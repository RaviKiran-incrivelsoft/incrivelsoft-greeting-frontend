import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const globalPostImages = {
	occasion: "https://res.cloudinary.com/dnl1wajhw/image/upload/v1735634498/Screenshot_2024-12-31_140252_yo7icy.png",
	anniversary: "https://res.cloudinary.com/dnl1wajhw/image/upload/v1735634498/Screenshot_2024-12-31_140340_gozefj.png",
	birthday: "https://res.cloudinary.com/dnl1wajhw/image/upload/v1735634497/Screenshot_2024-12-31_140507_s1u7da.png",
	event: "https://res.cloudinary.com/dnl1wajhw/image/upload/v1735634497/Screenshot_2024-12-31_140427_kfzfam.png",
};

const Template = ({ onSelect, closeModal }) => {
	const [images, setImages] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

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
			const activeComponent = sessionStorage.getItem("activeComponent");
			const response = await axios.get(
				`${backendUrl}/post`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const filteredPosts = response.data.posts.filter(
				(post) =>
					post.type === activeComponent && (post.isGlobal || post.userId)
			);
			setImages(filteredPosts);
		} catch (error) {
			console.log(error);
			toast.error(error.response.data.error || "Failed to fetch posts", {
				position: "top-center",
				theme: "colored",
			});
		} finally {
			setIsLoading(false);
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

					<div className="grid grid-cols-3 gap-x-6 gap-y-4 justify-center overflow-y-auto max-h-[70vh] [&::-webkit-scrollbar]:w-0">
						{isLoading ? (
							<div className="relative py-24 col-span-3">
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="rotating-circles">
										<div></div>
										<div></div>
										<div></div>
									</div>
								</div>
							</div>
						) : (
							<>
								{images.map((item, index) => (
									<div key={index} className="text-center">
										<div onClick={() => handleSelect(item._id)} className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg">
											<img
												src={
													item.isGlobal
														? globalPostImages[item.type] || item.mediaURL
														: item.mediaURL
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
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Template;
