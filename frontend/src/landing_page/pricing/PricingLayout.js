import React from "react";
import OpenAccountCard from "./Sidebar/OpenAccountCard";
import Brokerage from "./Brokerage/Brokerage";

function PricingLayout() {
    return (
        <section className="pricing-layout">

            <div className="container pricing-container">

                <div className="row g-4 align-items-start">

                    <div className="col-lg-3 col-md-12">
                        <OpenAccountCard />
                    </div>

                    <div className="col-lg-9 col-md-12">
                        <Brokerage />
                    </div>

                </div>

            </div>

        </section>
    );
}

export default PricingLayout;