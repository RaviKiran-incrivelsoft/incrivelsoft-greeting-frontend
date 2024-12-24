import React, { useState, useEffect } from "react";
import axios from "axios";

const DeliverySettings = ({ onClose, campaignId, setCampaignStatus }) => {
	const [deadline, setDeadline] = useState("");
	const [scheduleTime, setScheduleTime] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [confirmationMessage, setConfirmationMessage] = useState("");
	const [alreadyScheduled, setAlreadyScheduled] = useState(false);

	// Check if the campaign is already scheduled when the component mounts
	useEffect(() => {
		const checkIfAlreadyScheduled = async () => {
			try {
				const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/campaigns/${campaignId}`);
				if (response.data.scheduled) {
					setAlreadyScheduled(true);
				}
			} catch (error) {
				console.error("Error checking campaign schedule status:", error.response?.data || error.message);
				setErrorMessage("Error fetching campaign status. Please try again.");
			}
		};

		if (campaignId) {
			checkIfAlreadyScheduled();
		}
	}, [campaignId]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (alreadyScheduled) {
			setErrorMessage("This campaign has already been scheduled.");
			return;
		}

		if (!deadline || !scheduleTime) {
			setErrorMessage("Please select both a valid date and time.");
			return;
		}

		const selectedDateTime = new Date(`${deadline}T${scheduleTime}`);
		const currentDateTime = new Date();

		if (selectedDateTime < currentDateTime) {
			setErrorMessage("Cannot schedule a campaign for a past date.");
			return;
		}

		const formattedDeadline = selectedDateTime.toISOString();

		const data = {
			deadline: formattedDeadline,
			schedule_time: scheduleTime,
			deliveryType: "scheduled",
			campaignId: campaignId || "default_campaign",
		};

		try {
			const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/schedule`, data);
			console.log("Delivery scheduled:", response.data);
			setConfirmationMessage("Delivery scheduled successfully!");
			setErrorMessage("");

			if (setCampaignStatus) {
				setCampaignStatus(campaignId, "Scheduled", deadline, scheduleTime);
			}
		} catch (error) {
			console.error("Error scheduling delivery:", error.response?.data || error.message);
			setErrorMessage("Error scheduling delivery. Please try again.");
		}
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
			<div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold">Schedule Campaign</h2>
					<button onClick={onClose} className="text-gray-500 hover:text-gray-700">
						&times;
					</button>
				</div>

				{errorMessage && (
					<div className="text-red-600 text-sm mb-4">{errorMessage}</div>
				)}

				{confirmationMessage && (
					<div className="text-green-600 text-sm mb-4">{confirmationMessage}</div>
				)}

				{alreadyScheduled ? (
					<div className="text-gray-500 text-sm mb-4">
						This campaign has already been scheduled.
					</div>
				) : (
					<form onSubmit={handleSubmit}>
						<div className="mb-4">
							<label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
								Select Date
							</label>
							<input
								type="date"
								id="deadline"
								value={deadline}
								onChange={(e) => setDeadline(e.target.value)}
								className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>

						<div className="mb-4">
							<label htmlFor="scheduleTime" className="block text-sm font-medium text-gray-700">
								Select Time
							</label>
							<input
								type="time"
								id="scheduleTime"
								value={scheduleTime}
								onChange={(e) => setScheduleTime(e.target.value)}
								className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>

						<div className="flex justify-between mt-4">
							<button
								type="button"
								onClick={onClose}
								className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
							>
								Cancel
							</button>
							<button
								type="submit"
								className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
							>
								Schedule
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
};

export default DeliverySettings;
