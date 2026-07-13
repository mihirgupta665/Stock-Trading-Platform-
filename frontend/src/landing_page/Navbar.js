import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setIsLoggedIn(true);
      setToken(storedToken);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    delete axios.defaults.headers.common["Authorization"];
    setIsLoggedIn(false);
    setToken("");
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg border-bottom" style={{ backgroundColor: "#fff" }}>
      <div className="container p-2">
        <Link className="navbar-brand" to="/">
          <img src="media/images/logo.svg" alt="Logo" style={{ width: "130px" }} />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            <li className="nav-item">
              <Link className="nav-link active fs-6" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active fs-6" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active fs-6" to="/products">Products</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active fs-6" to="/pricing">Pricing</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active fs-6" to="/support">Support</Link>
            </li>
            
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <a 
                    className="nav-link fs-6 fw-bold text-primary" 
                    href={`http://localhost:3001?token=${token}`}
                    style={{ transition: "color 0.2s" }}
                  >
                    Console (Dashboard)
                  </a>
                </li>
                <li className="nav-item ms-3">
                  <button 
                    onClick={handleLogout} 
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
                  <Link className="nav-link fs-6 text-dark" to="/login">Login</Link>
                </li>
                <li className="nav-item ms-3">
                  <Link 
                    className="btn btn-primary fs-6 py-1 px-3 text-white" 
                    to="/signup"
                    style={{ borderRadius: "4px", backgroundColor: "#387ed1", border: "none", whiteSpace: "nowrap" }}
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
