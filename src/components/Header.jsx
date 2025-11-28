
import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import newLogo from "../assets/TconnectsNewLogo.png";
import "./Header.css";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => {
    const nav = document.querySelector(".navbar-collapse");
    if (nav && nav.classList.contains("show")) {
      nav.classList.remove("show");
    }
  };

  const handleLinkClick = () => {
    closeMobileMenu();
  };

  return (
    <Navbar expand="lg" className={`custom-navbar fixed-top ${scrolled ? "scrolled" : ""}`}>
      <Container fluid className="px-3 px-md-4">

        {/* LOGO */}
        <Navbar.Brand as={Link} to="/" className="brand-container" onClick={handleLinkClick}>
          <img src={newLogo} className="main-logo" alt="TConnects Logo" />
        </Navbar.Brand>

        {/* HAMBURGER */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler">
          <span className="toggler-icon"></span>
          <span className="toggler-icon"></span>
          <span className="toggler-icon"></span>
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto navbar-nav-custom">

            <Nav.Link as={Link} to="/" className="nav-link-custom" onClick={handleLinkClick}>
              <span className="nav-text">Home</span>
            </Nav.Link>

            <NavDropdown
              title={
                <span className="nav-text dropdown-title">
                  Find Work <FaChevronDown className="dropdown-icon" />
                </span>
              }
              id="find-work-dropdown"
              className="nav-dropdown-custom"
              align="start"
            >
              <NavDropdown.Item as={Link} to="/jobs" className="dropdown-item-custom" onClick={handleLinkClick}>
                Jobs
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/internships" className="dropdown-item-custom" onClick={handleLinkClick}>
                Internships
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/freelance" className="dropdown-item-custom" onClick={handleLinkClick}>
                Freelance
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown
              title={
                <span className="nav-text dropdown-title">
                  Learning <FaChevronDown className="dropdown-icon" />
                </span>
              }
              id="learning-dropdown"
              className="nav-dropdown-custom"
              align="start"
            >
              <NavDropdown.Item as={Link} to="/courses" className="dropdown-item-custom" onClick={handleLinkClick}>
                Skill Development
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/mock-interview" className="dropdown-item-custom" onClick={handleLinkClick}>
                Schedule a Mock Interview
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/resume-building" className="dropdown-item-custom" onClick={handleLinkClick}>
                Resume Building
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} to="/blogs" className="nav-link-custom" onClick={handleLinkClick}>
              <span className="nav-text">Blogs</span>
            </Nav.Link>
          </Nav>

          {/* AUTH BUTTONS FIXED */}
          <div className="auth-buttons">
            <Link to="/register" onClick={handleLinkClick}>
              <button className="auth-btn register-btn">
                <span className="btn-text">Register</span>
              </button>
            </Link>

            <Link to="/login" onClick={handleLinkClick}>
              <button className="auth-btn login-btn">
                <span className="btn-text">Login</span>
              </button>
            </Link>
          </div>
        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
};

export default Header;
