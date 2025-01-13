import React, { useCallback, useEffect, useState } from "react";
import { FaRegEnvelope } from "react-icons/fa";
import Template from "./Template";
import { toast } from "react-toastify";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function FestivalGreetings({ fetchGreetings, closeModal }) {
	const [formData, setFormData] = useState({
		festivalName: "",
		festivalDescription: "",
		festivalDate: "",
		from: "",
		address: "",
		csvData: [],
		postDetails: ""
	});
	const [userType, setUserType] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [isTemplateSelected, setIsTemplateSelected] = useState(false);
	const [userDetails, setUserDetails] = useState([
		{ first_name: "", last_name: "", email: "", contact: "", birthdate: "" },
	]);

	const handleUserInput = (e) => {
		setUserDetails([{
			...userDetails[0],
			[e.target.name]: e.target.value,
		}]);
		setFormData((prevData) => ({
			...prevData,
			csvData: [{ ...userDetails[0], [e.target.name]: e.target.value }],
		}));
		sessionStorage.setItem('formData', JSON.stringify({
			...formData,
			csvData: [{ ...userDetails[0], [e.target.name]: e.target.value }],
		}));
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

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	const downloadSampleCSV = () => {
		const sampleCSV = `"first_name","last_name","email","contact","birthdate"\n` +
						  `"mufasa","babu","mahesh@example.com","=""+911234567890""","dd-mm-yyyy"`;
	
		const blob = new Blob([sampleCSV], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = "sample.csv";
		link.click();
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
		const recipientType = sessionStorage.getItem('userType');
		if (storedData) {
			setFormData(JSON.parse(storedData));
			setUserDetails(JSON.parse(storedData).csvData)
		}
		if (recipientType) {
			setUserType(recipientType);
		}
	}, [handlePostSelect]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);


		try {
			const token = localStorage.getItem("token");

			console.log("Token Retrieved:", token);

			const response = await axios.post(
				`${backendUrl}/festivals`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			fetchGreetings()
			toast.success(response.data.message, {
				position: "top-center",
				theme: "colored",
			});
			console.log("Form submitted successfully:", response.data);

			sessionStorage.clear(); // Ensure this doesn't unintentionally clear unrelated data
			closeModal();
		} catch (error) {
			console.error("Error submitting form:", error);

			// Extract and display the error message
			const errorMessage = error.response?.data?.error || "Failed to submit form";
			toast.error(errorMessage, {
				position: "top-center",
				theme: "colored",
			});
		} finally {
			setLoading(false); // Ensure loading spinner is disabled
		}
	};


	return (
		<div
			className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center"
		>
			<div
				className="bg-white p-6 rounded-lg lg:w-1/2 w-4/5"
			>
				<h2 className="text-xl font-bold text-center mb-5">Occasion Greetings</h2>
				<form onSubmit={handleSubmit}>
					<div className="grid lg:grid-cols-3 grid-cols-2 items-start justify-center gap-4 lg:text-base text-sm">
						<div className="form-group">
							<label className="block text-sm font-semibold mb-2">Occasion Name</label>
							<input
								type="text"
								value={formData.festivalName}
								onChange={handleInputChange}
								name="festivalName"
								className="w-full border border-gray-300 rounded px-2 py-1"
								required
							/>
						</div>
						<div className="form-group">
							<label className="block text-sm font-semibold mb-2">Occasion Date</label>
							<input
								type="date"
								value={formData.festivalDate}
								onChange={handleInputChange}
								name="festivalDate"
								className="w-full border border-gray-300 rounded px-2 py-1"
								required
							/>
						</div>
						<div className="form-group">
							<label className="block text-sm font-semibold mb-2">Description</label>
							<input
								type="text"
								value={formData.festivalDescription}
								onChange={handleInputChange}
								name="festivalDescription"
								className="w-full border border-gray-300 rounded px-2 py-1"
								required
							/>
						</div>
						<div className="form-group">
							<label className="block text-sm font-semibold mb-2">Address</label>
							<input
								type="text"
								value={formData.address}
								onChange={handleInputChange}
								name="address"
								className="w-full border border-gray-300 rounded px-2 py-1"
								required
							/>
						</div>
						<div className="form-group">
							<label className="block text-sm font-semibold mb-2">From</label>
							<input
								type="text"
								value={formData.from}
								onChange={handleInputChange}
								name="from"
								className="w-full border border-gray-300 rounded px-2 py-1"
								required
							/>
						</div>
						<div className="form-group">
							<label className="block text-sm font-semibold mb-2">Recipient Type</label>
							<select
								onChange={(e) => { setUserType(e.target.value); sessionStorage.setItem("userType", e.target.value) }}
								className="w-full border border-gray-300 rounded px-2 py-1"
								defaultValue=""
								required
							>
								<option value="" disabled>
									Select Type
								</option>
								<option value="single">Single</option>
								<option value="multiple">Multiple</option>
							</select>
						</div>
					</div>

					<div>
							<button
								className="flex w-fit mt-5 items-center text-center justify-around py-1.5 px-4 border-2 rounded-md transition-all duration-300 ease-in-out text-blue-600 border-blue-600 hover:text-white hover:bg-blue-600 hover:border-transparent"
								type="button"
								onClick={() => setIsTemplateSelected(true)}
							>
								<FaRegEnvelope className="mr-2"/> Select Template
							</button>
							{/* {formData.postDetails ? <span className="block text-sm text-green-600">Template Selected</span> : <span className="block text-sm text-red-600">Please Select Template</span>} */}
						</div>
					{isTemplateSelected && <Template onSelect={handlePostSelect} closeModal={() => setIsTemplateSelected(false)} />}
					{userType === "single" && (
						<div className="grid lg:grid-cols-3 grid-cols-2 gap-4 mt-4">
							<div className="form-group">
								<label className="block text-sm font-semibold mb-2">First Name</label>
								<input
									type="text"
									value={formData.csvData.first_name}
									onChange={handleUserInput}
									name="first_name"
									className="w-full border border-gray-300 rounded px-2 py-1"
								/>
							</div>
							<div className="form-group">
								<label className="block text-sm font-semibold mb-2">Last Name</label>
								<input
									type="text"
									value={formData.csvData.last_name}
									onChange={handleUserInput}
									name="last_name"
									className="w-full border border-gray-300 rounded px-2 py-1"
								/>
							</div>
							<div className="form-group">
								<label className="block text-sm font-semibold mb-2">Email</label>
								<input
									type="email"
									value={formData.csvData.email}
									onChange={handleUserInput}
									name="email"
									className="w-full border border-gray-300 rounded px-2 py-1"
								/>
							</div>
							<div className="form-group">
								<label className="block text-sm font-semibold mb-2">Contact</label>
								<input
									type="text"
									value={formData.csvData.contact}
									onChange={handleUserInput}
									name="contact"
									className="w-full border border-gray-300 rounded px-2 py-1"
								/>
							</div>
							<div className="form-group">
								<label className="block text-sm font-semibold mb-2">Birthdate</label>
								<input
									type="date"
									value={formData.csvData.birthdate}
									onChange={handleUserInput}
									name="birthdate"
									className="w-full border border-gray-300 rounded px-2 py-1"
								/>
							</div>
						</div>
					)}

					{userType === "multiple" && (
						<div className="mt-6">
							<button
								type="button"
								onClick={() => setIsModalOpen(true)}
								className="py-1.5 px-4 mb-2 border-2 rounded-md transition-all duration-300 ease-in-out text-blue-600 border-blue-600 hover:text-white hover:bg-blue-600 hover:border-transparent"
							>
								Upload CSV
							</button>
							{formData.csvData.length ? <span className="block text-green-600 text-sm">File uploaded</span> : <span className="block text-red-600 text-sm">File required</span>}
						</div>
					)}

					{isModalOpen && (
						<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
							<div className="bg-white rounded-lg lg:w-2/5 w-4/5 p-6 shadow-lg lg:text-base text-sm">
								<h2 className="text-lg font-semibold mb-4">CSV File Requirements</h2>
								<p className="mb-6">
									Please ensure the CSV file contains the following fields: <br />
									<span className="font-semibold">
										first_name, last_name, email, contact, birthdate
									</span>
								</p>
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
										onClick={() => document.getElementById("csvFileInput").click()}
									>
										Upload
									</button>
									<input
										id="csvFileInput"
										type="file"
										accept=".csv"
										onChange={(e) => { handleFileChange(e); toggleModal() }}
										className="hidden"
									/>
									<button
										onClick={() => setIsModalOpen(false)}
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
							className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
						>
							{loading ? "Submitting..." : "Submit"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default FestivalGreetings;
