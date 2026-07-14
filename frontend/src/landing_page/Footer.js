import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="container-fluid border-top bg-light mt-5 ">
            <div className="container">
                <div className="row mt-5 ms-5">
                    <div className="col">
                        <img src="media/images/logo.svg" alt="Logo" style={{ width: "50%" }} />
                        <p className="mt-4">&copy; 2010 - 2026, Mihir Gupta. <br /> All rights reserved.</p>
                    </div>

                    <div className="col">
                        <h5 className="mb-4">Company</h5>
                        <Link style={{textDecoration:"None"}} className="d-block mb-3 text-muted" to="/about">About</Link>
                        <Link style={{textDecoration:"None"}} className="d-block mb-3 text-muted" to="/about">Philosophy</Link>
                        <Link style={{textDecoration:"None"}} className="d-block mb-3 text-muted" to="/about">Press & media</Link>
                        <Link style={{textDecoration:"None"}} className="d-block mb-3 text-muted" to="/about">Careers</Link>
                        <Link style={{textDecoration:"None"}} className="d-block mb-3 text-muted" to="/about">Zerodha Cares (CSR)</Link>
                        <Link style={{textDecoration:"None"}} className="d-block mb-3 text-muted" to="/">Zerodha.tech</Link>
                        <Link style={{textDecoration:"None"}} className="d-block mb-3 text-muted" to="/">Open source</Link>
                    </div>

                    <div className="col">
                        <h5 className="mb-4">Support</h5>
                        <Link style={{textDecoration:"None"}} className="d-block mb-3 text-muted" to="/support">Contact us</Link>
                        <Link style={{textDecoration:"None"}} className="d-block mb-3 text-muted" to="/support">Support portal</Link>
                        <Link style={{textDecoration:"None"}} className="d-block mb-3 text-muted" to="/support">How to file a complaint?</Link>
                        <Link style={{textDecoration:"None"}} className="d-block mb-3 text-muted" to="/support">Status of your complaints</Link>
                        <Link style={{textDecoration:"None"}} className="d-block mb-3 text-muted" to="/support">Bulletin</Link>
                        <Link style={{textDecoration:"None"}} className="d-block mb-3 text-muted" to="/support">Circular</Link>
                        <Link style={{textDecoration:"None"}} className="d-block mb-3 text-muted" to="/">Z-Connect blog</Link>
                        <Link style={{textDecoration:"None"}} className="d-block mb-3 text-muted" to="/">Downloads</Link>
                    </div>

                    <div className="col">
                        <h5 className="mb-4">Account</h5>
                        <Link style={{textDecoration:"None"}} className="d-block mb-3 text-muted" to="/signup">Open demat account</Link>
                        <Link style={{textDecoration:"None"}} className="d-block mb-3 text-muted" to="/signup">Minor demat account</Link>
                        <Link style={{textDecoration:"None"}} className="d-block mb-3 text-muted" to="/signup">NRI demat account</Link>
                        <Link style={{textDecoration:"None"}} className="d-block mb-3 text-muted" to="/products">Commodity</Link>
                        <Link style={{textDecoration:"None"}} className="d-block mb-3 text-muted" to="/products">Dematerialisation</Link>
                        <Link style={{textDecoration:"None"}} className="d-block mb-3 text-muted" to="/">Fund transfer</Link>
                        <Link style={{textDecoration:"None"}} className="d-block mb-3 text-muted" to="/">MTF</Link>
                        <Link style={{textDecoration:"None"}} className="d-block mb-3 text-muted" to="/signup">Referral program</Link>
                    </div>
                </div>

                <div className="row mt-5 " style={{ fontSize: "14px" }}>
                    <p>Zerodha Broking Ltd.: Member of NSE, BSE​ &​ MCX – SEBI Registration no.: INZ000031633 CDSL/NSDL: Depository services through Zerodha Broking Ltd. – SEBI Registration no.: IN-DP-431-2019 Registered Address: Zerodha Broking Ltd., #153/154, 4th Cross, Dollars Colony, Opp. Clarence Public School, J.P Nagar 4th Phase, Bengaluru - 560078, Karnataka, India. For any complaints pertaining to securities broking please write to complaints@zerodha.com, for DP related to dp@zerodha.com. Please ensure you carefully read the Risk Disclosure Document as prescribed by SEBI | ICF</p>

                    <p>Procedure to file a complaint on SEBI SCORES: Register on SCORES portal. Mandatory details for filing complaints on SCORES: Name, PAN, Address, Mobile Number, E-mail ID. Benefits: Effective Communication, Speedy redressal of the grievances</p>

                    <p>Smart Online Dispute Resolution | Grievances Redressal Mechanism</p>

                    <p>Investments in securities market are subject to market risks; read all the related documents carefully before investing.</p>

                    <p>Attention investors: 1) Stock brokers can accept securities as margins from clients only by way of pledge in the depository system w.e.f September 01, 2020. 2) Update your e-mail and phone number with your stock broker / depository participant and receive OTP directly from depository on your e-mail and/or mobile number to create pledge. 3) Check your securities / MF / bonds in the consolidated account statement issued by NSDL/CDSL every month.</p>

                    <p>India's largest broker based on networth as per NSE. NSE broker factsheet</p>

                    <p>"Prevent unauthorised transactions in your account. Update your mobile numbers/email IDs with your stock brokers. Receive information of your transactions directly from Exchange on your mobile/email at the end of the day. Issued in the interest of investors. KYC is one time exercise while dealing in securities markets - once KYC is done through a SEBI registered intermediary (broker, DP, Mutual Fund etc.), you need not undergo the same process again when you approach another intermediary." Dear Investor, if you are subscribing to an IPO, there is no need to issue a cheque. Please write the Bank account number and sign the IPO application form to authorize your bank to make payment in case of allotment. In case of non allotment the funds will remain in your bank account. As a business we don't give stock tips, and have not authorized anyone to trade on behalf of others. If you find anyone claiming to be part of Zerodha and offering such services, please create a ticket here.</p>

                    <p>*Customers availing insurance advisory services offered by Ditto (Tacterial Consulting Private Limited | IRDAI Registered Corporate Agent (Composite) License No CA0738) will not have access to the exchange investor grievance redressal forum, SEBI SCORES/ODR, or arbitration mechanism for such products.</p>
                </div>

            </div>
        </footer>
    );
}

export default Footer;