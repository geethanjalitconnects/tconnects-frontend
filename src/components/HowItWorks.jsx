import React, { useEffect, useRef, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './HowItWorks.css';

const HowItWorks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const steps = [
    {
      icon: "bi-person-plus",
      title: "Create Account",
      description: "Sign up as a job seeker or employer to get started."
    },
    {
      icon: "bi-search",
      title: "Find Opportunities", 
      description: "Browse jobs or courses tailored to your risk management career."
    },
    {
      icon: "bi-award",
      title: "Achieve Success",
      description: "Land your dream job or master new skills to advance your career."
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={sectionRef}
      className={`how-it-works-section py-6 ${isVisible ? 'section-visible' : ''}`}
    >
      <Container>
        <h2 className={`text-center fw-bold text-dark-blue mb-5 section-title ${isVisible ? 'title-animate' : ''}`}>
          How It Works
        </h2>
        <Row className="justify-content-center text-center g-4">
          {steps.map((step, index) => (
            <Col md={4} key={index}>
              <div 
                className={`how-it-works-item p-4 rounded shadow-sm h-100 ${isVisible ? 'item-animate' : ''}`}
                style={{ '--animation-delay': `${(index + 1) * 0.2}s` }}
              >
                <div className="icon-circle mb-3">
                  <i className={`bi ${step.icon} fs-2 text-primary-teal animate-icon`}></i>
                </div>
                <h4 className="fw-bold text-dark-blue mb-2">{step.title}</h4>
                <p className="text-muted">{step.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default HowItWorks;