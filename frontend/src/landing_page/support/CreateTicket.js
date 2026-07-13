import React from 'react';
import { Link } from 'react-router-dom';

function CreateTicket() {
    return (
        <div className="container p-4">
            <div className="row">
                <h1 className="fs-2">To create a ticket, select a relevant topic</h1>
                <div className="col-4 pt-3 mt-5">
                    <h5 className="mb-5"><i className="fa-solid fa-circle-plus"> </i> Account Opening</h5>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>Online Account Opening</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>Offline Account Opening</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>Company, Partnership and HUF Account Opening</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>NRI Account Opening</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>Charges at Zerodha</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>Zerodha IDFC FIRST Bank 3-in-1 Account</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>Getting Started</p></Link>
                </div>
                <div className="col-4 pt-3 mt-5">
                    <h5 className="mb-5"><i className="fa-solid fa-circle-user"></i> Your Zerodha Account</h5>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>Login Credentials</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>Account modification and Segment Addition</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>DP ID and back details</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>Your Profile</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>Transfer and Conversion of shares</p></Link>
                </div>
                <div className="col-4 pt-3 mt-5">
                    <h5 className="mb-5"><i className="fa-solid fa-chart-area"></i>Your Zerodha Account</h5>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>Adding Fund</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>Fund withdrawal</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>eMandate</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>Adding Bank Account</p></Link>
                </div>

                <div className="col-4 pt-3 mt-5">
                    <h5 className="mb-5"><i className="fa-regular fa-credit-card"></i> Funds</h5>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>Reports</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>Ledger</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>Portfolio</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>60 Day Challenge</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>IPO</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>Refferal Program</p></Link>
                </div>
                <div className="col-4 pt-3 mt-5">
                    <h5 className="mb-5"><i className="fa-regular fa-face-smile"></i> Console</h5>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>Online Account Opening</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>Offline Account Opening</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>Company, Partnership and HUF Account Opening</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>NRI Account Opening</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>Charges at Zerodha</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>Zerodha IDFC FIRST Bank 3-in-1 Account</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>Getting Started</p></Link>
                </div>
                <div className="col-4 pt-3 mt-5">
                    <h5 className="mb-5"><i className="fa-regular fa-circle"></i> Coin</h5>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>Understanding Mutual Funds</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>About Coin</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>Buying and Selling through Coin</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>Starting an SIP</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>Managing your Portfolio</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>Coin App</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>Moving to Coin</p></Link>
                    <Link style={{ textDecoration: "none" }} to="/support"><p>Government Securities</p></Link>
                </div>
            </div>
        </div>
    );
}

export default CreateTicket;