import React from "react";
import { useNavigate } from "react-router-dom";

const ServicePage = () => {
	const navigate = useNavigate();
	const services = [
		{
			id: 1,
			image: "/images/whatsAppService.png",
			text: "The temple sends special messages on your special day through WhatsApp. You can also donate to the temple.",
		},
		{
			id: 2,
			image: "/images/gmailGreetings.png",
			text: "The temple sends special messages on your special day through WhatsApp. You can also donate to the temple.",
		}
	];

	return (
		<section className="pt-12">
			<div className="lg:mx-20 mx-10">
				<h2 className="lg:text-4xl text-2xl font-semibold text-center mb-5">
					Our Services For Your Special Day
				</h2>
				<div className="flex flex-col md:flex-row items-center gap-10 mb-16">
					{/* Image */}
					<div className="lg:w-1/3">
						<img
							src="/images/temple.png"
							alt="Special Day Services"
							className="w-full rounded-lg"
						/>
					</div>

					{/* Paragraph */}
					<div className="lg:w-2/3 text-gray-700">
						<p className="text-lg leading-7">
							We don't offer traditional services. Instead, we strive to bring
							joy and blessings to You, our devotees.
						</p>
						<p className="mt-4 text-lg leading-7">
							On their special days, we are honored to send heartfelt messages
							filled with divine love and grace.
						</p>
						<p className="mt-4 text-lg leading-7">
							This is our way of connecting with you, ensuring that your
							cherished moments are touched by the temple's blessings.
						</p>
					</div>
				</div>
			</div>
			{/* Devotional Services Section */}
			<div className="w-full py-20 px-10 bg-sky-50">
				<h2 className="text-3xl font-bold text-center text-gray-800">Devotional Services</h2>
				<p className="text-center text-gray-600 mt-4 mb-8">
					Receive heartfelt blessings and messages from the temple on your special day through email and WhatsApp.
				</p>

				<div className="flex lg:flex-row flex-col justify-center lg:gap-24 gap-12">
					{services.map((service) => (
						<div
							key={service.id}
							className="relative w-[300px] h-[300px] flex-shrink-0 rounded-lg overflow-hidden shadow-lg cursor-pointer group"
						>
							<img
								src={service.image}
								alt={service.image}
								className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
							/>
							<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<p className="text-white text-md px-8 text-center font-semibold">{service.text}</p>
							</div>
						</div>
					))}
				</div>

				<div className="flex justify-center mt-8">
					<button
						onClick={() => navigate('/greetings')}
						className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
					>
						Create Campaign
					</button>
				</div>
			</div>
		</section>
	);
};

export default ServicePage;
