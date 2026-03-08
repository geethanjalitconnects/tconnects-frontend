import React, { useState, useEffect, useContext, useRef } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { FaChevronDown } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import newLogo from "../assets/TconnectsNewLogo.png";
import "./Header.css";
import { AuthContext } from "../context/AuthContext";

const Header = ({ currentUser, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  const { user: contextUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef(null);

  // Use currentUser prop if available, fallback to context
  const user = currentUser || contextUser;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMobileMenu = () => {
    const nav = document.querySelector(".navbar-collapse");
    if (nav?.classList.contains("show")) {
      nav.classList.remove("show");
    }
  };

  // ✅ FIXED: Header no longer calls the logout API itself.
  // It just delegates fully to onLogout() from App.jsx.
  // This prevents the double API call that was causing the bug.
  const logoutUser = async () => {
    setDropdownOpen(false);
    closeMobileMenu();
    if (onLogout) {
      await onLogout();
    }
  };

  return (
    <Navbar
      expand="lg"
      className={`custom-navbar fixed-top ${scrolled ? "scrolled" : ""}`}
    >
      <Container fluid className="px-3 px-md-4">
        <Navbar.Brand as={Link} to="/" onClick={closeMobileMenu}>
          <img src={newLogo} className="main-logo" alt="TConnects Logo" />
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="custom-toggler"
        >
          <span className="toggler-icon"></span>
          <span className="toggler-icon"></span>
          <span className="toggler-icon"></span>
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto navbar-nav-custom">
            <Nav.Link
              as={Link}
              to="/"
              className="nav-link-custom"
              onClick={closeMobileMenu}
            >
              <span className="nav-text">Home</span>
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
                as="a"
                href="https://tconnects.vercel.app/"
                target="_self"
                rel="noopener noreferrer"
                className="dropdown-item-custom"
                onClick={closeMobileMenu}
              >
                Resume Building
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          <div className="right-section">
            {user ? (
              <div
                className="header-user-menu"
                ref={menuRef}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="user-avatar">
                  {user.full_name?.charAt(0)?.toUpperCase() ||
                    user.email?.charAt(0)?.toUpperCase() ||
                    "U"}
                </div>

                <div className="user-name">
                  Hi,{" "}
                  {user.full_name?.split(" ")[0] ||
                    user.email?.split("@")[0] ||
                    "User"}
                </div>

                <div
                  className="user-dropdown-menu"
                  style={{ display: dropdownOpen ? "block" : "none" }}
                >
                  <button
                    className="user-dropdown-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(false);
                      closeMobileMenu();
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
                    onClick={(e) => {
                      e.stopPropagation();
                      logoutUser();
                    }}
                  >
                    ↪ Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/register" onClick={closeMobileMenu}>
                  <button className="auth-btn register-btn">Register</button>
                </Link>
                <Link to="/login" onClick={closeMobileMenu}>
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