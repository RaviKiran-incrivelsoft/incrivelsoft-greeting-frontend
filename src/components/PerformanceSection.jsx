import React, { useState } from "react";

const PerformanceSection = () => {
	const [openIndex, setOpenIndex] = useState(null);

	const sections = [
		{
			title: "Custom Edit Tool Application",
			content:
				"Our advanced editing tool allows users to customize their workflow efficiently. It provides intuitive controls, real-time updates, and seamless integration with existing systems.",
		},
		{
			title: "Built-In Safety Chat Mode Enabled",
			content:
				"A secure chat environment with end-to-end encryption ensures confidential communication. The safety mode automatically detects and prevents unauthorized access to sensitive conversations.",
		},
		{
			title: "Foster Trust Builds System Always Open",
			content:
				"Transparency and reliability are at the core of our platform. We implement advanced security measures and real-time monitoring to ensure a trustworthy environment for all users.",
		},
		{
			title: "Create Auto Layouts In App Interface",
			content:
				"Our smart auto-layout feature dynamically adapts the interface based on user preferences. It optimizes the screen space, maintains consistency, and enhances the overall user experience.",
		},
	];

	return (
		<div className="flex items-center justify-center gap-20 lg:px-32 px-12 lg:py-24 py-12">
			{/* Left Side - Images */}
			<div className="lg:w-1/2 hidden lg:flex flex-col md:flex-row gap-4">
				{/* Large Image */}
				<img
					src="/images/dashboard.png"
					alt="Large"
					className="w-full md:w-1/2 rounded-lg shadow-lg"
				/>
				{/* Two stacked images */}
				<div className="flex flex-col gap-4 justify-center">
					<img
						src="/images/count.png"
						alt="Medium"
						className="w-2/3 rounded-lg shadow-lg"
					/>
					<img
						src="/images/summary.png"
						alt="Small"
						className="w-full md:w-48 rounded-lg shadow-lg"
					/>
				</div>
			</div>

			{/* Right Side - Content */}
			<div className="lg:w-1/2">
				<h2 className="lg:text-3xl text-xl font-bold text-gray-800">
					Performance Is The Key To Most People Achieving A Better Future
				</h2>
				<p className="text-gray-600 mt-4 lg:text-base text-sm">
					Unlock new possibilities with cutting-edge technology designed to
					enhance efficiency, streamline workflows, and provide unparalleled
					user experiences.
				</p>

				{/* Accordion Sections */}
				<div className="mt-6">
					{sections.map((item, index) => (
						<div key={index} className="border-b border-gray-300 py-4">
							<button
								className="flex justify-between items-center w-full text-left focus:outline-none"
								onClick={() => setOpenIndex(openIndex === index ? null : index)}
							>
								<span className="lg:text-lg font-semibold text-gray-700">
									{item.title}
								</span>
								<span className="text-gray-500 text-2xl transition-transform duration-300 ease-in-out">
									{openIndex === index ? "−" : "+"}
								</span>
							</button>
							<div
								className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
									}`}
							>
								<p className="mt-2 text-gray-600 lg:text-base text-sm">{item.content}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default PerformanceSection;
