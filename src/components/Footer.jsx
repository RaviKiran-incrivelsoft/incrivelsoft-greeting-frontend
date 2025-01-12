import React from 'react'
import { useNavigate } from 'react-router-dom';

const Footer = () => {
	const navigate = useNavigate();

	return (
		<footer className="w-full bg-black py-10 lg:px-20 px-10">
			<div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
				{/* Left Section */}
				<div className="flex flex-col">
					<img className="w-[158px] h-[70px] object-cover mb-5" alt="logo" src="/images/logo.png" />
					<p className="text-[#bbbbbb]">
						Sign up with us, and on your birthday, you'll receive a personalized message filled with blessings from the temple.
					</p>
				</div>

				{/* Middle Section */}
				<div className="flex flex-col">
					<h2 className="text-white text-2xl font-bold mb-4">Our services</h2>
					<p className="text-[#bbbbbb]">
						Birthday Wishes <br />
						Community Engagement <br />
						Event Notification <br />
						Special Day Wishes
					</p>
				</div>

				{/* Quick Links */}
				<div className="flex flex-col">
					<h2 className="text-white text-2xl font-bold mb-4">Quick link</h2>
					<p className="text-[#999] cursor-pointer hover:text-white" onClick={()=>navigate('/')}>Home</p>
					<p className="text-[#999] cursor-pointer hover:text-white" onClick={()=>navigate('/greetings')}>Greetings</p>
					<p className="text-[#999] cursor-pointer hover:text-white" onClick={()=>navigate('/templates')}>Templates</p>
				</div>

				{/* Right Section */}
				<div className="flex flex-col">
					<h2 className="text-white text-2xl font-bold mb-4">Contact us</h2>
					<div className="flex items-center gap-3 mb-2">
						<img className="rounded-full w-[2rem] h-[2rem]" src="/images/location.jpg" alt="Location" />
						<span className="text-white">India</span>
					</div>
					<div className="flex items-center gap-3 mb-2">
						<img className="w-[2rem] h-[2rem]" src="/images/email.jpg" alt="Email" />
						<a href="mailto:hr@incrivelsoft.com" className="text-white">hr@incrivelsoft.com</a>
					</div>
					<div className="flex items-center gap-3">
						<img className="w-[2rem] h-[2rem]" src="/images/phone.jpg" alt="Phone" />
						<a href="tel:+91123456789" className="text-white">+91 7032880286</a>
					</div>
				</div>
			</div>

			{/* Footer Bottom */}
			<div className="mt-10 border-t border-gray-500 pt-5 text-center">
				<p className="text-[#bbbbbb]">
					Copyright © {new Date().getFullYear()} <span className="text-white">incrivelsoft</span>
				</p>
			</div>
		</footer>
	);
}

export default Footer