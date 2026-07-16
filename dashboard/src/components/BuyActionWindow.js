import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid, mode = "BUY", price = 0.0 }) => {
    const [stockQuantity, setStockQuantity] = useState("1");
    const [stockPrice, setStockPrice] = useState(price.toString());
    const navigate = useNavigate();

    useEffect(() => {
        setStockPrice(price.toString());
    }, [price]);
    
    const generalContext = useContext(GeneralContext);

    const handleActionClick = () => {
        const token = localStorage.getItem("token");
        const parsedQty = Number(stockQuantity) || 0;
        const parsedPrice = Number(stockPrice) || 0;

        if (parsedQty <= 0) {
            toast.warning("Invalid quantity specified");
            return;
        }

        axios.post("http://localhost:3002/newOrder", {
            name: uid,
            qty: parsedQty,
            price: parsedPrice,
            mode: mode,
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            generalContext.triggerOrdersRefresh();
            if (mode === "BUY") {
                if (parsedPrice < price) {
                    toast.info(`Pending BUY ${uid}: $${parsedPrice.toFixed(2)}`);
                } else {
                    toast.success(`Bought ${uid}: $${parsedPrice.toFixed(2)}`);
                }
            } else {
                if (parsedPrice > price) {
                    toast.info(`Pending SELL ${uid}: $${parsedPrice.toFixed(2)}`);
                } else {
                    toast.success(`Sold ${uid}: $${parsedPrice.toFixed(2)}`);
                }
            }
            navigate("/orders");
        })
        .catch((err) => {
            const errMsg = err.response?.data?.error || "Order execution failed";
            toast.error(errMsg);
            console.error(`Error creating ${mode} order:`, err);
        });

        generalContext.closeBuyWindow();
    };

    const handleCancelClick = () => {
        generalContext.closeBuyWindow();
    };

    const qtyValue = Number(stockQuantity) || 0;
    const priceValue = Number(stockPrice) || 0;

    return (
        <div className="container" id="buy-window" draggable="true" style={{ borderTop: mode === "SELL" ? "10px solid #ff5722" : "10px solid #4184f3" }}>
            <div className="regular-order">
                <div style={{ marginBottom: "15px", fontWeight: "bold", fontSize: "1.1rem", color: mode === "SELL" ? "#ff5722" : "#4184f3" }}>
                    {mode === "SELL" ? "Sell" : "Buy"} {uid}
                </div>
                <div className="inputs">
                    <fieldset>
                        <legend>Qty.</legend>
                        <input
                            type="number"
                            name="qty"
                            id="qty"
                            onChange={(e) => setStockQuantity(e.target.value)}
                            value={stockQuantity}
                        />
                    </fieldset>
                    <fieldset>
                        <legend>Price</legend>
                        <input
                            type="number" 
                            name="price"
                            id="price"
                            step="0.05"
                            onChange={(e) => setStockPrice(e.target.value)}
                            value={stockPrice}
                        />
                    </fieldset>
                </div>
            </div>

            <div className="buttons">
                <span>Margin required ${(qtyValue * priceValue).toFixed(2)}</span>
                <div>
                    <button 
                        className="btn" 
                        style={{ backgroundColor: mode === "SELL" ? "#ff5722" : "#4184f3", color: "#fff", border: "none" }}
                        onClick={handleActionClick}
                    >
                        {mode === "SELL" ? "Sell" : "Buy"}
                    </button>
                    <button className="btn btn-grey" onClick={handleCancelClick} style={{ border: "none" }}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BuyActionWindow;