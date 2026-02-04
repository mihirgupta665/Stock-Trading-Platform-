import React from 'react';
function Stats() {
    return (
        <div className="container">
            <div className="row p-5">
                <div className="col-6 py-5 pe-5 ">
                    <h1 className="fs-1 mb-5 p-1">Trust with confidence</h1>
                    <h2 className="fs-4 mb-3">Customer-first always</h2>
                    <p className="mb-5 text-muted">That's why 1.3+ crore customers trust Zerodha with Rs.3.5+ lakh crores worth of equity investments.</p>
                    <h2 className="fs-4 mb-3">No spam or gimmicks</h2>
                    <p className="mb-5 text-muted">No gimmicks, spam, "gamification", or annoying push notifications. High quality apps that you use at your pace, the way you like. Our philosophies.</p>
                    <h2 className="fs-4 mb-3">The Zerodha universe</h2>
                    <p className="mb-5 text-muted">Not just an app, but a whole ecosystem. Our investments in 30+ fintech startups offer you tailored services specific to your needs.</p>
                    <h2 className="fs-4 mb-3">Do better with money</h2>
                    <p className="mb-5 text-muted">With initiatives like Nudge and Kill Switch, we don't just facilitate transactions, but actively help you do better with your money.</p>
                </div>
                <div  className="col-6 p-5"> 
                    <img style={{ width: "115%" }} src="media/images/ecosystem.png" alt="website eco system image" />
                    <div className="text-center">
                        <a href="" className="mx-5" style={{textDecoration:"None"}}>Explore our products <i className="fa-solid fa-arrow-right-long"></i></a>
                        <a href="" style={{textDecoration:"None"}}>Try Kite demo <i className="fa-solid fa-arrow-right-long"></i></a>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Stats;