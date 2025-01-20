import React from "react";

const Temple = () => {
	return (
		<section className="bg-white lg:mx-20 mx-10 lg:py-20 py-10 flex lg:flex-row flex-col lg:items-center justify-between">
			{/* Image on the Left */}
			<div className="lg:w-1/3 w-2/3">
				<img
					src="/images/temple.png"
					alt="Temple"
					className="w-250 h-250 object-cover"
				/>
			</div>

			{/* Text on the Right */}
			<div className="lg:w-2/3 lg:pl-10">
				<p className="lg:text-lg text-sm mb-6 text-justify">
					[Temple Name] is dedicated to fostering a deeper connection with our devotees. Our Greetings Portal is here to make your birthdays even more special by sending personalized blessings directly from the temple.
				</p>

				{/* Additional Details */}
				<div className="flex lg:space-x-10 space-x-5">
					{/* Group 1 */}
					<div className="text-center">
						<p className="lg:text-2xl font-semibold text-gray-800">+150%</p>
						<p className="lg:text-md text-sm text-gray-500 mt-2">Conversion Rate Increased</p>
					</div>

					{/* Group 2 */}
					<div className="text-center">
						<p className="lg:text-2xl font-semibold text-gray-800">+20M</p>
						<p className="lg:text-md text-sm text-gray-500 mt-2">Amount of Messages in 2023</p>
					</div>

					{/* Group 3 */}
					<div className="text-center">
						<p className="lg:text-2xl font-semibold text-gray-800">+87K</p>
						<p className="lg:text-md text-sm text-gray-500 mt-2">Happy Customers</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Temple;
