import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function SignUp() {
  const [username, setUsername] = useState("");
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
      window.location.href = `http://localhost:3001?token=${storedToken}`;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !email || !password) {
      setError("Please fill in all fields.");
      toast.warning("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3002/signup", {
        username,
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      setSuccess("Account created successfully! Redirecting to dashboard...");
      toast.success("Account created successfully");

      setTimeout(() => {
        window.location.href = `http://localhost:3001?token=${response.data.token}`;
      }, 1000);
    } catch (err) {
      const errMsg = err.response?.data?.error || "Registration failed";
      setError(errMsg);
      toast.error("Registration failed");
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
                Create Account
              </h2>
              <p className="text-muted">Start trading on our platform</p>
            </div>

            {error && <div className="alert alert-danger py-2">{error}</div>}
            {success && <div className="alert alert-success py-2">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted fw-semibold">Username</label>
                <input
                  type="text"
                  className="form-control form-control-lg placeholder-dim"
                  placeholder="Username"
                  style={{ borderRadius: "8px", fontSize: "16px" }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

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
                Sign Up
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-muted mb-0">
                Already have an account?{" "}
                <Link to="/login" className="text-primary fw-semibold" style={{ textDecoration: "none" }}>
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;