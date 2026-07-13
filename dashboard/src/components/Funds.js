import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "./Loader";

const Funds = () => {
  const [stats, setStats] = useState({
    availableBalance: 100000.0,
    totalInvested: 0.0,
    totalCurrentValue: 0.0,
    overallPnL: 0.0,
    returnPercent: 0.0,
    totalDeposited: 0.0
  });
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("deposit"); // "deposit" or "withdraw"
  const [inputAmount, setInputAmount] = useState("");
  
  // Commodity account state (mock activation)
  const [isCommodityActive, setIsCommodityActive] = useState(false);
  const [isCommodityModalOpen, setIsCommodityModalOpen] = useState(false);

  const fetchFundsData = () => {
    const token = localStorage.getItem("token");
    
    Promise.all([
      axios.get("http://localhost:3002/portfolio/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get("http://localhost:3002/allOrders", {
        headers: { Authorization: `Bearer ${token}` }
      })
    ])
    .then(([dashboardRes, ordersRes]) => {
      setStats({
        availableBalance: dashboardRes.data.availableBalance,
        totalInvested: dashboardRes.data.totalInvested,
        totalCurrentValue: dashboardRes.data.totalCurrentValue,
        overallPnL: dashboardRes.data.overallPnL,
        returnPercent: dashboardRes.data.returnPercent,
        totalDeposited: dashboardRes.data.totalDeposited || 0.0
      });
      setAllOrders(ordersRes.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Failed to load funds page details:", err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchFundsData();
  }, []);

  const handleActionClick = (action) => {
    setModalAction(action);
    setInputAmount("");
    setIsModalOpen(true);
  };

  const handlePresetClick = (amount) => {
    setInputAmount(amount.toString());
  };

  const handleFundsSubmit = (e) => {
    e.preventDefault();
    const val = Number(inputAmount);
    if (isNaN(val) || val <= 0) {
      toast.warning("Invalid amount");
      return;
    }

    if (modalAction === "withdraw" && stats.availableBalance < val) {
      toast.error("Insufficient funds");
      return;
    }

    const token = localStorage.getItem("token");
    axios.post("http://localhost:3002/portfolio/funds", {
      amount: val,
      action: modalAction === "deposit" ? "deposit" : "withdraw"
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setIsModalOpen(false);
      toast.success(modalAction === "deposit" ? "Funds added" : "Funds withdrawn");
      fetchFundsData();
    })
    .catch((err) => {
      const errMsg = err.response?.data?.error || "Transaction failed";
      toast.error(errMsg);
    });
  };

  const handleConfirmCommodity = () => {
    setIsCommodityActive(true);
    setIsCommodityModalOpen(false);
    toast.success("Commodity account active");
  };

  if (loading) {
    return <Loader message="Loading funds ledger..." />;
  }

  // Financial calculations
  const openingBalance = 100000.0;
  const availableCash = stats.availableBalance;
  const availableMargin = stats.availableBalance;
  
  // Blocked Funds / Delivery Margin (Funds locked for pending buy orders)
  const pendingBuyOrders = allOrders.filter(
    (order) => order.status === "PENDING" && order.mode === "BUY"
  );
  const blockedFunds = pendingBuyOrders.reduce(
    (sum, order) => sum + (order.qty * order.price), 0
  );
  const deliveryMargin = blockedFunds;

  // Used Margin (Active invested capital + Blocked funds)
  const usedMargin = stats.totalInvested + blockedFunds;

  // Realized P&L (Cash balance + Assets invested/blocked - Initial capital - Cumulative deposits)
  const realizedPnL = availableCash + stats.totalInvested + blockedFunds - (openingBalance + stats.totalDeposited);

  // Unrealized P&L
  const unrealizedPnL = stats.overallPnL;

  // Portfolio Value (Total net equity value = Cash + current market value of holdings + blocked funds)
  const portfolioValue = availableCash + blockedFunds + stats.totalCurrentValue;

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h2 style={styles.title}>Funds Ledger</h2>
          <p style={styles.subtitle}>Manage your simulated trading capital and accounts</p>
        </div>
        <div style={styles.headerRight}>
          <button style={{ ...styles.actionBtn, ...styles.depositBtn }} onClick={() => handleActionClick("deposit")}>Add Funds</button>
          <button style={{ ...styles.actionBtn, ...styles.withdrawBtn }} onClick={() => handleActionClick("withdraw")}>Withdraw</button>
        </div>
      </div>

      <div style={styles.grid}>
        {/* Left Column: Equity */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardTitle}>Equity Account</span>
            <span style={styles.activeBadge}>Active</span>
          </div>

          <div style={styles.balanceSummary}>
            <div style={styles.balanceBlock}>
              <h1 style={styles.balanceValue}>${portfolioValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>
              <span style={styles.balanceLabel}>Portfolio Value</span>
            </div>
            <div style={styles.balanceBlock}>
              <h2 style={{ ...styles.balanceValueMinor, color: realizedPnL >= 0 ? "#2e7d32" : "#c62828" }}>
                {realizedPnL >= 0 ? "+" : ""}${realizedPnL.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              <span style={styles.balanceLabel}>Realized P&L</span>
            </div>
          </div>

          <div style={styles.ledgerTable}>
            <div style={styles.ledgerRow}>
              <span>Opening Balance</span>
              <span style={styles.ledgerValBold}>${openingBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div style={styles.ledgerRow}>
              <span>Payin (Deposited)</span>
              <span style={{ color: "#4caf50", fontWeight: "600" }}>
                ${stats.totalDeposited.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div style={styles.ledgerRow}>
              <span>Available Cash</span>
              <span style={styles.ledgerValBold}>${availableCash.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div style={styles.ledgerRow}>
              <span>Available Margin</span>
              <span style={styles.ledgerValBold}>${availableMargin.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div style={styles.ledgerRow}>
              <span>Blocked Funds / Used Margin</span>
              <span>${usedMargin.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div style={styles.ledgerRow}>
              <span>Delivery Margin (Pending)</span>
              <span>${deliveryMargin.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div style={styles.ledgerRow}>
              <span>Unrealized P&L (Positions)</span>
              <span style={{ color: unrealizedPnL >= 0 ? "#2e7d32" : "#c62828", fontWeight: "600" }}>
                {unrealizedPnL >= 0 ? "+" : ""}${unrealizedPnL.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Commodity */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardTitle}>Commodity Account</span>
            <span style={isCommodityActive ? styles.activeBadge : styles.inactiveBadge}>
              {isCommodityActive ? "Active" : "Inactive"}
            </span>
          </div>

          {isCommodityActive ? (
            <>
              <div style={styles.balanceSummary}>
                <div style={styles.balanceBlock}>
                  <h1 style={styles.balanceValue}>$0.00</h1>
                  <span style={styles.balanceLabel}>Portfolio Value</span>
                </div>
                <div style={styles.balanceBlock}>
                  <h2 style={styles.balanceValueMinor}>$0.00</h2>
                  <span style={styles.balanceLabel}>Realized P&L</span>
                </div>
              </div>

              <div style={styles.ledgerTable}>
                <div style={styles.ledgerRow}>
                  <span>Opening Balance</span>
                  <span style={styles.ledgerValBold}>$0.00</span>
                </div>
                <div style={styles.ledgerRow}>
                  <span>Available Cash</span>
                  <span>$0.00</span>
                </div>
                <div style={styles.ledgerRow}>
                  <span>Available Margin</span>
                  <span>$0.00</span>
                </div>
              </div>
            </>
          ) : (
            <div style={styles.inactiveState}>
              <div style={styles.inactiveIcon}>🔒</div>
              <h4 style={styles.inactiveTitle}>Commodity Trading Inactive</h4>
              <p style={styles.inactiveDesc}>Activate your simulated MCX commodity ledger to begin trading Gold, Silver, and Crude Oil futures contracts.</p>
              <button style={styles.activateBtn} onClick={() => setIsCommodityModalOpen(true)}>Activate Account</button>
            </div>
          )}
        </div>
      </div>

      {/* 1. Add / Withdraw Funds Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>{modalAction === "deposit" ? "Add Funds" : "Withdraw Funds"}</h3>
              <button style={styles.modalCloseBtn} onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleFundsSubmit}>
              <div style={styles.modalBody}>
                <p style={styles.modalSubtext}>
                  {modalAction === "deposit" 
                    ? "Inject simulated capital into your Equity wallet to expand your trading capacity." 
                    : "Remove simulated capital from your available margin."}
                </p>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputSymbol}>$</span>
                  <input
                    type="number"
                    style={styles.modalInput}
                    placeholder="Enter amount"
                    value={inputAmount}
                    onChange={(e) => setInputAmount(e.target.value)}
                    required
                  />
                </div>
                <div style={styles.presets}>
                  <button type="button" style={styles.presetBtn} onClick={() => handlePresetClick(1000)}>+$1,000</button>
                  <button type="button" style={styles.presetBtn} onClick={() => handlePresetClick(5000)}>+$5,000</button>
                  <button type="button" style={styles.presetBtn} onClick={() => handlePresetClick(10000)}>+$10,000</button>
                </div>
              </div>
              <div style={styles.modalFooter}>
                <button type="button" style={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" style={{ ...styles.actionBtn, ...styles.depositBtn, marginTop: 0 }}>
                  {modalAction === "deposit" ? "Deposit" : "Withdraw"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Activate Commodity Account Modal */}
      {isCommodityModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Activate Commodity Account</h3>
              <button style={styles.modalCloseBtn} onClick={() => setIsCommodityModalOpen(false)}>&times;</button>
            </div>
            <div style={styles.modalBody}>
              <p style={styles.modalSubtext}>
                Would you like to activate your simulated Commodity MCX ledger? This will instantly link commodity segment derivatives to your dashboard.
              </p>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.cancelBtn} onClick={() => setIsCommodityModalOpen(false)}>Cancel</button>
              <button style={{ ...styles.actionBtn, ...styles.depositBtn, marginTop: 0 }} onClick={handleConfirmCommodity}>Confirm Activation</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    fontFamily: "Inter, -apple-system, sans-serif",
    backgroundColor: "#fcfcfc",
    minHeight: "85vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "35px",
    borderBottom: "1px solid #f0f0f0",
    paddingBottom: "20px",
  },
  headerLeft: {},
  title: {
    fontSize: "1.8rem",
    fontWeight: "600",
    color: "#2c3e50",
    margin: 0,
  },
  subtitle: {
    fontSize: "0.95rem",
    color: "#7f8c8d",
    marginTop: "6px",
    marginBottom: 0,
  },
  headerRight: {
    display: "flex",
    gap: "15px",
  },
  actionBtn: {
    padding: "10px 24px",
    borderRadius: "5px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    border: "none",
    transition: "all 0.15s ease-in-out",
  },
  depositBtn: {
    backgroundColor: "#4caf50",
    color: "#fff",
  },
  withdrawBtn: {
    backgroundColor: "#387ed1",
    color: "#fff",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "30px",
  },
  card: {
    backgroundColor: "#fff",
    border: "1px solid #eef2f5",
    borderRadius: "10px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)",
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    minHeight: "450px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #f6f8fb",
    paddingBottom: "15px",
    marginBottom: "20px",
  },
  cardTitle: {
    fontSize: "1.15rem",
    fontWeight: "600",
    color: "#34495e",
  },
  activeBadge: {
    backgroundColor: "#e2fbe8",
    color: "#28a745",
    fontSize: "0.75rem",
    fontWeight: "bold",
    padding: "4px 10px",
    borderRadius: "12px",
    textTransform: "uppercase",
  },
  inactiveBadge: {
    backgroundColor: "#f8f9fa",
    color: "#6c757d",
    fontSize: "0.75rem",
    fontWeight: "bold",
    padding: "4px 10px",
    borderRadius: "12px",
    textTransform: "uppercase",
  },
  balanceSummary: {
    display: "flex",
    gap: "40px",
    marginBottom: "25px",
    backgroundColor: "#fafbfc",
    padding: "20px",
    borderRadius: "8px",
  },
  balanceBlock: {},
  balanceValue: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#2e7d32",
    margin: 0,
  },
  balanceValueMinor: {
    fontSize: "1.5rem",
    fontWeight: "600",
    margin: 0,
  },
  balanceLabel: {
    fontSize: "0.8rem",
    color: "#8a99a8",
    fontWeight: "500",
    display: "block",
    marginTop: "4px",
  },
  ledgerTable: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  ledgerRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.9rem",
    color: "#5c6b73",
    paddingBottom: "10px",
    borderBottom: "1px solid #f6f8fb",
  },
  ledgerValBold: {
    fontWeight: "600",
    color: "#2c3e50",
  },
  inactiveState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    textAlign: "center",
    padding: "20px",
  },
  inactiveIcon: {
    fontSize: "3rem",
    marginBottom: "15px",
  },
  inactiveTitle: {
    fontSize: "1.1rem",
    color: "#34495e",
    fontWeight: "600",
    margin: "0 0 10px 0",
  },
  inactiveDesc: {
    fontSize: "0.85rem",
    color: "#7f8c8d",
    lineHeight: "1.5",
    maxWidth: "280px",
    margin: "0 0 20px 0",
  },
  activateBtn: {
    backgroundColor: "#387ed1",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "10px 24px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    width: "420px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
    overflow: "hidden",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    borderBottom: "1px solid #f0f2f5",
  },
  modalTitle: {
    fontSize: "1.15rem",
    fontWeight: "600",
    color: "#333",
    margin: 0,
  },
  modalCloseBtn: {
    border: "none",
    background: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#999",
  },
  modalBody: {
    padding: "24px",
  },
  modalSubtext: {
    fontSize: "0.85rem",
    color: "#666",
    lineHeight: "1.5",
    margin: "0 0 20px 0",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
  },
  inputSymbol: {
    position: "absolute",
    left: "15px",
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#444",
  },
  modalInput: {
    width: "100%",
    padding: "12px 15px 12px 40px",
    fontSize: "1.5rem",
    fontWeight: "600",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
  },
  presets: {
    display: "flex",
    gap: "10px",
  },
  presetBtn: {
    flex: 1,
    padding: "6px 0",
    fontSize: "0.8rem",
    fontWeight: "600",
    color: "#387ed1",
    border: "1px solid #e1e7ec",
    borderRadius: "4px",
    backgroundColor: "#fff",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  modalFooter: {
    padding: "15px 24px",
    backgroundColor: "#fafbfc",
    borderTop: "1px solid #f0f2f5",
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
  },
  cancelBtn: {
    backgroundColor: "transparent",
    color: "#666",
    border: "none",
    padding: "10px 20px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
  }
};

export default Funds;
