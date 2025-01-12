import React from 'react';
import { useNavigate } from 'react-router-dom';

const Process = () => {
	const navigate = useNavigate();
	return (
		<section className="lg:px-32 px-10 py-20 bg-gray-100 flex justify-between items-center">
			{/* Left side image */}
			<div className="lg:flex flex-1 hidden">
				<img
					src="/images/process.png"
					alt="How it works"
					className="w-[400px] h-auto rounded-lg shadow-md"
				/>
			</div>

			{/* Right side content */}
			<div className="flex-1 lg:pl-10">
				<h2 className="lg:text-4xl text-3xl font-semibold mb-4">How it Works</h2>
				<p className="lg:text-lg text-gray-700 mb-6">
					Sign Up With Us, And On Your Birthday, You'll Receive A Personalized Message Filled With
					Blessings From The Temple.
				</p>
				<button onClick={()=> navigate('/service')} className="bg-black text-white border-2 border-white py-3 px-6 rounded-lg hover:bg-white hover:text-black hover:border-black">
					Discover More
				</button>
			</div>
		</section>
	);
};

export default Process;
