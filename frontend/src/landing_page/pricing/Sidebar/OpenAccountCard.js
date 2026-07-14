import React from "react";

function OpenAccountCard() {
    return (
        <div className="open-account-card">

            <div className="open-account-badge">
                ₹0 Account Opening
            </div>

            <h3 className="open-account-title">
                Start Your Investment Journey
            </h3>

            <p className="open-account-description">
                Invest in stocks, mutual funds, ETFs, IPOs and derivatives with a
                modern trading platform trusted by millions of investors.
            </p>

            <div className="open-account-features">

                <div className="feature-item">
                    ✓ Zero account opening charges
                </div>

                <div className="feature-item">
                    ✓ ₹0 brokerage on equity delivery
                </div>

                <div className="feature-item">
                    ✓ Lightning-fast order execution
                </div>

                <div className="feature-item">
                    ✓ Secure & paperless KYC
                </div>

            </div>

            <button className="btn btn-primary w-100 open-account-btn">
                Open Account
            </button>

            <p className="small text-center text-muted mt-3 mb-0">
                Join millions of investors today.
            </p>

        </div>
    );
}

export default OpenAccountCard;