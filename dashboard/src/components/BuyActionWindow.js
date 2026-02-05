import React from "react";

function BuyActionWindow({ uid }) {
    return (
        <div style={{
            position: "fixed",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "20px",
            background: "#fff",
            border: "1px solid #ddd",
            zIndex: 1000
        }}>
            <h4>Buy Stock</h4>
            <p>Stock UID: {uid}</p>
        </div>
    );
}

export default BuyActionWindow;
