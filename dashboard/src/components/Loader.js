import React from "react";

const Loader = ({ message = "Loading details..." }) => {
  return (
    <div style={styles.container}>
      <div className="custom-loader-spinner" style={styles.spinner}></div>
      <p style={styles.text}>{message}</p>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    width: "100%",
    boxSizing: "border-box"
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid #f3f3f3",
    borderTop: "3px solid #387ed1",
    borderRadius: "50%",
  },
  text: {
    marginTop: "15px",
    color: "#6c757d",
    fontSize: "0.85rem",
    fontWeight: "500",
    marginBottom: 0,
  }
};

export default Loader;
