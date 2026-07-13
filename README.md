# 📈 Kite Stock Trading Platform Clone

A premium, full-stack, simulated stock trading platform modeling the Zerodha Kite ecosystem. The application integrates real-time mock price ticking, automated limit order matching engines, secure Razorpay checkout gateway simulation, a comprehensive cash/margin balance ledger, and an interactive products directory.

<p align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)
![Razorpay](https://img.shields.io/badge/Razorpay-Checkout-002D62?logo=razorpay)
![Chart.js](https://img.shields.io/badge/Chart.js-Data--Viz-FF6384?logo=chartdotjs)
![CSS3](https://img.shields.io/badge/CSS3-Vanilla--CSS-1572B6?logo=css3)

</p>

---

# 🌐 Live Demo

Experience the simulated stock trading workspace live—from real-time watchlist analytics to payment checkouts and position-to-holding migrations.

<p align="center">
  <a href="https://github.com/mihirgupta665/Stock-Trading-Platform-" target="_blank">
    <img src="https://img.shields.io/badge/🚀%20Launch%20Kite%20Clone-Live%20Application-2563EB?style=for-the-badge" alt="Launch Live Platform">
  </a>
</p>

<p align="center">
  <strong>🔗 Repository URL</strong><br>
  👉 <a href="https://github.com/mihirgupta665/Stock-Trading-Platform-">
    https://github.com/mihirgupta665/Stock-Trading-Platform-
  </a>
</p>

> **💳 Razorpay Test Mode:** Wallet deposit checks are processed using **Razorpay Test Mode**. Use Razorpay's domestic test card number `4100 2800 0000 1007` to simulate successful credits.

---

# ✨ Features

## 👤 Trading Console Features

- **Real-Time Watchlist**: View live price fluctuations of target equities, with green/red indicator spikes indicating price movements.
- **Unified Dollar Currency ($)**: Clean, globalized currency metrics displaying portfolio valuations, orders, and ledger transactions in USD.
- **Dynamic Limit Orders**: Places trades in a `"PENDING"` status if target buy/sell criteria are not immediately satisfied by market rates.
- **Locked Assets & Margin Validation**: Holds buy funds or sell shares immediately in pending states to prevent double-spending, automatically releasing assets upon cancellation.
- **US Market Hours Lock**: Blocks orders placed outside US trading hours (translated to Indian Standard Time: **7:00 PM IST to 1:30 AM IST**, daily including weekends), showing an active countdown to the next opening.
- **Interactive Data Visualization**: Renders holdings allocation metrics via Chart.js Doughnut structures with optimized legends and flexbox constraints.
- **Product Ecosystem Directory**: Discovers secondary Kite products (Console, Coin, Sentinel) in a grid layout with lift-up card transitions.
- **Sleek Loading Skeletons**: Modern loading spinner rings that replace static text placeholders during async database fetches.

---

## 🛠 Financial & Engine Features

- **Audit Ledger Logs**: A dedicated database transactions collection recording every deposit, withdrawal, purchase, and sale for audit trails.
- **Automatic Matching Engine**: Background price chronometer triggering updates every 2 minutes to evaluate, execute, or cancel limit orders.
- **24-Hour Expiration Engine**: Automatically cancels unfilled pending limit orders after 24 hours, returning locked wallet margin or positions.
- **Daily Positions Settlement**: Merges daily open trading Positions into permanent investment Holdings at **1:31 AM IST** every day.
- **Razorpay Sandbox Integration**: Seamlessly switches between full Razorpay Checkout test mode and mock loaders based on environment configs.

---

# 🚀 Tech Stack

## Frontend (Marketing Landing Page & Console Dashboard)

- React 18
- React Router DOM
- Axios
- Chart.js
- React Toastify
- Material-UI Icons
- CSS3 (Vanilla stylesheet system)

---

## Backend (REST API & Automation Engines)

- Node.js
- Express.js
- MongoDB Atlas (Mongoose Object Modeling)
- Node-Cron (Background tasks engine)
- Helmet & Express-Rate-Limit (Security & DDoS prevention)
- Winston Logger (Detailed server event logs)
- Finnhub API (Real-time financial quote synchronization)

---

# Project Architecture

```
                      React Console Client
                               │
                               │
                       REST API Requests
                               │
                               ▼
                        Express Backend
                               │
      ┌────────────┬───────────┴───┬─────────────┐
      │            │               │             │
      ▼            ▼               ▼             ▼
 MongoDB Atlas  Node-Cron     Finnhub API    Razorpay
                 │                          (Checkout)
                 ├─► Order Matcher
                 ├─► 24h Expiry
                 └─► Daily Settlement (1:31 AM IST)
```

---

# 📁 Project Structure

```
Stock-Trading-Platform/
│
├── Backend/                    # Express.js Server
│   ├── config/                 # Winston and Database Connectors
│   ├── controllers/            # Portfolio and Auth Handlers
│   ├── cron/                   # Daily Settlement and Matching Engines
│   ├── middleware/             # Rate Limiting and JWT Verifiers
│   ├── model/                  # MongoDB Schemas (Users, Orders, Transactions)
│   ├── routes/                 # Express API Endpoint Mappings
│   ├── services/               # Trading Logic and Settlement Executors
│   ├── validators/             # US Market Hours and Trade Payload Joi Schemes
│   ├── index.js                # Core App Entry
│   └── package.json
│
├── dashboard/                  # Kite Console Panel (React SPA)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Watchlist, Funds Ledger, Holdings, Loader
│   │   ├── index.js            # Axios Interceptors and App Bootstrap
│   │   └── index.css           # Styling Sheet
│   └── package.json
│
├── frontend/                   # Marketing & Signup Pages (React SPA)
│   ├── src/
│   │   ├── landing_page/       # Home, Products, Pricing, SignUp/Login
│   │   └── index.js            # Axios Interceptors and Routes
│   └── package.json
│
└── README.md
```

---

# ⚙️ Key Functionalities

### Market Hours Checking Algorithm
Checks the timezone-offset dynamically using `Intl.DateTimeFormat` relative to `Asia/Kolkata`:
```javascript
// Open: 7:00 PM IST (1140 minutes) | Close: 1:30 AM IST (90 minutes next day)
const isOpen = currentMins >= 1140 || currentMins < 90;
```
If closed, calculates the remaining hours and minutes until `19:00` and returns:
`"Exchange opens after Xh Ym"`

### 24h Expiration & Matching Cycle
Runs every 2 minutes:
1. Compares current stock rates against pending BUY (`price <= current`) and SELL (`price >= current`) orders.
2. If time since order creation exceeds 24 hours, cancels the order, flags it as `"CANCELLED"`, and refunds the locked cash/shares.

---

# 🔐 Environment Variables

## Backend (.env)

```env
MONGO_URL=YOUR_MONGODB_ATLAS_URI
JWT_SECRET=YOUR_JWT_ENCRYPTION_SECRET_KEY
PORT=3002

# Market Configuration
TIMEZONE=Asia/Kolkata
SETTLEMENT_TIME=01:31
PRICE_REFRESH_INTERVAL=*/2 * * * *

# Finnhub API Configuration
FINNHUB_API_KEY=YOUR_FINNHUB_API_KEY

# Razorpay Configuration (Test Mode)
RAZORPAY_KEY_ID=rzp_test_yourKeyId
RAZORPAY_KEY_SECRET=yourKeySecret
```

---

## Client (dashboard & frontend) (.env)

```env
REACT_APP_API_URL=http://localhost:3002
```

---

# 💻 Installation

Clone the repository:

```bash
git clone https://github.com/mihirgupta665/Stock-Trading-Platform-.git
cd Stock-Trading-Platform-
```

### 1. Install Backend Dependencies
```bash
cd Backend
npm install
```

### 2. Install Dashboard Console Dependencies
```bash
cd ../dashboard
npm install
```

### 3. Install Marketing Frontend Dependencies
```bash
cd ../frontend
npm install
```

---

# ▶ Running the Project

### Start Backend Server
```bash
cd Backend
npm start
```
*Port runs by default on `http://localhost:3002`.*

### Start Console Dashboard
```bash
cd dashboard
npm start
```
*App opens on `http://localhost:3001`.*

### Start Marketing Frontend
```bash
cd frontend
npm start
```
*App opens on `http://localhost:3000`.*

---

# 🤝 Contributing

Contributions are welcome. Please open a pull request or issue to discuss potential improvements.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/NewFeature`).
3. Commit changes (`git commit -m "Add new feature"`).
4. Push to branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

---

# 👨‍💻 Author

**Mihir Gupta**

If you found this project helpful, consider giving it a ⭐ on GitHub!
