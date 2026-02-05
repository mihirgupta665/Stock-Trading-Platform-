import React from 'react';

function Hero() {
    return (
        <section className="container-fluid pt-5 pb-4" id="supportHero">
            <div className="" id="supportWrapper">
                <h4 className="fs-5">Support Portal</h4>
                 <a href="">Track Tickets</a>
            </div>
            <div className="row p-5" >
                <div className="col-5 px-5 mx-5 ">
                    <h4 className="fw-normal lh-base">Search for an answer or browser help topics to create a ticket</h4>
                    <input style={{width:"98%"}} className="d-block p-4 mt-4 mb-4 rounded-3 border-white" placeholder='Eg: how do i activate F&O, why is my order getting rejected..'/>

                    <a href="">Track accout opening</a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <a href="">Track segment activation</a>
                    <br />
                    <a href="">Intraday margins</a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <a href="">Kite user manual</a>
                    </div>
                <div className="col-5 px-5 mx-5">
                    <h4 className="fw-normal">Featured</h4>
                    <ol>
                        <li><a href=''>Current Takeovers and Delisting - January 2024</a></li>
                        <li className="mt-3"><a href=''>Latest Intraday leverages - MIS & CO</a></li>
                    </ol>
                </div>
            </div>
        </section>
    );
}

export default Hero;
