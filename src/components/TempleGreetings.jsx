import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function TempleGreetings({ campaignId, closeModal }) {
	const [loading, setLoading] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
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
		csvFile: null,
	});

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	const downloadSampleCSV = () => {
		const sampleCSV = `first_name,last_name,email,contact,birthdate\nmufasa,babu,mahesh@example.com,1234567890,dd-mm-yyy`;
		const blob = new Blob([sampleCSV], { type: 'text/csv' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = 'sample.csv';
		link.click();
	};

	const handleFileChange = (field) => (e) => {
		setFormData((prevData) => ({
			...prevData,
			[field]: e.target.files[0],
		}));
	};

	const isFileUploaded = (field) => {
		return formData[field] ? true : false;
	};

	const handleInputChange = (field) => (e) => {
		setFormData((prevData) => ({
			...prevData,
			[field]: e.target.value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true)

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
		} finally {
			setLoading(false)
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
						</div>

						<div className="flex gap-6 my-4 mb-6">
							<div>
								<button
									type="button"
									className="py-1.5 px-4 border-2 rounded-md transition-all duration-300 ease-in-out text-blue-600 border-blue-600 hover:text-white hover:bg-blue-600 hover:border-transparent"
									onClick={() => document.getElementById('paypalQrCodeInput').click()}
								>
									Upload PayPal QR Code
								</button>
								<input
									id="paypalQrCodeInput"
									type="file"
									accept="image/*"
									onChange={handleFileChange('paypalQrCode')}
									className="hidden"
									required
								/>
								{isFileUploaded('paypalQrCode') && <span className="block text-green-600">File uploaded</span>}
							</div>
							<div>
								<button
									type="button"
									className="py-1.5 px-4 border-2 rounded-md transition-all duration-300 ease-in-out text-blue-600 border-blue-600 hover:text-white hover:bg-blue-600 hover:border-transparent"
									onClick={() => document.getElementById('zelleQrCodeInput').click()}
								>
									Upload Zelle QR Code
								</button>
								<input
									id="zelleQrCodeInput"
									type="file"
									accept="image/*"
									onChange={handleFileChange('zelleQrCode')}
									className="hidden"
									required
								/>
								{isFileUploaded('zelleQrCode') && <span className="block text-green-600">File uploaded</span>}
							</div>
							<div>
								<input
									id="csvFileInput"
									type="file"
									accept=".csv"
									onChange={(e) => {handleFileChange('csvFile')(e);toggleModal()}}
									className="hidden w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
									required
								/>
								<button
									type="button"
									onClick={toggleModal}
									className="py-1.5 px-4 border-2 rounded-md transition-all duration-300 ease-in-out text-blue-600 border-blue-600 hover:text-white hover:bg-blue-600 hover:border-transparent"
								>
									Upload Devotee CSV
								</button>
								{isFileUploaded('csvFile') && <span className="block text-green-600">File uploaded</span>}
							</div>
						</div>

						{/* Modal Popup */}
						{isModalOpen && (
							<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
								<div className="bg-white rounded-lg w-2/5 p-6 shadow-lg">
									<h2 className="text-lg font-semibold mb-4">CSV File Requirements</h2>
									<p className="mb-6">
										Please make sure the CSV file contains the following fields: <br />
										<span className="font-semibold">first_name, last_name, email, contact, birthdate</span>
									</p>

									{/* Buttons to download sample CSV or close */}
									<div className="flex justify-end space-x-4">
										<button
											type="button"
											onClick={downloadSampleCSV}
											className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
										>
											Sample CSV
										</button>
										<button
											type="button"
											className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
											onClick={() => document.getElementById('csvFileInput').click()}
										>
											Upload
										</button>
										<button
											onClick={toggleModal}
											className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
										>
											Close
										</button>
									</div>
								</div>
							</div>
						)}

						<div className="flex justify-center">
							<button
								type="submit"
								disabled={loading}
								className={`h-10 flex items-center justify-center px-4 rounded text-white ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
									}`}
							>
								{loading ? (
									<div className="flex space-x-1 p-1.5">
										<span className="dot bg-white"></span>
										<span className="dot bg-white"></span>
										<span className="dot bg-white"></span>
									</div>
								) : (
									"Create"
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default TempleGreetings;
