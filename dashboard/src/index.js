import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./components/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// Dynamically rewrite localhost API endpoints to environment values on deployment
axios.interceptors.request.use((config) => {
  const apiBase = process.env.REACT_APP_API_URL;
  if (apiBase && config.url && config.url.startsWith("http://localhost:3002")) {
    config.url = config.url.replace("http://localhost:3002", apiBase);
  }
  return config;
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Home />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  </React.StrictMode>
);
