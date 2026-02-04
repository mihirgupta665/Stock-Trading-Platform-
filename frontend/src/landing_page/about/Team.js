import React from 'react';
import { Link } from 'react-router-dom';

function Team() {
    return ( 
        <div className="container">
            <div className="row text-center border-top ">
                <div className="col mt-5">
                    <h1>About ME</h1>
                </div>
            </div>
            <div className="row px-5 pt-5 pb-3 text-muted">
                <div className="col-6 p-5 text-center">
                    <img src="media/images/mihir_guitar.jpeg" alt="Mihir's Image" style={{width:"70%", borderRadius:"100%"}}></img>
                    <h3 className="mt-4 lh-base">Mihir Gupta</h3>
                    <h5>Founder, CEO</h5>
                </div>
                <div className="col-6 p-5 lh-lg" style={{fontSize:"18px"}}>
                    <p>Mihir bootstrapped and founded Zerodha in 2010 to overcome the hurdles he faced during his decade long stint as a trader. Today, Zerodha has changed the landscape of the Indian broking industry.</p>

                    <p>He is a member of the SEBI Secondary Market Advisory Committee (SMAC) and the Market Data Advisory Committee (MDAC).</p>

                    <p>Playing basketball is his zen.</p>

                    <p>Connect on <Link to="/" style={{ textDecoration: "None" }}>Homepage </Link>/ <a href="" style={{ textDecoration: "None" }}>TradingQnA </a>/ <a href="" style={{ textDecoration: "None" }}>Twitter </a> </p>
                </div>
            </div>
        </div>
     );
}

export default Team;