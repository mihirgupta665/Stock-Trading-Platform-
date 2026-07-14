import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

function Brokerage() {
    return (
        <div className="brokerage-card">

            <Navigation />

            <div className="brokerage-content">
                <Outlet />
            </div>

        </div>
    );
}

export default Brokerage;