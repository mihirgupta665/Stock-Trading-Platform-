import React from 'react';
function Education() {
    return (
        <div className="container mt-5">
            <div className="row mt-5 ">
                <div className="col-6">
                    <img src="media/images/education.svg" alt="Education image" />
                </div>
                <div className="col-6 mt-5">
                    <h1 className="mt-2 mb-4 fs-2 mt-4">Free and open market education</h1>
                    <p>Varsity, the largest online stock market education book in the world covering everything from the basics to advanced trading.</p>
                    <a href="" style={{ textDecoration: "None" }}>Varsity <i className="fa-solid fa-arrow-right-long"></i></a>
                    <p className="mt-5">TradingQ&A, the most active trading and investment community in India for all your market related queries.</p>
                    <a href="" style={{ textDecoration: "None" }}>TradingQ&A <i className="fa-solid fa-arrow-right-long"></i></a>
                </div>
            </div>
        </div>
    );
}

export default Education;