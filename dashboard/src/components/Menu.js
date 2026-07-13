import React, { useState } from "react";
import { Link } from "react-router-dom";

const Menu = () => {
    const [selectedMenu, setSelectedMenu] = useState(0);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    const username = localStorage.getItem("username") || "User";

    const handleMenuClick = (index) => {
        setSelectedMenu(index);
    };

    const handleProfileClick = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        window.location.href = "http://localhost:3000";
    };

    const menuClass = "menu";
    const activeMenuClass = "menu selected";

    return (
        <div className="menu-container">
            <img src="logo.png" alt="Logo" style={{ width: "50px" }} />
            <div className="menus">
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
                        <Link to="/holdings" style={{ textDecoration: "none" }} onClick={() => handleMenuClick(2)} >
                            <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>Holdings</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/positions" style={{ textDecoration: "none" }} onClick={() => handleMenuClick(3)}>
                            <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>Positions</p>
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
                <hr />
                <div className="profile" onClick={handleProfileClick} style={{ position: "relative" }}>
                    <div className="avatar" style={{ textTransform: "uppercase" }}>
                        {username.slice(0, 2)}
                    </div>
                    <p className="username" style={{ textTransform: "capitalize" }}>{username}</p>
                    
                    {isProfileDropdownOpen && (
                        <div 
                            className="profile-dropdown" 
                            style={{
                                position: "absolute",
                                top: "45px",
                                right: "0",
                                backgroundColor: "#fff",
                                border: "1px solid #eee",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                borderRadius: "8px",
                                padding: "10px",
                                zIndex: 1000,
                                minWidth: "120px",
                                textAlign: "center"
                            }}
                        >
                            <span 
                                onClick={handleLogout} 
                                style={{ 
                                    color: "#df5b2b", 
                                    cursor: "pointer", 
                                    fontWeight: "bold",
                                    fontSize: "0.9rem" 
                                }}
                            >
                                Logout
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Menu;
