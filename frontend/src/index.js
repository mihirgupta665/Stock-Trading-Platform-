import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import HomePage from './landing_page/home/HomePage';
import SignUp from './landing_page/signup/SignUp';
import Login from './landing_page/signup/Login';
import AboutPage from './landing_page/about/AboutPage';
import PricingPage from './landing_page/pricing/PricingPage';
import ProductsPage from './landing_page/products/ProductsPage';
import SupportPage from './landing_page/support/SupportPage';
import Navbar from './landing_page/Navbar';
import Footer from './landing_page/Footer';
import NotFound from './landing_page/NotFound';
import axios from "axios";
import Equity from './landing_page/pricing/Brokerage/Equity';
import Currency from './landing_page/pricing/Brokerage/Currency';
import Commodity from './landing_page/pricing/Brokerage/Commodity';

import ScrollToTop from './ScrollToTop';

// Dynamically rewrite localhost API endpoints to environment values on deployment
axios.interceptors.request.use((config) => {
    const apiBase = process.env.REACT_APP_API_URL;
    if (apiBase && config.url && config.url.startsWith("http://localhost:3002")) {
        config.url = config.url.replace("http://localhost:3002", apiBase);
    }
    return config;
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/pricing" element={<PricingPage />}>
                <Route index element={<Equity />} />
                <Route path="equity" element={<Equity />} />
                <Route path="currency" element={<Currency />} />
                <Route path="commodity" element={<Commodity />} />
            </Route>
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
        <Footer />
    </BrowserRouter>
);


