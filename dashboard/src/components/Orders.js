import React, { useState, useEffect, useContext } from "react";

import axios from "axios";
import GeneralContext from "./GeneralContext";
import Loader from "./Loader";

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const generalContext = useContext(GeneralContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:3002/allOrders", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      setAllOrders(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Failed to load orders:", err);
      setLoading(false);
    });
  }, [generalContext.ordersChanged]);

  if (loading) {
    return <Loader message="Loading orders ledger..." />;
  }

  return (
    <div className="orders">
      <h3 className="title">Orders ({allOrders.length})</h3>

      {allOrders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders today</p>
          <Link to={"/"} className="btn btn-blue" style={{ marginTop: "15px" }}>
            Get started
          </Link>
        </div>
      ) : (
        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>Instrument</th>
                <th>Qty.</th>
                <th>Price</th>
                <th>Status</th>
                <th>Mode</th>
              </tr>
            </thead>
            <tbody>
              {allOrders.map((order, index) => {
                const modeClass = order.mode === "BUY" ? "profit" : "loss";
                let statusBgColor = "#e2fbe8";
                let statusTextColor = "#28a745";
                if (order.status === "PENDING") {
                  statusBgColor = "#fff3cd";
                  statusTextColor = "#856404";
                } else if (order.status === "CANCELLED" || order.status === "FAILED") {
                  statusBgColor = "#f8d7da";
                  statusTextColor = "#dc3545";
                }

                return (
                  <tr key={index}>
                    <td>{order.name}</td>
                    <td>{order.qty}</td>
                    <td>${Number(order.price).toFixed(2)}</td>
                    <td>
                      <span style={{
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        backgroundColor: statusBgColor,
                        color: statusTextColor,
                        textTransform: "uppercase"
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td className={modeClass}>{order.mode}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
