import React from 'react';

function RightSection({imageURL, productName, productDescription, arrowName}) {
    return ( 
        <div className="container py-5">
            <div className="row align-items-center">
                <div className="col-12 col-md-6 order-2 order-md-1 p-3">
                    <h1 className="fs-2 mb-4">{productName}</h1>
                    <p style={{ fontSize: "19px" }} className="mb-4">{productDescription}</p>
                    <a style={{textDecoration:"None"}} href={process.env.REACT_APP_DASHBOARD_URL || "http://localhost:3001"}>{arrowName} <i className="fa-solid fa-arrow-right-long"></i> </a>
                </div>
                <div className="col-12 col-md-6 order-1 order-md-2 text-center mb-4 mb-md-0">
                    <img src={imageURL} className="img-fluid" alt={productName} style={{ maxWidth: "100%", height: "auto" }}></img>
                </div>
            </div>
        </div>
     );
}

export default RightSection;