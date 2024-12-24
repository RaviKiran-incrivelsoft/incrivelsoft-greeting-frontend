import React from "react";

const BirthdayCard = ({ sideImage, selectedOption }) => {
	return (
		<div>
			<h3 className="text-lg font-bold mb-4">Birthday Card Details</h3>
			<form>
				<div className="mb-4">
					<label className="block text-sm font-medium mb-2">Recipient Name:</label>
					<div className="flex space-x-2">
						<input
							type="text"
							placeholder="First Name"
							className="w-1/2 p-2 border rounded"
						/>
						<input
							type="text"
							placeholder="Last Name"
							className="w-1/2 p-2 border rounded"
						/>
					</div>
				</div>
				<div className="mb-4">
					<label className="block text-sm font-medium mb-2">Title:</label>
					<input
						type="text"
						placeholder="Enter Title"
						className="w-full p-2 border rounded"
					/>
				</div>
				<button
					type="button"
					className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
				>
					Next
				</button>
			</form>
		</div>
	);
};

export default BirthdayCard;
