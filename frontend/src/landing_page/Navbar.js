import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("action") === "logout" || params.get("error") === "unauthorized") {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      setIsLoggedIn(false);
      setToken("");
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setIsLoggedIn(true);
      setToken(storedToken);
    } else {
      setIsLoggedIn(false);
      setToken("");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    delete axios.defaults.headers.common["Authorization"];
    setIsLoggedIn(false);
    setToken("");
    
    const dashboardUrl = process.env.REACT_APP_DASHBOARD_URL || (window.location.hostname === "localhost" ? "http://localhost:3001" : "");
    if (dashboardUrl) {
      window.location.href = `${dashboardUrl}?action=logout`;
    } else {
      window.location.reload();
    }
  };
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavToggle = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  const closeNavbar = () => {
    setIsNavCollapsed(true);
  };

  return (
    <nav className="navbar navbar-expand-lg border-bottom sticky-top" style={{ backgroundColor: "#fff" }}>
      <div className="container p-2">
        <Link className="navbar-brand" to="/" onClick={closeNavbar}>
          <img src="media/images/logo.svg" alt="Logo" style={{ width: "130px" }} />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={handleNavToggle}
          aria-controls="navbarSupportedContent"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${!isNavCollapsed ? 'show' : ''}`} id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? "active-nav-link" : ""}`} to="/" onClick={closeNavbar}>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? "active-nav-link" : ""}`} to="/about" onClick={closeNavbar}>About</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? "active-nav-link" : ""}`} to="/products" onClick={closeNavbar}>Products</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? "active-nav-link" : ""}`} to="/pricing" onClick={closeNavbar}>Pricing</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? "active-nav-link" : ""}`} to="/support" onClick={closeNavbar}>Support</NavLink>
            </li>
            
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <a 
                    className="nav-link fs-6 fw-bold text-primary" 
                    href={`${process.env.REACT_APP_DASHBOARD_URL || (window.location.hostname === "localhost" ? "http://localhost:3001" : "")}?token=${token}`}
                    style={{ transition: "color 0.2s" }}
                    onClick={closeNavbar}
                  >
                    Dashboard
                  </a>
                </li>
                <li className="nav-item ms-3">
                  <button 
                    onClick={() => { handleLogout(); closeNavbar(); }} 
                    className="btn btn-outline-danger fs-6 py-1 px-3"
                    style={{ borderRadius: "4px" }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link text-dark ${isActive ? "active-nav-link" : ""}`} to="/login" onClick={closeNavbar}>Login</NavLink>
                </li>
                <li className="nav-item ms-3">
                  <Link 
                    className="btn btn-primary fs-6 py-1 px-3 text-white" 
                    to="/signup"
                    style={{ borderRadius: "4px", backgroundColor: "#387ed1", border: "none", whiteSpace: "nowrap" }}
                    onClick={closeNavbar}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
