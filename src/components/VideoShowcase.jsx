const VideoShowcase = () => {
	const videos = [
		{ src: "/videos/ai1.mp4", title: "WhatsApp Greetings", desc: "Automate personalized messages." },
		{ src: "/videos/ai2.mp4", title: "Email Scheduler", desc: "Schedule custom email greetings." },
		{ src: "/videos/ai3.mp4", title: "Template Builder", desc: "Design and customize templates." },
		{ src: "/videos/ai4.mp4", title: "Bulk Messaging", desc: "Send messages to thousands instantly." },
		{ src: "/videos/ai5.mp4", title: "Analytics Dashboard", desc: "Track message performance." },
		{ src: "/videos/ai6.mp4", title: "Multi-Platform Support", desc: "Works on WhatsApp & Email." }
	];

	return (
		<section className="py-16 lg:px-20 px-10 bg-gray-900 text-white">
			<div className="text-center mb-12">
				<h2 className="lg:text-4xl text-xl font-bold">Know more about the Automated Greetings</h2>
				<p className="lg:text-lg text-sm text-gray-400 mt-2">Watch how our platform simplifies messaging.</p>
			</div>

			<div className="grid md:grid-cols-3 lg:gap-14 gap-8">
				{videos.map((video, index) => (
					<div key={index} className="relative group lg:mx-auto mx-5 overflow-hidden rounded-2xl shadow-lg">
						<video
							className="w-full h-auto object-cover rounded-2xl transition-transform duration-300 group-hover:scale-110"
							src={video.src}
							loop
							playsInline
							autoPlay={false}
							onMouseEnter={(e) => {
								e.target.play();
							}}
							onMouseLeave={(e) => {
								e.target.pause();
							}}
						/>
						<div className="absolute group-hover:hidden inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pointer-events-none">
							<h3 className="text-xl font-semibold">{video.title}</h3>
							<p className="text-gray-300 text-sm">{video.desc}</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};

export default VideoShowcase;