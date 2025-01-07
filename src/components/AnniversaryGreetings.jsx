import React, { useCallback, useEffect, useState } from "react";
import { FaRegEnvelope } from "react-icons/fa";
import Template from "./Template";
import { toast } from "react-toastify";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function AnniversaryGreetings({ fetchGreetings, closeModal }) {
	const [formData, setFormData] = useState({
		title: "",
		csvData: [],
		postDetails: ""
	});
	const [userType, setUserType] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [isTemplateSelected, setIsTemplateSelected] = useState(false);
	const [userDetails, setUserDetails] = useState([
		{ husband_name: "", wife_name: "", email: "", contact: "", marriagedate: "" },
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
					obj[header.trim()] = values[index]?.trim();
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
		const sampleCSV = `husband_name,wife_name,email,contact,marriagedate\nMohan,Rashmika,mohan@example.com,1234567890,dd-mm-yyyy`;
		const blob = new Blob([sampleCSV], { type: "text/csv" });
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
		const id = sessionStorage.getItem('customPostId');
		const storedData = sessionStorage.getItem('formData');
		const recipientType = sessionStorage.getItem('userType');
		if (storedData) {
			setFormData(JSON.parse(storedData));
			setUserDetails(JSON.parse(storedData).csvData)
		}
		if (id) {
			handlePostSelect(id);
			sessionStorage.removeItem('customPostId');
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

			const response = await axios.post(
				`${backendUrl}/marriages`,
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

			// sessionStorage.clear(); // Ensure this doesn't unintentionally clear unrelated data
			// closeModal();
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
			onClick={closeModal}
		>
			<div
				className="bg-white p-6 rounded-lg w-1/2"
				onClick={(e) => e.stopPropagation()}
			>
				<h2 className="text-xl font-bold text-center mb-5">Anniversary Greetings</h2>
				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-3 items-start justify-center gap-4">
						<div className="form-group">
							<label className="block text-sm font-semibold mb-2">Title</label>
							<input
								type="text"
								value={formData.title}
								onChange={handleInputChange}
								name="title"
								className="w-full border border-gray-300 rounded px-2 py-1"
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
							{/* {formData.postDetails ? <span className="block text-sm text-green-600">Template Selected</span> : <span className="block text-sm text-red-600">Please Select Template</span>} */}
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
									Select Recipient Type
								</option>
								<option value="single">Single</option>
								<option value="multiple">Multiple</option>
							</select>
						</div>
					</div>

					{isTemplateSelected && <Template onSelect={handlePostSelect} closeModal={() => setIsTemplateSelected(false)} />}
					{userType === "single" && (
						<div className="grid grid-cols-3 gap-4 mt-4">
							<div className="form-group">
								<label className="block text-sm font-semibold mb-2">Husband Name</label>
								<input
									type="text"
									value={formData.csvData.husband_name}
									onChange={handleUserInput}
									name="husband_name"
									className="w-full border border-gray-300 rounded px-2 py-1"
								/>
							</div>
							<div className="form-group">
								<label className="block text-sm font-semibold mb-2">Wife Name</label>
								<input
									type="text"
									value={formData.csvData.wife_name}
									onChange={handleUserInput}
									name="wife_name"
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
								<label className="block text-sm font-semibold mb-2">Married Date</label>
								<input
									type="date"
									value={formData.csvData.marriagedate}
									onChange={handleUserInput}
									name="marriagedate"
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
							<div className="bg-white rounded-lg w-2/5 p-6 shadow-lg">
								<h2 className="text-lg font-semibold mb-4">CSV File Requirements</h2>
								<p className="mb-6">
									Please ensure the CSV file contains the following fields: <br />
									<span className="font-semibold">
										husband_name, wife_name, email, contact, marriagedate
									</span>
								</p>
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
										className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
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

export default AnniversaryGreetings;
