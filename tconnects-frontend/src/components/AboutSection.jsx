import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import './AboutSection.css';

const AboutSection = ({ navigateToAboutUs }) => { // Accept navigation prop
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({ years: 0, companies: 0, placements: 0 });
  const aboutRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            startCounterAnimation();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const startCounterAnimation = () => {
    // Animate years counter
    let yearsCount = 0;
    const yearsTarget = 5;
    const yearsInterval = setInterval(() => {
      yearsCount += 1;
      setCounters(prev => ({ ...prev, years: yearsCount }));
      if (yearsCount >= yearsTarget) {
        clearInterval(yearsInterval);
      }
    }, 200);

    // Animate companies counter
    let companiesCount = 0;
    const companiesTarget = 200;
    const companiesInterval = setInterval(() => {
      companiesCount += 10;
      setCounters(prev => ({ ...prev, companies: Math.min(companiesCount, companiesTarget) }));
      if (companiesCount >= companiesTarget) {
        clearInterval(companiesInterval);
      }
    }, 80);

    // Animate placements counter
    let placementsCount = 0;
    const placementsTarget = 1000;
    const placementsInterval = setInterval(() => {
      placementsCount += 50;
      setCounters(prev => ({ ...prev, placements: Math.min(placementsCount, placementsTarget) }));
      if (placementsCount >= placementsTarget) {
        clearInterval(placementsInterval);
      }
    }, 40);
  };

  // Use the navigation function passed from App.js
  const handleLearnMoreClick = () => {
    if (navigateToAboutUs) {
      navigateToAboutUs();
    } else {
      console.warn('Navigation function not provided');
    }
  };

  return (
    <div className="about-section" ref={aboutRef}>
      <Container className="about-container">
        <Row className="align-items-center about-main-row">
          <Col lg={7} className="about-content-column">
            <div className={`about-content ${isVisible ? 'animate-in' : ''}`}>
              <h2 className="about-title slide-up">
                About <span className="gradient-text">TConnects</span>
              </h2>
              <p className="about-lead slide-up delay-1">
                TConnects is India's premier risk management job portal, connecting talented
                professionals with leading organizations across the country. We specialize in
                enterprise risk management, cybersecurity, compliance, and operational risk
                roles.
              </p>
              <p className="about-description slide-up delay-2">
                Founded by industry experts, we understand the unique challenges and
                opportunities in the Indian risk management landscape. Our platform bridges
                the gap between skilled professionals and organizations seeking top-tier risk
                management talent.
              </p>
              
              {/* Statistics Grid */}
              <div className="stats-grid slide-up delay-3">
                <div className="stat-item">
                  <div className="stat-number">
                    <span className="counter-number">{counters.years}</span>
                    <span className="plus-sign">+</span>
                  </div>
                  <p className="stat-label">Years Experience</p>
                  <div className="stat-underline"></div>
                </div>

                <div className="stat-item">
                  <div className="stat-number">
                    <span className="counter-number">{counters.companies}</span>
                    <span className="plus-sign">+</span>
                  </div>
                  <p className="stat-label">Partner Companies</p>
                  <div className="stat-underline"></div>
                </div>

                <div className="stat-item">
                  <div className="stat-number">
                    <span className="counter-number">{counters.placements}</span>
                    <span className="plus-sign">+</span>
                  </div>
                  <p className="stat-label">Successful Placements</p>
                  <div className="stat-underline"></div>
                </div>
              </div>
            </div>
          </Col>
          
          <Col lg={5} className="mission-column">
            <div className={`mission-card-container ${isVisible ? 'slide-in-right' : ''}`}>
              <Card className="mission-card">
                <div className="card-gradient-overlay"></div>
                <Card.Body className="mission-card-body">
                  <div className="mission-icon">
                    <i className="fas fa-rocket"></i>
                  </div>
                  <h4 className="mission-title">Our Mission</h4>
                  <p className="mission-text">
                    To empower professionals and organizations by providing innovative recruitment solutions, 
                    skill development opportunities, and career advancement pathways that drive success in an 
                    ever-evolving security landscape.
                  </p>
                  <Button className="mission-btn" onClick={handleLearnMoreClick}>
                    <span>Learn More About Us</span>
                    <i className="arrow-right">→</i>
                  </Button>
                </Card.Body>
                
                {/* Floating Elements */}
                <div className="floating-dot dot-1"></div>
                <div className="floating-dot dot-2"></div>
                <div className="floating-dot dot-3"></div>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
      
      {/* Background Elements */}
      <div className="bg-elements">
        <div className="bg-circle circle-1"></div>
        <div className="bg-circle circle-2"></div>
        <div className="bg-triangle"></div>
      </div>
    </div>
  );
};

export default AboutSection;
