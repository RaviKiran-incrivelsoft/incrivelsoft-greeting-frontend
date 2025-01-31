import React from 'react'
import Hero from '../components/Hero'
import Temple from '../components/Temple'
import Services from '../components/Services'
import Join from '../components/Join'
import Business from '../components/Business'
import Testimonial from '../components/Testimonial'
import Process from '../components/Process'
import VideoShowcase from '../components/VideoShowcase'
import Grow from '../components/Grow'
import SecuritySection from '../components/SecuritySection'
import PerformanceSection from '../components/PerformanceSection'

const Home = ({onRegisterClick}) => {
	return (
		<div>
			<Hero />
			<Temple />
			<Grow />
			<SecuritySection />
			<PerformanceSection />
			<VideoShowcase />
			<Services />
			<Join onRegisterClick={onRegisterClick}/>
			<Process/>
			<Testimonial/>
			<Business/>
		</div>
	)
}

export default Home