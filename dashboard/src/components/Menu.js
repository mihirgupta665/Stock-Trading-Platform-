import React, { useState } from "react";

import { Link } from "react-router-dom";  // whenever we need link import same from the "react-router-dom"

const Menu = () => {

    const [selectedMenu, setSelectedMenu] = useState(0);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    const handleMenuClick = (index) => {        // navbar each option could be considered as intergex index value to perform the renering
        setSelectedMenu(index);
    }
    const handleProfileClick = () => {          // profile need to be shown or not shown so creating a toggling effect for just options
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    }

    const menuClass = "menu";        // default style to all the menu options
    const activeMenuClass = "menu selected"     // apart from default a special style to currently active class


    return (
        <div className="menu-container">
            <img src="logo.png" style={{ width: "50px" }} />
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
                <div className="profile" onClick={handleProfileClick}>
                    <div className="avatar">ZU</div>
                    <p className="username">USERID</p>
                </div>
            </div>
        </div>
    );
};

export default Menu;
