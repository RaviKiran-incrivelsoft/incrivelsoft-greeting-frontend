import React, { useEffect, useState } from 'react'
import Hero from '../components/Hero'
import Temple from '../components/Temple'
import Services from '../components/Services'
import Join from '../components/Join'
import Business from '../components/Business'
import Testimonial from '../components/Testimonial'
import Process from '../components/Process'

const Home = ({onRegisterClick}) => {
	const [token, setToken] = useState(localStorage.getItem("token"));

	useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === "token" && event.newValue === null) {
                console.log("Token has been removed from localStorage.");
                // Perform additional actions when the token is removed.
            }
			else{
				setToken(localStorage.getItem("token"));
			}
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);
	return (
		<div>
			<Hero />
			<Temple />
			<Services />
			{token? (<></>): (<Join onRegisterClick={onRegisterClick}/>)}
			<Process/>
			<Testimonial/>
			<Business/>
		</div>
	)
}

export default Home