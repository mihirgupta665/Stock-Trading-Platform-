import React from 'react';

function Hero() {
    return ( 
        <div className="container">
            <div className="row pt-5 pb-4 border-bottom text-center">
                <div className="col">
                    <h1 className="fw-normal mb-2 fs-2" style={{ color: '#424242' }}>Charges</h1>
                    <p className="text-muted mt-2 mb-4 fs-6">List of all charges and taxes</p>
                </div>
            </div>
            <div className="row text-center pt-5 px-2 px-md-5">
                <div className="col-12 col-md-4 p-4 mb-4">
                    <img src="media/images/pricingEquity.svg" alt="Free Equity Delivery" className="img-fluid mb-3" style={{ maxWidth: "120px", height: "auto" }} />
                    <h3 className="fs-5 fw-normal mt-3 mb-2" style={{ color: '#424242' }}>Free equity delivery</h3>
                    <p className="text-muted p-1 px-md-3 small">All equity delivery investments (NSE, BSE), are absolutely free — ₹0 brokerage.</p>
                </div>
                <div className="col-12 col-md-4 p-4 mb-4">
                    <img src="media/images/intradayTrades.svg" alt="Intraday Trades" className="img-fluid mb-3" style={{ maxWidth: "120px", height: "auto" }} />
                    <h3 className="fs-5 fw-normal mt-3 mb-2" style={{ color: '#424242' }}>Intraday and F&O trades</h3>
                    <p className="text-muted p-1 px-md-3 small">Flat ₹20 or 0.03% (whichever is lower) per executed order on intraday trades across equity, currency, and commodity trades. Flat ₹20 on all option trades.</p>
                </div>
                <div className="col-12 col-md-4 p-4 mb-4">
                    <img src="media/images/pricingEquity.svg" alt="Free Direct MF" className="img-fluid mb-3" style={{ maxWidth: "120px", height: "auto" }} />
                    <h3 className="fs-5 fw-normal mt-3 mb-2" style={{ color: '#424242' }}>Free direct MF</h3>
                    <p className="text-muted p-1 px-md-3 small">All direct mutual fund investments are absolutely free — ₹0 commissions & DP charges.</p>
                </div>
            </div>
        </div>
     );
}

export default Hero;
    