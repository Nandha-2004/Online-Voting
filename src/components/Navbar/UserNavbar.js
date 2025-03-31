import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './CSS/Nav.css'
import axios from 'axios';
import Cookies from 'js-cookie';
import Image from 'react-bootstrap/Image';


function UserNavbar() {
  const handleLogout = () => {
    // Remove all cookies
    Object.keys(Cookies.get()).forEach(cookie => Cookies.remove(cookie));

    // Clear localStorage
    localStorage.clear();

    // Send logout request to backend
    axios.post('/logout')
        .then(() => {
            // Redirect to login page after successful logout
            window.location.href = '/Login';
        })
        .catch(error => {
            console.error("❌ Logout failed:", error);
        });
};

  return (
    <Navbar expand="lg" className="Nav">
      <Container fluid>
      <Navbar.Brand href="#" className='Heading'>
      <Image 
        src="/assets/Images/logo_e.png" // ✅ Corrected image path
        alt="Logo" 
        width={40} // ✅ Adjust size as needed
        height={40} 
        className="d-inline-block align-top" 
        style={{ width: '53px', borderRadius: '11px' }} // ✅ Fixed border-radius syntax
      />
        Online Voting System
      </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" style={{backgroundColor:'aliceblue'}}/>
        <Navbar.Collapse id="navbarScroll">
        <Nav
            className="me-auto my-2 my-lg-0 Nav-items-container"
            style={{ maxHeight: '160px'}} // ✅ Fixed syntax
            navbarScroll
          >
            <Nav.Link className="Nav-items" href="/User" >Home</Nav.Link>
            <Nav.Link className="Nav-items" href="/Edit">Edit Profile</Nav.Link>
            <Nav.Link className="Nav-items" href='/Login'><Button onClick={handleLogout}>Logout</Button></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default UserNavbar;