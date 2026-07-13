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
            const curValue = stock.price * stock.qty;
            const isProfit = (curValue - (stock.avg * stock.qty)) >= 0.0;
            const profClass = isProfit ? "profit" : "loss";
            const dayClass = stock.isLoss ? "loss" : "profit";

            return (
              <tr key={index} >
                <td>{stock.product || "CNC"}</td>
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>${stock.avg.toFixed(2)}</td>  {/* toFixed(x) sets the number of x decimals to be visible */}
                <td>${stock.price.toFixed(2)}</td>
                <td className={profClass}>${(curValue - stock.avg * stock.qty).toFixed(2)}</td>
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
