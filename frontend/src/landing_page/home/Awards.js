import React from 'react';
function Awards() {
    return ( 
        <div className="container mt-5">
            <div className="row mt-5">
                <div className="col-6 mt-2 p-5">
                    <img src="media/images/largestBroker.svg" alt="stats image"/>
                </div>
                <div className="col-6 mt-5 p-5">
                    <h1 className="mt-3">Largest Stock broker in India</h1>
                    <p className="mb-4 p-1">2+ million clients contribute to over 15% of all retail order volumes in India daily by trading and investing in:</p>
                    <div className="row">
                        <div className="col">
                            <ul>
                                <li>
                                    <p>Features and Options</p>
                                </li>
                                <li>
                                    <p>Commodity Derivatives</p>
                                </li>
                                <li>
                                    <p>Currency Derivatives</p>
                                </li>
                            </ul>
                        </div>
                        <div className="col">
                            <ul>
                                <li>
                                    <p>Stocks and IPOs</p>
                                </li>
                                <li>
                                    <p>Direct mutual funds</p>
                                </li>
                                <li>
                                    <p>Bonds and Govt. Securities </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <img className="mt-2" style={{width:"95%"}} src="media/images/pressLogos.png" alt="press logo image"/>
                </div>
            </div>
        </div>
     );
}

export default Awards;