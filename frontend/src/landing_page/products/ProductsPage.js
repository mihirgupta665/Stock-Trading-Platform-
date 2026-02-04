import React from 'react';
import Hero from './Hero';
import LeftSection from './LeftSection';
import RightSection from './RightSection';
import Universe from './Universe';

function ProductsPage() {
    return (
        <h1>
            <Hero />
            <LeftSection />
            <RightSection />
            <Universe />
        </h1>
    );
}

export default ProductsPage;