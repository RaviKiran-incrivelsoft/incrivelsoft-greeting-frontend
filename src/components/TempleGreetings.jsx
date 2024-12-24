import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate in React Router v6

function TempleGreetings({ sideImage, selectedOption }) {
	const formRef = useRef(null);
	const navigate = useNavigate(); // Updated hook for navigation in React Router v6

	// Consolidate all form fields into a single state object
	const [formData, setFormData] = useState({
		csvFile: null,
		paypalQrCode: null,
		zelleQrCode: null,
		deityImage: null,
		priestImage: null,
		audioFile: null,
		templeBanner: null,
		templename: "",
		templeImage: null,
		address: "",
		taxId: "",
		phone: "",
		fax: "",
		templeTitle: "",
		websiteUrl: "",
		facebookUrl: "",
		twitterUrl: "",
		instagramUrl: "",
	});

	// Handle file and input changes
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

		const formDataObj = new FormData();
		Object.keys(formData).forEach((key) => {
			formDataObj.append(key, formData[key]);
		});

		try {
			const response = await fetch("http://localhost:3001/api/temple-details", {
				method: "POST",
				body: formDataObj,
			});
			const data = await response.json();
			console.log("Server response:", data); // Log the entire response

			// Encode the parameters
			const encodedTitle = encodeURIComponent(formData.templeTitle);
			const encodedImage = encodeURIComponent(sideImage); // Use the fetched image URL

			// Store the title in local storage or handle it as needed
			localStorage.setItem("dashboardTitle", formData.templeTitle);

			// Navigate to the /board page with title and image parameters
			navigate(`/board?selectedOption=${selectedOption}&title=${encodedTitle}&image=${encodedImage}`);
		} catch (error) {
			console.error("Error submitting form:", error);
		}
	};

	return (
		<div className="container mx-auto">
			<div className="text-xl font-bold text-center">Temple Information</div>
			<div className="container mx-auto px-4 py-6">
				<form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="form-group">
							<label className="block text-gray-700 font-bold mb-2">Temple Title</label>
							<input
								type="text"
								value={formData.templeTitle}
								onChange={handleInputChange("templeTitle")}
								className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 p-2.5"
								required
							/>
						</div>
						<div className="form-group">
							<label className="block text-gray-700 font-bold mb-2">Temple Name</label>
							<input
								type="text"
								value={formData.templename}
								onChange={handleInputChange("templename")}
								className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 p-2.5"
								required
							/>
						</div>
						<div className="form-group">
							<label className="block text-gray-700 font-bold mb-2">Temple Address</label>
							<input
								type="text"
								value={formData.address}
								onChange={handleInputChange("address")}
								className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 p-2.5"
								required
							/>
						</div>
						<div className="form-group">
							<label className="block text-gray-700 font-bold mb-2">Temple Tax ID</label>
							<input
								type="text"
								value={formData.taxId}
								onChange={handleInputChange("taxId")}
								className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 p-2.5"
								required
							/>
						</div>
						<div className="form-group">
							<label className="block text-gray-700 font-bold mb-2">Temple Phone</label>
							<input
								type="number"
								value={formData.phone}
								onChange={handleInputChange("phone")}
								className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 p-2.5"
								required
							/>
						</div>
						<div className="form-group">
							<label className="block text-gray-700 font-bold mb-2">Temple Website URL</label>
							<input
								type="text"
								value={formData.websiteUrl}
								onChange={handleInputChange("websiteUrl")}
								className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 p-2.5"
								required
							/>
						</div>
						<div className="form-group">
							<label className="block text-gray-700 font-bold mb-2">Facebook URL</label>
							<input
								type="text"
								value={formData.facebookUrl}
								onChange={handleInputChange("facebookUrl")}
								className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 p-2.5"
								required
							/>
						</div>
						<div className="form-group">
							<label className="block text-gray-700 font-bold mb-2">Twitter URL</label>
							<input
								type="text"
								value={formData.twitterUrl}
								onChange={handleInputChange("twitterUrl")}
								className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 p-2.5"
								required
							/>
						</div>
						<div className="form-group">
							<label className="block text-gray-700 font-bold mb-2">Instagram URL</label>
							<input
								type="text"
								value={formData.instagramUrl}
								onChange={handleInputChange("instagramUrl")}
								className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 p-2.5"
								required
							/>
						</div>
						<div className="form-group">
							<label className="block text-gray-700 font-bold mb-2">PayPal QR Code Image</label>
							<input
								type="file"
								accept="image/*"
								onChange={handleFileChange("paypalQrCode")}
								className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
								required
							/>
						</div>
						<div className="form-group">
							<label className="block text-gray-700 font-bold mb-2">Zelle QR Code Image</label>
							<input
								type="file"
								accept="image/*"
								onChange={handleFileChange("zelleQrCode")}
								className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
								required
							/>
						</div>
					</div>

					<div className="text-xl font-bold text-center">Devotee Information</div>
					<div className="form-group">
						<label className="block text-gray-700 font-bold mb-2">CSV File</label>
						<input
							type="file"
							accept=".csv"
							onChange={handleFileChange("csvFile")}
							className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
							required
						/>
					</div>

					<div className="flex justify-center">
						<button
							type="submit"
							className="bg-blue-500 hover:bg-blue-700 text-white rounded-xl w-full h-[3rem]"
						>
							Next
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default TempleGreetings;
