import React from "react";
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ onLoginClick }) => {
	const navigate = useNavigate();

	const token = localStorage.getItem('token');
	const user = JSON.parse(localStorage.getItem('user'));
	
	const fullname = user?.firstName + ' ' + user?.lastName;
	const profileImage = 'https://cdn3.iconfinder.com/data/icons/avatars-9/145/Avatar_Dog-1024.png';

	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		navigate('/');
	};

	return (
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
						<span className="text-black font-semibold mr-3 ml-2">{fullname}</span>
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
						onClick={onLoginClick}
						className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-black rounded-lg group bg-white border border-black hover:bg-gradient-to-br hover:from-gray-700 hover:to-gray-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-300"
					>
						<span className="relative uppercase px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
							Login
						</span>
					</button>)}
			</div>
		</nav >
	);
};

export default Navbar;
