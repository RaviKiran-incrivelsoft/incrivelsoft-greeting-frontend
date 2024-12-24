import React, { useState } from "react";
import BirthdayCard from "./BirthdayCard";
import TempleGreetings from "./TempleGreetings";

const AddCampaign = ({ isOpen, onClose }) => {
	const [selectedOption, setSelectedOption] = useState("option");
	const sideImage = "/images/addcampaign.png";

	const handleSelectChange = (event) => {
		const value = event.target.value;
		setSelectedOption(value);
	};

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
			onClick={onClose}
		>
			<div
				className="w-full max-w-5xl flex flex-col md:flex-row shadow-2xl rounded-[30px] overflow-hidden bg-white"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Left Section */}
				<div className="w-2/5 bg-gradient-to-br from-white via-blue-100 to-blue-200 p-6 md:p-10 flex flex-col justify-center items-center">
					<h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
						Let’s Get Started!
					</h2>
					<p className="text-lg text-gray-600 text-center mb-6">
						Create a campaign in less than a minute.
					</p>
					<button
						className="bg-white text-black px-6 py-3 rounded-full shadow hover:bg-gray-100 transition"
					>
						View Sample
					</button>
					<img
						className="mt-8 hover:scale-110 transform transition-transform duration-300"
						alt="Preview"
						src="/images/addcampaign.png"
						width={250}
						height={250}
					/>
				</div>

				{/* Right Section */}
				<div className="w-3/5 p-6 md:p-10 bg-white flex flex-col justify-center">
					<div className="text-center mb-6">
						<h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
							Customize Your Card
						</h2>
						<p className="text-gray-500 mt-2">
							Select an occasion, add recipient details, and title.
						</p>
					</div>

					<div className="flex-1">
						<label className="block text-lg font-medium text-gray-700 mb-2">
							Select an occasion:
						</label>
						<select
							className="w-full h-12 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-400 transition text-gray-800"
							value={selectedOption}
							onChange={handleSelectChange}
						>
							<option value="option" disabled>
								Select Option
							</option>
							<option value="Birthday Card">Birthday Card</option>
							<option value="Temple Greetings">Temple Greetings</option>
						</select>

						{/* Conditional Rendering */}
						<div className="mt-6 max-h-[300px] overflow-y-auto
							[&::-webkit-scrollbar]:w-2
							[&::-webkit-scrollbar-track]:rounded-full
							[&::-webkit-scrollbar-track]:bg-gray-100
							[&::-webkit-scrollbar-thumb]:rounded-full
							[&::-webkit-scrollbar-thumb]:bg-gray-300
							grey:[&::-webkit-scrollbar-track]:bg-neutral-700
							grey:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
							{selectedOption === "Birthday Card" && (
								<BirthdayCard selectedOption={selectedOption} sideImage={sideImage} />
							)}

							{selectedOption === "Temple Greetings" && (
								<TempleGreetings selectedOption={selectedOption} sideImage={sideImage} />
							)}

							{!selectedOption && (
								<p className="text-center text-gray-500 mt-4">
									Choose an option to see the preview.
								</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddCampaign;
