import { FaChartLine, FaCode, FaUserFriends } from "react-icons/fa";

const Grow = () => {
	const features = [
		{
			icon: <FaChartLine className="text-purple-500 text-4xl" />,
			title: "Active User Analytics",
			description: "Gain valuable insights with real-time analytics to track user engagement and growth."
		},
		{
			icon: <FaCode className="text-red-500 text-4xl" />,
			title: "Smart Coding Development",
			description: "Utilize advanced development strategies to create efficient and scalable applications."
		},
		{
			icon: <FaUserFriends className="text-green-500 text-4xl" />,
			title: "User Friendly Interface",
			description: "Designed with simplicity and accessibility in mind to enhance user experience."
		}
	];

	return (
		<div className="lg:max-w-4xl lg:mx-auto mx-12 text-center py-16">
			<h1 className="text-xl lg:text-3xl font-bold text-gray-800">How To Grow Your Business</h1>
			<p className="lg:text-base text-sm text-gray-600 mt-4">Discover key strategies to expand and enhance your business efficiency with modern solutions.</p>

			<div className="grid md:grid-cols-3 gap-6 mt-8">
				{features.map((feature, index) => (
					<div key={index} className="p-6 bg-white shadow-lg rounded-xl border border-gray-200">
						<div className="flex justify-center mb-4">{feature.icon}</div>
						<h2 className="lg:text-lg font-semibold text-gray-800">{feature.title}</h2>
						<p className="lg:text-base text-sm text-gray-600 mt-2">{feature.description}</p>
					</div>
				))}
			</div>

			<p className="text-sm lg:text-base text-gray-600 mt-20">
				Approx <span className="text-purple-500 font-semibold">100+</span> team members ready to online support for you
			</p>
		</div>
	);
};

export default Grow;
