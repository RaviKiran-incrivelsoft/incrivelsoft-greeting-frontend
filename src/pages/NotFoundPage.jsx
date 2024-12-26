import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
	return (
		<div className="text-center">
			<main className="h-[70vh] w-full flex flex-col justify-center items-center bg-sky-700">
				<h1 className="text-9xl font-extrabold text-white tracking-widest">404</h1>
				<div className="bg-[#f79538] px-2 font-semibold rounded rotate-12 absolute">
					Page Not Found
				</div>
				<button className="mt-5 relative inline-block text-sm font-medium text-[#f79538] group active:text-orange-500 focus:outline-none focus:ring">
					<span
						className="absolute inset-0 transition-transform translate-x-0 translate-y-0 bg-[#f79538] group-hover:translate-y-0.5 group-hover:translate-x-0.5"
					></span>
					<Link
						to="/"
						className="relative flex px-6 py-3 bg-[#1A2238] border-current border-2 transition-transform translate-x-0 translate-y-0 group-hover:translate-y-[-2px] group-hover:translate-x-[-2px]"
					>
						<div className="relative mr-4">
							<svg className="mx-auto h-6 w-6 text-[#f79538] moving-diagonal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
							</svg>
						</div>
						Go Back Home
					</Link>
				</button>
			</main>
		</div>
	);
};

export default NotFoundPage;
