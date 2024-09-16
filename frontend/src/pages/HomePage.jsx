
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import heroImage from '../assets/heroimage1.jpeg'; // Ensure this path is correct
import '../css/HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-image-container">
          <img src={heroImage} alt="Hero" className="hero-image" />
          <div className="hero-overlay"></div>
        </div>
        <Container className="hero-content">
          <Row className="align-items-center">
            <Col md={6}>
              <div className="hero-text-background">
                <h1 className="hero-title">Empower Your Future with Mentorship</h1>
                <p className="hero-subtitle">Connect with experienced mentors and unlock your potential.</p>
                <Button href="/find-mentor" variant="primary" className="hero-button">Find a Mentor</Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* About Section */}
      <section className="about-section">
        <Container>
          <Row>
            <Col md={12} className="text-center">
              <h2 className="section-title">About Us</h2>
              <p className="section-description">
                At EmPowHer, we believe in the power of mentorship to drive personal and professional growth. Our platform connects you with experienced mentors who can guide you through your career journey.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call-to-Action Section */}
      <section className="cta-section">
        <Container>
          <Row className="text-center">
            <Col md={12}>
              <h2 className="cta-title">Ready to Transform Your Life?</h2>
              <Button href="/find-mentor" variant="primary" className="cta-button">Get Started</Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <Container className="text-center">
          <p>&copy; 2024 EmPowHer. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
};

export default HomePage;
