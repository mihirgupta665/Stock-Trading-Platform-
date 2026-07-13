import React, { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import TopBar from "./TopBar";

const Home = () => {
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check URL parameters for token (SSO Redirect)
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");

    if (urlToken) {
      localStorage.setItem("token", urlToken);
      // Clean URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const token = localStorage.getItem("token");

    if (!token) {
      // Not logged in -> Redirect to marketing portal login
      window.location.href = "http://localhost:3000/login";
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
        window.location.href = "http://localhost:3000/login?error=unauthorized";
      });
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
