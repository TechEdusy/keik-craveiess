// frontend/src/components/Navbar.js
import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Navbar as BootstrapNavbar,
  Nav,
  NavDropdown,
  Container,
} from "react-bootstrap";

function Navbar() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <BootstrapNavbar bg="light" expand="lg">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          Keik Craveiess
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/products">
              Products
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about">
              About Us
            </Nav.Link>
            <Nav.Link as={NavLink} to="/contact">
              Contact
            </Nav.Link>
          </Nav>
          <Nav>
            {!token ? (
              <NavDropdown title="Account" id="basic-nav-dropdown">
                <NavDropdown.Item as={NavLink} to="/login">
                  Login
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/register">
                  Register
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                {role === "admin" && (
                  <Nav.Link as={NavLink} to="/admin">
                    Admin Dashboard
                  </Nav.Link>
                )}
                {role === "homebaker" && (
                  <Nav.Link as={NavLink} to="/homebaker">
                    Home Baker Dashboard
                  </Nav.Link>
                )}
                {role === "user" && (
                  <Nav.Link as={NavLink} to="/user">
                    User Dashboard
                  </Nav.Link>
                )}
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;
