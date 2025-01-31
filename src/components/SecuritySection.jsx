import React from "react";

const SecuritySection = () => {
	return (
		<div className="flex items-center justify-center gap-10 lg:px-32 px-12 lg:py-20 py-14 lg:text-black lg:bg-white text-white bg-black">
			{/* Left Side */}
			<div className="lg:w-1/2">
				<h2 className="lg:text-3xl text-xl font-bold lg:text-gray-800">
					Better Security To Better Protection An Experience Of Strength.
				</h2>
				<p className="text-gray-400 lg:text-gray-600 mt-4">
					Our platform ensures high-level security and a seamless experience
					with top-tier protection.
				</p>
				<hr className="border-t-2 border-gray-300 my-10 w-full" />

				<div className="mt-4">
					<h3 className="lg:text-xl font-semibold lg:text-gray-700">
						Well Organised User Interface
					</h3>
					<p className="text-gray-400 lg:text-gray-600 my-2">
						A structured and intuitive UI for smooth user interaction.
					</p>
				</div>

				<div className="mt-4">
					<h3 className="lg:text-xl font-semibold lg:text-gray-700">
						Completely Bug Free
					</h3>
					<p className="text-gray-400 lg:text-gray-600 my-2">
						We ensure a flawless experience with rigorous testing.
					</p>
				</div>
			</div>

			{/* Center Arrow */}
			<div className="hidden lg:block self-start">
				<img src="/images/arrow.png" alt="Arrow" className="w-14" />
			</div>

			{/* Right Side */}
			<div className="lg:w-1/2 h-full hidden lg:flex flex-col items-center relative">
				<img
					src="/images/savings.png"
					alt="savings"
					className="w-48 lg:w-72 rounded-lg shadow-lg self-end mb-24"
				/>
				<img
					src="/images/graph.png"
					alt="graph"
					className="w-36 lg:w-60 rounded-lg shadow-lg absolute bottom-16 left-0"
				/>
				<img
					src="/images/users.png"
					alt="users"
					className="w-24 lg:w-36 rounded-lg shadow-lg absolute bottom-0 left-42"
				/>
			</div>
		</div>
	);
};

export default SecuritySection;
