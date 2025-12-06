import React, { useState } from "react";
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  FaChevronDown,
  FaUser,
} from "react-icons/fa";
import "./Header.css";

const Header = ({ isAuthenticated, userName, userType, handleLogout }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const closeMobileMenu = () => setExpanded(false);

  return (
    <Navbar
      expand="lg"
      expanded={expanded}
      className="custom-navbar"
      fixed="top"
    >
      <div className="container-fluid">

        {/* LOGO */}
        <Navbar.Brand as={Link} to="/" onClick={closeMobileMenu}>
          <img src={logo} alt="Logo" className="main-logo" />
        </Navbar.Brand>

        {/* MOBILE HAMBURGER */}
        <Navbar.Toggle
          aria-controls="navbar-nav"
          className="custom-toggler"
          onClick={() => setExpanded(expanded ? false : true)}
        >
          <span className="toggler-icon"></span>
          <span className="toggler-icon"></span>
          <span className="toggler-icon"></span>
        </Navbar.Toggle>

        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto navbar-nav-custom">

            {/* HOME */}
            <Nav.Link
              as={Link}
              to="/"
              className="nav-link-custom"
              onClick={closeMobileMenu}
            >
              Home
            </Nav.Link>

            {/* BLOGS */}
            <Nav.Link
              as={Link}
              to="/blogs"
              className="nav-link-custom"
              onClick={closeMobileMenu}
            >
              Blogs
            </Nav.Link>

            {/* FIND WORK DROPDOWN */}
            <NavDropdown
              title={
                <span className="nav-text dropdown-title">
                  Find Work <FaChevronDown className="dropdown-icon" />
                </span>
              }
              className="nav-dropdown-custom"
              align="start"
            >
              <NavDropdown.Item
                as={Link}
                to="/jobs"
                className="dropdown-item-custom"
                onClick={closeMobileMenu}
              >
                Jobs
              </NavDropdown.Item>

              <NavDropdown.Item
                as={Link}
                to="/internships"
                className="dropdown-item-custom"
                onClick={closeMobileMenu}
              >
                Internships
              </NavDropdown.Item>

              <NavDropdown.Item
                as={Link}
                to="/freelancers"
                className="dropdown-item-custom"
                onClick={closeMobileMenu}
              >
                Freelance
              </NavDropdown.Item>
            </NavDropdown>

            {/* LEARNING DROPDOWN */}
            <NavDropdown
              title={
                <span className="nav-text dropdown-title">
                  Learning <FaChevronDown className="dropdown-icon" />
                </span>
              }
              className="nav-dropdown-custom"
              align="start"
            >
              <NavDropdown.Item
                as={Link}
                to="/courses"
                className="dropdown-item-custom"
                onClick={closeMobileMenu}
              >
                Skill Development
              </NavDropdown.Item>

              <NavDropdown.Item
                as={Link}
                to="/mock-interview"
                className="dropdown-item-custom"
                onClick={closeMobileMenu}
              >
                Schedule a Mock Interview
              </NavDropdown.Item>

              <NavDropdown.Item
                as={Link}
                to="/resume-building"
                className="dropdown-item-custom"
                onClick={closeMobileMenu}
              >
                Resume Building
              </NavDropdown.Item>
            </NavDropdown>

            {/* AUTH SECTION */}
            {!isAuthenticated ? (
              <div className="auth-buttons">

                <Button
                  as={Link}
                  to="/login"
                  className="login-btn"
                  onClick={closeMobileMenu}
                >
                  Login
                </Button>

                <Button
                  as={Link}
                  to="/register"
                  className="register-btn"
                  onClick={closeMobileMenu}
                >
                  Register
                </Button>

              </div>
            ) : (
              <div className="header-user-menu">

                {/* USER DROPDOWN */}
                <NavDropdown
                  title={
                    <span className="user-name">
                      <FaUser className="user-icon" /> Hi, {userName}
                    </span>
                  }
                  className="user-dropdown"
                  align="end"
                >
                  {/* Dashboard (Candidate or Recruiter) */}
                  {userType === "candidate" && (
                    <NavDropdown.Item
                      as={Link}
                      to="/candidate-dashboard/overview"
                      onClick={closeMobileMenu}
                    >
                      Dashboard
                    </NavDropdown.Item>
                  )}

                  {userType === "recruiter" && (
                    <NavDropdown.Item
                      as={Link}
                      to="/recruiter-dashboard/overview"
                      onClick={closeMobileMenu}
                    >
                      Dashboard
                    </NavDropdown.Item>
                  )}

                  {/* LOGOUT */}
                  <NavDropdown.Item
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                  >
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
            )}

          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default Header;
