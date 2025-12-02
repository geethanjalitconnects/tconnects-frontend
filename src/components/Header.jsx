import React, { useState, useEffect, useContext } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { FaChevronDown } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import newLogo from "../assets/TconnectsNewLogo.png";
import api from "../config/api";
import "./Header.css";

import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Scroll Effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu
  const closeMobileMenu = () => {
    const nav = document.querySelector(".navbar-collapse");
    if (nav?.classList.contains("show")) {
      nav.classList.remove("show");
    }
  };

  // Logout
  const logoutUser = () => {
    api.post("/api/auth/logout/").finally(() => {
      setUser(null); // update global user state
      navigate("/");
    });
  };

  return (
    <Navbar expand="lg" className={`custom-navbar fixed-top ${scrolled ? "scrolled" : ""}`}>
      <Container fluid className="px-3 px-md-4">

        {/* LOGO */}
        <Navbar.Brand as={Link} to="/" onClick={closeMobileMenu}>
          <img src={newLogo} className="main-logo" alt="TConnects Logo" />
        </Navbar.Brand>

        {/* HAMBURGER */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler">
          <span className="toggler-icon"></span>
          <span className="toggler-icon"></span>
          <span className="toggler-icon"></span>
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          {/* CENTER NAV */}
          <Nav className="mx-auto navbar-nav-custom">

            <Nav.Link as={Link} to="/" className="nav-link-custom" onClick={closeMobileMenu}>
              <span className="nav-text">Home</span>
            </Nav.Link>

            <NavDropdown
              title={<span className="nav-text dropdown-title">Find Work <FaChevronDown className="dropdown-icon" /></span>}
              id="find-work-dropdown"
              className="nav-dropdown-custom"
              align="start"
            >
              <NavDropdown.Item as={Link} to="/jobs" className="dropdown-item-custom">Jobs</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/internships" className="dropdown-item-custom">Internships</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/freelance" className="dropdown-item-custom">Freelance</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown
              title={<span className="nav-text dropdown-title">Learning <FaChevronDown className="dropdown-icon" /></span>}
              id="learning-dropdown"
              className="nav-dropdown-custom"
              align="start"
            >
              <NavDropdown.Item as={Link} to="/courses" className="dropdown-item-custom">Skill Development</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/mock-interview" className="dropdown-item-custom">Schedule a Mock Interview</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/resume-building" className="dropdown-item-custom">Resume Building</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} to="/blogs" className="nav-link-custom" onClick={closeMobileMenu}>
              <span className="nav-text">Blogs</span>
            </Nav.Link>
          </Nav>

          {/* RIGHT SECTION */}
          <div className="right-section">

            {user ? (
              // When USER is LOGGED IN
              <div className="header-user-menu">

                {/* Avatar */}
                <div className="user-avatar">
                  {user.full_name?.charAt(0)?.toUpperCase()}
                </div>

                <div className="user-name">
                  Hi, {user.full_name?.split(" ")[0]}
                </div>

                {/* Dropdown */}
                <div className="user-dropdown-menu">
                  <button
                    className="user-dropdown-item"
                    onClick={() => {
                      navigate(
                        user.role === "candidate"
                          ? "/candidate-dashboard"
                          : "/recruiter-dashboard"
                      );
                    }}
                  >
                    🧑‍💼 My Account
                  </button>

                  <button
                    className="user-dropdown-item logout-item"
                    onClick={logoutUser}
                  >
                    ↪ Logout
                  </button>
                </div>
              </div>
            ) : (
              // When USER is NOT LOGGED IN
              <div className="auth-buttons">
                <Link to="/register">
                  <button className="auth-btn register-btn">Register</button>
                </Link>
                <Link to="/login">
                  <button className="auth-btn login-btn">Login</button>
                </Link>
              </div>
            )}

          </div>
        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
};

export default Header;
