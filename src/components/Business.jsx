import React from 'react';

const Business = () => {
	return (
		<section className="py-20 px-10 bg-gray-100 text-center">
			<h2 className="text-2xl font-bold mb-4">Say Hello to Market!</h2>

			{/* Paragraph */}
			<p className="text-lg mb-6">
				Sign up for our Newsletter and receive the latest updates!
			</p>

			{/* Form */}
			<div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
				<div className="mb-4">
					<input
						type="text"
						placeholder="Enter your name"
						className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
					/>
				</div>
				<div className="mb-6">
					<input
						type="email"
						placeholder="Enter your email"
						className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
					/>
				</div>
				<button className="bg-black text-white border-2 border-white py-2 px-6 rounded-lg hover:bg-white hover:text-black hover:border-black">
					Join
				</button>
			</div>

			{/* Horizontal Line */}
			<div className="my-16 mx-auto w-1/2 border-t-2 border-gray-400"></div>

			{/* Title */}
			<h2 className="lg:text-4xl text-xl lg:mb-16 mb-10">
				OVER 1K+ BUSINESSES GROWING WITH Market
			</h2>

			{/* Images */}
			<div className="flex lg:flex-row flex-wrap justify-center lg:gap-16 gap-10">
				<img src="/images/spotify.svg" alt="Business 1" className="lg:w-[150px] w-[100px] h-auto object-contain" />
				<img src="/images/dropbox.svg" alt="Business 2" className="lg:w-[150px] w-[100px] h-auto object-contain" />
				<img src="/images/google.svg" alt="Business 3" className="lg:w-[150px] w-[100px] h-auto object-contain" />
				<img src="/images/airbnb.svg" alt="Business 4" className="lg:w-[150px] w-[100px] h-auto object-contain" />
				<img src="/images/envato.svg" alt="Business 5" className="lg:w-[150px] w-[100px] h-auto object-contain" />
			</div>
		</section>
	);
};

export default Business;
