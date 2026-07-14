import React from "react";
import { NavLink } from "react-router-dom";

function Navigation() {
    return (
        <nav className="brokerage-navigation">

            <NavLink
                end
                to="equity"
                className={({ isActive }) =>
                    `brokerage-nav-link ${isActive ? "active" : ""}`
                }
            >
                Equity
            </NavLink>

            <NavLink
                to="currency"
                className={({ isActive }) =>
                    `brokerage-nav-link ${isActive ? "active" : ""}`
                }
            >
                Currency
            </NavLink>

            <NavLink
                to="commodity"
                className={({ isActive }) =>
                    `brokerage-nav-link ${isActive ? "active" : ""}`
                }
            >
                Commodity
            </NavLink>

        </nav>
    );
}

export default Navigation;