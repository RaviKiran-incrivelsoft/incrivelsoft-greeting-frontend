import React from "react";

const Hero = () => {
	return (
		<section className="bg-white lg:mx-20 mx-10 py-10 flex items-center justify-between">
			{/* Text on the Left */}
			<div className="lg:w-2/3 w-1/2">
				<h1 className="lg:text-5xl text-base lg:leading-[4rem] font-bold text-gray-800">
					Celebrating Your Special Day with Us
				</h1>
			</div>

			{/* Image on the Right */}
			<div className="lg:w-1/3 w-1/2 flex items-center justify-end">
				<img
					src="/images/specialday.png"
					alt="Special Day"
					className="lg:w-[350px] lg:h-[350px] object-cover"
				/>
			</div>
		</section>
	);
};

export default Hero;
