import React, { useState } from "react";
import { BsEnvelope } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { GiBigDiamondRing } from "react-icons/gi";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { MdOutlineEventNote, MdOutlineTempleHindu } from "react-icons/md";
import { PiBuildingOffice } from "react-icons/pi";
import BirthdayGreetings from "./BirthdayGreetings";
import FestivalGreetings from "./FestivalGreetings";
import MarriageDetails from "./MarriageDetails";
import EventComponent from "./EventComponent";
import TempleGreetings from "./TempleGreetings";
import CompanyDetails from "./CompanyPopup";

const Dropdown = ({ togglePost }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [activeComponent, setActiveComponent] = useState(null);

	const toggleGreeting = () => {
		setActiveComponent(null);
		setIsOpen(false);
	}


	
	const componentMap = {
		Birthday: <BirthdayGreetings closeModal={toggleGreeting} AddPost={togglePost} />,
		Festival: <FestivalGreetings closeModal={toggleGreeting} AddPost={togglePost} />,
		Marriage: <MarriageDetails closeModal={toggleGreeting} AddPost={togglePost} />,
		Events: <EventComponent closeModal={toggleGreeting} AddPost={togglePost} />,
		Temple: <TempleGreetings closeModal={toggleGreeting} AddPost={togglePost} />,
		Company: <CompanyDetails closeModal={toggleGreeting} AddPost={togglePost} />,
	};

	return (
		<div
			className="relative inline-flex"
			onMouseEnter={() => setIsOpen(true)}
		>
			<button
				type="button"
				onMouseLeave={() => setIsOpen(false)}
				className="flex items-center mr-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
				aria-haspopup="menu"
				aria-expanded={isOpen ? "true" : "false"}
				aria-label="Dropdown"
			>
				<FaPlus className="mr-2" />
				Add Greetings
				<svg
					className={`ml-2 transform transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`}
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					onClick={() => setIsOpen(!isOpen)}
				>
					<path d="m6 9 6 6 6-6" />
				</svg>
			</button>

			{isOpen && (
				<div
					className="absolute top-10 z-10 transition-opacity opacity-100 min-w-[180px] bg-white shadow-md rounded-lg"
					role="menu"
					onMouseEnter={() => setIsOpen(true)}
					aria-orientation="vertical"
				>
					<div className="p-1 space-y-0.5">
						<span
							className="flex items-center gap-x-3.5 py-2 px-3 cursor-pointer rounded-lg text-gray-800 hover:bg-sky-100 focus:outline-none focus:bg-gray-100"
							onClick={() => setActiveComponent("Birthday")}
						>
							<LiaBirthdayCakeSolid /> Birthday
						</span>
						<span
							className="flex items-center gap-x-3.5 py-2 px-3 cursor-pointer rounded-lg text-gray-800 hover:bg-sky-100 focus:outline-none focus:bg-gray-100"
							onClick={() => setActiveComponent("Festival")}
						>
							<MdOutlineEventNote /> Festival
						</span>
						<span
							className="flex items-center gap-x-3.5 py-2 px-3 cursor-pointer rounded-lg text-gray-800 hover:bg-sky-100 focus:outline-none focus:bg-gray-100"
							onClick={() => setActiveComponent("Marriage")}
						>
							<GiBigDiamondRing /> Marriage
						</span>
						<span
							className="flex items-center gap-x-3.5 py-2 px-3 cursor-pointer rounded-lg text-gray-800 hover:bg-sky-100 focus:outline-none focus:bg-gray-100"
							onClick={() => setActiveComponent("Events")}
						>
							<BsEnvelope /> Events
						</span>
						<span
							className="flex items-center gap-x-3.5 py-2 px-3 cursor-pointer rounded-lg text-gray-800 hover:bg-sky-100 focus:outline-none focus:bg-gray-100"
							onClick={() => setActiveComponent("Temple")}
						>
							<MdOutlineTempleHindu /> Temple
						</span>
						<span
							className="flex items-center gap-x-3.5 py-2 px-3 cursor-pointer rounded-lg text-gray-800 hover:bg-sky-100 focus:outline-none focus:bg-gray-100"
							onClick={() => setActiveComponent("Company")}
						>
							<PiBuildingOffice /> Company
						</span>
					</div>

					{/* Render the Selected Component */}
					{activeComponent && componentMap[activeComponent]}
				</div>
			)}
		</div>
	);
};

export default Dropdown;
