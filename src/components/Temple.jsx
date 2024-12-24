import React from "react";

const Temple = () => {
	return (
		<section className="bg-white mx-20 py-20 flex items-center justify-between">
			{/* Image on the Left */}
			<div className="w-1/3">
				<img
					src="/images/temple.png"
					alt="Temple"
					className="w-250 h-250 object-cover"
				/>
			</div>

			{/* Text on the Right */}
			<div className="w-2/3 pl-10">
				<p className="text-lg mb-6">
					[Temple Name] is dedicated to fostering a deeper connection with our devotees. Our Greetings Portal is here to make your birthdays even more special by sending personalized blessings directly from the temple.
				</p>

				{/* Additional Details */}
				<div className="flex space-x-10">
					{/* Group 1 */}
					<div className="text-center">
						<p className="text-2xl font-semibold text-gray-800">+150%</p>
						<p className="text-md text-gray-500 mt-2">Conversion Rate Increased</p>
					</div>

					{/* Group 2 */}
					<div className="text-center">
						<p className="text-2xl font-semibold text-gray-800">+20M</p>
						<p className="text-md text-gray-500 mt-2">Amount of Messages in 2023</p>
					</div>

					{/* Group 3 */}
					<div className="text-center">
						<p className="text-2xl font-semibold text-gray-800">+87K</p>
						<p className="text-md text-gray-500 mt-2">Happy Customers</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Temple;
