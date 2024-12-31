import React, { useCallback, useEffect, useState } from "react";
import { FaRegEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";
import Template from "./Template";

function EventComponent({ fetchGreetings, closeModal }) {
	const [formData, setFormData] = useState({
		eventName: "",
		eventDate: "",
		address: "",
		csvData: [],
		postId: ""
	});
	const [userDetails, setUserDetails] = useState([
		{ first_name: "", last_name: "", email: "", contact: "", birthdate: "" },
	]);
	const [userType, setUserType] = useState(false);
	const [isTemplateSelected, setIsTemplateSelected] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

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

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	const downloadSampleCSV = () => {
		const sampleCSV = `first_name,last_name,email,contact\nJohn,Doe,john.doe@example.com,1234567890`;
		const blob = new Blob([sampleCSV], { type: "text/csv" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = "sample.csv";
		link.click();
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		fetchGreetings();
		toast.success("Event details submitted successfully!", {
			position: "top-center",
			theme: "colored",
		});
		closeModal();
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
				<div className="text-xl font-bold text-center mb-5">Event Information</div>
				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-3 items-start gap-4 mb-4">
						<div className="form-group">
							<label className="block text-sm text-gray-700 font-semibold mb-2">
								Event Name
							</label>
							<input
								type="text"
								value={formData.eventName}
								onChange={handleInputChange}
								name="eventName"
								className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
								required
							/>
						</div>
						<div className="form-group">
							<label className="block text-sm text-gray-700 font-semibold mb-2">
								Event Date
							</label>
							<input
								type="date"
								value={formData.eventDate}
								onChange={handleInputChange}
								name="eventDate"
								className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
								required
							/>
						</div>
						<div className="form-group">
							<label className="block text-sm text-gray-700 font-semibold mb-2">
								Address
							</label>
							<input
								type="text"
								value={formData.address}
								onChange={handleInputChange}
								name="address"
								className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
								required
							/>
						</div>
						<div>
							<button
								className="flex w-full mb-2 items-center text-center justify-around py-1.5 px-4 border-2 rounded-md transition-all duration-300 ease-in-out text-blue-600 border-blue-600 hover:text-white hover:bg-blue-600 hover:border-transparent"
								type="button"
								onClick={() => setIsTemplateSelected(true)}
							>
								<FaRegEnvelope /> Select Template
							</button>
							{formData.postId ? <span className="block text-sm text-green-600">Template Selected</span> : <span className="block text-sm text-red-600">Please Select Template</span>}
						</div>
						<div className="form-group">
							<label className="block text-sm text-gray-700 font-semibold mb-2">
								User Type
							</label>
							<select
								onChange={(e) => { setUserType(e.target.value); sessionStorage.setItem("userType", e.target.value) }}
								defaultValue=""
								className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
								required
							>
								<option value="" disabled>
									Select an option
								</option>
								<option value="single">Single User</option>
								<option value="multiple">Multiple Users</option>
							</select>
						</div>
					</div>

					{isTemplateSelected && <Template onSelect={handlePostSelect} closeModal={() => setIsTemplateSelected(false)} />}
					{userType === "single" && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
							<div className="form-group">
								<label className="block text-sm text-gray-700 font-semibold mb-2">
									First Name
								</label>
								<input
									type="text"
									value={formData.csvData.firstName}
									onChange={handleUserInput}
									name="firstName"
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
									required
								/>
							</div>
							<div className="form-group">
								<label className="block text-sm text-gray-700 font-semibold mb-2">
									Last Name
								</label>
								<input
									type="text"
									value={formData.csvData.lastName}
									onChange={handleUserInput}
									name="lastName"
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
									required
								/>
							</div>
							<div className="form-group">
								<label className="block text-sm text-gray-700 font-semibold mb-2">
									Email
								</label>
								<input
									type="email"
									value={formData.csvData.email}
									onChange={handleUserInput}
									name="email"
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
									required
								/>
							</div>
							<div className="form-group">
								<label className="block text-sm text-gray-700 font-semibold mb-2">
									Contact
								</label>
								<input
									type="text"
									value={formData.csvData.contact}
									onChange={handleUserInput}
									name="contact"
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
									required
								/>
							</div>
							<div>
								<label className="block text-sm text-gray-700 font-semibold mb-2">Birthdate</label>
								<input
									type="date"
									value={formData.csvData.birthdate}
									onChange={handleUserInput}
									name="birthdate"
									className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm py-1 px-2 bg-gray-50"
									required
								/>
							</div>
						</div>
					)}

					{userType === "multiple" && (
						<div className="flex flex-col gap-2 w-1/4">
							<button
								type="button"
								onClick={toggleModal}
								className="py-1.5 px-4 border-2 rounded-md transition-all duration-300 ease-in-out text-blue-600 border-blue-600 hover:text-white hover:bg-blue-600 hover:border-transparent"
							>
								Upload CSV
							</button>
							{formData.csvFile ? <span className="block text-green-600">File uploaded</span> : <span className="block text-red-600">File required</span>}
						</div>
					)}

					{isModalOpen && (
						<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
							<div className="bg-white rounded-lg w-2/5 p-6 shadow-lg">
								<h2 className="text-lg font-semibold mb-4">CSV File Requirements</h2>
								<p className="mb-6">
									Please make sure the CSV file contains the following fields: <br />
									<span className="font-semibold">first_name, last_name, email, contact</span>
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
									<button
										onClick={toggleModal}
										className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
									>
										Close
									</button>
									<input
										id="csvFileInput"
										type="file"
										accept=".csv"
										onChange={(e) => { handleFileChange(e); toggleModal() }}
										className="hidden"
									/>
								</div>
							</div>
						</div>
					)}

					<div className="flex justify-center mt-6">
						<button
							type="submit"
							className="h-10 flex items-center justify-center px-4 rounded text-white bg-blue-600 hover:bg-blue-700"
						>
							Submit
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default EventComponent;
