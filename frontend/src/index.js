import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from './landing_page/home/HomePage';
import SignUp from './landing_page/signup/SignUp';
import About from './landing_page/about/About';
import Pricing from './landing_page/pricing/Pricing';
import Products from './landing_page/products/Products';
import Support from './landing_page/support/Support';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<HomePage />} /> 
            <Route path="/signup" element={<SignUp />} /> 
            <Route path="/about" element={<About />} /> 
            <Route path="/products" element={<Products />} /> 
            <Route path="/pricing" element={<Pricing />} /> 
            <Route path="/support" element={<Support />} /> 
        </Routes>
    </BrowserRouter>
);


