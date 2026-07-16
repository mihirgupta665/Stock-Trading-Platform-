import React, { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import TopBar from "./TopBar";

const Home = () => {
  const [authorized, setAuthorized] = useState(false);
  const [tokenStep, setTokenStep] = useState("loading"); // "pending", "loading", "success", "error"
  const [authStep, setAuthStep] = useState("pending");
  const [workspaceStep, setWorkspaceStep] = useState("pending");
  const [progress, setProgress] = useState(10);
  const [errorMessage, setErrorMessage] = useState(null);

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
      setTokenStep("error");
      setErrorMessage("No active session token found. Redirecting to login...");
      const frontendUrl = process.env.REACT_APP_FRONTEND_URL || (window.location.hostname === "localhost" ? "http://localhost:3000" : "");
      
      const timer = setTimeout(() => {
        window.location.href = `${frontendUrl}/login`;
      }, 2000);
      return () => clearTimeout(timer);
    }

    // Token exists - step 1 is success
    setTokenStep("success");
    setProgress(35);
    setAuthStep("loading");

    // Set axios global authorization header
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Add a short delay for premium feel
    const authTimer = setTimeout(() => {
      // Validate token and fetch user details
      axios
        .get("http://localhost:3002/user")
        .then((res) => {
          localStorage.setItem("username", res.data.user.username);
          setAuthStep("success");
          setProgress(70);
          setWorkspaceStep("loading");

          // Artificial delay to show workspace preparation
          const workspaceTimer = setTimeout(() => {
            setWorkspaceStep("success");
            setProgress(100);
            
            // Allow user to see 100% completion
            const finalTimer = setTimeout(() => {
              setAuthorized(true);
            }, 600);
            return () => clearTimeout(finalTimer);
          }, 900);
          return () => clearTimeout(workspaceTimer);
        })
        .catch((err) => {
          console.error("Auth validation failed", err);
          
          const isAuthError = err.response && (err.response.status === 401 || err.response.status === 403);
          setAuthStep("error");
          
          if (isAuthError) {
            setErrorMessage("Session expired or invalid credentials. Redirecting...");
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            const frontendUrl = process.env.REACT_APP_FRONTEND_URL || (window.location.hostname === "localhost" ? "http://localhost:3000" : "");
            
            const errorTimer = setTimeout(() => {
              window.location.href = `${frontendUrl}/login?error=unauthorized`;
            }, 3000);
            return () => clearTimeout(errorTimer);
          } else {
            // Server or network error (e.g. Render server waking up)
            setErrorMessage("Server connection failed. The backend may be booting up. Please refresh in a moment.");
          }
        });
    }, 700);

    return () => clearTimeout(authTimer);
  }, []);

  useEffect(() => {
    const handlePageShow = () => {
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
      <div className="console-loader-bg">
        <style>{`
          .console-loader-bg {
            background: radial-gradient(circle at 50% 50%, #f8fafc 0%, #f1f5f9 100%);
            height: 100vh;
            width: 100vw;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #334155;
            position: relative;
            overflow: hidden;
            box-sizing: border-box;
          }

          .console-loader-bg::before {
            content: '';
            position: absolute;
            top: -20%;
            left: -20%;
            width: 60%;
            height: 60%;
            background: radial-gradient(circle, rgba(59, 130, 246, 0.04) 0%, rgba(255, 255, 255, 0) 70%);
            filter: blur(80px);
            animation: floatLight 12s infinite ease-in-out;
            pointer-events: none;
          }

          .console-loader-bg::after {
            content: '';
            position: absolute;
            bottom: -20%;
            right: -20%;
            width: 60%;
            height: 60%;
            background: radial-gradient(circle, rgba(16, 185, 129, 0.03) 0%, rgba(255, 255, 255, 0) 70%);
            filter: blur(80px);
            animation: floatLight 15s infinite ease-in-out reverse;
            pointer-events: none;
          }

          .console-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 24px;
            width: 420px;
            padding: 40px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 
                        0 8px 10px -6px rgba(0, 0, 0, 0.05);
            z-index: 10;
            text-align: center;
            animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            box-sizing: border-box;
          }

          .logo-container {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            background: rgba(59, 130, 246, 0.08);
            border-radius: 16px;
            border: 1px solid rgba(59, 130, 246, 0.2);
            margin-bottom: 20px;
            animation: pulseGlow 3s infinite ease-in-out;
          }

          .console-title {
            font-size: 1.3rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            color: #0f172a;
            margin: 0 0 6px 0;
            text-transform: uppercase;
          }

          .console-subtitle {
            font-size: 0.85rem;
            color: #64748b;
            margin: 0 0 28px 0;
          }

          .chart-animation-container {
            margin: 24px 0;
            background: #f8fafc;
            border-radius: 16px;
            padding: 18px;
            border: 1px solid #e2e8f0;
          }

          .progress-track {
            background: #e2e8f0;
            border-radius: 100px;
            height: 5px;
            width: 100%;
            margin-bottom: 28px;
            overflow: hidden;
            position: relative;
          }

          .progress-bar {
            background: linear-gradient(90deg, #10b981 0%, #3b82f6 50%, #6366f1 100%);
            height: 100%;
            border-radius: 100px;
            transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.2);
          }

          .step-list {
            display: flex;
            flex-direction: column;
            gap: 14px;
            text-align: left;
            margin-bottom: 8px;
          }

          .step-item {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 0.85rem;
            padding: 10px 14px;
            border-radius: 12px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            transition: all 0.3s ease;
          }

          .step-item.success {
            background: rgba(16, 185, 129, 0.04);
            border-color: rgba(16, 185, 129, 0.15);
          }

          .step-item.loading {
            background: rgba(59, 130, 246, 0.04);
            border-color: rgba(59, 130, 246, 0.15);
          }

          .step-label {
            font-weight: 500;
          }

          .step-item.success .step-label {
            color: #10b981;
          }

          .step-item.loading .step-label {
            color: #3b82f6;
            font-weight: 600;
          }

          .step-item.pending .step-label {
            color: #64748b;
          }

          .step-item.error .step-label {
            color: #ef4444;
          }

          .step-icon-container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
          }

          .status-badge {
            font-size: 0.72rem;
            padding: 2px 8px;
            border-radius: 9999px;
            margin-left: auto;
            font-weight: 600;
          }

          .status-badge.success {
            background: rgba(16, 185, 129, 0.08);
            color: #10b981;
          }

          .status-badge.loading {
            background: rgba(59, 130, 246, 0.08);
            color: #3b82f6;
            animation: pulseOpacity 1.5s infinite ease-in-out;
          }

          .status-badge.pending {
            background: #e2e8f0;
            color: #64748b;
          }

          .status-badge.error {
            background: rgba(239, 68, 68, 0.08);
            color: #ef4444;
          }

          .console-footer {
            font-size: 0.72rem;
            color: #64748b;
            margin-top: 24px;
            border-top: 1px solid #e2e8f0;
            padding-top: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
          }

          .error-alert {
            margin-top: 16px;
            padding: 12px;
            border-radius: 8px;
            background: rgba(244, 63, 94, 0.1);
            border: 1px solid rgba(244, 63, 94, 0.2);
            color: #f43f5e;
            font-size: 0.8rem;
            animation: fadeIn 0.4s ease;
          }

          /* Keyframe Animations */
          @keyframes floatLight {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(40px, -20px) scale(1.08); }
          }

          @keyframes pulseGlow {
            0%, 100% { 
              box-shadow: 0 0 15px rgba(59, 130, 246, 0.1);
              border-color: rgba(59, 130, 246, 0.2);
            }
            50% { 
              box-shadow: 0 0 30px rgba(59, 130, 246, 0.35);
              border-color: rgba(59, 130, 246, 0.5);
            }
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes rotateSpinner {
            100% { transform: rotate(360deg); }
          }

          @keyframes pulseOpacity {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }

          @keyframes candlePulseUp {
            0%, 100% { transform: scaleY(0.7); }
            50% { transform: scaleY(1.3); }
          }

          @keyframes candlePulseDown {
            0%, 100% { transform: scaleY(1.2); }
            50% { transform: scaleY(0.6); }
          }

          @keyframes trendDraw {
            0% { stroke-dashoffset: 120; }
            45% { stroke-dashoffset: 0; }
            80% { stroke-dashoffset: -120; }
            100% { stroke-dashoffset: -120; }
          }
        `}</style>
        
        <div className="console-card">
          <div className="console-header">
            <div className="logo-container">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Custom Stock Kite Logo */}
                <path d="M12 2L4 10L12 18L20 10L12 2Z" fill="url(#logoGrad)" />
                <path d="M12 10L12 22" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                <path d="M8 14H16" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                <defs>
                  <linearGradient id="logoGrad" x1="4" y1="2" x2="20" y2="18" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="console-title">Kite Console</h1>
            <p className="console-subtitle">Secure Access Gateway</p>
          </div>

          <div className="chart-animation-container">
            <svg width="150" height="70" viewBox="0 0 120 60" style={{ margin: "0 auto", display: "block" }}>
              {/* Horizontal Grid lines */}
              <line x1="5" y1="15" x2="115" y2="15" stroke="rgba(0, 0, 0, 0.05)" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="5" y1="30" x2="115" y2="30" stroke="rgba(0, 0, 0, 0.05)" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="5" y1="45" x2="115" y2="45" stroke="rgba(0, 0, 0, 0.05)" strokeWidth="1" strokeDasharray="2 2" />

              {/* Candlestick 1 */}
              <line x1="26" y1="22" x2="26" y2="52" stroke="#ef4444" strokeWidth="1.2" opacity="0.5" />
              <rect x="22" y="28" width="8" height="16" fill="#ef4444" rx="1.5" style={{ transformOrigin: "26px 36px", animation: "candlePulseDown 2.2s infinite ease-in-out" }} />
              
              {/* Candlestick 2 */}
              <line x1="50" y1="8" x2="50" y2="42" stroke="#10b981" strokeWidth="1.2" opacity="0.5" />
              <rect x="46" y="16" width="8" height="20" fill="#10b981" rx="1.5" style={{ transformOrigin: "50px 26px", animation: "candlePulseUp 2.8s infinite ease-in-out" }} />
              
              {/* Candlestick 3 */}
              <line x1="74" y1="18" x2="74" y2="48" stroke="#ef4444" strokeWidth="1.2" opacity="0.5" />
              <rect x="70" y="24" width="8" height="15" fill="#ef4444" rx="1.5" style={{ transformOrigin: "74px 31px", animation: "candlePulseDown 1.9s infinite ease-in-out" }} />

              {/* Candlestick 4 */}
              <line x1="98" y1="5" x2="98" y2="38" stroke="#10b981" strokeWidth="1.2" opacity="0.5" />
              <rect x="94" y="9" width="8" height="22" fill="#10b981" rx="1.5" style={{ transformOrigin: "98px 20px", animation: "candlePulseUp 2.4s infinite ease-in-out" }} />
              
              {/* Trend Line Chart Overlay */}
              <path d="M 26 36 L 50 26 L 74 32 L 98 18" fill="none" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" 
                    style={{
                      strokeDasharray: 120,
                      strokeDashoffset: 120,
                      animation: "trendDraw 3.2s infinite linear"
                    }} 
              />
            </svg>
          </div>

          <div className="progress-track">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>

          <div className="step-list">
            {/* Step 1 */}
            <div className={`step-item ${tokenStep}`}>
              <div className="step-icon-container">
                {tokenStep === "success" && (
                  <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: "18px", height: "18px", fill: "#10b981" }}>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {tokenStep === "loading" && (
                  <div style={{ width: "14px", height: "14px", border: "2px solid rgba(59, 130, 246, 0.2)", borderTop: "2px solid #3b82f6", borderRadius: "50%", animation: "rotateSpinner 0.8s linear infinite" }}></div>
                )}
                {tokenStep === "pending" && (
                  <div style={{ width: "12px", height: "12px", border: "2px solid #4b5563", borderRadius: "50%" }}></div>
                )}
                {tokenStep === "error" && (
                  <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: "18px", height: "18px", fill: "#f43f5e" }}>
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="step-label">Locating SSO Session</span>
              <span className={`status-badge ${tokenStep}`}>
                {tokenStep === "success" && "Done"}
                {tokenStep === "loading" && "Reading..."}
                {tokenStep === "pending" && "Pending"}
                {tokenStep === "error" && "Missing"}
              </span>
            </div>

            {/* Step 2 */}
            <div className={`step-item ${authStep}`}>
              <div className="step-icon-container">
                {authStep === "success" && (
                  <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: "18px", height: "18px", fill: "#10b981" }}>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {authStep === "loading" && (
                  <div style={{ width: "14px", height: "14px", border: "2px solid rgba(59, 130, 246, 0.2)", borderTop: "2px solid #3b82f6", borderRadius: "50%", animation: "rotateSpinner 0.8s linear infinite" }}></div>
                )}
                {authStep === "pending" && (
                  <div style={{ width: "12px", height: "12px", border: "2px solid #4b5563", borderRadius: "50%" }}></div>
                )}
                {authStep === "error" && (
                  <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: "18px", height: "18px", fill: "#f43f5e" }}>
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="step-label">Verifying Credentials</span>
              <span className={`status-badge ${authStep}`}>
                {authStep === "success" && "Verified"}
                {authStep === "loading" && "Authenticating..."}
                {authStep === "pending" && "Pending"}
                {authStep === "error" && "Failed"}
              </span>
            </div>

            {/* Step 3 */}
            <div className={`step-item ${workspaceStep}`}>
              <div className="step-icon-container">
                {workspaceStep === "success" && (
                  <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: "18px", height: "18px", fill: "#10b981" }}>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {workspaceStep === "loading" && (
                  <div style={{ width: "14px", height: "14px", border: "2px solid rgba(59, 130, 246, 0.2)", borderTop: "2px solid #3b82f6", borderRadius: "50%", animation: "rotateSpinner 0.8s linear infinite" }}></div>
                )}
                {workspaceStep === "pending" && (
                  <div style={{ width: "12px", height: "12px", border: "2px solid #4b5563", borderRadius: "50%" }}></div>
                )}
                {workspaceStep === "error" && (
                  <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: "18px", height: "18px", fill: "#f43f5e" }}>
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="step-label">Initializing Workspace</span>
              <span className={`status-badge ${workspaceStep}`}>
                {workspaceStep === "success" && "Ready"}
                {workspaceStep === "loading" && "Preparing..."}
                {workspaceStep === "pending" && "Pending"}
                {workspaceStep === "error" && "Blocked"}
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="error-alert">
              {errorMessage}
            </div>
          )}

          <div className="console-footer">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M6 1C3.24 1 1 3.24 1 6C1 8.76 3.24 11 6 11C8.76 11 11 8.76 11 6C11 3.24 8.76 1 6 1ZM5.5 3H6.5V4H5.5V3ZM5.5 5H6.5V9H5.5V5Z" fill="#475569"/>
            </svg>
            <span>Secured Session connection</span>
          </div>
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
