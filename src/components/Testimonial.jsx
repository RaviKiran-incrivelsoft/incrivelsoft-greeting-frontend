import React from 'react';

const Testimonial = () => {
	return (
		<section className="bg-cover bg-no-repeat bg-center w-full py-20 px-10 bg-gray-100 text-center relative"
			style={{ backgroundImage: "url('/images/testimonial.png')" }}
		>
			{/* Overlay for the background */}
			<div className="absolute inset-0 bg-black opacity-30"></div>

			{/* Title and Description */}
			<div className="relative z-10 max-w-4xl mx-auto text-white">
				<h2 className="lg:text-4xl text-3xl font-semibold mb-4">What people say</h2>
				<p className="lg:text-lg mb-12">
					Make your birthdays even more special by sending personalized blessings directly from the temple.
					Join our Greetings Portal and feel the love and blessings of our spiritual family.
				</p>
			</div>

			{/* Testimonials */}
			<div className="relative z-10 max-w-6xl mx-auto flex justify-center gap-8 flex-wrap">
				{/* Testimonial 1 */}
				<div className="bg-white text-black p-8 rounded-lg shadow-xl max-w-xs w-full transform transition-transform duration-300 hover:scale-105">
					<div className="mb-6">
						<svg className="w-12 h-12 text-yellow-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9l2 2-2 2m4 0l2 2-2 2m0-8l2 2-2 2m4 0l2 2-2 2m0-4l-2-2 2-2m-4 0l-2-2 2-2M2 12h8m4 0h8" />
						</svg>
					</div>
					<p className="text-lg mb-4">
						"I received a birthday blessing from the temple, and it truly made my day special. The personalized message was heartfelt and meaningful."
					</p>
					<div className="font-semibold">Rajesh Kumar</div>
					<div className="text-sm text-gray-500">New Delhi, India</div>
				</div>

				{/* Testimonial 2 */}
				<div className="bg-white text-black p-8 rounded-lg shadow-xl max-w-xs w-full transform transition-transform duration-300 hover:scale-105">
					<div className="mb-6">
						<svg className="w-12 h-12 text-yellow-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9l2 2-2 2m4 0l2 2-2 2m0-8l2 2-2 2m4 0l2 2-2 2m0-4l-2-2 2-2m-4 0l-2-2 2-2M2 12h8m4 0h8" />
						</svg>
					</div>
					<p className="text-lg mb-4">
						"The personalized blessings I received from the temple on my birthday were beyond my expectations. It felt so personal, and the message brought tears to my eyes."
					</p>
					<div className="font-semibold">Priya Sharma</div>
					<div className="text-sm text-gray-500">Mumbai, India</div>
				</div>

				{/* Testimonial 3 */}
				<div className="bg-white text-black p-8 rounded-lg shadow-xl max-w-xs w-full transform transition-transform duration-300 hover:scale-105">
					<div className="mb-6">
						<svg className="w-12 h-12 text-yellow-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9l2 2-2 2m4 0l2 2-2 2m0-8l2 2-2 2m4 0l2 2-2 2m0-4l-2-2 2-2m-4 0l-2-2 2-2M2 12h8m4 0h8" />
						</svg>
					</div>
					<p className="text-lg mb-4">
						"I was truly touched by the thoughtful birthday message from the temple. It was more than just a greeting – it was a blessing from the heart!"
					</p>
					<div className="font-semibold">Anil Mehta</div>
					<div className="text-sm text-gray-500">Bangalore, India</div>
				</div>
			</div>
		</section>
	);
};

export default Testimonial;
