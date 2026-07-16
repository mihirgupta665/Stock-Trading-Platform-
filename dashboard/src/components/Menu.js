import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Menu = () => {
    const location = useLocation();
    
    const getMenuIndexFromPath = (pathname) => {
        if (pathname === "/orders") return 1;
        if (pathname === "/positions") return 2;
        if (pathname === "/holdings") return 3;
        if (pathname === "/funds") return 4;
        if (pathname === "/apps") return 5;
        return 0;
    };

    const [selectedMenu, setSelectedMenu] = useState(getMenuIndexFromPath(location.pathname));
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const profileRef = useRef(null);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    useEffect(() => {
        setSelectedMenu(getMenuIndexFromPath(location.pathname));
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const username = localStorage.getItem("username") || "User";

    const handleMenuClick = (index) => {
        setSelectedMenu(index);
        setIsMobileMenuOpen(false);
    };

    const handleProfileClick = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        delete axios.defaults.headers.common["Authorization"];
        const frontendUrl = process.env.REACT_APP_FRONTEND_URL || (window.location.hostname === "localhost" ? "http://localhost:3000" : "");
        window.location.href = `${frontendUrl}/login?action=logout`;
    };

    const menuClass = "menu";
    const activeMenuClass = "menu selected";

    return (
        <div className="menu-container">
            <img src="logo.png" alt="Logo" style={{ width: "50px" }} />
            
            <div className={`menus ${isMobileMenuOpen ? "mobile-open" : ""}`}>
                <ul>
                    <li>
                        <Link style={{ textDecoration: "none" }} to="/" onClick={() => handleMenuClick(0)}>
                            <p className={selectedMenu === 0 ? activeMenuClass : menuClass} >Dashboard</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/orders" style={{ textDecoration: "none" }} onClick={() => handleMenuClick(1)}>
                            <p className={selectedMenu === 1 ? activeMenuClass : menuClass} >Orders</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/positions" style={{ textDecoration: "none" }} onClick={() => handleMenuClick(2)}>
                            <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>Positions</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/holdings" style={{ textDecoration: "none" }} onClick={() => handleMenuClick(3)} >
                            <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>Holdings</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/funds" style={{textDecoration:"none"}} onClick={() => handleMenuClick(4)}>
                            <p className={selectedMenu===4?activeMenuClass:menuClass} >Funds</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/apps" style={{textDecoration:"none"}} onClick={()=>handleMenuClick(5)} >
                            <p className={selectedMenu===5?activeMenuClass:menuClass}>Apps</p>
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="right-nav">
                <div ref={profileRef} className="profile" onClick={handleProfileClick} style={{ position: "relative" }}>
                    <div className="avatar" style={{ textTransform: "uppercase" }}>
                        {username.slice(0, 2)}
                    </div>
                    <p className="username" style={{ textTransform: "capitalize" }}>{username}</p>
                    
                    {isProfileDropdownOpen && (
                        <div 
                            className="profile-dropdown" 
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                position: "absolute",
                                top: "50px", // Put it below the profile name in the header top bar
                                right: "0",
                                backgroundColor: "#fff",
                                border: "1px solid #e5e7eb",
                                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                                borderRadius: "10px",
                                padding: "16px",
                                zIndex: 1000,
                                minWidth: "185px",
                                textAlign: "left",
                                display: "flex",
                                flexDirection: "column",
                                gap: "2px"
                            }}
                        >
                            <span style={{ fontWeight: "600", fontSize: "0.95rem", color: "#1f2937", textTransform: "capitalize" }}>
                                {username}
                            </span>
                            <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                                Client ID: TRDER{username.slice(0, 3).toUpperCase()}99
                            </span>
                            <hr style={{ margin: "10px 0", border: "0", borderTop: "1px solid #e5e7eb" }} />
                            <button 
                                onClick={handleLogout} 
                                style={{ 
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                    width: "100%",
                                    padding: "8px 12px",
                                    color: "#dc2626",
                                    backgroundColor: "#fff",
                                    border: "1px solid #fca5a5",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    fontWeight: "500",
                                    fontSize: "0.85rem",
                                    transition: "all 0.2s ease"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#fef2f2";
                                    e.currentTarget.style.borderColor = "#ef4444";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "#fff";
                                    e.currentTarget.style.borderColor = "#fca5a5";
                                }}
                            >
                                <i className="fa-solid fa-right-from-bracket"></i>
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                <button className="hamburger-btn" onClick={toggleMobileMenu} aria-label="Toggle menu">
                    <span className={`bar ${isMobileMenuOpen ? "open" : ""}`}></span>
                    <span className={`bar ${isMobileMenuOpen ? "open" : ""}`}></span>
                    <span className={`bar ${isMobileMenuOpen ? "open" : ""}`}></span>
                </button>
            </div>
        </div>
    );
};

export default Menu;
