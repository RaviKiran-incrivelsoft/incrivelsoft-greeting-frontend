import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { FaRegEnvelope } from "react-icons/fa";
import Template from "./Template";

const MarriageDetails = ({ fetchGreetings, closeModal }) => {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		csvData: [],
		postDetails: ""
	});

	const [isTemplateSelected, setIsTemplateSelected] = useState(false);

	const handlePostSelect = useCallback(
		(id) => {
			setFormData((prevData) => {
				const updatedData = {
					...prevData,
					postId: id,
				};
				sessionStorage.setItem('formData', JSON.stringify(updatedData));
				return updatedData;
			});
		},
		[]
	);

	useEffect(() => {
		const id = sessionStorage.getItem('customPostId');
		const storedData = sessionStorage.getItem('formData');
		if (storedData) {
			setFormData(JSON.parse(storedData));
		}
		if (id) {
			handlePostSelect(id);
			sessionStorage.removeItem('customPostId');
		}
	}, [handlePostSelect]);

	const handleInputChange = (field) => (e) => {
		setFormData((prevData) => ({
			...prevData,
			[field]: e.target.value,
		}));
		sessionStorage.setItem('formData', JSON.stringify({
			...formData,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const token = localStorage.getItem("token");
			console.log(formData);

			await axios.post(
				`${process.env.REACT_APP_BACKEND_URL}/marriages`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			fetchGreetings();
			sessionStorage.clear();
			toast.success("Marriage details submitted successfully!", {
				position: "top-center",
				theme: "colored",
			});
			closeModal();
		} catch (error) {
			const errorMessage = error.response?.data?.error || "Submission failed.";
			toast.error(errorMessage, {
				position: "top-center",
				theme: "colored",
			});
		} finally {
			setLoading(false);
		}
	};



	return (
		<div
			className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center"
			onClick={closeModal}
		>
			<div
				className="bg-white p-6 rounded-lg w-1/2"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="text-xl font-bold text-center mb-5">Marriage Details</div>
				<form onSubmit={handleSubmit} className="grid grid-cols-3 gap-x-4 gap-y-6 items-start">
					<div className="form-group">
						<label className="block text-sm text-gray-700 font-semibold mb-2">Husband Name</label>
						<input
							type="text"
							value={formData.husbandName}
							onChange={handleInputChange("husbandName")}
							className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
							required
						/>
					</div>
					<div className="form-group">
						<label className="block text-sm text-gray-700 font-semibold mb-2">Wife Name</label>
						<input
							type="text"
							value={formData.wifeName}
							onChange={handleInputChange("wifeName")}
							className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
							required
						/>
					</div>
					<div className="form-group">
						<label className="block text-sm text-gray-700 font-semibold mb-2">Email</label>
						<input
							type="email"
							value={formData.email}
							onChange={handleInputChange("email")}
							className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
							required
						/>
					</div>
					<div className="form-group">
						<label className="block text-sm text-gray-700 font-semibold mb-2">Contact</label>
						<input
							type="text"
							value={formData.contact}
							onChange={handleInputChange("contact")}
							className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
							required
						/>
					</div>
					<div className="form-group">
						<label className="block text-sm text-gray-700 font-semibold mb-2">Marriage Date</label>
						<input
							type="date"
							value={formData.marriageDate}
							onChange={handleInputChange("marriageDate")}
							className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
							required
						/>
					</div>
					<div>
						<button
							className="flex w-full mt-5 items-center text-center justify-around py-1.5 px-4 border-2 rounded-md transition-all duration-300 ease-in-out text-blue-600 border-blue-600 hover:text-white hover:bg-blue-600 hover:border-transparent"
							type="button"
							onClick={() => setIsTemplateSelected(true)}
						>
							<FaRegEnvelope /> Select Template
						</button>
						{/* {formData.postId ? <span className="block text-sm text-green-600">Template Selected</span> : <span className="block text-sm text-red-600">Please Select Template</span>} */}
					</div>

					<div className="flex justify-end mt-2 gap-4">
						<button
							type="button"
							onClick={closeModal}
							className="flex items-center py-1.5 px-4 border-2 rounded-md transition-all duration-300 ease-in-out text-gray-600 border-gray-600 hover:text-white hover:bg-gray-600 hover:border-transparent"
						>
							Close
						</button>
						<button
							type="submit"
							disabled={loading}
							className={`h-10 px-4 rounded text-white ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
						>
							{loading ? "Submitting..." : "Submit"}
						</button>
					</div>
				</form>
				{isTemplateSelected && <Template onSelect={handlePostSelect} closeModal={() => setIsTemplateSelected(false)} />}
			</div>
		</div>
	);
};

export default MarriageDetails;
