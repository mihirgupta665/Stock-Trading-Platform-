<p align="center">
  <img src="./assets/banner.png" alt="Kite Console Hero Banner" width="100%">
</p>

<h1 align="center">📊 KITE CONSOLE</h1>

<p align="center">
  <strong>Premium Full-Stack Stock Trading Simulator & Portfolio Manager</strong>
</p>

<p align="center">
Execute trades • Match limit orders • Track EOD settlements • Analyze portfolio allocations
</p>

<p align="center">

<a href="https://stock-trading-platform-dashboard-six.vercel.app">
<img src="https://img.shields.io/badge/🚀%20Live%20Demo-387ed1?style=for-the-badge">
</a>

&nbsp;

<a href="https://github.com/mihirgupta665/Stock-Trading-Platform-">
<img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github">
</a>

&nbsp;

<a href="https://github.com/mihirgupta665/Stock-Trading-Platform-/releases/download/v1.0.0/Kite_Console_Demo.mp4">
<img src="https://img.shields.io/badge/🎥%20Project%20Demo-Watch%20Now-red?style=for-the-badge">
</a>

</p>

<p align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-Checkout-002D62?logo=razorpay&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?logo=chartdotjs&logoColor=white)

</p>

---

# 🌍 Live Demo

Experience the complete Kite Console trading platform, including real-time order matching, margin calculations, daily settlements, bank transaction logs, interactive graphs, and cross-origin security structures.

### 🚀 Live Applications

- **Marketing Frontend Portal**: [stock-trading-platform-frontend-six.vercel.app](https://stock-trading-platform-frontend-six.vercel.app)
- **Console Dashboard Application**: [stock-trading-platform-dashboard-six.vercel.app](https://stock-trading-platform-dashboard-six.vercel.app)

### 🔑 Demo Account Credentials

| Email Address | Password |
|:---------:|:--------:|
| **demo@zerodha.com** | **password123** |

> **Note:** Use these credentials to sign in and instantly interact with a funded mock portfolio containing pre-seeded transactions and holdings.

---

# 📖 About Kite Console

Kite Console is a production-inspired, full-stack trading simulator that replicates the core brokerage functionalities of modern exchange wrappers. The platform focuses on high-fidelity transactional consistency, secure session lifecycles, and automated EOD accounting pipelines.

The backend acts as a mock clearinghouse, utilizing **Mongoose transactions** to lock assets, matching pending limit orders through background cron schedulers, and migrating daily positions into settled long-term holdings. The frontend contains two distinct React applications (a marketing portal and an admin console dashboard) utilizing localized cross-origin sync methods to manage authorization states.

---

# ⭐ Project Highlights

- 🔐 **Cross-Origin Session Sync**: Bi-directional token synchronization and bfcache back-button navigation protection.
- 💰 **Double-Spending Prevention**: Real-time asset locks for active orders (blocking margin or shares immediately).
- 📈 **Hybrid EOD Settlement**: An automated nightly settlement engine running in Mongoose transactions with an "Active-on-Wake" dynamic fallback logic for cold-starting environments.
- ⚡ **Asynchronous Order Matcher**: Background schedulers evaluating pending limit orders against mock market ticks.
- 💳 **Razorpay Sandbox Integration**: Checkout workflows enabling mock deposits to load simulated capital.
- 📊 **Dynamic Portfolio Analytics**: Asset allocation breakdowns visualized via interactive Chart.js doughnut panels.
- 🛡️ **Rate-Limiting & Security Headers**: Helmet.js configurations and endpoint request throttling.

---

# 📑 Table of Contents

- 📖 About
- ⭐ Project Highlights
- 📸 Project Showcase
- 🎥 Demo GIF
- 🎬 Demo Video
- ✨ Features
- 🛠️ Technology Stack
- 🏗️ System Architecture
- 📁 Project Structure
- 🔌 REST API Directory
- ⚙️ Installation & Setup
- 🔐 Environment Variables
- 🚀 Deployment Overview
- 📈 Engineering Highlights (Deep Dives)
- 🔮 Future Improvements
- 🤝 Contributing
- 📄 License
- 👨💻 Author

---

# 📸 Project Showcase

> Visual layout of the key workflows and trading dashboard views.

---

# 📊 Core Experience

## Dashboard Summary (Summary Panel)

<p align="center">
<img src="./assets/screenshots/01-dashboard.png" width="95%">
</p>

---

## Interactive Watchlist & Prices

<p align="center">
<img src="./assets/screenshots/02-watchlist.png" width="95%">
</p>

---

## Active Positions & Daily Trades

<p align="center">
<img src="./assets/screenshots/03-positions.png" width="95%">
</p>

---

## Permanent Holdings Ledger

<p align="center">
<img src="./assets/screenshots/04-holdings.png" width="95%">
</p>

---

# 💵 Capital & Transactions

## Wallet Capital Management

<p align="center">
<img src="./assets/screenshots/05-funds.png" width="95%">
</p>

---

## Razorpay Checkout Gateway

<p align="center">
<img src="./assets/screenshots/06-deposit.png" width="95%">
</p>

---

# 🔐 Security Gateway

## Console Gateway (SSO Authentication)

<p align="center">
<img src="./assets/screenshots/07-gateway.png" width="95%">
</p>

---

# 📱 Responsive Layout

## Mobile Console Dashboard

<p align="center">
<img src="./assets/screenshots/08-mobile-dashboard.png" width="40%">
</p>

---

# 🎥 Project Demonstration

A walk-through of the trading interface—from placing limit orders to inspecting EOD holding migrations.

<p align="center">
  <img src="./assets/demo.gif" alt="Kite Console Project Demo" width="95%">
</p>

---

# 🎬 Project Walkthrough Video

Watch the walkthrough, covering system architecture, session security syncs, transaction rollbacks, geocoding validation, and portfolio analytics.

<p align="center">
<a href="https://github.com/mihirgupta665/Stock-Trading-Platform-/releases/download/v1.0.0/Kite_Console_Demo.mp4">
  <img src="https://img.shields.io/badge/🎥%20Watch%20Full%20Project%20Demo-181717?style=for-the-badge&logo=github&logoColor=white" alt="Watch Kite Console Walkthrough">
</a>
</p>

---

# ✨ Features

## 👤 User Features
- Browse global assets on the watchlist with real-time positive/negative indicator badges.
- Place MARKET or LIMIT buy and sell orders.
- View nested routing brokerage charges under `/pricing` without full-page re-renders.
- Audit ledger statements containing opening balances, margins, blocked cash, and realized P&L.
- Log bank transaction statements for deposits and withdrawals.
- View asset allocations dynamically graphed on doughnut charts.

## 🔐 Security Features
- JWT Session authentication injected in outgoing Axios headers.
- Bi-directional login/logout cross-origin SSO state sync.
- Browser back-button (bfcache) protection via HTML5 event hooks.
- Joi schema input filters validating payload bounds.
- Request rate limiters and Helmet security header configurations.

---

# 🛠️ Technology Stack

| Category | Technologies |
|----------|--------------|
| **Frontend Apps** | React 18, React Router v6, Axios, Chart.js, Vanilla CSS3 |
| **Backend API** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose |
| **Asynchronous Scheduling** | Node-Cron |
| **Payment Sandbox** | Razorpay Test checkout API |
| **Security & Logging** | JWT, Bcrypt, Helmet, Express-Rate-Limit, Winston Logger |

---

# 🏗️ System Architecture

Kite Console follows a secure, micro-routed architecture:

```text
                  Client Browser (Port 3000 / 3001)
                                │
                      Express.js API (Port 3002)
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
  MongoDB Atlas          Razorpay Checkout        Finnhub Prices
```

### Architecture Highlights
- Isolated marketing origin (port 3000) and dashboard origin (port 3001).
- Unified Express.js API (port 3002).
- Node-Cron schedulers running price synchronization and settlement scripts.

---

# 📁 Project Structure

```text
Stock-Trading-Platform/
│
├── Backend/                    # Express.js Server
│   ├── config/                 # Winston logging & DB configs
│   ├── controllers/            # Controller handlers
│   ├── cron/                   # Schedulers (Matcher, price sync, EOD)
│   ├── middleware/             # JWT auth & security filters
│   ├── model/                  # Mongoose models (Holdings, Orders)
│   ├── routes/                 # Express API routes
│   └── services/               # Core logic (Settlement, Trading)
│
├── dashboard/                  # Console Panel (React Web App)
│   ├── public/                 # Pre-mount loaders
│   └── src/                    # Views & Components
│
└── frontend/                   # Marketing Portal (React Web App)
    └── src/                    # Landing page layouts
```

---

# 🔌 REST API Directory

### Authentication
| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/signup` | Create user profile and pre-fund account |
| POST | `/login` | Verify credentials and return JWT token |

### Portfolio & Trades
| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/allHoldings` | Fetch settled holdings |
| GET | `/allPositions` | Fetch active positions |
| POST | `/newOrder` | Submit trade (Market/Limit) |
| GET | `/allOrders` | Fetch order history |

### Wallet Management
| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/portfolio/funds` | Log withdrawal requests |
| POST | `/portfolio/funds/order` | Initialize Razorpay payment intent |
| POST | `/portfolio/funds/verify` | Verify payment check signature |
| GET | `/portfolio/transactions` | Fetch audit logs |

---

# ⚙️ Installation & Setup

Clone the project
```bash
git clone https://github.com/mihirgupta665/Stock-Trading-Platform-.git
cd Stock-Trading-Platform-
```

### 1. Backend Server Setup
```bash
cd Backend
npm install
# Configure your .env variables (see settings below)
npm start
```

### 2. Dashboard Application Setup
```bash
cd ../dashboard
npm install
# Configure your .env settings
npm start
```

### 3. Marketing Portal Setup
```bash
cd ../frontend
npm install
# Configure your .env settings
npm start
```

---

# 🔐 Environment Variables

Create a `.env` file in the project roots:

### Backend (`Backend/.env`)
```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3002
TIMEZONE=Asia/Kolkata
SETTLEMENT_TIME=01:31
PRICE_REFRESH_INTERVAL=*/2 * * * *
FINNHUB_API_KEY=your_finnhub_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### Dashboard (`dashboard/.env`)
```env
PORT=3001
REACT_APP_API_URL=http://localhost:3002
REACT_APP_FRONTEND_URL=http://localhost:3000
```

---

# 🚀 Deployment Overview

| Origin / Layer | Service Provider |
|----------------|------------------|
| **Marketing Portal** | Vercel (Static Web Hosting) |
| **Console Dashboard** | Vercel (Static Web Hosting) |
| **API Engine** | Render / Railway (Dynamic Server Host) |
| **Database Cache** | MongoDB Atlas (Cloud Cluster) |

---

# 📈 Engineering Highlights (Deep Dives)

### 1. Preventing Double Spending via Capital Locks
When placing limit buy orders, funds are immediately locked to prevent over-purchasing. When selling, target asset quantities are deducted immediately.
- **Deduction & Hold**: Trade submissions verify available liquid cash or shares. If verified, funds or shares are deducted and stored in `"BLOCKED"` status on the pending order, maintaining ledger consistency.
- **Rollback Safeties**: If an order is canceled or expires, a transactional rollback runs, releasing the blocked assets back to the user's active wallet balance.

### 2. Hybrid Nightly EOD Settlement Logic
Positions represent active intraday exposure, while holdings are settled multi-day assets.
- **Atomic Transactions**: A daily cron job executes at `1:31 AM IST`. It aggregates active user positions and migrates them into holdings (calculating weighted average purchase costs) in a single transaction.
- **Eventual Consistency Fallback Handler**: Free-tier cloud instances sleep after inactivity, missing cron schedules. To ensure consistency, a fallback checks cutoff times on dashboard loads. If positions are older than 24 hours, the settlement executes dynamically before resolving statistics.

### 3. SSO and Browser bfcache Session Shielding
To prevent unauthorized navigation when accessing the console:
- **SSO Sync**: The dashboard and marketing portal coordinate tokens. If the token is cleared in one tab, the other origin detects the change and logs the user out.
- **bfcache Protection**: Browsers restore DOM states without hitting the network on backward clicks. An HTML5 `pageshow` listener detects cache retrievals, checks active tokens, and redirects immediately on session deletion.

---

# 🔮 Future Improvements
- **WebSockets Engine**: Deliver real-time stock tickers to the watchlist via socket streams.
- **Candlestick Charts**: Integrate interactive financial charts to display historical trade ranges.
- **Trailing Stop Loss**: Add advanced order triggers (`SL` and `SL-M` models).

---

# 🤝 Contributing

Contributions are welcome! Please fork the repository, make changes in a feature branch, and open a Pull Request.

---

# 📄 License

This project is made only for exploring and learning purpose.

---

# 👨💻 Author

## Mihir Gupta

B.Tech Computer Science Engineering (AI & ML)

Passionate developer focused on building scalable, transactional applications and low-latency APIs.

- **GitHub**: [github.com/mihirgupta665](https://github.com/mihirgupta665)
- **LinkedIn**: [linkedin.com/in/YOUR-LINKEDIN](https://linkedin.com/in/YOUR-LINKEDIN)
- **Portfolio**: [YOUR-PORTFOLIO.com](https://YOUR-PORTFOLIO.com)

---

<p align="center">
  <strong>Thank you for visiting Kite Console! Happy Trading ❤️</strong>
</p>
