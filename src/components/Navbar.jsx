import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ onLoginClick }) => {
	const navigate = useNavigate();
	const [profileImage, setProfileImage] = useState('/avatars/cat.png');

	const images = [
		"bear", "cat", "chicken", "deer", "dog",
		"eagle", "giraffe", "meerkat", "panda", "sealion",
		"lion", "cow", "dragon", "duck", "hippopotamus",
		"koala", "wolf", "fox", "rabbit", "monkey", "fish", "wrabbit"
	];

	function getRandomImage() {
		const randomIndex = Math.floor(Math.random() * images.length);
		setProfileImage(`/avatars/${images[randomIndex]}.png`);
	}
	const token = localStorage.getItem('token');
	const userName = localStorage.getItem('userName');


	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('userName');
		navigate('/');
	};

	return (
		<>
			<nav className="bg-white">
				<div className="px-10 py-4 flex items-center justify-between">
					{/* Logo */}
					<img src="/images/logo.png" alt="Logo" className="h-16" />

					{/* Links */}
					<div className="flex space-x-6">
						<Link
							to="/"
							className="text-gray-600 hover:text-gray-800 hover:underline hover:underline-offset-8 mr-4"
						>
							Home
						</Link>
						{token &&
							<Link
								to="/greetings"
								className="text-gray-600 hover:text-gray-800 hover:underline hover:underline-offset-8 mr-4"
							>
								Dashboard
							</Link>}
						<Link
							to="/service"
							className="text-gray-600 hover:text-gray-800 hover:underline hover:underline-offset-8 mr-4"
						>
							Services
						</Link>
						<Link
							to="/contact"
							className="text-gray-600 hover:text-gray-800 hover:underline hover:underline-offset-8"
						>
							Contact
						</Link>
					</div>

					{token ? (
						<div className="flex items-center ml-4">
							{/* Profile Image (Round) */}
							<img
								src={profileImage}
								alt="Profile"
								className="w-10 h-10 rounded-full mr-2"
							/>
							{/* User */}
							<span className="text-black font-semibold mr-3 ml-2">{userName}</span>
							{/* Logout Button */}
							<button
								onClick={handleLogout}
								className="bg-red-500 text-white px-4 py-2 rounded-lg"
							>
								Logout
							</button>
						</div>
					) : (
						< button
							onClick={() => { getRandomImage(); onLoginClick() }}
							className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-black rounded-lg group bg-white border border-black hover:bg-gradient-to-br hover:from-gray-700 hover:to-gray-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-300"
						>
							<span className="relative uppercase px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
								Login
							</span>
						</button>)}
				</div>
			</nav >
		</>
	);
};

export default Navbar;
