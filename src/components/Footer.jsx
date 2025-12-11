import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsInstagram, BsLinkedin } from 'react-icons/bs';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section py-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="mb-3 text-dark-blue footer-title">TConnects</h5>
            <p className="text-dark footer-description">
              Connecting risk management professionals with their next career opportunity.
            </p>
            {/* Social Media Icons */}
            <div className="footer-social-links mt-3">
              <a 
                href="https://www.linkedin.com/company/getjobsandskills/"
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-social-icon"
                aria-label="LinkedIn"
              >
                <BsLinkedin />
              </a>
              <a 
                href="https://www.instagram.com/tconnects_getjobsandskills?igsh=dTNtcnBkMHU0YWpq&utm_source=qr"
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-social-icon"
                aria-label="Instagram"
              >
                <BsInstagram />
              </a>
            </div>
          </Col>
          <Col md={2} className="mb-4 mb-md-0">
            <h6 className="text-dark-blue mb-3 footer-heading">Find Work</h6>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/jobs" className="footer-link p-0 mb-2">Jobs</Nav.Link>
              <Nav.Link as={Link} to="/internships" className="footer-link p-0 mb-2">Internships</Nav.Link>
              <Nav.Link as={Link} to="/freelancers" className="footer-link p-0 mb-2">Freelance</Nav.Link>
            </Nav>
          </Col>
          <Col md={2} className="mb-4 mb-md-0">
            <h6 className="text-dark-blue mb-3 footer-heading">Learning</h6>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/courses" className="footer-link p-0 mb-2">Skill Development</Nav.Link>
              <Nav.Link
                as="a"
                href="https://tconnects.vercel.app/"
                target="_self"
                rel="noopener noreferrer"
                className="footer-link p-0 mb-2"
              >
                Resume Building
              </Nav.Link>
              <Nav.Link as={Link} to="/mock-interview" className="footer-link p-0 mb-2">Schedule a mock interview</Nav.Link>
            </Nav>
          </Col>
        </Row>
        <hr className="footer-divider my-4" />
        <div className="text-center footer-copyright">
          <p className="mb-0">Virtual Protect Security Pvt Ltd | All rights reserved</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
