import React, { useState } from "react";
import { FaUpload, FaRedo } from "react-icons/fa";

const AddPost = () => {
	const [title, setTitle] = useState("");
	const [media, setMedia] = useState(null);
	const [paragraph, setParagraph] = useState("");

	const handleMediaUpload = (file) => {
		const reader = new FileReader();
		reader.onload = () => setMedia({ type: file.type.startsWith("video") ? "video" : "image", url: reader.result });
		reader.readAsDataURL(file);
	};

	const handleSubmit = async () => {
		const formData = new FormData();

		try {
			formData.append('userMedia', media);
			formData.append('userDescription', paragraph);

			const campaignResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/create_campaign`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					campaignName: title,
					campaignDescription: paragraph,
					createdAt: new Date().toISOString(),
					id: Date.now(),
				}),
			});

			console.log('Campaign response status:', campaignResponse.status);
			if (!campaignResponse.ok) {
				const errorResponse = await campaignResponse.text();
				console.log('Error response from campaign API:', errorResponse);
				throw new Error('Failed to create campaign.');
			}

			const uploadEndpoint = `${process.env.REACT_APP_BACKEND_URL}/api/addpost`;
			const uploadResponse = await fetch(uploadEndpoint, {
				method: 'POST',
				body: formData,
			});
			console.log(media);
			

			console.log('Media upload response status:', uploadResponse.status);
			if (uploadResponse.ok) {
				const data = await uploadResponse.json();
				console.log('Response data:', data);
			} else {
				const uploadErrorResponse = await uploadResponse.text();
				console.log('Error response from media upload API:', uploadErrorResponse);
				throw new Error('Failed to submit post.');
			}

			window.history.pushState({}, '', `/dashboard?userDescription=${encodeURIComponent(paragraph)}`);
		} catch (error) {
			console.error('Error:', error);
		}
	};


	return (
		<div className="mx-48 px-16 py-6 bg-[#f5f5f5]">
			{/* Title Input */}
			<div className="mb-4">
				<input
					type="text"
					placeholder="Add Title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="w-full px-3 py-2 text-2xl font-semibold outline-none placeholder-gray-400 bg-[#f5f5f5]"
				/>
			</div>

			{/* Media Upload */}
			<div className="mb-4 flex justify-center relative">
				{media ? (
					<div className="relative">
						{media.type === "image" ? (
							<img src={media.url} alt="Uploaded" className="w-auto h-72 rounded shadow" />
						) : (
							<video controls src={media.url} className="w-auto h-72 rounded shadow"></video>
						)}
						<label className="absolute top-2 right-2 p-2 bg-white text-gray-700 rounded-full shadow hover:bg-gray-100 cursor-pointer">
							<input
								type="file"
								accept="image/*,video/*"
								onChange={(e) => handleMediaUpload(e.target.files[0])}
								className="hidden"
							/>
							<FaRedo />
						</label>
					</div>
				) : (
					<label className="flex items-center justify-center w-full h-40 bg-gray-100 border-dashed border-2 border-gray-400 rounded cursor-pointer">
						<input
							type="file"
							accept="image/*,video/*"
							onChange={(e) => handleMediaUpload(e.target.files[0])}
							className="hidden"
						/>
						<div className="flex flex-col items-center text-gray-500">
							<FaUpload className="text-4xl mb-2" />
							<span>Click to upload an image or video</span>
						</div>
					</label>
				)}
			</div>

			{/* Paragraph Input */}
			<div className="mb-4">
				<textarea
					placeholder="Enter paragraph"
					value={paragraph}
					onChange={(e) => setParagraph(e.target.value)}
					className="w-full px-3 py-2 text-gray-700 outline-none placeholder-gray-400 bg-[#f5f5f5] resize-none"
					rows={4}
				></textarea>
			</div>

			{/* Submit Button */}
			<div className="flex justify-center">
				<button
					onClick={handleSubmit}
					className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
				>
					Submit Post
				</button>
			</div>
		</div>
	);
};

export default AddPost;
