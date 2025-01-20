import React, { useEffect, useState } from "react";
import { BsEnvelope } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { GiBigDiamondRing } from "react-icons/gi";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { MdOutlineEventNote, MdOutlineTempleHindu } from "react-icons/md";
// import { PiBuildingOffice } from "react-icons/pi";
// import CompanyDetails from "./CompanyPopup";
import BirthdayGreetings from "./BirthdayGreetings";
import FestivalGreetings from "./FestivalGreetings";
import EventComponent from "./EventComponent";
import TempleGreetings from "./TempleGreetings";
import AnniversaryGreetings from "./AnniversaryGreetings";

const Dropdown = ({ fetchData }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [activeComponent, setActiveComponent] = useState(null);

	useEffect(() => {
		const popup = sessionStorage.getItem('greetingsPopup');
		const component = sessionStorage.getItem('activeComponent');
		if (popup) {
			setIsOpen(popup);
		}
		if (component) {
			setActiveComponent(component);
		}
	}, []);

	const toggleGreeting = () => {
		setActiveComponent(null);
		setIsOpen(false);
		sessionStorage.clear();
	}

	const componentMap = {
		birthday: <BirthdayGreetings fetchGreetings={fetchData} closeModal={toggleGreeting} />,
		occasion: <FestivalGreetings fetchGreetings={fetchData} closeModal={toggleGreeting} />,
		anniversary: <AnniversaryGreetings fetchGreetings={fetchData} closeModal={toggleGreeting} />,
		event: <EventComponent fetchGreetings={fetchData} closeModal={toggleGreeting} />,
		temple: <TempleGreetings fetchGreetings={fetchData} closeModal={toggleGreeting} />,
		// Company: <CompanyDetails fetchGreetings={fetchData} closeModal={toggleGreeting} />,
	};

	return (
		<div
			className="relative inline-flex"
			onMouseEnter={() => { setIsOpen(true); sessionStorage.setItem("greetingsPopup", true); }}
		>
			<button
				onMouseLeave={() => { setIsOpen(false); sessionStorage.removeItem("greetingsPopup"); }}
				type="button"
				className="flex items-center mr-2 bg-blue-600 text-white lg:px-4 p-2 rounded-lg shadow-md hover:bg-blue-700"
				aria-haspopup="menu"
				aria-expanded={isOpen ? "true" : "false"}
				aria-label="Dropdown"
			>
				<FaPlus className="mr-2" />
				Add<span className='lg:block hidden ml-1'>Greetings</span>				
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
							onClick={() => {
								setActiveComponent("birthday");
								sessionStorage.setItem("activeComponent", "birthday");
							}}
						>
							<LiaBirthdayCakeSolid /> Birthday
						</span>
						<span
							className="flex items-center gap-x-3.5 py-2 px-3 cursor-pointer rounded-lg text-gray-800 hover:bg-sky-100 focus:outline-none focus:bg-gray-100"
							onClick={() => {
								setActiveComponent("occasion");
								sessionStorage.setItem("activeComponent", "occasion");
							}}
						>
							<MdOutlineEventNote /> Occasion
						</span>
						<span
							className="flex items-center gap-x-3.5 py-2 px-3 cursor-pointer rounded-lg text-gray-800 hover:bg-sky-100 focus:outline-none focus:bg-gray-100"
							onClick={() => {
								setActiveComponent("anniversary");
								sessionStorage.setItem("activeComponent", "anniversary");
							}}
						>
							<GiBigDiamondRing /> Anniversary
						</span>
						<span
							className="flex items-center gap-x-3.5 py-2 px-3 cursor-pointer rounded-lg text-gray-800 hover:bg-sky-100 focus:outline-none focus:bg-gray-100"
							onClick={() => {
								setActiveComponent("event");
								sessionStorage.setItem("activeComponent", "event");
							}}
						>
							<BsEnvelope /> Events
						</span>
						<span
							className="flex items-center gap-x-3.5 py-2 px-3 cursor-pointer rounded-lg text-gray-800 hover:bg-sky-100 focus:outline-none focus:bg-gray-100"
							onClick={() => {
								setActiveComponent("temple");
								sessionStorage.setItem("activeComponent", "temple");
							}}
						>
							<MdOutlineTempleHindu /> Temple
						</span>
						{/* <span
							className="flex items-center gap-x-3.5 py-2 px-3 cursor-pointer rounded-lg text-gray-800 hover:bg-sky-100 focus:outline-none focus:bg-gray-100"
							onClick={() => {
								setActiveComponent("Company");
								sessionStorage.setItem("activeComponent", "Company");
							}}
						>
							<PiBuildingOffice /> Company
						</span> */}
					</div>

					{/* Render the Selected Component */}
					{activeComponent && componentMap[activeComponent]}
				</div>
			)}
		</div>
	);
};

export default Dropdown;
