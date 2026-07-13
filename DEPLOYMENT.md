# 🚀 Deployment Guide: Stock Trading Platform (100% Vercel)

This step-by-step guide walks you through deploying your entire platform—**Backend**, **Frontend**, and **Dashboard**—all on **Vercel**!

---

## 🔍 Will the Cron Jobs run automatically when deployed on Vercel?

**YES!** 
Because Vercel is a serverless platform, traditional background processes like `node-cron` shut down when there are no active requests. To solve this, your project uses **Vercel's Native Cron Scheduler**:
* We have configured a `"crons"` array in the [vercel.json](file:///c:/Users/mihir/Desktop/Stock%20Trading%20Platform/Backend/vercel.json) file.
* Vercel will automatically ping your backend's API cron endpoints on a set schedule (`/api/cron/sync` every 2 mins, `/api/cron/settle` daily, etc.).
* These cron ticks execute in the cloud completely automatically. **You can safely turn off your local computer and close localhost**; Vercel's cloud triggers will update your MongoDB database 24/7.

---

## 📋 Pre-Deployment Checklist

Before pushing to production, make sure:
1. Your MongoDB Atlas cluster allows incoming connections from Vercel's servers:
   * Go to **MongoDB Atlas** -> **Network Access**.
   * Click **Add IP Address** -> select **Allow Access From Anywhere** (`0.0.0.0/0`) -> Click **Confirm**. (Since Vercel uses dynamic serverless IP ranges, this is required).
2. Your GitHub repository has the latest code pushed (`git push` completed).

---

## 🛠 Step 1: Deploying the Backend on Vercel

1. Go to the [Vercel Dashboard](https://vercel.com/) and click **Add New** -> **Project**.
2. Select your `Stock-Trading-Platform-` repository.
3. Configure the project:
   * **Project Name**: `stock-trading-backend`
   * **Framework Preset**: `Other` (Vercel will auto-detect Node.js)
   * **Root Directory**: Click **Edit** and select **`Backend`**.
4. Expand **Environment Variables** and add all the keys from your `Backend/.env` file:
   * `MONGO_URL` = *Your MongoDB Atlas connection URI*
   * `JWT_SECRET` = *Your JWT secret token*
   * `FINNHUB_API_KEY` = *Your Finnhub API Key*
   * `RAZORPAY_KEY_ID` = *Your Razorpay Key ID*
   * `RAZORPAY_KEY_SECRET` = *Your Razorpay Key Secret*
   * `PORT` = `3002`
5. Click **Deploy**. Vercel will compile your Express backend into serverless functions and register the cron routes.
6. Once deployed, copy your backend's Vercel URL (e.g. `https://stock-trading-backend.vercel.app`).

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
   * **Value**: *Your Deployed Backend Vercel URL* (e.g. `https://stock-trading-backend.vercel.app`)
5. Click **Deploy**. Vercel will compile your static React app.

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
   * **Value**: *Your Deployed Backend Vercel URL* (e.g. `https://stock-trading-backend.vercel.app`)
5. Click **Deploy**. Vercel will compile your console dashboard.
