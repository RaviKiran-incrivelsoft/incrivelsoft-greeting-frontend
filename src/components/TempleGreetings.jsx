import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { FaRegEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";
import Template from "./Template";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function TempleGreetings({ campaignId, closeModal }) {
	const [loading, setLoading] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isTemplateSelected, setIsTemplateSelected] = useState(false);
	const [formData, setFormData] = useState({
		templeName: "",
		address: "",
		taxId: "",
		phone: "",
		websiteUrl: "",
		facebookUrl: "",
		twitterUrl: "",
		instagramUrl: "",
		paypalQrCode: null,
		zelleQrCode: null,
		csvData: null,
		postDetails: ""
	});

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	const downloadSampleCSV = () => {
		const sampleCSV = `"first_name","last_name","email","contact","birthdate"\n` +
						  `"mufasa","babu","mahesh@example.com","=""+911234567890""","dd-mm-yyyy"`;
		const blob = new Blob([sampleCSV], { type: 'text/csv' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = 'sample.csv';
		link.click();
	};

	const handleQRcode = (field) => (e) => {
		setFormData((prevData) => ({
			...prevData,
			[field]: e.target.files[0],
		}));
	};

	const isFileUploaded = (field) => {
		return formData[field] ? true : false;
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
					let value = values[index]?.trim();

					// Clean up extra quotes from the field
					if (value.startsWith('"') && value.endsWith('"')) {
						value = value.slice(1, -1); // Remove wrapping quotes
					}

					// Handle the contact field specifically
					if (header.trim().toLowerCase() === "contact") {
						value = value.replace(/"/g, ""); // Remove extra embedded quotes
					}

					obj[header.trim()] = value;
				});
				return obj;
			});

			console.log("Parsed CSV data:", data);
			setFormData((prevData) => ({
				...prevData,
				csvData: data,
			}));
			sessionStorage.setItem('formData', JSON.stringify({
				...formData,
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
		setFormData((prevData) => ({
			...prevData,
			[e.target.name]: e.target.value,
		}));
		sessionStorage.setItem('formData', JSON.stringify({
			...formData,
			[e.target.name]: e.target.value,
		}));
	};

	const handlePostSelect = useCallback(
		(id) => {
			setFormData((prevData) => {
				const updatedData = {
					...prevData,
					postDetails: id,
				};
				sessionStorage.setItem('formData', JSON.stringify(updatedData));
				return updatedData;
			});
		},
		[]
	);

	useEffect(() => {
		const storedData = sessionStorage.getItem('formData');
		if (storedData) {
			setFormData(JSON.parse(storedData));
		}
	}, [handlePostSelect]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		const formDataToSubmit = new FormData();

		for (const key in formData) {
			if (formData[key]) {
				if (key === "csvData") {
					// Serialize csvData as a JSON string
					formDataToSubmit.append(key, JSON.stringify(formData[key]));
				} else if (formData[key] instanceof File) {
					formDataToSubmit.append(key, formData[key]);
				} else {
					formDataToSubmit.append(key, formData[key]);
				}
			}
		}

		try {
			const token = localStorage.getItem("token");
			console.log("Serialized Form Data:", formDataToSubmit);

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

			toast.success("Temple Details added", {
				position: "top-center",
				theme: "colored",
			});
			console.log("Form submitted successfully:", response.data);
			closeModal();
		} catch (error) {
			console.error("Error submitting form:", error);
			const errorMessage = error.response?.data?.error || "Failed to submit form";
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
		>
			<div
				className="bg-white p-6 rounded-lg lg:w-3/5 w-4/5"
			>
				<div className="text-xl font-bold text-center mb-5">Temple Information</div>
				<div className="container mx-auto px-4">
					<form onSubmit={handleSubmit}>
						<div className="grid items-end lg:grid-cols-3 grid-cols-2 gap-3">
							<div className="form-group">
								<label className="block text-sm text-gray-700 font-semibold mb-2">Temple Name</label>
								<input
									type="text"
									value={formData.templeName}
									onChange={handleInputChange}
									name="templeName"
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
									required
								/>
							</div>
							<div className="form-group">
								<label className="block text-sm text-gray-700 font-semibold mb-2">Temple Address</label>
								<input
									type="text"
									value={formData.address}
									onChange={handleInputChange}
									name="address"
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
									required
								/>
							</div>
							<div className="form-group">
								<label className="block text-sm text-gray-700 font-semibold mb-2">Temple Tax ID</label>
								<input
									type="text"
									value={formData.taxId}
									onChange={handleInputChange}
									name="taxId"
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
									required
								/>
							</div>
							<div className="form-group">
								<label className="block text-sm text-gray-700 font-semibold mb-2">Temple Phone</label>
								<input
									type="number"
									value={formData.phone}
									onChange={handleInputChange}
									name="phone"
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
									required
								/>
							</div>
							<div className="form-group">
								<label className="block text-sm text-gray-700 font-semibold mb-2">Website URL</label>
								<input
									type="text"
									value={formData.websiteUrl}
									onChange={handleInputChange}
									name="websiteUrl"
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
									required
								/>
							</div>
							<div className="form-group">
								<label className="block text-sm text-gray-700 font-semibold mb-2">Facebook URL</label>
								<input
									type="text"
									value={formData.facebookUrl}
									onChange={handleInputChange}
									name="facebookUrl"
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
									required
								/>
							</div>
							<div className="form-group">
								<label className="block text-sm text-gray-700 font-semibold mb-2">Twitter URL</label>
								<input
									type="text"
									value={formData.twitterUrl}
									onChange={handleInputChange}
									name="twitterUrl"
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
									required
								/>
							</div>
							<div className="form-group">
								<label className="block text-sm text-gray-700 font-semibold mb-2">Instagram URL</label>
								<input
									type="text"
									value={formData.instagramUrl}
									onChange={handleInputChange}
									name="instagramUrl"
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
									required
								/>
							</div>
							<div className="lg:col-span-1 col-span-2">
								<button
									className="flex items-center mt-5 w-4/5 text-center justify-around py-1.5 px-4 rounded-md transition-all duration-300 ease-in-out text-white bg-blue-600 hover:bg-blue-700"
									type="button"
									onClick={() => setIsTemplateSelected(true)}
									
								>
									<FaRegEnvelope /> Select Template
								</button>
								{/* {formData.postDetails ? <span className="block text-sm text-green-600">Template Selected</span> : <span className="block text-sm text-red-600">Please Select Template</span>} */}
							</div>
							<div className="lg:col-span-1 col-span-2">
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
									onChange={handleQRcode('paypalQrCode')}
									className="hidden"
									required
								/>
								{isFileUploaded('paypalQrCode') && <span className="block text-green-600">File uploaded</span>}
							</div>
							<div className="lg:col-span-1 col-span-2">
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
									onChange={handleQRcode('zelleQrCode')}
									className="hidden"
									required
								/>
								{isFileUploaded('zelleQrCode') && <span className="block text-green-600">File uploaded</span>}
							</div>
							<div className="lg:col-span-1 col-span-2">
								<input
									id="csvFileInput"
									type="file"
									accept=".csv"
									onChange={(e) => { handleFileChange(e); toggleModal() }}
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
								{isFileUploaded('csvData') && <span className="block text-green-600">File uploaded</span>}
							</div>
						</div>

						{isTemplateSelected && <Template onSelect={handlePostSelect} closeModal={() => setIsTemplateSelected(false)} />}
						{isModalOpen && (
							<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
								<div className="bg-white rounded-lg lg:w-2/5 w-4/5 p-6 shadow-lg lg:text-base text-sm">
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
											onClick={() => document.getElementById('csvFileInput').click()}
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

						<div className="flex justify-end mt-6 gap-4">
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
