import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from './landing_page/home/HomePage';
import SignUp from './landing_page/signup/SignUp';
import AboutPage from './landing_page/about/AboutPage';
import PricingPage from './landing_page/pricing/PricingPage';
import ProductsPage from './landing_page/products/ProductsPage';
import SupportPage from './landing_page/support/SupportPage';
import Navbar from './landing_page/Navbar';
import Footer from './landing_page/Footer';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Navbar />
        <Routes>
            <Route path="/" element={<HomePage />} /> 
            <Route path="/signup" element={<SignUp />} /> 
            <Route path="/about" element={<AboutPage />} /> 
            <Route path="/pricing" element={<PricingPage />} /> 
            <Route path="/products" element={<ProductsPage />} /> 
            <Route path="/support" element={<SupportPage />} /> 
        </Routes>
        <Footer />
    </BrowserRouter>
);


