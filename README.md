# Stock Trading Platform Simulator

A full-stack stock trading simulator inspired by Zerodha Kite. The platform replicates core brokerage functionalities, featuring automated limit order matching engines, portfolio asset migration settlement, live price feed simulations, and transaction audit trails.

<p align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)
![Razorpay](https://img.shields.io/badge/Razorpay-Checkout-002D62?logo=razorpay)
![Chart.js](https://img.shields.io/badge/Chart.js-Data--Viz-FF6384?logo=chartdotjs)
![CSS3](https://img.shields.io/badge/CSS3-Vanilla--CSS-1572B6?logo=css3)

</p>

> [!NOTE]
> On the free Render tier, the backend sleeps after inactivity. When a user opens the application, the backend wakes up, performs an initial market synchronization, registers the cron jobs, and continues updating stock prices every two minutes while the service remains active.

---

## 📌 Project Highlights

* **Simulated Real-Time Prices**: Watchlist items simulate realistic price ticks, rendering visual growth/decline cues.
* **Automated Matching Engine**: Background workers evaluate and fill pending buy/sell transactions against current market prices.
* **Limit Order Validation**: Permits setting target buy/sell price boundaries, queuing unfilled orders in a pending log.
* **Asset & Capital Allocation Lock**: Locks available cash/shares immediately upon placing a pending order to eliminate double-spending risks.
* **Razorpay Sandbox Checkout**: Integrates Razorpay Test Mode to credit simulated trading capital.
* **Daily EOD Settlement Engine**: Migrates daily active Positions into permanent Holdings at `1:31 AM IST` daily.
* **Comprehensive Transaction Ledger**: Automatically writes immutable audit logs of all deposits, withdrawals, buys, and sells.
* **Market Hours Validation**: Restricts order submissions to mock US Market hours (translated to **7:00 PM IST to 1:30 AM IST**), including weekend trading intervals.
* **Dynamic Portfolio Analytics**: Displays asset allocation breakdowns via interactive Chart.js doughnut panels.

---

## 🎯 Why I Built This Project

This project was built to understand the backend architecture, data consistency rules, and scheduler patterns required to operate modern stock trading and brokerage platforms. Replicating the core workflows of Zerodha Kite provided hands-on experience solving engineering problems including:
* Managing volatile, stateful transactional balance ledgers.
* Designing order queues that execute asynchronously when market rates hit target criteria.
* Coordinating nightly EOD asset migrations and settlement balances (migrating short-term Positions into long-term Holdings).
* Simulating external web checkouts using Razorpay to manage deposits.
* Locking assets securely in pending states to ensure system integrity.

---

## ✨ Features

### 1. Core Trading & Matching Engine
* **Order Processing**: Users can submit MARKET or LIMIT orders. Market orders execute immediately at the current price, while Limit orders enter a `"PENDING"` status.
* **Asynchronous Matcher**: Evaluates pending orders against current prices in real-time, executing trades once the target criteria are met.
* **Asset Lock Engine**: Cash (for buy orders) or shares (for sell orders) are immediately locked upon placing a pending order.
* **24-Hour Expiration**: Cancels unfilled limit orders after 24 hours and automatically refunds locked assets.
* **EOD Settlement**: A daily cron job executes at `1:31 AM IST` to settle the day's positions, updating holdings and clearing active positions.

### 2. Wallet & Capital Management
* **Simulated Deposit Gateway**: Uses Razorpay Checkout (Test Mode) to deposit simulated funds, dynamically fetching credentials from the backend.
* **Mock Payment Fallback**: Automatically bypasses Razorpay validation if running with placeholder credentials, enabling seamless local testing.
* **Simulated Withdrawals**: Validates available cash, updates balances, and logs withdrawal records.
* **Structured Capital Ledger**: Tracks financial states including Opening Balance, Available Cash, Used Margin, Blocked Margin, and Realized/Unrealized P&L.

### 3. Portfolio Analytics
* **Asset Allocation Visualization**: Renders holdings percentages dynamically using Chart.js doughnut charts.
* **Performance Metrics**: Calculates overall portfolio values, cumulative investment costs, current market valuations, and percentage returns.

### 4. User Experience & UI Enhancements
* **Dynamic Watchlist**: Offers internal scrolling, active search queries, and real-time positive/negative indicator badges.
* **Unified Loading Skeletons**: Replaces basic loading text indicators with rotating loader spinner components.
* **Zerodha Ecosystem Directory**: A structured grid featuring lift-up cards linking to Console, Coin, and Sentinel.
* **Nested Routing & Segmented Pricing Layout**: Implements React Router v6 nested routing (`/pricing/equity`, `/pricing/currency`, `/pricing/commodity`) under a parent route layout. Renders child components dynamically via `<Outlet />` without re-rendering the common Hero section or the Open Account sidebar.


---

## 🔀 Navigation & Routing Architecture

To support client-side routing practice, the application employs **React Router v6 Nested Routing**:
* **Parent Route Layout**: `/pricing` maps to the main pricing page layouts.
* **Child Brokerage Routes**:
  - `/pricing/` (Index) & `/pricing/equity` — Renders `Equity` charge tables.
  - `/pricing/currency` — Renders `Currency` charge tables.
  - `/pricing/commodity` — Renders `Commodity` charge tables.
* **Layout Preservation**: Common elements (such as the main Hero banner and the Open Account sidebar card) are rendered once in the parent layout, using routing to slide the tabular data dynamically into an `<Outlet />`.
* **Sticky Navigation Header**: The main navbar uses dynamic `NavLink` tags with active-state styling overlays, stuck to the top of the browser viewport.

---

## 🔒 Security Architecture

* **JWT Session Authentication**: Secures sensitive endpoints (orders, holdings, wallet ledger) with JSON Web Tokens passed in the HTTP Authorization header.
* **Bi-directional SSO Logout Synchronization**: Prevents token leakage and synchronizes session termination between the marketing frontend and the console dashboard origins.
* **Back-Button (bfcache) Session Protection**: Uses HTML5 `pageshow` hooks to immediately detect token deletions and block cached DOM screen restoration, redirecting unauthorized users instantly.
* **Axios-Level Request Authorization Interception**: Automatically blocks and aborts outgoing backend requests if local credentials are deleted, redirecting to the login portal with original route memory.
* **Password Hashing**: Protects user credentials in the database using bcrypt hashing.
* **Express-Rate-Limit**: Implements request rate limiters to protect the authentication and trading APIs from DDoS and brute-force attacks.
* **Helmet.js Security Headers**: Sets HTTP headers to safeguard against common web vulnerabilities (XSS, clickjacking, MIME sniffing).
* **CORS Middleware**: Restricts API calls to approved origins.
* **Joi Input Validation**: Validates all trade payloads (symbol, quantity, price, transaction type) at the middleware layer before processing.

---

## 🌐 API Overview

The backend API routes are organized into functional groups:

### Authentication
* `POST /signup` — Register a new account (hashes passwords and sets initial capital).
* `POST /login` — Authenticate credentials and return a session JWT.

### Portfolio & Holdings
* `GET /allHoldings` — Retrieve the user's settled holdings.
* `GET /allPositions` — Fetch the user's active, short-term positions.

### Orders
* `GET /allOrders` — Retrieve the user's order history (SUCCESS, PENDING, CANCELLED).
* `POST /newOrder` — Validate inputs, verify market hours, lock assets, and queue or execute the order.

### Wallet Ledger
* `POST /portfolio/funds` — Process withdrawal requests and record ledger entries.
* `POST /portfolio/funds/order` — Create a Razorpay Order ID (INR/USD converted).
* `POST /portfolio/funds/verify` — Verify the Razorpay payment signature and credit the wallet.

### Transactions
* `GET /portfolio/transactions` — Retrieve the immutable audit trail of all financial actions.

### Market Data
* `GET /allPrices` — Retrieve current prices for all supported symbols.
* `GET /search` — Query symbols in the database.

---

## 🗄 Database Design

The system runs on **MongoDB** using a NoSQL schema layout designed with **Mongoose**.

```
  ┌──────────────┐          ┌──────────────┐          ┌───────────────────┐
  │     User     │◄─────────┤    Orders    │◄─────────┤   Transactions    │
  └──────┬───────┘          └──────────────┘          └───────────────────┘
         │
         ├──────────────────┬──────────────────┐
         ▼                  ▼                  ▼
  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
  │   Holdings   │   │  Positions   │   │  Watchlists  │
  └──────────────┘   └──────────────┘   └──────────────┘
```

### Primary Collections & Schema Relationships:
1. **User (`users`)**: Stores username, email, hashed password, `availableBalance` (current cash), and `totalDeposited` (cumulative deposits).
2. **Orders (`orders`)**: Tracks transactional logs. References `User`. Fields: `name` (symbol), `qty`, `price`, `mode` (BUY/SELL), and `status` (SUCCESS/PENDING/CANCELLED).
3. **Holdings (`holdings`)**: Represents settled long-term investments. References `User`. Fields: `name` (symbol), `qty`, `avg` (average purchase price), and `price` (latest price).
4. **Positions (`positions`)**: Tracks active daily trades. References `User`. Fields: `product` (CNC/MIS), `name` (symbol), `qty`, `avg`, `price`.
5. **Transactions (`transactions`)**: An immutable log recording every wallet change (`DEPOSIT`, `WITHDRAWAL`, `BUY`, `SELL`). References `User`.
6. **Watchlist (`watchlists`)**: Stores user-configured watchlist symbols. References `User`.
7. **StockPrice (`stockprices`)**: Holds the latest synchronized market price for each symbol.
8. **StockMaster (`stockmasters`)**: Contains reference metadata for each stock.
9. **SettlementLog (`settlementlogs`)**: Logs daily position-to-holding migrations.

---

## 🛠 Technical Challenges Solved

### 1. Preventing Asset Over-Commitment (Double Spending)
When placing a limit order, cash (for buy orders) or stock shares (for sell orders) are immediately locked. 
* **The Solution**: A Joi-validated middleware immediately checks if the user has enough available cash or shares. If valid, the assets are deducted from `availableBalance` or `positions` and flagged in the pending order. If the order is cancelled, these assets are automatically returned.

### 2. EOD Position Migration & Settlement Consistency
Moving positions to holdings requires shifting active trades into settled capital.
* **The Solution**: The daily settlement service executes at `1:31 AM IST`. It queries all open positions, updates existing holding records (averaging the buy cost), inserts new holdings if they do not exist, and clears the positions collection in a single execution phase.

### 3. Market-Hours Lock and Countdown
Trading must be restricted to US market hours, but calculated locally in Indian Standard Time (IST).
* **The Solution**: Implemented timezone-locked validation checking in the Express route middleware. The backend converts local time to the `Asia/Kolkata` zone and translates current hours/minutes into minutes-from-midnight, verifying if the request falls within the `19:00` (7:00 PM) to `01:30` (1:30 AM) trading window. If closed, it computes the time remaining until `19:00` and throws a custom error.

---

## 📐 Project Architecture

* **Controllers**: Receive HTTP requests, delegate logic to services, and send JSON responses (e.g. `portfolio.controller.js`).
* **Services**: Handle the core business logic, database queries, and transactions (e.g. `trading.service.js`).
* **Middleware**: Intercept requests to perform actions like JWT token verification, rate limiting, and global error handling.
* **Validators**: Validate request payloads against Joi schemas before hitting controller routes (e.g. `trade.validator.js`).
* **Cron Jobs**: Run scheduled processes using Node-Cron, such as order matching and settlements.
* **Models**: Define the Mongoose schemas and indexes (e.g. `UserModel.js`).

## 📁 Project Structure

```
Stock-Trading-Platform/
│
├── Backend/                    # Express.js Server
│   ├── config/                 # Database connection & Winston configuration
│   ├── controllers/            # Request handlers
│   ├── cron/                   # Node-Cron schedulers (price updates & settlements)
│   ├── middleware/             # Rate limiter & JWT authorization handler
│   ├── model/                  # MongoDB schemas (User, Orders, Transactions)
│   ├── routes/                 # Express route definitions
│   ├── services/               # Core business logic (Trading, Settlement)
│   ├── validators/             # Joi input validation & market hours validation
│   ├── index.js                # Core API entry point
│   └── package.json
│
├── dashboard/                  # Kite Console Panel (React Web App)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Watchlist, Orders, Holdings, Funds Ledger, Loader
│   │   ├── index.js            # Axios interceptor setup & app rendering
│   │   └── index.css           # Styling Sheet
│   └── package.json
│
└── frontend/                   # Marketing & Authentication Pages (React Web App)
    ├── src/
    │   ├── landing_page/       # Home, Signup, Login, Pricing, Products, Support
    │   └── index.js            # Router setup & Axios interceptor
    └── package.json
```

---


## ⚙️ Environment Variables

### Backend (`Backend/.env`)
```env
MONGO_URL=mongodb+srv://...
JWT_SECRET=your_jwt_secret_key
PORT=3002

# Market Configuration
TIMEZONE=Asia/Kolkata
SETTLEMENT_TIME=01:31
PRICE_REFRESH_INTERVAL=*/2 * * * *

# Finnhub API Configuration
FINNHUB_API_KEY=your_finnhub_key

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_yourKeyId
RAZORPAY_KEY_SECRET=yourSecret
```

### Console Dashboard (`dashboard/.env`)
```env
PORT=3001
REACT_APP_API_URL=http://localhost:3002
REACT_APP_FRONTEND_URL=http://localhost:3000
```

### Marketing Frontend (`frontend/.env`)
```env
PORT=3000
REACT_APP_API_URL=http://localhost:3002
REACT_APP_DASHBOARD_URL=http://localhost:3001
```

---

## 💻 Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/mihirgupta665/Stock-Trading-Platform-.git
   cd Stock-Trading-Platform-
   ```

2. **Configure the Backend**
   ```bash
   cd Backend
   npm install
   # Create a .env file based on the environment variables section above
   npm start
   ```

3. **Configure the Console Dashboard**
   ```bash
   cd ../dashboard
   npm install
   # Create a .env file pointing to your backend url
   npm start
   ```

4. **Configure the Marketing Frontend**
   ```bash
   cd ../frontend
   npm install
   # Create a .env file pointing to your backend url
   npm start
   ```

---

## 🚀 Deployment Overview

* **Frontend App**: Deployed on Vercel as a static Single Page Application.
* **Dashboard App**: Deployed on Vercel as a static Single Page Application.
* **Backend Simulator Server**: Deployed on a traditional host (such as Railway or Render) to support continuous background process execution.
* **Database**: Hosted on MongoDB Atlas.

---

## 📈 Project Statistics

* **REST APIs**: 18 active routes.
* **Database Collections**: 9 distinct schemas.
* **Background Schedulers**: 5 automated tasks.
* **Trading Modules**: 4 integrated sub-services.
* **User Interfaces**: 2 distinct React applications.

---

## 🔮 Future Improvements

* **WebSockets Integration**: Implement Socket.io to deliver real-time live stock prices to the watchlist instead of polling.
* **Advanced Charting**: Integrate lightweight trading charts to display historical candlestick patterns.
* **Advanced Order Types**: Add Stop-Loss (SL) and Trailing Stop-Loss triggers.
* **Watchlist Notifications**: Enable SMS or email alerts when a stock hits a target price.
* **Performance Logs**: Track and chart portfolio value history over time.

---

## 🤝 Contributing

Contributions are welcome. Please open an issue or pull request to discuss changes.

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/NewFeature`).
3. Commit your changes (`git commit -m "Add new feature"`).
4. Push to the branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is for educational and learning purposes only.

---

## 👨‍💻 Author

**Mihir Gupta**

If you found this project helpful, consider giving it a ⭐ on GitHub!
