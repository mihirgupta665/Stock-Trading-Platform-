import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
    return (
        <section className="container-fluid pt-5 pb-4" id="supportHero">
            <div className="" id="supportWrapper">
                <h4 className="fs-5">Support Portal</h4>
                 <Link to="/support">Track Tickets</Link>
            </div>
            <div className="row p-5" >
                <div className="col-5 px-5 mx-5 ">
                    <h4 className="fw-normal lh-base">Search for an answer or browser help topics to create a ticket</h4>
                    <input style={{width:"98%"}} className="d-block p-4 mt-4 mb-4 rounded-3 border-white" placeholder='Eg: how do i activate F&O, why is my order getting rejected..'/>

                    <Link to="/support">Track account opening</Link> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Link to="/support">Track segment activation</Link>
                    <br />
                    <Link to="/support">Intraday margins</Link> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Link to="/support">Kite user manual</Link>
                </div>
                <div className="col-5 px-5 mx-5">
                    <h4 className="fw-normal">Featured</h4>
                    <ol>
                        <li><Link to='/support'>Current Takeovers and Delisting - January 2024</Link></li>
                        <li className="mt-3"><Link to='/support'>Latest Intraday leverages - MIS & CO</Link></li>
                    </ol>
                </div>
            </div>
        </section>
    );
}

export default Hero;
