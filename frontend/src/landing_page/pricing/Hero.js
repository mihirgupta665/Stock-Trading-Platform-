import React from 'react';

function Hero() {
    return ( 
        <div className="container">
            <div className="row pt-5 pb-4  border-bottom text-center">
                <div className="col">
                    <h1>Pricing</h1>
                    <p className="text-muted mt-4 mb-4 fs-5">Free equity investments and flat &#8377;20 traday and F&O traders</p>
                </div>
            </div>
            <div className="row text-center pt-5 px-5">
                <div className="col-4 p-4">
                    <img src="media/images/pricingEquity.svg" />
                    <h1 className="fs-2">Free equity delivery</h1>
                    <p className="text-muted p-2 px-4">All equity delivery investments (NSE, BSE), are absolutely free — ₹ 0 brokerage.</p>
                </div>
                <div className="col-4 p-4">
                    <img src="media/images/intradayTrades.svg" />
                    <h1 className="fs-2">Intraday and F&O trades</h1>
                    <p className="text-muted p-2 px-4">Flat ₹ 20 or 0.03% (whichever is lower) per executed order on intraday trades across equity, currency, and commodity trades. Flat ₹20 on all option trades.</p>
                </div>
                <div className="col-4 p-4 ">
                    <img src="media/images/pricingEquity.svg" />
                    <h1 className="fs-2">Free direct MF</h1>
                    <p className="text-muted p-2 px-4">All direct mutual fund investments are absolutely free — ₹ 0 commissions & DP charges.</p>
                </div>
            </div>
        </div>
     );
}

export default Hero;
<h1>Hero</h1>