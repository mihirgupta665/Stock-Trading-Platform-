import React from 'react';

function Universe() {
    return (
        <div className="container my-5 p-5 text-center">
            <div className="row ">
                <div className="col">
                    <h1 className="fs-2">The Zerodha Universe</h1>
                    <p className="mt-4">Extend your trading and investment experience even further with our partner platforms</p>
                </div>
            </div>
            <div style={{ fontSize: "13px" }} className="row text-muted mt-4 ms-1 pt-5 ">
                <div className="col-4">
                    <img src="media/images/smallcaseLogo.png" />
                    <p className="text-small text-muted px-5 mt-3">Our asset management venture
                        that is creating simple and transparent index
                        funds to help you save for your goals.</p>
                </div>
                <div className="col-4">
                    <img style={{ width: "40%" }} src="media/images/streakLogo.png" />
                    <p className="text-small text-muted px-5 mt-3">Options trading platform that lets you
                        create strategies, analyze positions, and examine
                        data points like open interest, FII/DII, and more.
                    </p>
                </div>
                <div className="col-4">
                    <img style={{ width: "50%" }} src="media/images/sensibullLogo.svg" />
                    <p className="text-small text-muted px-5 pt-2 mt-4">Investment research platform
                        that offers detailed insights on stocks,
                        sectors, supply chains, and more.</p>
                </div>
            </div>
            <div style={{ fontSize: "13px" }} className="row text-muted ms-1 pt-5 ">
                <div className="col-4">
                    <img style={{ width: "50%" }} src="media/images/zerodhaFundhouse.png" />
                    <p className="text-small text-muted px-5 pt-1 mt-3">Systematic trading platform
                        that allows you to create and backtest
                        strategies without coding.</p>
                </div>
                <div className="col-4">
                    <img style={{ width: "55%" }} src="media/images/goldenpiLogo.png" />
                    <p className="text-small text-muted px-5 mt-3">Thematic investing platform
                        that helps you invest in diversified
                        baskets of stocks on ETFs.</p>
                </div>
                <div className="col-4">
                    <img style={{ width: "35%" }} src="media/images/dittoLogo.png" />
                    <p className="text-small text-muted px-5 mt-4">Personalized advice on life
                        and health insurance. No spam
                        and no mis-selling.
                        Sign up for free</p>
                </div>
                <button className="p-2 btn btn-primary fs-4 my-5" style={{ width: "20%", margin: "0 auto" }}>Sign up for free</button>
            </div>
        </div>
    );
}

export default Universe;