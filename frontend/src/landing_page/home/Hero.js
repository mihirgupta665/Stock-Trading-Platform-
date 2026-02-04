import React from 'react';
function Hero() {
    return ( 
        <div className='container text-center mb-5'>
            <div className='row'>
                <img style={{width:"1320px", height:"500px"}} src="media/images/homeHero.png" alt="Hero Image of Dashboard" className="mb-5"/>
            </div>
            <h1 className="mt-4">Invest In Everything</h1>
            <p>Online platform to invest in stocks, derivatives, mutual funds, and more</p>
            <button className="p-3 btn btn-primary fs-4 " style={{width: "20%", margin: "0 auto"}}>SignUp Now!</button>
        </div>
    );
}

export default Hero;