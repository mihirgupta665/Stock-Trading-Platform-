import React from 'react';

function LeftSection({ imageURL, productName, productDescription, tryDemo, learnMore, googlePlay, appStore }) {
    return (
        <div className="container py-5 ps-5">
            <div className="row">
                <div className="col-6">
                    <img src={imageURL} />
                </div>
                <div className="col-6 mt-4 ps-5 p-5">
                    <h1 className="fs-2 mb-4">{productName}</h1>
                    <p style={{ fontSize: "19px" }}  >{productDescription}</p>
                    <div className="mt-4 mb-4 pb-1">
                        <a href={tryDemo} style={{ textDecoration: "None" }}>Try Demo <i class="fa-solid fa-arrow-right-long"></i> </a>
                        <a href={learnMore} style={{ marginLeft: "50px", textDecoration:"None"}}>Learn More <i class="fa-solid fa-arrow-right-long"></i> </a>
                    </div>
                    <div>
                        <a href={googlePlay}><img src="media/images/googlePlayBadge.svg" /> </a>
                        <a href={appStore} style={{ marginLeft: "25px"}}><img src="media/images/appstoreBadge.svg" /></a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeftSection;