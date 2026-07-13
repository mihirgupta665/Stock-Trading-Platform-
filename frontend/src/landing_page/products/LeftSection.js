import React from 'react';

function LeftSection({ imageURL, productName, productDescription, tryDemo, learnMore, googlePlay, appStore }) {
    return (
        <div className="container py-5">
            <div className="row align-items-center">
                <div className="col-12 col-md-6 text-center mb-4 mb-md-0">
                    <img src={imageURL} className="img-fluid" alt={productName} />
                </div>
                <div className="col-12 col-md-6 ps-md-5 p-3">
                    <h1 className="fs-2 mb-4">{productName}</h1>
                    <p style={{ fontSize: "19px" }}>{productDescription}</p>
                    <div className="mt-4 mb-4 pb-1">
                        <a href={tryDemo} style={{ textDecoration: "None" }}>Try Demo <i className="fa-solid fa-arrow-right-long"></i> </a>
                        <a href={learnMore} className="ms-3 ms-sm-5" style={{ textDecoration:"None"}}>Learn More <i className="fa-solid fa-arrow-right-long"></i> </a>
                    </div>
                    <div className="d-flex flex-wrap gap-3 mt-3">
                        <a href={googlePlay}><img src="media/images/googlePlayBadge.svg" className="img-fluid" alt="Google Play Store Badge" /> </a>
                        <a href={appStore}><img src="media/images/appstoreBadge.svg" className="img-fluid" alt="Apple App Store Badge" /></a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeftSection;