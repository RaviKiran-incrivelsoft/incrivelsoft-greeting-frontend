import axios from 'axios';
import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-toastify';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ContactPage = () => {
	const [loading, setLoading] = useState(false);
	const [contactMethod, setContactMethod] = useState("email");
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		message: "",
		phoneNumber: "",
		whatsappNumber: "",
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true)
		try {
			const dataToSubmit =
				contactMethod === "email"
					? {
						fullName: formData.fullName,
						email: formData.email,
						message: formData.message,
					}
					: {
						phoneNumber: formData.phoneNumber,
						whatsappNumber: formData.whatsappNumber,
					};

			const response = await axios.post(`${backendUrl}/contact`, dataToSubmit);

			toast.success("Details Sent Successfully!", {
				position: "top-center",
				theme: "colored",
			});

			// Reset form
			setFormData({
				fullName: "",
				email: "",
				message: "",
				phoneNumber: "",
				whatsappNumber: "",
			});
			console.log("Response:", response.data);
		} catch (error) {
			const errorMessage =
				error.response?.data?.error || "Failed to send the Details.";
			toast.error(errorMessage, {
				position: "top-center",
				theme: "colored",
			});
			console.error("Error:", errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<section
			className="py-16 lg:px-32 px-10 bg-cover bg-center lg:h-[145vh]"
			style={{ backgroundImage: "url('/images/contactbg.avif')" }}
		>
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h2 className="lg:text-5xl text-3xl font-bold">Contact Us</h2>
					<p className="lg:text-lg text-gray-700 mt-4 lg:px-48">
						We'd love to hear from you! Whether you have a question about services, donations, or anything else, our team is ready to answer all your queries.
					</p>
				</div>

				<div className="flex lg:flex-row flex-col justify-between gap-10">
					<div className="flex flex-col space-y-6 text-white md:w-1/2">
						<div className="flex items-start space-x-4">
							<FaMapMarkerAlt className="text-2xl" />
							<div>
								<h3 className="font-semibold">Address</h3>
								<p>San Francisco, USA</p>
								<p>Hyderabad, India</p>
							</div>
						</div>
						<div className="flex items-start space-x-4">
							<FaPhoneAlt className="text-2xl" />
							<div>
								<h3 className="font-semibold">Phone</h3>
								<p>+91 7032880286</p>
								<p>+1 (408) 218 0000</p>
							</div>
						</div>
						<div className="flex items-start space-x-4">
							<FaEnvelope className="text-2xl" />
							<div>
								<h3 className="font-semibold">Email</h3>
								<p>info@incrivelsoft.com</p>
								<p>hr@incrivelsoft.com</p>
							</div>
						</div>
					</div>

					<div className="bg-white p-8 shadow-lg rounded-lg md:w-1/2">
						<h2 className="lg:text-3xl text-2xl font-semibold text-gray-800 mb-6">Know us more</h2>
						<div className="mb-6 flex lg:flex-row flex-col lg:items-end gap-4">
							<label className="block text-gray-700 font-medium lg:mb-2">Preferred Contact Method:</label>
							<div className="flex gap-4">
								<button
									className={`py-1 px-3 rounded-md border transition-all duration-300 ${contactMethod === "email"
										? "bg-blue-600 text-white border-blue-600"
										: "bg-white text-blue-600 border-blue-600"
										}`}
									onClick={() => setContactMethod("email")}
								>
									Email
								</button>
								<button
									className={`py-1 px-3 rounded-md border transition-all duration-300 ${contactMethod === "phone"
										? "bg-blue-600 text-white border-blue-600"
										: "bg-white text-blue-600 border-blue-600"
										}`}
									onClick={() => setContactMethod("phone")}
								>
									Phone
								</button>
							</div>
						</div>

						<form onSubmit={handleSubmit}>
							{contactMethod === "email" ? (
								<>
									<div className="mb-4">
										<label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">
											Full Name *
										</label>
										<input
											type="text"
											id="fullName"
											name="fullName"
											value={formData.fullName}
											onChange={handleInputChange}
											className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
											required
										/>
									</div>

									<div className="mb-4">
										<label htmlFor="email" className="block text-gray-700 font-medium mb-2">
											Email *
										</label>
										<input
											type="email"
											id="email"
											name="email"
											value={formData.email}
											onChange={handleInputChange}
											className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
											required
										/>
									</div>

									<div className="mb-4">
										<label htmlFor="message" className="block text-gray-700 font-medium mb-2">
											Message
										</label>
										<textarea
											id="message"
											name="message"
											value={formData.message}
											onChange={handleInputChange}
											className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
											rows="4"
										></textarea>
									</div>
								</>
							) : (
								<>
									<div className="mb-4">
										<label htmlFor="phoneNumber" className="block text-gray-700 font-medium mb-2">
											Phone Number
										</label>
										<input
											type="tel"
											id="phoneNumber"
											name="phoneNumber"
											value={formData.phoneNumber}
											onChange={handleInputChange}
											className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
										/>
									</div>

									<div className="mb-4">
										<label htmlFor="whatsappNumber" className="block text-gray-700 font-medium mb-2">
											WhatsApp Number *
										</label>
										<input
											type="tel"
											id="whatsappNumber"
											name="whatsappNumber"
											value={formData.whatsappNumber}
											onChange={handleInputChange}
											className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
											required
										/>
									</div>
								</>
							)}

							<button
								type="submit"
								disabled={loading}
								className={`w-full flex justify-center text-white px-6 py-2 rounded-md ${loading ? "bg-blue-400 cursor-not-allowed py-4" : "bg-blue-600 hover:bg-blue-700"
									}`}
							>
								{loading ? (
									<div className="flex space-x-1">
										<span className="dot bg-white"></span>
										<span className="dot bg-white"></span>
										<span className="dot bg-white"></span>
									</div>
								) : (
									"Submit"
								)}
							</button>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ContactPage;
