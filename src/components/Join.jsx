import React from 'react';
import Slider from 'react-slick';

const Join = ({ onRegisterClick }) => {

	const settings = {
		dots: true,
		infinite: true,
		// centerMode: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 4000,
	};

	return (
		<section className="bg-black text-white px-32 py-14 flex items-center justify-between">
			{/* Left content */}
			<div className="w-1/2">
				<h2 className="text-4xl font-bold mb-4">Join Us</h2>
				<p className="text-lg mb-6">
					Be a part of our spiritual family and let us celebrate your special moments together. Sign up today!
				</p>
				<button onClick={onRegisterClick} className="bg-black text-white border-2 border-white py-2 px-6 rounded-lg hover:bg-white hover:text-black hover:border-black">
					Register
				</button>
			</div>

			{/* Right carousel */}
			<div className="w-1/3 ml-10">
				<Slider {...settings}>
					<div>
						<img src="/images/join.png" alt="Image1" className="w-[300px] h-[300px] object-cover" />
					</div>
					<div>
						<img src="/images/join.png" alt="Image2" className="w-[300px] h-[300px] object-cover" />
					</div>
					<div>
						<img src="/images/join.png" alt="Image3" className="w-[300px] h-[300px] object-cover" />
					</div>
				</Slider>
			</div>
		</section>
	);
};

export default Join;
