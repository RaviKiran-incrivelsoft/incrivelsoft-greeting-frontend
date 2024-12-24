import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const ContactPage = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Message Sent:", { name, email, message });
	};

	return (
		<section
			className="py-16 px-32 bg-cover bg-center"
			style={{ backgroundImage: "url('/images/contactbg.avif')" }}
		>
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h2 className="text-5xl font-bold">Contact Us</h2>
					<p className="text-lg text-white mt-4 px-48">
						We'd love to hear from you! Whether you have a question about services, donations, or anything else, our team is ready to answer all your queries.
					</p>
				</div>

				<div className="flex flex-row justify-between gap-10">
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
								<p>+91 6302543159</p>
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
						<h3 className="text-3xl text-gray-900 mb-6">Send Message</h3>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div>
								<label htmlFor="full-name" className="block text-gray-700 font-medium">Full Name*</label>
								<input
									type="text"
									id="full-name"
									name="full-name"
									required
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Enter your full name"
								/>
							</div>
							<div>
								<label htmlFor="email" className="block text-gray-700 font-medium">Email*</label>
								<input
									type="email"
									id="email"
									name="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Enter your email"
								/>
							</div>
							<div>
								<label htmlFor="message" className="block text-gray-700 font-medium">Type your Message...*</label>
								<textarea
									id="message"
									name="message"
									required
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Type your message here"
									rows="4"
								/>
							</div>
							<button
								type="submit"
								className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
							>
								Send
							</button>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ContactPage;
