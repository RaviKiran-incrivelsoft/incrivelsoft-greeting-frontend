import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function TempleGreetings({ campaignId, closeModal }) {
	const [formData, setFormData] = useState({
		templeName: "",
		templeTitle: "",
		address: "",
		taxId: "",
		phone: "",
		fax: "",
		templeDescription: "",
		websiteUrl: "",
		facebookUrl: "",
		twitterUrl: "",
		instagramUrl: "",
		paypalQrCode: null,
		zelleQrCode: null,
		csvUser: null,
	});

	const handleFileChange = (field) => (e) => {
		setFormData((prevData) => ({
			...prevData,
			[field]: e.target.files[0],
		}));
	};

	const handleInputChange = (field) => (e) => {
		setFormData((prevData) => ({
			...prevData,
			[field]: e.target.value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formDataToSubmit = new FormData();

		for (const key in formData) {
			if (formData[key]) {
				if (formData[key] instanceof File) {
					formDataToSubmit.append(key, formData[key]);
				} else {
					formDataToSubmit.append(key, formData[key]);
				}
			}
		}

		try {
			const token = localStorage.getItem("token");

			const response = await axios.post(
				`${backendUrl}/temple?campaign=${campaignId}`,
				formDataToSubmit,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			toast.success('Temple Details added', {
				position: 'top-center',
				theme: "colored" 
			})
			console.log("Form submitted successfully:", response.data);
			closeModal();
		} catch (error) {
			console.error("Error submitting form:", error);
			const errorMessage = error.response?.data?.error || "Failed to submit form";
			toast.error(errorMessage, {
				position: 'top-center',
				theme: "colored" 
			})
		}
	};

	return (
		<div
			className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center"
			onClick={closeModal}
		>
			<div
				className="bg-white p-6 rounded-lg w-2/3"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="text-xl font-bold text-center mb-5">Temple Information</div>
				<div className="container mx-auto px-4">
					<form onSubmit={handleSubmit}>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
							<div className="form-group">
								<label className="block text-sm text-gray-700 font-semibold mb-2">Temple Title</label>
								<input
									type="text"
									value={formData.templeTitle}
									onChange={handleInputChange('templeTitle')}
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
									required
								/>
							</div>
							<div className="form-group">
								<label className="block text-sm text-gray-700 font-semibold mb-2">Temple Name</label>
								<input
									type="text"
									value={formData.templeName}
									onChange={handleInputChange('templeName')}
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
									required
								/>
							</div>
							<div className="form-group">
								<label className="block text-sm text-gray-700 font-semibold mb-2">Temple Address</label>
								<input
									type="text"
									value={formData.address}
									onChange={handleInputChange('address')}
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
									required
								/>
							</div>
							<div className="form-group">
								<label className="block text-sm text-gray-700 font-semibold mb-2">Temple Tax ID</label>
								<input
									type="text"
									value={formData.taxId}
									onChange={handleInputChange('taxId')}
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
									required
								/>
							</div>
							<div className="form-group">
								<label className="block text-sm text-gray-700 font-semibold mb-2">Temple Phone</label>
								<input
									type="number"
									value={formData.phone}
									onChange={handleInputChange('phone')}
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
									required
								/>
							</div>
							<div className="form-group">
								<label className="block text-sm text-gray-700 font-semibold mb-2">Fax</label>
								<input
									type="text"
									value={formData.fax}
									onChange={handleInputChange("fax")}
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm bg-gray-50 py-1 px-2"
								/>
							</div>
							<div className="form-group">
								<label className="block text-sm text-gray-700 font-semibold mb-2">Temple Description</label>
								<input
									type="text"
									value={formData.templeDescription}
									onChange={handleInputChange("templeDescription")}
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm bg-gray-50 py-1 px-2"
									rows="4"
								/>
							</div>
							<div className="form-group">
								<label className="block text-sm text-gray-700 font-semibold mb-2">Temple Website URL</label>
								<input
									type="text"
									value={formData.websiteUrl}
									onChange={handleInputChange('websiteUrl')}
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
									required
								/>
							</div>
							<div className="form-group">
								<label className="block text-sm text-gray-700 font-semibold mb-2">Facebook URL</label>
								<input
									type="text"
									value={formData.facebookUrl}
									onChange={handleInputChange('facebookUrl')}
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
									required
								/>
							</div>
							<div className="form-group">
								<label className="block text-sm text-gray-700 font-semibold mb-2">Twitter URL</label>
								<input
									type="text"
									value={formData.twitterUrl}
									onChange={handleInputChange('twitterUrl')}
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
									required
								/>
							</div>
							<div className="form-group">
								<label className="block text-sm text-gray-700 font-semibold mb-2">Instagram URL</label>
								<input
									type="text"
									value={formData.instagramUrl}
									onChange={handleInputChange('instagramUrl')}
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
									required
								/>
							</div>
							<div className="form-group">
								<label className="block text-sm text-gray-700 font-semibold mb-2">PayPal QR Code Image</label>
								<input
									type="file"
									accept="image/*"
									onChange={handleFileChange('paypalQrCode')}
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
									required
								/>
							</div>
							<div className="form-group">
								<label className="block text-sm text-gray-700 font-semibold mb-2">Zelle QR Code Image</label>
								<input
									type="file"
									accept="image/*"
									onChange={handleFileChange('zelleQrCode')}
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
									required
								/>
							</div>
						</div>

						<div className="text-xl font-semibold text-center mt-5">Devotee Information</div>
						<div className="form-group">
							<label className="block text-sm text-gray-700 font-semibold mb-2">CSV File</label>
							<input
								type="file"
								accept=".csv"
								onChange={handleFileChange('csvFile')}
								className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
								required
							/>
						</div>

						<div className="flex justify-center">
							<button
								type="submit"
								className="bg-blue-500 hover:bg-blue-700 text-white rounded-xl w-1/3 mt-5 h-[2.4rem]"
							>
								Next
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default TempleGreetings;
