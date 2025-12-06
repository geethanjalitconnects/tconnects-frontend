import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import './HeroSection.css';
import RiskCategoryModal from './RiskCategoryModal';
import { Link } from "react-router-dom";




const HeroSection = ({ navigateToJobsList, navigateToResumeMaking, onNavigate }) => {
  const [currentText, setCurrentText] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Diagnostic logging on component mount
  useEffect(() => {
    console.log('🏠 HeroSection mounted');
    console.log('📍 Props received:', {
      navigateToJobsList: !!navigateToJobsList,
      navigateToResumeMaking: !!navigateToResumeMaking,
      onNavigate: !!onNavigate
    });
  }, []);

  const changingTexts = [
    'Excellence',
    'Growth',
    'Success',
    'Innovation'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % changingTexts.length);
    }, 3000);

    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    
    return () => {
      clearInterval(interval);
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.overflow = "";
    };
  }, [changingTexts.length]);

  const handleCategoryClick = (categoryText) => {
    console.log('🎯 Category clicked:', categoryText);
    console.log('🔍 onNavigate available?', !!onNavigate);
    setSelectedCategory(categoryText);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    console.log('❌ Closing modal');
    setShowModal(false);
    setSelectedCategory(null);
  };

  const handleResumeMakingClick = () => {
    if (navigateToResumeMaking) {
      navigateToResumeMaking();
    } else {
      console.log('Resume making navigation not available');
    }
  };

  const handleExploreJobsClick = () => {
    if (navigateToJobsList) {
      navigateToJobsList();
    } else {
      console.log('Jobs list navigation not available');
    }
  };

  return (
    <div className="hero-section-fullwidth position-relative">
      <div className="hero-content-overlay">
        <Container className="h-100 d-flex align-items-center">
          <Row className="justify-content-center w-100">
            <Col md={10} lg={8} className="text-center">
              <p className="small-tag text-uppercase floating">Risk Management Careers</p>
              <h1 className="display-4 fw-bold text-dark-blue mb-4 hero-title">
                Connect with Risk Management{' '}
                <span className="changing-text gradient-text text-change">
                  {changingTexts[currentText]}
                </span>
              </h1>
              <p className="lead text-muted mb-5 hero-subtitle">
                Elevate your career with premium risk management opportunities, enhance your skills with expert-led courses, and join India's most trusted professional network for risk management excellence.
              </p>
              
              {/* Risk Management Categories Slider */}
              <div className="categories-slider-container mb-4">
                <h6 className="text-center text-muted mb-3 slider-title">
                  Explore Risk Management Careers
                </h6>
                <div className="categories-slider">
                  <div className="categories-track">
                    <div className="category-card" onClick={() => handleCategoryClick('Credit Risk')}>
                      <i className="bi bi-shield-check category-icon"></i>
                      <span>Credit Risk</span>
                    </div>
                    <div className="category-card" onClick={() => handleCategoryClick('Market Risk')}>
                      <i className="bi bi-graph-up-arrow category-icon"></i>
                      <span>Market Risk</span>
                    </div>
                    <div className="category-card" onClick={() => handleCategoryClick('Operational Risk')}>
                      <i className="bi bi-gear category-icon"></i>
                      <span>Operational Risk</span>
                    </div>
                    <div className="category-card" onClick={() => handleCategoryClick('Enterprise Risk')}>
                      <i className="bi bi-building category-icon"></i>
                      <span>Enterprise Risk</span>
                    </div>
                    <div className="category-card" onClick={() => handleCategoryClick('Compliance Risk')}>
                      <i className="bi bi-shield-exclamation category-icon"></i>
                      <span>Compliance Risk</span>
                    </div>
                    <div className="category-card" onClick={() => handleCategoryClick('Technology Risk')}>
                      <i className="bi bi-cpu category-icon"></i>
                      <span>Technology Risk</span>
                    </div>
                    <div className="category-card" onClick={() => handleCategoryClick('Environmental Risk')}>
                      <i className="bi bi-globe category-icon"></i>
                      <span>Environmental Risk</span>
                    </div>
                    <div className="category-card" onClick={() => handleCategoryClick('Human Capital Risk')}>
                      <i className="bi bi-people category-icon"></i>
                      <span>Human Capital Risk</span>
                    </div>
                    <div className="category-card" onClick={() => handleCategoryClick('Financial Risk')}>
                      <i className="bi bi-bank category-icon"></i>
                      <span>Financial Risk</span>
                    </div>
                    <div className="category-card" onClick={() => handleCategoryClick('Strategic Risk')}>
                      <i className="bi bi-lightning category-icon"></i>
                      <span>Strategic Risk</span>
                    </div>
                    {/* Duplicate for seamless loop */}
                    <div className="category-card" onClick={() => handleCategoryClick('Credit Risk')}>
                      <i className="bi bi-shield-check category-icon"></i>
                      <span>Credit Risk</span>
                    </div>
                    <div className="category-card" onClick={() => handleCategoryClick('Market Risk')}>
                      <i className="bi bi-graph-up-arrow category-icon"></i>
                      <span>Market Risk</span>
                    </div>
                    <div className="category-card" onClick={() => handleCategoryClick('Operational Risk')}>
                      <i className="bi bi-gear category-icon"></i>
                      <span>Operational Risk</span>
                    </div>
                    <div className="category-card" onClick={() => handleCategoryClick('Enterprise Risk')}>
                      <i className="bi bi-building category-icon"></i>
                      <span>Enterprise Risk</span>
                    </div>
                    <div className="category-card" onClick={() => handleCategoryClick('Compliance Risk')}>
                      <i className="bi bi-shield-exclamation category-icon"></i>
                      <span>Compliance Risk</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Search bar with animation */}
              <Card className="p-3 shadow-sm mb-5 search-bar-card">
                <Row className="g-2 align-items-center">
                  <Col md={5}>
                    <Form.Control
                      type="text"
                      placeholder="Job title, keywords, or company"
                      className="rounded-pill px-3 py-2"
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Control
                      type="text"
                      placeholder="Location"
                      className="rounded-pill px-3 py-2"
                    />
                  </Col>
                  <Col md={3}>
                    <Button variant="primary-custom" className="w-100 rounded-pill py-2">
                      Search <i className="bi bi-search ms-2"></i>
                    </Button>
                  </Col>
                </Row>
              </Card>
              
              {/* Updated Action Buttons with Navigation */}
              <div className="d-grid gap-3 d-sm-flex justify-content-sm-center hero-buttons">
   <Link 
  to="/jobs" 
  className="explore-jobs-btn"
>
  Explore Jobs <i className="bi bi-arrow-right"></i>
</Link>



                <Button 
                  size="lg" 
                  className="px-4 btn-orange-resume"
                  onClick={handleResumeMakingClick}
                >
                  Resume Making <i className="bi bi-file-earmark-text ms-2"></i>
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Risk Category Modal with detailed logging */}
      {showModal && selectedCategory && (
        <>
          {console.log('🎭 Rendering modal with:', { 
            category: selectedCategory, 
            hasOnNavigate: !!onNavigate,
            onNavigateType: typeof onNavigate
          })}
          <RiskCategoryModal 
            category={selectedCategory}
            onClose={handleCloseModal}
            onNavigate={onNavigate}
          />
        </>
      )}
    </div>
  );
};

export default HeroSection;