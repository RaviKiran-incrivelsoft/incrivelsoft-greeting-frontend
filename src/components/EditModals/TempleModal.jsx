import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

const TempleModal = ({ data, onClose, onFetch }) => {
	const [loading, setLoading] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [formData, setFormData] = useState({
		templeName: data.templeName,
		address: data.address,
		taxId: data.taxId,
		phone: data.phone,
		websiteUrl: data.websiteUrl,
		facebookUrl: data.facebookUrl,
		twitterUrl: data.twitterUrl,
		instagramUrl: data.instagramUrl,
		paypalQrCodeURL: data.paypalQrCodeURL,
		zelleQrCodeURL: data.zelleQrCodeURL,
		csvData: data.csvData,
	});
	const [imagePreview, setImagePreview] = useState({
		paypalQrCodeURL: data.paypalQrCodeURL,
		zelleQrCodeURL: data.zelleQrCodeURL,
	});
	const [changedData, setChangedData] = useState({});

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

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const reader = new FileReader();

		reader.onload = () => {
			const text = reader.result;
			const rows = text.trim().split("\n");
			const headers = rows[0].split(",");

			const data = rows.slice(1).map((row) => {
				const values = row.split(",");
				const obj = {};
				headers.forEach((header, index) => {
					obj[header.trim()] = values[index]?.trim();
				});
				return obj;
			});

			console.log("Parsed CSV data:", data);
			setFormData((prevData) => ({
				...prevData,
				csvData: data,
			}));
			setChangedData((prevData) => ({
				...prevData,
				csvData: data,
			}));
		};

		reader.onerror = (error) => {
			console.error("Error reading file:", error);
			toast.error("Failed to read file");
		};

		reader.readAsText(file);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		setChangedData({ ...changedData, [name]: value });
	};

	const handleImageUpload = (fieldName, e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview({ ...imagePreview, [fieldName === "paypalQrCode" ? "paypalQrCodeURL" : "zelleQrCodeURL"]: reader.result });
				setChangedData({ ...changedData, [fieldName]: file });
			};
			reader.readAsDataURL(file); // Read the file and generate base64 URL
		}
	};

	const handleSave = async (e) => {
		e.preventDefault();
		setLoading(true);
		
		try {
			const backendUrl = process.env.REACT_APP_BACKEND_URL;
			const token = localStorage.getItem("token");

			await axios.put(
				`${backendUrl}/temple/${data._id}`,
				changedData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${token}`,
					},
				}
			);

			onClose();
			onFetch();
			toast.success("Temple Data Updated..!", {
				position: "top-center",
				theme: "colored",
			});
		} catch (error) {
			console.error("Error updating temple data:", error);
			const errorMessage = error.response?.data?.error || "Failed to Update greeting";
			toast.error(errorMessage, {
				position: "top-center",
				theme: "colored",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-white rounded-lg lg:w-2/3 w-5/6 p-6">
				<h2 className="text-2xl font-bold mb-4">Edit Temple Data</h2>
				<div className="space-y-6">
					{/* Editable fields */}
					<div className="grid lg:grid-cols-3 grid-cols-2 gap-4">
						{Object.keys(formData)
							.filter(
								(key) =>
									![
										"paypalQrCodeURL",
										"zelleQrCodeURL",
										"csvData",
									].includes(key)
							)
							.map((key) => (
								<div key={key}>
									<label className="block font-medium capitalize">{key}</label>
									<input
										type="text"
										name={key}
										value={formData[key]}
										onChange={handleInputChange}
										className="w-full border p-2 rounded"
									/>
								</div>
							))}
					</div>
					{/* QR Code Images */}
					<div className="grid lg:grid-cols-3 grid-cols-2 gap-6">
						{["paypalQrCodeURL", "zelleQrCodeURL"].map((field) => (
							<div key={field}>
								<label className="block font-medium capitalize">
									{field === "paypalQrCodeURL" ? "PayPal QR Code" : "Zelle QR Code"}
								</label>
								<div className="relative w-30 h-auto">
									<img
										src={imagePreview[field] || changedData[field]}
										alt={field}
										className="w-full h-full object-cover rounded-lg"
									/>
									<label
										className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 hover:opacity-100 cursor-pointer rounded-lg"
										htmlFor={`${field}-upload`}
									>
										Upload
									</label>
									<input
										id={`${field}-upload`}
										type="file"
										accept="image/*"
										className="hidden"
										onChange={(e) => handleImageUpload(field === "paypalQrCodeURL" ? "paypalQrCode" : "zelleQrCode", e)}
									/>
								</div>
							</div>
						))}
						<div>
							<label className="block font-medium">CSV Data</label>
							<p className="text-sm mb-2">Count: {formData.csvData?.length}</p>
							<button
								className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
								onClick={toggleModal}
							>
								Upload CSV
							</button>
							<input
								id="csv-upload"
								type="file"
								accept=".csv"
								className="hidden"
								onChange={(e) => { handleFileChange(e); toggleModal() }}
							/>
						</div>
					</div>
				</div>
				{isModalOpen && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
						<div className="bg-white rounded-lg lg:w-2/5 w-4/5 lg:text-base text-sm p-6 shadow-lg">
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
									className="lg:px-4 p-2 bg-green-600 text-white rounded hover:bg-green-700"
								>
									Sample CSV
								</button>
								<button
									type="button"
									className="lg:px-4 p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
									onClick={() => document.getElementById('csv-upload').click()}
								>
									Upload
								</button>
								<button
									onClick={toggleModal}
									className="lg:px-4 p-2 bg-gray-300 text-black rounded hover:bg-gray-400"
								>
									Close
								</button>
							</div>
						</div>
					</div>
				)}
				{/* Action Buttons */}
				<div className="mt-6 flex justify-end space-x-4">
					<button
						className="py-2 px-4 bg-gray-200 rounded hover:bg-gray-300"
						onClick={onClose}
					>
						Cancel
					</button>
					<button
						onClick={handleSave}
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
							"Update"
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default TempleModal