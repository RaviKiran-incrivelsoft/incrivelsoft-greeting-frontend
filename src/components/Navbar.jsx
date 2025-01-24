import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = ({ onLoginClick }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const isActive = (path) => location.pathname === path;
	const [profileImage, setProfileImage] = useState("/avatars/deer.png");
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const images = [
		"bear", "cat", "chicken", "deer", "dog", "eagle", "giraffe", "meerkat", "panda",
		"sealion", "lion", "cow", "dragon", "duck", "hippopotamus", "koala", "wolf", "fox",
		"rabbit", "monkey", "fish", "wrabbit",
	];

	function getRandomImage() {
		const randomIndex = Math.floor(Math.random() * images.length);
		setProfileImage(`/avatars/${images[randomIndex]}.png`);
	}

	const role = localStorage.getItem("role");
	useEffect(() => {
		if (role === "admin") {
			setProfileImage('/avatars/admin.png');
		}
	}, [role]);
	const token = localStorage.getItem("token");
	const userName = localStorage.getItem("userName");
	const handleLogout = () => {
		localStorage.clear();
		navigate("/");
	};

	return (
		<nav className="bg-white">
			<div className="px-10 py-4 flex items-center justify-between">
				{/* Logo */}
				<img src="/images/logo.png" alt="Logo" className="h-16" />

				{/* Hamburger Menu */}
				<div className="lg:hidden flex gap-2">
					{token &&
						<img
							src={profileImage}
							alt="Profile"
							className="w-10 h-10 rounded-full mr-2"
						/>
					}
					<button
						className="block text-gray-600 focus:outline-none"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 6h16M4 12h16m-7 6h7"
							/>
						</svg>
					</button>
				</div>

				{/* Links (Desktop) */}
				<div className={`hidden space-x-6 ${role === 'admin' ? 'lg:hidden' : 'lg:flex'}`}>
					<Link
						to="/"
						className={`${isActive("/") ? "text-gray-800 underline underline-offset-8" : "text-gray-600"
							} hover:text-gray-800`}
					>
						Home
					</Link>
					{token && (
						<Link
							to="/greetings"
							className={`${isActive("/greetings") || isActive("/templates") || isActive("/addpost") || isActive("/analytics")
								? "text-gray-800 underline underline-offset-8"
								: "text-gray-600"
								} hover:text-gray-800`}
						>
							Dashboard
						</Link>
					)}
					<Link
						to="/service"
						className={`${isActive("/service") ? "text-gray-800 underline underline-offset-8" : "text-gray-600"
							} hover:text-gray-800`}
					>
						Services
					</Link>
					<Link
						to="/contact"
						className={`${isActive("/contact") ? "text-gray-800 underline underline-offset-8" : "text-gray-600"
							} hover:text-gray-800`}
					>
						Contact
					</Link>
					{token && (
						<Link
							to="/support"
							className={`${isActive("/support")
								? "text-gray-800 underline underline-offset-8"
								: "text-gray-600"
								} hover:text-gray-800`}
						>
							Support
						</Link>
					)}
				</div>

				{/* Profile Section */}
				{token ? (
					<div className="hidden lg:flex items-center ml-4">
						<img
							src={profileImage}
							alt="Profile"
							className="w-10 h-10 rounded-full mr-2"
						/>
						<span className="text-black font-semibold mr-3 ml-2">{userName}</span>
						<button
							onClick={handleLogout}
							className="bg-red-500 text-white px-4 py-2 rounded-lg"
						>
							Logout
						</button>
					</div>
				) : (
					<button
						onClick={() => {
							getRandomImage();
							onLoginClick();
						}}
						className="hidden lg:inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-black rounded-lg group bg-white border border-black hover:bg-gray-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-300"
					>
						<span className="relative px-5 py-2.5 transition-all duration-75 bg-white rounded-md group-hover:bg-opacity-0">
							Login
						</span>
					</button>
				)}
			</div>

			{/* Links (Mobile) */}
			<div
				className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
					}`}
			>
				<div className="px-4 py-2 space-y-4 text-center bg-white shadow-md">
					<Link
						to="/"
						className={`${isActive("/") ? "text-gray-800 underline underline-offset-8" : "text-gray-600"
							} hover:text-gray-800 block`}
						onClick={() => setIsMenuOpen(false)}
					>
						Home
					</Link>
					{token && (
						<Link
							to="/greetings"
							className={`${isActive("/greetings") || isActive("/templates") || isActive("/analytics") || isActive("/addpost")
								? "text-gray-800 underline underline-offset-8"
								: "text-gray-600"
								} hover:text-gray-800 block`}
							onClick={() => setIsMenuOpen(false)}
						>
							Dashboard
						</Link>
					)}
					<Link
						to="/service"
						className={`${isActive("/service") ? "text-gray-800 underline underline-offset-8" : "text-gray-600"
							} hover:text-gray-800 block`}
						onClick={() => setIsMenuOpen(false)}
					>
						Services
					</Link>
					<Link
						to="/contact"
						className={`${isActive("/contact") ? "text-gray-800 underline underline-offset-8" : "text-gray-600"
							} hover:text-gray-800 block`}
						onClick={() => setIsMenuOpen(false)}
					>
						Contact
					</Link>
					{token && (
						<Link
							to="/support"
							className={`${isActive("/support") ? "text-gray-800 underline underline-offset-8" : "text-gray-600"
								} hover:text-gray-800 block`}
							onClick={() => setIsMenuOpen(false)}
						>
							Support
						</Link>
					)}
					{token ? (
						<button
							onClick={() => {
								handleLogout();
								setIsMenuOpen(false);
							}}
							className="w-fit bg-red-500 text-white px-4 py-2 rounded-lg"
						>
							Logout
						</button>
					) : (
						<button
							onClick={() => {
								getRandomImage();
								onLoginClick();
								setIsMenuOpen(false);
							}}
							className="w-fit bg-gray-800 text-white px-4 py-2 rounded-lg"
						>
							Login
						</button>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
