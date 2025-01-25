import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import Template from './Template';
import { toast } from "react-toastify";
import { FaRegEnvelope } from "react-icons/fa";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function BirthdayGreetings({ closeModal, fetchGreetings }) {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		from: "",
		csvData: [],
		postDetails: ""
	});
	const [userDetails, setUserDetails] = useState([
		{ first_name: "", last_name: "", email: "", contact: "", birthdate: "" },
	]);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [userType, setUserType] = useState(false);
	const [isTemplateSelected, setIsTemplateSelected] = useState(false);

	const toggleModal = () => setIsModalOpen(!isModalOpen);

	const downloadSampleCSV = () => {
		const sampleCSV = `"first_name","last_name","email","contact","birthdate"\n` +
						  `"mufasa","babu","mahesh@example.com","=""+911234567890""","dd-mm-yyyy"`;
		const blob = new Blob([sampleCSV], { type: "text/csv" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = "sample.csv";
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

			const response = await axios.post(
				`${backendUrl}/birthdays`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			fetchGreetings();
			toast.success("Birthday Greeting Scheduled", {
				position: "top-center",
				theme: "colored",
			});
			console.log("Form submitted successfully:", response.data);
			sessionStorage.clear();
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
				className="bg-white p-6 rounded-lg lg:w-1/2 w-3/4"
			>
				<div className="text-xl font-bold text-center mb-5">Birthday Greeting</div>
				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
						<div>
							<label className="block text-sm text-gray-700 font-semibold mb-2">Title</label>
							<input
								type="text"
								value={formData.title}
								onChange={handleInputChange}
								name="title"
								className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
								required
							/>
						</div>
						<div>
							<label className="block text-sm text-gray-700 font-semibold mb-2">From</label>
							<input
								type="text"
								value={formData.from}
								onChange={handleInputChange}
								name="from"
								className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
								required
							/>
						</div>
						<div>
							<label className="block text-sm text-gray-700 font-semibold mb-2">Send To</label>
							<select
								onChange={(e) => { setUserType(e.target.value); sessionStorage.setItem("userType", e.target.value) }}
								className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
								defaultValue=""
								required
							>
								<option value="" disabled>Select an option</option>
								<option value="single">Single</option>
								<option value="multiple">Multiple (CSV)</option>
							</select>
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
					</div>

					{isTemplateSelected && <Template onSelect={handlePostSelect} closeModal={() => setIsTemplateSelected(false)} />}
					{userType === "single" &&
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm text-gray-700 font-semibold mb-2">First Name</label>
								<input
									type="text"
									value={formData.csvData[0]?.first_name}
									onChange={handleUserInput}
									name="first_name"
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
									required
								/>
							</div>
							<div>
								<label className="block text-sm text-gray-700 font-semibold mb-2">Last Name</label>
								<input
									type="text"
									value={formData.csvData[0]?.last_name}
									onChange={handleUserInput}
									name="last_name"
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
								/>
							</div>
							<div>
								<label className="block text-sm text-gray-700 font-semibold mb-2">Email</label>
								<input
									type="email"
									value={formData.csvData[0]?.email}
									onChange={handleUserInput}
									name="email"
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
									required
								/>
							</div>
							<div>
								<label className="block text-sm text-gray-700 font-semibold mb-2">Contact</label>
								<input
									type="text"
									value={formData.csvData[0]?.contact}
									onChange={handleUserInput}
									name="contact"
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
								/>
							</div>
							<div>
								<label className="block text-sm text-gray-700 font-semibold mb-2">Birthdate</label>
								<input
									type="date"
									value={formData.csvData[0]?.birthdate}
									onChange={handleUserInput}
									name="birthdate"
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
									required
								/>
							</div>
						</div>
					}
					{userType === "multiple" &&
						<div>
							<button
								type="button"
								onClick={toggleModal}
								className="py-1.5 px-4 mb-2 border-2 rounded-md transition-all duration-300 ease-in-out text-blue-600 border-blue-600 hover:text-white hover:bg-blue-600 hover:border-transparent"
							>
								Upload CSV
							</button>
							{formData.csvData.length ? <span className="block text-green-600 text-sm">File uploaded</span> : <span className="block text-red-600 text-sm">File required</span>}
							{isModalOpen && (
								<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
									<div className="bg-white rounded-lg lg:w-2/5 w-4/5 p-6 shadow-lg lg:text-base text-sm">
										<h2 className="text-lg font-semibold mb-4">CSV File Requirements</h2>
										<p className="mb-6">
											Please make sure the CSV file contains the following fields: <br />
											<span className="font-semibold">first_name, last_name, email, contact, birthdate</span>
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
											<button
												onClick={toggleModal}
												className="lg:px-4 p-2 bg-gray-300 text-black rounded hover:bg-gray-400"
											>
												Close
											</button>
										</div>

										<input
											id="csvFileInput"
											type="file"
											accept=".csv"
											onChange={(e) => { handleFileChange(e); toggleModal() }}
											className="hidden"
										/>
									</div>
								</div>
							)}
						</div>
					}

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
							className={`h-10 flex items-center justify-center px-4 rounded text-white ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
						>
							{loading ? "Submitting..." : "Submit"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default BirthdayGreetings;
