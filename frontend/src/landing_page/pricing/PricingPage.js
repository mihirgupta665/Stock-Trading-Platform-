import React from 'react';
import Hero from './Hero';
import PricingLayout from "./PricingLayout";
import AdditionalCharges from "./AdditionalCharges";
import "./pricing.css";

function PricingPage() {
    return ( 
        <>
            <Hero />
            <PricingLayout />
            <AdditionalCharges />
        </>
     );
}

export default PricingPage;