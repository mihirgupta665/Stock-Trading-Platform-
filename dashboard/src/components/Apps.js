import React, { useState } from "react";

const styles = {
  container: {
    padding: "30px",
    fontFamily: "Inter, sans-serif",
  },
  header: {
    marginBottom: "30px",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "600",
    color: "#444",
    margin: 0,
  },
  subtitle: {
    color: "#666",
    fontSize: "0.95rem",
    marginTop: "8px",
    lineHeight: "1.5",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "25px",
    marginTop: "20px",
  },
  card: {
    backgroundColor: "#fff",
    border: "1px solid #eee",
    borderRadius: "8px",
    padding: "24px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.02)",
    transition: "all 0.2s ease-in-out",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "240px",
  },
  cardHover: {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
    borderColor: "#ddd",
  },
  appHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
  },
  appIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "1.2rem",
    marginRight: "15px",
  },
  appName: {
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#333",
  },
  appDesc: {
    color: "#777",
    fontSize: "0.85rem",
    lineHeight: "1.4",
    margin: 0,
  },
  btn: {
    alignSelf: "flex-start",
    backgroundColor: "#387ed1",
    color: "#fff",
    textDecoration: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    fontSize: "0.85rem",
    fontWeight: "bold",
    transition: "background-color 0.2s",
    marginTop: "15px",
  }
};

const appsList = [
  {
    name: "Kite",
    desc: "Our flagship trading platform with lightning-fast charting, elegant interface, and advanced order types.",
    iconText: "K",
    color: "#df5b2b",
    link: "https://kite.zerodha.com"
  },
  {
    name: "Console",
    desc: "The backoffice dashboard for your account. Analyze your trades, check reports, and track corporate actions.",
    iconText: "C",
    color: "#387ed1",
    link: "https://console.zerodha.com"
  },
  {
    name: "Coin",
    desc: "Buy direct mutual funds online directly from asset management companies with zero brokerage commission.",
    iconText: "Co",
    color: "#43a047",
    link: "https://coin.zerodha.com"
  },
  {
    name: "Streak",
    desc: "Create, backtest, and deploy algo trading strategies without coding. Code-free trading strategies system.",
    iconText: "S",
    color: "#7e57c2",
    link: "https://streak.tech"
  },
  {
    name: "Sensibull",
    desc: "India's largest options trading platform. Analyze strategy builders, options chains, and track open interest.",
    iconText: "Se",
    color: "#e91e63",
    link: "https://sensibull.com"
  },
  {
    name: "GoldenPi",
    desc: "Invest in bonds and corporate debentures online. Safe fixed-income investment yields with direct payouts.",
    iconText: "G",
    color: "#ff9800",
    link: "https://goldenpi.com"
  }
];

const AppCard = ({ app }) => {
  const [hover, setHover] = useState(false);

  const cardStyle = {
    ...styles.card,
    ...(hover ? styles.cardHover : {})
  };

  return (
    <div 
      style={cardStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div>
        <div style={styles.appHeader}>
          <div style={{ ...styles.appIcon, backgroundColor: app.color }}>
            {app.iconText}
          </div>
          <span style={styles.appName}>{app.name}</span>
        </div>
        <p style={styles.appDesc}>{app.desc}</p>
      </div>
      <a 
        href={app.link} 
        target="_blank" 
        rel="noopener noreferrer" 
        style={styles.btn}
      >
        Open App
      </a>
    </div>
  );
};

const Apps = () => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Zerodha ecosystem</h2>
        <p style={styles.subtitle}>
          Build strategies, analyze data, and invest online with our curated in-house and partner platforms.
        </p>
      </div>
      <div style={styles.grid}>
        {appsList.map((app, index) => (
          <AppCard key={index} app={app} />
        ))}
      </div>
    </div>
  );
};

export default Apps;
