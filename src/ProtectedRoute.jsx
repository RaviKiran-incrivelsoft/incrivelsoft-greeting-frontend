import React, { useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { Navigate, useNavigate } from "react-router-dom";

// Component to handle session expiration popup
const SessionExpiredPopup = ({ onConfirm }) => (
	<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div className="bg-white rounded-lg shadow-lg p-6 w-96">
			<h2 className="text-xl font-semibold text-gray-800 mb-4">Session Expired</h2>
			<p className="text-gray-600 mb-6">
				Your session has expired. Please log in again to continue.
			</p>
			<div className="flex justify-end">
				<button
					onClick={onConfirm}
					className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
				>
					Go to Home
				</button>
			</div>
		</div>
	</div>
);

const isAuthenticated = (setSessionExpired) => {
	const token = localStorage.getItem("token");
	if (!token) return false;

	try {
		const decoded = jwtDecode(token);
		if (decoded.exp * 1000 < Date.now()) {
			localStorage.clear();
			setSessionExpired(true);
			return false;
		}
		return true;
	} catch (error) {
		localStorage.clear();
		setSessionExpired(true);
		return false;
	}
};

const ProtectedRoute = ({ element }) => {
	const [sessionExpired, setSessionExpired] = useState(false);
	const navigate = useNavigate();

	if (sessionExpired) {
		return (
			<SessionExpiredPopup
				onConfirm={() => {
					navigate("/");
				}}
			/>
		);
	}

	return isAuthenticated(setSessionExpired) ? element : <Navigate to="/" replace />;
};

export default ProtectedRoute;
