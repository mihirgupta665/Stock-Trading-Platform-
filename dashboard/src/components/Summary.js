import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./Loader";

const Summary = () => {
  const username = localStorage.getItem("username") || "User";
  const [stats, setStats] = useState({
    availableBalance: 0,
    totalInvested: 0,
    totalCurrentValue: 0,
    overallPnL: 0,
    returnPercent: 0
  });
  const [holdingsCount, setHoldingsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // Fetch dashboard statistics and holdings count simultaneously
    Promise.all([
      axios.get("http://localhost:3002/portfolio/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get("http://localhost:3002/allHoldings", {
        headers: { Authorization: `Bearer ${token}` }
      })
    ])
    .then(([dashboardRes, holdingsRes]) => {
      setStats({
        availableBalance: dashboardRes.data.availableBalance,
        totalInvested: dashboardRes.data.totalInvested,
        totalCurrentValue: dashboardRes.data.totalCurrentValue,
        overallPnL: dashboardRes.data.overallPnL,
        returnPercent: dashboardRes.data.returnPercent
      });
      setHoldingsCount(holdingsRes.data.length);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Failed to load dashboard summary stats:", err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loader message="Loading dashboard details..." />;
  }

  const pnlClass = stats.overallPnL >= 0 ? "profit" : "loss";
  const pnlSign = stats.overallPnL >= 0 ? "+" : "";

  return (
    <>
      <div className="username">
        <h6>Hi, {username}!</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>${stats.availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used <span>$0.00</span>{" "}
            </p>
            <p>
              Opening balance <span>$1,00,000.00</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings ({holdingsCount})</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className={pnlClass}>
              ${stats.overallPnL.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <small style={{ marginLeft: "10px", fontSize: "0.9rem" }}>
                {pnlSign}{stats.returnPercent.toFixed(2)}%
              </small>
            </h3>
            <p>P&L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value <span>${stats.totalCurrentValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>{" "}
            </p>
            <p>
              Investment <span>${stats.totalInvested.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;
