import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import UserNavbar from "../Navbar/UserNavbar";
import './CSS/user.css';
import UserCard from './Components/UserCard/userCard';
import UpcomingElections from './Components/UpcomingElections';
import ScrollReveal from "scrollreveal";
import { BASE_URL } from '../../helper';
import Cookies from 'js-cookie';
import 'font-awesome/css/font-awesome.css'; // Use non-minified version

const User = () => {
  const location = useLocation();
  const { voterst } = location.state || {}; // Safe extraction

  // Function to set a cookie safely
  useEffect(() => {
    if (voterst?.id && !Cookies.get('myCookie')) {
      Cookies.set('myCookie', voterst.id, { expires: 7 });
    }
  }, [voterst]);

  // Get voter ID safely
  const voterid = Cookies.get('myCookie') || null; // Null instead of empty string

  // Scroll Reveal Refs
  const revealRefBottom = useRef(null);
  const revealRefLeft = useRef(null);
  const revealRefTop = useRef(null);
  const revealRefRight = useRef(null);

  useEffect(() => {
    const scrollConfig = {
      duration: 1000,
      delay: 200,
      distance: '50px',
      easing: 'ease',
      reset: true,
    };

    const sr = ScrollReveal();
    sr.reveal(revealRefBottom.current, { ...scrollConfig, origin: 'bottom' });
    sr.reveal(revealRefRight.current, { ...scrollConfig, origin: 'right' });
    sr.reveal(revealRefLeft.current, { ...scrollConfig, origin: 'left' });
    sr.reveal(revealRefTop.current, { ...scrollConfig, origin: 'top' });

    return () => sr.destroy(); // Cleanup to prevent memory leaks
  }, []);

  const [singleVoter, setVoter] = useState({}); // Use object instead of array

  useEffect(() => {
    const fetchUserData = async () => {
        try {
            const voterid = localStorage.getItem("voterid"); // Get voter ID from localStorage
            if (!voterid) {
                console.error("No voter ID found");
                return;
            }

            const response = await axios.get(`${BASE_URL}/voter/getVoterbyID/${voterid}`, {
                withCredentials: true // ✅ Send HTTP-only cookie with request
            });

            if (response.data.success) {
              setVoter(response.data.voter);
            } else {
                console.error("Failed to fetch user data");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    fetchUserData();
}, []);


  return (
    <div className="User">
      <UserNavbar />
      <div className="Heading2" ref={revealRefTop}>
        <h3>Welcome <span>{singleVoter?.firstName || 'User'}</span></h3>
      </div>
      <div className="userPage">
        <div className="userDetails" ref={revealRefLeft}>
          <UserCard voter={singleVoter} />
        </div>
        <div className='details' ref={revealRefRight}>
          <h2>Welcome to <span>Online Voting Platform</span></h2>
          <h6>Exercise Your Right to Vote Anytime, Anywhere</h6>
          <p>
            Welcome to our online voting platform, where your voice matters...
          </p>
        </div>
      </div>
      <UpcomingElections voteStatus={singleVoter?.voteStatus || "Not Voted"} />
    </div>
  );  
}

export default User;
