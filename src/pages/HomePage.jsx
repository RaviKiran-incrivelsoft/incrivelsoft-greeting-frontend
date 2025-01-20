import React from 'react'
import Hero from '../components/Hero'
import Temple from '../components/Temple'
import Services from '../components/Services'
import Join from '../components/Join'
import Business from '../components/Business'
import Testimonial from '../components/Testimonial'
import Process from '../components/Process'

const Home = ({onRegisterClick}) => {
	return (
		<div>
			<Hero />
			<Temple />
			<Services />
			<Join onRegisterClick={onRegisterClick}/>
			<Process/>
			<Testimonial/>
			<Business/>
		</div>
	)
}

export default Home