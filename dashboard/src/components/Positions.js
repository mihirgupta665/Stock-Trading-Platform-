import React, { useState, useEffect, useContext } from "react";
// import { positions } from "../data/data";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import Loader from "./Loader";


const Positions = () => {

  const [allPositions, setAllPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const generalContext = useContext(GeneralContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:3002/allPositions", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      setAllPositions(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Failed to load positions:", err);
      setLoading(false);
    });
  }, [generalContext.ordersChanged]);

  if (loading) {
    return <Loader message="Loading positions ledger..." />;
  }



  return (
    <>
      <h3 className="title">Positions ({allPositions.length}) </h3>

      <div className="order-table">
        <table>
          <tr>
            <th>Product</th>
            <th>Instrument</th>
            <th>Qty.</th>
            <th>Avg.</th>
            <th>LTP</th>
            <th>P&L</th>
            <th>Chg.</th>
          </tr>

          {allPositions.map((stock, index) => {
            const indianStocks = [
              "INFY", "ONGC", "TCS", "KPITTECH", "QUICKHEAL", 
              "WIPRO", "M&M", "RELIANCE", "HUL", "BHARTIARTL", 
              "HDFCBANK", "ITC", "SBIN", "TATAPOWER"
            ];
            const getRate = (symbol) => indianStocks.includes(symbol.toUpperCase()) ? 1 / 83.0 : 1.0;
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
                <td>{stock.product || "CNC"}</td>
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>${avgUSD.toFixed(2)}</td>  {/* toFixed(x) sets the number of x decimals to be visible */}
                <td>${priceUSD.toFixed(2)}</td>
                <td className={profClass}>${pnlUSD.toFixed(2)}</td>
                <td className={dayClass}>{stock.day}</td>
              </tr>
            );
          })}

        </table>
      </div>
    </>
  );
};

export default Positions;
