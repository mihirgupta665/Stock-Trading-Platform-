import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";
import GeneralContext from "./GeneralContext";
import Loader from "./Loader";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const generalContext = useContext(GeneralContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:3002/allHoldings", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      setAllHoldings(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Failed to load holdings:", err);
      setLoading(false);
    });
  }, [generalContext.ordersChanged]);

  if (loading) {
    return <Loader message="Loading holdings ledger..." />;
  }

  const labels = allHoldings.map((subArray) => subArray["name"]);
  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price ($)",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      }
    ],  
  };

  const indianStocks = [
    "INFY", "ONGC", "TCS", "KPITTECH", "QUICKHEAL", 
    "WIPRO", "M&M", "RELIANCE", "HUL", "BHARTIARTL", 
    "HDFCBANK", "ITC", "SBIN", "TATAPOWER"
  ];
  const getRate = (symbol) => indianStocks.includes(symbol.toUpperCase()) ? 1 / 83.0 : 1.0;

  const totalInvestment = allHoldings.reduce((sum, stock) => {
    const rate = getRate(stock.name);
    return sum + (stock.avg * rate * stock.qty);
  }, 0);

  const totalCurrentValue = allHoldings.reduce((sum, stock) => {
    const rate = getRate(stock.name);
    return sum + (stock.price * rate * stock.qty);
  }, 0);

  const totalPnL = totalCurrentValue - totalInvestment;
  const pnlPercent = totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>
          <tbody>
            {allHoldings.map((stock, index) => {
              const rate = getRate(stock.name);
              const avgUSD = stock.avg * rate;
              const priceUSD = stock.price * rate;
              const curValueUSD = priceUSD * stock.qty;
              const investedUSD = avgUSD * stock.qty;
              const pnlUSD = curValueUSD - investedUSD;
              const isProfit = pnlUSD >= 0.0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={index} >
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>${avgUSD.toFixed(2)}</td>
                  <td>${priceUSD.toFixed(2)}</td>
                  <td>${curValueUSD.toFixed(2)}</td>
                  <td className={profClass}>${pnlUSD.toFixed(2)}</td>
                  <td className={profClass}>{stock.net}</td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>
            ${totalInvestment.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            ${totalCurrentValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5 className={totalPnL >= 0 ? "profit" : "loss"}>
            ${totalPnL.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({totalPnL >= 0 ? "+" : ""}{pnlPercent.toFixed(2)}%)
          </h5>
          <p>P&L</p>
        </div>
      </div>

      <VerticalGraph data={data}/>
    </>
  );
};

export default Holdings;
