# 🚀 Deployment Guide: Stock Trading Platform

This step-by-step guide walks you through deploying your backend simulator server on a traditional cloud host (**Render.com**) and both React frontends on **Vercel**.

---

## 🔍 Will the Cron Jobs run automatically when deployed on Render?

**YES!** 
Because Render Free Web Services are traditional, long-running Node.js processes:
* The backend runs continuously in the cloud.
* The built-in `node-cron` schedulers (US market check, limit order match, 24h cancellation, 1:31 AM IST settlement) run natively inside your server instance.
* You can **safely close your local computer and shut down localhost**; the background processes will continue executing automatically on the cloud database.

> [!NOTE]
> Render Free Web Services go to sleep (spin down) if they do not receive any HTTP requests for 15 minutes. 
> To prevent your server from sleeping and keep your background crons running continuously, you can use a free uptime monitoring service (such as [UptimeRobot](https://uptimerobot.com/)) to ping your backend URL (e.g. `https://your-backend.onrender.com/allPrices`) every 10 minutes.

---

## 📋 Pre-Deployment Checklist

Before pushing to production, make sure:
1. Your MongoDB Atlas cluster allows incoming connections from your hosting servers:
   * Go to **MongoDB Atlas** -> **Network Access**.
   * Click **Add IP Address** -> select **Allow Access From Anywhere** (`0.0.0.0/0`) -> Click **Confirm**. (Cloud hosting providers change server IPs dynamically, so this is required).
2. Your GitHub repository has the latest version of the code (`git push` completed).

---

## 🛠 Step 1: Deploying the Backend on Render

1. Go to [Render.com](https://render.com/) and log in with GitHub.
2. Click **New** -> **Web Service**.
3. Select your `Stock-Trading-Platform-` repository.
4. Configure the Web Service settings:
   * **Name**: `stock-trading-backend`
   * **Region**: Choose the closest region (e.g., Singapore or US East).
   * **Root Directory**: `Backend`
   * **Runtime**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
5. Under **Environment Variables**, add the required backend keys:
   * `MONGO_URL` = *Your MongoDB Atlas connection URI*
   * `JWT_SECRET` = *Your JWT secret token*
   * `FINNHUB_API_KEY` = *Your Finnhub API Key*
   * `RAZORPAY_KEY_ID` = *Your Razorpay Key ID*
   * `RAZORPAY_KEY_SECRET` = *Your Razorpay Key Secret*
   * `PORT` = `3002`
6. Click **Deploy Web Service**. Render will spin up the server and give you a public URL (e.g. `https://stock-trading-backend.onrender.com`). **Copy this URL**.

---

## 💻 Step 2: Deploying the Marketing Frontend on Vercel

1. Go to the [Vercel Dashboard](https://vercel.com/) and click **Add New** -> **Project**.
2. Select your `Stock-Trading-Platform-` repository.
3. Configure the project:
   * **Project Name**: `kite-marketing-frontend`
   * **Framework Preset**: `Create React App`
   * **Root Directory**: Click **Edit** and select **`frontend`**.
4. Expand **Environment Variables** and add:
   * **Key**: `REACT_APP_API_URL`
   * **Value**: *Your Deployed Backend Render URL* (e.g. `https://stock-trading-backend.onrender.com`)
5. Click **Deploy**. Vercel will build your static files and deploy them.

---

## 📊 Step 3: Deploying the Console Dashboard on Vercel

1. Go to the [Vercel Dashboard](https://vercel.com/) and click **Add New** -> **Project**.
2. Select your `Stock-Trading-Platform-` repository.
3. Configure the project:
   * **Project Name**: `kite-console-dashboard`
   * **Framework Preset**: `Create React App`
   * **Root Directory**: Click **Edit** and select **`dashboard`**.
4. Expand **Environment Variables** and add:
   * **Key**: `REACT_APP_API_URL`
   * **Value**: *Your Deployed Backend Render URL* (e.g. `https://stock-trading-backend.onrender.com`)
5. Click **Deploy**. Vercel will build your client console dashboard and deploy it.
