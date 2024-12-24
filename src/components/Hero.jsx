import React from "react";

const Hero = () => {
	return (
		<section className="bg-white mx-20 py-10 flex items-center justify-between">
			{/* Text on the Left */}
			<div className="w-2/3">
				<h1 className="text-5xl leading-[4rem] font-bold text-gray-800">
					Celebrating Your <br />Special Day with Us
				</h1>
			</div>

			{/* Image on the Right */}
			<div className="w-1/3 flex items-center justify-end">
				<img
					src="/images/specialday.png"
					alt="Special Day"
					className="w-[350px] h-[350px] object-cover"
				/>
			</div>
		</section>
	);
};

export default Hero;
