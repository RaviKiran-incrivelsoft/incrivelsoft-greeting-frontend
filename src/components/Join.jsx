import React from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';

const Join = ({ onRegisterClick }) => {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const settings = {
		dots: true,
		infinite: true,
		// centerMode: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		pauseOnHover: false,
		autoplaySpeed: 3000,
	};

	return (
		<section className="bg-black text-white lg:px-32 px-10 py-14 flex lg:flex-row flex-col items-center justify-between">
			{/* Left content */}
			<div className="lg:w-1/2">
				<h2 className="lg:text-4xl text-2xl font-bold mb-4">Join Us</h2>
				<p className="text-lg mb-6">
					Be a part of our spiritual family and let us celebrate your special moments together. Sign up today!
				</p>
				{token ?
					<button onClick={() => navigate('/greetings')} className="bg-black text-white border-2 border-white py-2 px-6 rounded-lg hover:bg-white hover:text-black hover:border-black">
						Dashboard
					</button>
					:
					<button onClick={onRegisterClick} className="bg-black text-white border-2 border-white py-2 px-6 rounded-lg hover:bg-white hover:text-black hover:border-black">
						Register
					</button>
				}
			</div>

			{/* Right carousel */}
			<div className="lg:w-1/3 w-3/4 lg:ml-10 lg:mt-0 mt-10">
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
