import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-us-page">
      {/* Hero Section */}
      <section className="hero-section py-5" style={{ backgroundColor: "#e0f2f1" }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="hero-content">
                <span className="badge mb-3 px-3 py-2" style={{ backgroundColor: "#2d7d7d", color: "white" }}>
                  ABOUT TCONNECT
                </span>
                <h1 className="display-4 fw-bold text-dark mb-4">
                  Connecting Talent with
                  <span className="text-teal"> Opportunity</span>
                </h1>
                <p className="lead text-muted mb-4">
                  Tconnect is a premier branch of Virtual Protect Security, dedicated to bridging the gap between
                  skilled professionals and leading employers in risk management, compliance, and security sectors.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-image text-center">
                <img
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&h=400&fit=crop&crop=center"
                  alt="Professional Team Collaboration and Career Networking"
                  className="img-fluid rounded shadow"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Decorative circles */}
        <div
          className="position-absolute"
          style={{
            top: "10%",
            left: "5%",
            width: "60px",
            height: "60px",
            backgroundColor: "#48c9b0",
            borderRadius: "50%",
            opacity: "0.3",
          }}
        ></div>
        <div
          className="position-absolute"
          style={{
            top: "60%",
            right: "10%",
            width: "40px",
            height: "40px",
            backgroundColor: "#2d7d7d",
            borderRadius: "50%",
            opacity: "0.4",
          }}
        ></div>
        <div
          className="position-absolute"
          style={{
            top: "30%",
            right: "20%",
            width: "30px",
            height: "30px",
            backgroundColor: "#48c9b0",
            borderRadius: "50%",
            opacity: "0.2",
          }}
        ></div>
      </section>

      {/* Company Overview */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle p-3 me-3" style={{ backgroundColor: "#48c9b0", opacity: "0.1" }}>
                      <i className="fas fa-shield-alt fs-4" style={{ color: "#2d7d7d" }}></i>
                    </div>
                    <h4 className="card-title mb-0">Our Heritage</h4>
                  </div>
                  <p className="card-text text-muted">
                    Born from Virtual Protect Security's commitment to excellence, Tconnect inherits decades of
                    experience in security, risk management, and compliance solutions, bringing this expertise to the
                    talent acquisition space.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle p-3 me-3" style={{ backgroundColor: "#48c9b0", opacity: "0.1" }}>
                      <i className="fas fa-chart-line fs-4" style={{ color: "#2d7d7d" }}></i>
                    </div>
                    <h4 className="card-title mb-0">Our Focus</h4>
                  </div>
                  <p className="card-text text-muted">
                    We specialize in connecting risk management professionals, compliance experts, and security
                    specialists with organizations that value expertise, innovation, and strategic thinking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-5" style={{ backgroundColor: "#f0fffe" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="text-center mb-5">
                <h2 className="h1 fw-bold mb-3">Vision & Mission</h2>
                <p className="lead text-muted">
                  Shared values that drive both Tconnect and Virtual Protect Security forward
                </p>
              </div>

              <div className="row g-4">
                <div className="col-lg-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body p-5 text-center">
                      <div className="mb-4">
                        <img
                          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&h=200&fit=crop&crop=center"
                          alt="Vision - Business Strategy"
                          className="img-fluid rounded"
                        />
                      </div>
                      <h3 className="h4 fw-bold text-teal mb-3">Our Vision</h3>
                      <p className="text-muted">
                        To be the leading platform that transforms how organizations discover and connect with
                        exceptional talent in risk management and security sectors, creating a safer and more secure
                        business environment globally.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body p-5 text-center">
                      <div className="mb-4">
                        <img
                          src="https://images.unsplash.com/photo-1553484771-371a605b060b?w=300&h=200&fit=crop&crop=center"
                          alt="Mission - Team Collaboration"
                          className="img-fluid rounded"
                        />
                      </div>
                      <h3 className="h4 fw-bold text-teal mb-3">Our Mission</h3>
                      <p className="text-muted">
                        To empower professionals and organizations by providing innovative recruitment solutions, skill
                        development opportunities, and career advancement pathways that drive success in an
                        ever-evolving security landscape.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Virtual Protect Security Connection */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="pe-lg-4">
                <h2 className="h1 fw-bold mb-4">
                  Powered by <span className="text-teal">Virtual Protect Security</span>
                </h2>
                <p className="lead text-muted mb-4">
                  Virtual Protect Security, our parent company, has been at the forefront of security solutions and risk
                  management for years. Tconnect embodies and extends VProtect Security's vision and mission into the
                  talent acquisition space.
                </p>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-check-circle text-teal me-2"></i>
                      <span>Industry Expertise</span>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-check-circle text-teal me-2"></i>
                      <span>Proven Track Record</span>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-check-circle text-teal me-2"></i>
                      <span>Global Network</span>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-check-circle text-teal me-2"></i>
                      <span>Innovation Focus</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="text-center">
                <img
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&h=400&fit=crop&crop=center"
                  alt="Security Operations Center and Monitoring"
                  className="img-fluid rounded shadow"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-5" style={{ backgroundColor: "#e0f2f1" }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="h1 fw-bold mb-3">Our Core Values</h2>
            <p className="lead text-muted">The principles that guide everything we do at Tconnect</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="text-center">
                <div
                  className="rounded-circle p-4 d-inline-flex mb-3"
                  style={{ backgroundColor: "#48c9b0", opacity: "0.1" }}
                >
                  <i className="fas fa-handshake fs-2" style={{ color: "#2d7d7d" }}></i>
                </div>
                <h4 className="fw-bold mb-3">Trust & Integrity</h4>
                <p className="text-muted">
                  Building lasting relationships through transparency, honesty, and ethical practices in every
                  interaction.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="text-center">
                <div
                  className="rounded-circle p-4 d-inline-flex mb-3"
                  style={{ backgroundColor: "#48c9b0", opacity: "0.1" }}
                >
                  <i className="fas fa-lightbulb fs-2" style={{ color: "#2d7d7d" }}></i>
                </div>
                <h4 className="fw-bold mb-3">Innovation</h4>
                <p className="text-muted">
                  Continuously evolving our platform and services to meet the changing needs of the modern workforce.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="text-center">
                <div
                  className="rounded-circle p-4 d-inline-flex mb-3"
                  style={{ backgroundColor: "#48c9b0", opacity: "0.1" }}
                >
                  <i className="fas fa-trophy fs-2" style={{ color: "#2d7d7d" }}></i>
                </div>
                <h4 className="fw-bold mb-3">Excellence</h4>
                <p className="text-muted">
                  Striving for the highest standards in service delivery and professional development opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Founder Section - Single Founder */}
      <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="h1 fw-bold mb-3">Meet Our Founder</h2>
            <p className="lead text-muted">Visionary leader driving innovation in security and talent acquisition</p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-5 text-center">
                  <div className="mb-4">
                    <div 
                      className="rounded-circle mx-auto d-flex align-items-center justify-content-center shadow"
                      style={{ 
                        width: "150px", 
                        height: "150px", 
                        backgroundColor: "#2d7d7d",
                        color: "white"
                      }}
                    >
                      <i className="fas fa-user fs-1"></i>
                    </div>
                  </div>
                  <h4 className="fw-bold mb-2">Domala Sai Krishna</h4>
                  <p className="text-teal fw-semibold mb-3">Founder & CEO</p>
                  <p className="text-muted mb-4">
                    Alumni of National Forensic Sciences University, Gandhinagar, 
                    Gujarat with a Master's degree in Homeland Security & Anti-terrorism. 
                    Bringing expertise in security, risk assessment, and strategic leadership 
                    to revolutionize talent acquisition in the security sector.
                  </p>
                  <div className="d-flex justify-content-center gap-2">
                    <a href="#" className="btn btn-outline-secondary btn-sm">
                      <i className="fab fa-linkedin"></i>
                    </a>
                    <a href="#" className="btn btn-outline-secondary btn-sm">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="btn btn-outline-secondary btn-sm">
                      <i className="fas fa-envelope"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-5" style={{ backgroundColor: "#2d7d7d" }}>
        <div className="container">
          <div className="row text-center text-white">
            <div className="col-md-3">
              <div className="mb-3">
                <i className="fas fa-users fs-1 mb-3"></i>
                <h3 className="fw-bold">500+</h3>
                <p className="mb-0">Risk Management Professionals</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <i className="fas fa-building fs-1 mb-3"></i>
                <h3 className="fw-bold">200+</h3>
                <p className="mb-0">Partner Organizations</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <i className="fas fa-briefcase fs-1 mb-3"></i>
                <h3 className="fw-bold">1000+</h3>
                <p className="mb-0">Successful Placements</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <i className="fas fa-shield-alt fs-1 mb-3"></i>
                <h3 className="fw-bold">98%</h3>
                <p className="mb-0">Client Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
