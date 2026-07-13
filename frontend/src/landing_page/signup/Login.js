import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("action") === "logout" || params.get("error") === "unauthorized") {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const redirectTo = params.get("redirectTo");
      if (redirectTo) {
        const joinChar = redirectTo.includes("?") ? "&" : "?";
        window.location.href = `${redirectTo}${joinChar}token=${storedToken}`;
      } else {
        const dashboardUrl = process.env.REACT_APP_DASHBOARD_URL || (window.location.hostname === "localhost" ? "http://localhost:3001" : "");
        window.location.href = `${dashboardUrl}?token=${storedToken}`;
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      toast.warning("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3002/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      setSuccess("Login successful! Redirecting to dashboard...");
      toast.success("Login successful");

      setTimeout(() => {
        const params = new URLSearchParams(window.location.search);
        const redirectTo = params.get("redirectTo");
        const token = response.data.token;
        if (redirectTo) {
          const joinChar = redirectTo.includes("?") ? "&" : "?";
          window.location.href = `${redirectTo}${joinChar}token=${token}`;
        } else {
          const dashboardUrl = process.env.REACT_APP_DASHBOARD_URL || (window.location.hostname === "localhost" ? "http://localhost:3001" : "");
          window.location.href = `${dashboardUrl}?token=${token}`;
        }
      }, 1000);
    } catch (err) {
      const errMsg = err.response?.data?.error || "Login failed";
      setError(errMsg);
      toast.error("Login failed");
    }
  };

  return (
    <div className="container py-5 mt-5" style={{ minHeight: "75vh" }}>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-5">
          <div
            className="card border-0 shadow-lg p-4"
            style={{
              borderRadius: "12px",
              backgroundColor: "#fff",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div className="text-center mb-4">
              <h2 className="fw-bold" style={{ color: "#387ed1" }}>
                Login to Console
              </h2>
              <p className="text-muted">Access your trading dashboard</p>
            </div>

            {error && <div className="alert alert-danger py-2">{error}</div>}
            {success && <div className="alert alert-success py-2">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted fw-semibold">Email address</label>
                <input
                  type="email"
                  className="form-control form-control-lg placeholder-dim"
                  placeholder="name@example.com"
                  style={{ borderRadius: "8px", fontSize: "16px" }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-muted fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  style={{ borderRadius: "8px", fontSize: "16px" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-3 fs-5 fw-bold"
                style={{
                  borderRadius: "8px",
                  backgroundColor: "#387ed1",
                  border: "none",
                  transition: "all 0.2s",
                }}
              >
                Log In
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-muted mb-0">
                New user?{" "}
                <Link to="/signup" className="text-primary fw-semibold" style={{ textDecoration: "none" }}>
                  Create an account
                </Link>
              </p>
              <div className="mt-3 border-top pt-3">
                <p className="text-muted mb-1" style={{ fontSize: "14px" }}>
                  Demo Account:
                </p>
                <p className="text-dark fw-bold mb-0" style={{ fontSize: "14px" }}>
                  demo@zerodha.com / password123
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
