import React, { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import TopBar from "./TopBar";

const Home = () => {
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check URL parameters for token (SSO Redirect) or logout action
    const params = new URLSearchParams(window.location.search);
    const action = params.get("action");

    if (action === "logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      const frontendUrl = process.env.REACT_APP_FRONTEND_URL || (window.location.hostname === "localhost" ? "http://localhost:3000" : "");
      window.location.href = `${frontendUrl}/login?action=logout`;
      return;
    }

    const urlToken = params.get("token");
    if (urlToken) {
      localStorage.setItem("token", urlToken);
      // Clean URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const token = localStorage.getItem("token");

    if (!token) {
      // Not logged in -> Redirect to marketing portal login
      const frontendUrl = process.env.REACT_APP_FRONTEND_URL || (window.location.hostname === "localhost" ? "http://localhost:3000" : "");
      window.location.href = `${frontendUrl}/login`;
      return;
    }

    // Set axios global authorization header
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Validate token and fetch user details
    axios
      .get("http://localhost:3002/user")
      .then((res) => {
        localStorage.setItem("username", res.data.user.username);
        setAuthorized(true);
      })
      .catch((err) => {
        console.error("Auth validation failed", err);
        // Invalid token -> Clear storage and redirect
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        const frontendUrl = process.env.REACT_APP_FRONTEND_URL || (window.location.hostname === "localhost" ? "http://localhost:3000" : "");
        window.location.href = `${frontendUrl}/login?error=unauthorized`;
      });
  }, []);

  useEffect(() => {
    const handlePageShow = (event) => {
      const token = localStorage.getItem("token");
      if (!token) {
        const frontendUrl = process.env.REACT_APP_FRONTEND_URL || (window.location.hostname === "localhost" ? "http://localhost:3000" : "");
        window.location.href = `${frontendUrl}/login?redirectTo=${encodeURIComponent(window.location.href)}`;
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  if (!authorized) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "#387ed1", marginBottom: "10px" }}>Loading Console...</h2>
          <p style={{ color: "#888" }}>Verifying your security credentials</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <TopBar />
      <Dashboard />
    </>
  );
};

export default Home;
