import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const images = [
	{ _id: "67735e3c713fd1cbbdc063b7", image: "https://res.cloudinary.com/dnl1wajhw/image/upload/v1735634498/Screenshot_2024-12-31_140252_yo7icy.png", title: "Happy Birthday", description: "Celebrate a joyous birthday with this special greeting!" },
	{ _id: "6773642054309c49c245823e", image: "https://res.cloudinary.com/dnl1wajhw/image/upload/v1735634498/Screenshot_2024-12-31_140340_gozefj.png", title: "Festival Greetings", description: "Wishing you a festive season filled with joy and happiness!" },
	{ _id: "67738e0f9f864f3ef31fcd74", image: "https://res.cloudinary.com/dnl1wajhw/image/upload/v1735634497/Screenshot_2024-12-31_140507_s1u7da.png", title: "Marriage Blessings", description: "Wishing you a lifetime of love and happiness together." },
	{ _id: "67738e0f9f864f3ef31fcd74", image: "https://res.cloudinary.com/dnl1wajhw/image/upload/v1735634497/Screenshot_2024-12-31_140427_kfzfam.png", title: "Event Celebration", description: "Join us for a memorable event filled with fun and excitement!" },
	// { _id: 104, image: "https://via.placeholder.com/300", title: "Temple Visit", description: "May your visit to the temple bring peace and blessings." },
	// { _id: 105, image: "https://via.placeholder.com/300", title: "Corporate Greetings", description: "Wishing you success and prosperity in all your business endeavors." },
];


const Template = ({ onSelect, closeModal }) => {
	const navigate = useNavigate();

	const handleSelect = useCallback(
		(id) => {
			console.log(id);
			onSelect(id);
			closeModal();
		},
		[onSelect, closeModal]
	);

	useEffect(() => {
		const id = sessionStorage.getItem('customPostId');
		if (id) {
			handleSelect(id);
			sessionStorage.removeItem('customPostId');
		}
	}, [handleSelect]);

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
					<h2 className="text-2xl font-semibold mb-6 text-center">Select your Template</h2>

					<div className="grid grid-cols-3 gap-x-6 gap-y-4 overflow-y-auto max-h-[70vh] [&::-webkit-scrollbar]:w-0">
						{images.map((item, index) => (
							<div key={index} className="text-center">
								<div onClick={() => handleSelect(item._id)} className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg">
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
			</div>
		</div>
	);
};

export default Template;
