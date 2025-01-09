import React, { useState } from "react";

const ConfirmationPopup = ({ isOpen, onClose, onConfirm }) => {
	const [delLoading, setDelLoading] = useState(false);
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg shadow-lg p-6 w-96">
				<h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Deletion</h2>
				<p className="text-gray-600 mb-6">Are you sure you want to delete this greeting? This action cannot be undone.</p>
				<div className="flex justify-end space-x-4">
					<button
						onClick={onClose}
						className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
					>
						Cancel
					</button>
					<button
						onClick={() => {
							setDelLoading(true);
							const isLoading = onConfirm();
							setDelLoading(isLoading);
						}}
						className={`bg-red-600 text-white px-4 py-2 rounded-md ${delLoading ? "bg-red-400 cursor-not-allowed py-4" : "bg-red-600 hover:bg-red-700"
							}`}
					>
						{delLoading ? (
							<div className="flex space-x-1">
								<span className="dot bg-white"></span>
								<span className="dot bg-white"></span>
								<span className="dot bg-white"></span>
							</div>
						) : (
							"Ok"
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmationPopup;
