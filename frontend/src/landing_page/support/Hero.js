import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
    return (
        <section className="container-fluid py-5" id="supportHero">
            <div className="container px-md-5">
                {/* Header row */}
                <div className="d-flex justify-content-between align-items-center mb-5 pb-3 border-bottom border-white border-opacity-10">
                    <h4 className="fs-4 fw-normal mb-0">Support Portal</h4>
                    <Link to="/support" className="text-white text-decoration-underline fs-6 support-track-link">Track Tickets</Link>
                </div>
                
                {/* Content row */}
                <div className="row g-5">
                    {/* Left Column: Search & Quick Links */}
                    <div className="col-lg-7 col-md-12">
                        <h3 className="fw-normal lh-base fs-3 mb-4">Search for an answer or browse help topics to create a ticket</h3>
                        
                        <div className="mb-4">
                            <input 
                                className="w-100 p-3 ps-4 rounded-1 border-0 support-search-input" 
                                placeholder="Eg: how do i activate F&O, why is my order getting rejected.."
                            />
                        </div>

                        <div className="d-flex flex-wrap gap-4 mt-2 support-quick-links">
                            <Link to="/support" className="text-white text-decoration-underline">Track account opening</Link>
                            <Link to="/support" className="text-white text-decoration-underline">Track segment activation</Link>
                            <Link to="/support" className="text-white text-decoration-underline">Intraday margins</Link>
                            <Link to="/support" className="text-white text-decoration-underline">Kite user manual</Link>
                        </div>
                    </div>

                    {/* Right Column: Featured complaints */}
                    <div className="col-lg-5 col-md-12 ps-lg-5">
                        <h4 className="fw-normal fs-4 mb-4">Featured</h4>
                        <ol className="ps-3 text-white featured-list-links">
                            <li className="mb-3">
                                <Link to="/support" className="text-white text-decoration-underline lh-lg">Current Takeovers and Delisting - January 2024</Link>
                            </li>
                            <li>
                                <Link to="/support" className="text-white text-decoration-underline lh-lg">Latest Intraday leverages - MIS & CO</Link>
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
