import { useEffect, React, useRef, useState } from 'react';
import ScrollReveal from "scrollreveal";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import "../CSS/upcomingElections.css";
import { BASE_URL } from '../../../helper';

const UpcomingElections = () => {
    const navigate = useNavigate();
    const [upcomingElections, setUpcomingElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const revealRefBottom = useRef(null);
    const revealRefLeft = useRef(null);  
    const revealRefTop = useRef(null);
    const revealRefRight = useRef(null);

    useEffect(() => {
        axios.get(`${BASE_URL}/admin/getElections`)
            .then((response) => {
                console.log("Elections Data:", response.data);
                // Filter only the elections that are "started"
                const startedElections = response.data.filter(election => election.status === "started");
                setUpcomingElections(startedElections);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching elections: ", err);
                setError(err);
                setLoading(false);
            });

        // Initialize ScrollReveal for animations
        ScrollReveal().reveal(revealRefBottom.current, {
            duration: 1000,
            delay: 200,
            distance: '50px',
            origin: 'bottom',
            easing: 'ease',
            reset: true,
        });

        ScrollReveal().reveal(revealRefRight.current, {
            duration: 1000,
            delay: 200,
            distance: '50px',
            origin: 'right',
            easing: 'ease',
            reset: true,
        });

        ScrollReveal().reveal(revealRefLeft.current, {
            duration: 1000,
            delay: 200,
            distance: '50px',
            origin: 'left',
            easing: 'ease',
            reset: true,
        });

        ScrollReveal().reveal(revealRefTop.current, {
            duration: 1000,
            delay: 200,
            distance: '50px',
            origin: 'top',
            easing: 'ease',
            reset: true,
        });
    }, []);

    if (loading) return <p>Loading elections...</p>;
    if (error) return <p>Error fetching elections: {error.message}</p>;
    if (upcomingElections.length === 0) return <p>No ongoing elections.</p>;

    return (
        <div className="upcomingElections">
            <h2 ref={revealRefTop}>Ongoing Elections</h2>
            <div className="upcomingElectionsCardContainer">
                {upcomingElections.map((election, index) => (
                    <div key={election._id} className="upcomingElectionCard" 
                        ref={index % 2 === 0 ? revealRefLeft : revealRefRight}>
                        <h3>{election.name}</h3><br/>
                        <p>{election.desc}</p><br/>
                        <button><a href='/Vote'>Participate/Vote</a></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpcomingElections;
