import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsEnvelope } from "react-icons/bs";
import { FaUpload, FaRedo } from "react-icons/fa";
import { GiBigDiamondRing } from "react-icons/gi";
import { IoMdArrowRoundBack } from "react-icons/io";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { MdOutlineEventNote, MdOutlineTempleHindu } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AddPost = () => {
	const navigate = useNavigate();
	const [postName, setPostName] = useState("");
	const [media, setMedia] = useState(null);
	const [postDescription, setPostDescription] = useState("");
	const [loading, setLoading] = useState(false);
	const [type, setType] = useState();
	const [showPopup, setShowPopup] = useState(false);

	const postTypes = [
		{
			id: "birthday",
			name: "Birthday",
			icon: <LiaBirthdayCakeSolid />,
			bgColor: "bg-pink-500",
		},
		{
			id: "occasion",
			name: "Occasion",
			icon: <BsEnvelope />,
			bgColor: "bg-purple-500",
		},
		{
			id: "anniversary",
			name: "Anniversary",
			icon: <GiBigDiamondRing />,
			bgColor: "bg-yellow-500",
		},
		{
			id: "event",
			name: "Event",
			icon: <MdOutlineEventNote />,
			bgColor: "bg-green-500",
		},
		{
			id: "temple",
			name: "Temple",
			icon: <MdOutlineTempleHindu />,
			bgColor: "bg-blue-500",
		},
	];

	const handleSelect = (type) => {
		setType(type);
		sessionStorage.setItem("activeComponent", type);
		setShowPopup(false);
	};

	useEffect(() => {
		setShowPopup(true);
	}, []);

	const handleMediaUpload = (file) => {
		setMedia({ file, type: file.type.startsWith("video") ? "video" : "image" });
	};

	const handleSubmit = async () => {
		setLoading(true)
		const formData = new FormData();
		formData.append("postName", postName);
		formData.append("postDescription", postDescription);
		formData.append("type", type);
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

			console.log("Template created successfully:", response.data._id);
			toast.success('Template created successfully', {
				position: 'top-center',
				autoClose: 3000,
				theme: "colored",
				onClose: navigate(-1)
			})
		} catch (error) {
			console.error("Error in Creating Template:", error);
			toast.error(error.response.data.error, {
				position: 'top-center',
				theme: "colored"
			})
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="lg:mx-48 lg:px-16 px-10 py-10 bg-[#f5f5f5] relative">
			{showPopup &&
				<div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-8 rounded-lg shadow-lg lg:w-1/2 w-4/5">
						<h2 className="lg:text-2xl text-lg font-bold text-center mb-6 text-gray-800">
							Select Post Type
						</h2>
						<div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
							{postTypes.map((post) => (
								<button
									key={post.id}
									className="flex items-center gap-4 p-2 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 rounded-full shadow-md text-gray-800"
									onClick={() => handleSelect(post.id)}
								>
									<div
										className={`text-2xl p-3 self-start flex items-center justify-center rounded-full text-white ${post.bgColor}`}
									>
										{post.icon}
									</div>
									<span className="lg:font-semibold">{post.name}</span>
								</button>
							))}
						</div>
					</div>
				</div>
			}
			{/* Title Input */}
			<button
				onClick={() => navigate(-1)}
				className=" absolute lg:left-[-3rem] left-[1rem] top-4 flex items-center p-1 text-xl border-2 rounded-full transition-all duration-300 ease-in-out text-gray-600 border-gray-600 hover:text-white hover:bg-gray-600 hover:border-transparent"
			>
				<IoMdArrowRoundBack />
			</button>
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
							<img src={URL.createObjectURL(media.file)} alt="Uploaded" className="w-64 lg:w-auto h-auto lg:h-80 rounded shadow" />
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
					placeholder="Enter your text"
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
