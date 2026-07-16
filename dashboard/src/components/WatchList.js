import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import { Tooltip, Grow } from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown, BarChartOutlined, MoreHoriz } from "@mui/icons-material";
import { DoughnutChart } from "./DoughnutChart.js";
import Loader from "./Loader";

const WatchList = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const generalContext = useContext(GeneralContext);

    useEffect(() => {
        axios.get("http://localhost:3002/allPrices")
            .then((res) => {
                const mappedList = res.data.map((stock) => ({
                    name: stock.symbol,
                    price: stock.currentPrice,
                    percent: (stock.changePercent >= 0 ? "+" : "") + Number(stock.changePercent || 0).toFixed(2) + "%",
                    isDown: (stock.changePercent || 0) < 0
                }));
                setWatchlist(mappedList);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load watchlist from DB:", err);
                setLoading(false);
            });
    }, [generalContext.ordersChanged]);

    const filteredWatchlist = watchlist.filter((stock) =>
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const data = {
        labels: filteredWatchlist.slice(0, 10).map((stock) => stock.name),
        datasets: [
            {
                label: 'Price',
                data: filteredWatchlist.slice(0, 10).map((stock) => stock.price),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(233, 30, 99, 0.5)',
                    'rgba(156, 39, 176, 0.5)',
                    'rgba(33, 150, 243, 0.5)',
                    'rgba(0, 150, 136, 0.5)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(233, 30, 99, 1)',
                    'rgba(156, 39, 176, 1)',
                    'rgba(33, 150, 243, 1)',
                    'rgba(0, 150, 136, 1)',
                ],
                borderWidth: 1,
            },
        ], 
    };

    return (
        <div className="watchlist-container">
            <div className="search-container">
                <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Search eg:infy, bse, AAPL, TSLA"
                    className="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="counts"> {filteredWatchlist.length} / 50</span>
            </div>

            {loading ? (
                <Loader message="Loading watchlist..." />
            ) : (
                <>
                    <ul className="list">
                        {filteredWatchlist.map((stock, index) => {
                            return <WatchListItem stock={stock} key={index} />
                        })}
                    </ul>

                    {filteredWatchlist.length > 0 && (
                        <div style={{ height: "360px", flexShrink: 0, padding: "20px 10px", display: "flex", justifyContent: "center", marginBottom: "30px" }}>
                            <DoughnutChart data={data} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

const WatchListItem = ({ stock }) => {
    const [showWatchListActions, setShowWatchListActions] = useState(false);

    const handleMouseEnter = (event) => {
        setShowWatchListActions(true);
    }
    const handleMouseLeave = (event) => {
        setShowWatchListActions(false);
    }

    return(
        <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}> 
            <div className="item">
                <p className={stock.isDown?"down":"up"}>{stock.name}</p>
                <div className="itemInfo">
                    <span className="percent">{stock.percent}</span>
                    {stock.isDown ? (<KeyboardArrowDown className="down" />) : (<KeyboardArrowUp className="up" />)}
                    <span className="price">{Number(stock.price).toFixed(2)}</span>
                </div>
            </div>
            {showWatchListActions && <WatchListActions uid={stock.name} price={stock.price} />}
        </li>
    );
}

const WatchListActions = ({ uid, price }) => {
    const generalContext = useContext(GeneralContext);

    const handleBuyClick = () => {
        generalContext.openBuyWindow(uid, price);
    };

    const handleSellClick = () => {
        generalContext.openSellWindow(uid, price);
    };

    const handleAnalyticsClick = () => {
        generalContext.openAnalytics(uid);
    };

    return(
        <span className="actions">
            <span>
                <Tooltip title="Buy (B)" placement="top" arrow TransitionComponent={Grow}>
                    <button className="buy" onClick={handleBuyClick}>Buy</button>
                </Tooltip>
                <Tooltip title="Sell (S)" placement="top" arrow TransitionComponent={Grow}>
                    <button className="sell" onClick={handleSellClick}>Sell</button>
                </Tooltip>
                <Tooltip title="Analytics (A)" placement="top" arrow TransitionComponent={Grow}>
                    <button className="action" onClick={handleAnalyticsClick}> <BarChartOutlined className="icon" /> </button>
                </Tooltip>
                <Tooltip title="More (M)" placement="top" arrow TransitionComponent={Grow}>
                    <button className="action"> <MoreHoriz className="icon" /> </button>
                </Tooltip>
            </span>
        </span>
    );
}

export default WatchList;
