import React from 'react';
import { Link } from 'react-router-dom';

function Stats() {
    return (
        <div className="container">
            <div className="row p-3 p-md-5 align-items-center">
                <div className="col-12 col-lg-6 py-3 py-md-5 pe-lg-5">
                    <h1 className="fs-2 mb-4">Trust with confidence</h1>
                    <h2 className="fs-5 mb-2">Customer-first always</h2>
                    <p className="mb-4 text-muted">That's why 1.3+ crore customers trust Zerodha with Rs.3.5+ lakh crores worth of equity investments.</p>
                    <h2 className="fs-5 mb-2">No spam or gimmicks</h2>
                    <p className="mb-4 text-muted">No gimmicks, spam, "gamification", or annoying push notifications. High quality apps that you use at your pace, the way you like. Our philosophies.</p>
                    <h2 className="fs-5 mb-2">The Zerodha universe</h2>
                    <p className="mb-4 text-muted">Not just an app, but a whole ecosystem. Our investments in 30+ fintech startups offer you tailored services specific to your needs.</p>
                    <h2 className="fs-5 mb-2">Do better with money</h2>
                    <p className="mb-4 text-muted">With initiatives like Nudge and Kill Switch, we don't just facilitate transactions, but actively help you do better with your money.</p>
                </div>
                <div className="col-12 col-lg-6 p-3 p-md-5 text-center"> 
                    <img style={{ maxWidth: "100%", height: "auto" }} src="media/images/ecosystem.png" className="img-fluid mb-4" alt="Ecosystem Illustration" />
                    <div className="text-center d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3">
                        <Link to="/products" style={{textDecoration:"None"}}>Explore our products <i className="fa-solid fa-arrow-right-long"></i></Link>
                        <a href="http://localhost:3001" style={{textDecoration:"None"}}>Try Kite demo <i className="fa-solid fa-arrow-right-long"></i></a>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Stats;