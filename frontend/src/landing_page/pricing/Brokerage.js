import React from 'react';

function Brokerage() {
    return (
        <div className="container border-top mt-4 p-5">
            <div className="row  p-3">
                <div className="col-8 ">
                    <a style={{ textDecoration: "None" }} href=""><h4 className="text-center ">Brokerage Calculator</h4></a>
                    <ul className="text-muted mt-4 pt-2">
                        <li><p>Call & Trade and RMS auto-squareoff: Additional charges of ₹50 + GST per order.</p></li>

                        <li><p>Digital contract notes will be sent via e-mail.</p></li>

                        <li><p>Physical copies of contract notes, if required, shall be charged ₹20 per contract note. Courier charges apply.</p></li>

                        <li><p>For NRI account (non-PIS), 0.5% or ₹100 per executed order for equity (whichever is lower).</p></li>

                        <li><p>For NRI account (PIS), 0.5% or ₹200 per executed order for equity (whichever is lower).</p></li>

                        <li><p>If the account is in debit balance, any order placed will be charged ₹40 per executed order instead of ₹20 per executed order.</p></li>
                    </ul>
                </div>
                <div className="col-4">
                    <a style={{ textDecoration: "None" }} href=""><h4>List of Charges</h4></a>
                </div>
            </div>
        </div>
    );
}

export default Brokerage;