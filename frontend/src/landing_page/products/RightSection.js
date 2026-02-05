import React from 'react';

function RightSection({imageURL, productName, productDescription, arrowName}) {
    return ( 
        <div className="container p-5">
            <div className="row px-5">
                <div className="col-6 mt-5 p-5">
                    <h1 className="mt-5 pt-5">{productName}</h1>
                    <p style={{ fontSize: "19px" }} className="mt-4 pe-5 mb-4 ">{productDescription}</p>
                    <a style={{textDecoration:"None"}} href="">{arrowName} <i className="fa-solid fa-arrow-right-long"></i> </a>
                </div>
                <div className="col-6">
                    <img src={imageURL} style={{height:"110%", width:"120%"}}></img>
                </div>
            </div>
        </div>
     );
}

export default RightSection;