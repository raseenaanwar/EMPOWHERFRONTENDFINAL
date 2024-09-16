import  { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import axios from 'axios';
import logo from '../assets/logo.jpeg'; // Import your logo image file
import '../css/CustomNavbar.css'; // Import the CSS file for additional styling
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';

const CustomNavbar = ({ isLoggedIn, handleLogout }) => {
  const email = localStorage.getItem('email'); 
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/user-details/', {
          params: { email }
        });
        setFirstName(response.data.first_name);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    if (email) {
      fetchUserDetails();
    }
  }, [email]);

  return (
    <Navbar className="custom-navbar" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand href="/" className="mr-auto">
          {/* <img
            src={logo}
            height="1"
            className="rounded-logo d-inline-block align-top"
            alt="Empowher Logo"
          /> */}
          <div className="website-name">EmPowHer</div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <div style={{ width: '100%' }}>
            <Nav className="me-auto d-flex justify-content-end align-items-center">
              <Nav.Link className="nav-link" href="/">Home</Nav.Link>
              <Nav.Link className="nav-link" href="#about">About</Nav.Link>
              <Nav.Link href="/find-mentor">Find A Mentor</Nav.Link>
              <Nav.Link className="nav-link" href="#testimonials">Testimonials</Nav.Link>
              <Nav.Link className="nav-link" href="#blog">Donate</Nav.Link>
            </Nav>
          </div>
          <div style={{ width: '50%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            {isLoggedIn ? (
              <>
                <span className="welcome-text">Welcome, {firstName}!</span>
                <Button className="logout-button" onClick={handleLogout} variant="outline-light">Logout</Button>
              </>
            ) : (
              <Nav.Link href="/login" className="custom-button text-end">Sign In / Register</Nav.Link>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;



