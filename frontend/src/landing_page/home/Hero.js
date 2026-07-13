import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
    return (
        <div className='container text-center mb-5'>
            <div className='row text-center justify-content-center'>
                <img style={{ maxWidth: "100%", height: "auto" }} src="media/images/homeHero.png" alt="Dashboard Landing Hero" className="img-fluid mb-5" />
                <h1 className="mt-4">Invest In Everything</h1>
                <p>Online platform to invest in stocks, derivatives, mutual funds, and more</p>
                <Link to="/signup" className="p-3 btn btn-primary fs-4" style={{ width: "250px", margin: "0 auto" }}>SignUp Now!</Link>
            </div>
        </div>
    );
}

export default Hero;