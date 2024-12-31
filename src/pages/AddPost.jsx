import axios from "axios";
import React, { useState } from "react";
import { FaUpload, FaRedo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AddPost = () => {
	const navigate = useNavigate();
	const [postName, setPostName] = useState("");
	const [media, setMedia] = useState(null);
	const [postDescription, setPostDescription] = useState("");
	const [loading, setLoading] = useState(false);

	const handleMediaUpload = (file) => {
		setMedia({ file, type: file.type.startsWith("video") ? "video" : "image" });
	};

	const handleSubmit = async () => {
		setLoading(true)
		const formData = new FormData();
		formData.append("postName", postName);
		formData.append("postDescription", postDescription);
		if (media) {
			formData.append("media", media.file);
		}

		try {
			const token = localStorage.getItem("token");

			const response = await axios.post(
				`${backendUrl}/post`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			console.log("Campaign created successfully:", response.data._id);
			toast.success('Campaign created successfully', {
				position: 'top-center',
				autoClose: 3000,
				theme: "colored",
				onClose: () => {
					sessionStorage.setItem('customPostId', response.data._id);
					navigate(-1);
				}
			})
		} catch (error) {
			console.error("Error in submitting campaign:", error);
			toast.error('Failed to create campaign', {
				position: 'top-center',
				theme: "colored"
			})
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="mx-48 px-16 py-6 bg-[#f5f5f5]">
			{/* Title Input */}
			<div className="mb-4">
				<input
					type="text"
					placeholder="Add Title"
					value={postName}
					onChange={(e) => setPostName(e.target.value)}
					className="w-full px-3 py-2 text-2xl font-semibold outline-none placeholder-gray-400 bg-[#f5f5f5]"
				/>
			</div>

			{/* Media Upload */}
			<div className="mb-4 flex justify-center relative">
				{media ? (
					<div className="relative">
						{media.type === "image" ? (
							<img src={URL.createObjectURL(media.file)} alt="Uploaded" className="w-auto h-72 rounded shadow" />
						) : (
							<video controls src={URL.createObjectURL(media.file)} className="w-auto h-72 rounded shadow"></video>
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
					value={postDescription}
					onChange={(e) => setPostDescription(e.target.value)}
					className="w-full px-3 py-2 text-gray-700 outline-none placeholder-gray-400 bg-[#f5f5f5] resize-none"
					rows={4}
				></textarea>
			</div>

			{/* Submit Button */}
			<div className="flex justify-center">
				<button
					type="submit"
					disabled={loading}
					onClick={handleSubmit}
					className={`h-10 flex items-center justify-center px-4 rounded shadow text-white ${loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
				>
					{loading ? (
						<div className="flex space-x-1">
							<span className="dot bg-white"></span>
							<span className="dot bg-white"></span>
							<span className="dot bg-white"></span>
						</div>
					) : (
						"Submit Post"
					)}
				</button>
			</div>
		</div>
	);
};

export default AddPost;
