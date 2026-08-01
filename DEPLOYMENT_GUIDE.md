# 🚀 Deployment Guide: Vercel (Frontend) & Render (Backend)

This guide provides step-by-step instructions to deploy the **Car Castle Goa** application:
- **Frontend (React)**: Deployed on **Vercel**
- **Backend (FastAPI & MongoDB)**: Deployed on **Render**

---

## Part 1: Deploy Backend on Render

### Step 1: Create a Render Web Service
1. Log in to **[Render.com](https://render.com/)**.
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository: `https://github.com/Jeeerryyy/Car-Castle---Finance-Tracker-`.

### Step 2: Configure Render Service Settings
Fill in the following fields in Render:

| Setting Field | Recommended Value |
| :--- | :--- |
| **Name** | `car-castle-backend` |
| **Region** | Singapore / Nearest to India |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `python -m uvicorn server:app --host 0.0.0.0 --port $PORT` |

### Step 3: Add Backend Environment Variables on Render
Scroll down to **Environment Variables** and add:

| Key | Value | Description |
| :--- | :--- | :--- |
| `MONGO_URL` | `mongodb+srv://<user>:<password>@cluster.mongodb.net/car_castle_goa?retryWrites=true&w=majority` | MongoDB Atlas Connection String |
| `DB_NAME` | `car_castle_goa` | Database Name |
| `JWT_SECRET` | `supersecretkey_change_me_in_production` | JWT Secret Key for Session Auth |
| `CORS_ORIGINS` | `https://car-castle.vercel.app,http://localhost:3000` | Allowed Frontend URLs |

4. Click **Create Web Service**. Render will deploy your FastAPI backend.
5. Copy your Render Backend URL (e.g. `https://car-castle-backend.onrender.com`).

---

## Part 2: Deploy Frontend on Vercel

### Step 1: Import Project into Vercel
1. Log in to **[Vercel.com](https://vercel.com/)**.
2. Click **Add New...** -> **Project**.
3. Select your repository: `Jeeerryyy/Car-Castle---Finance-Tracker-`.

### Step 2: Configure Vercel Project Settings
In the Project Configuration panel:

1. **Framework Preset**: `Create React App`
2. **Root Directory**: Click **Edit** and set to `frontend`
3. Expand **Build and Output Settings**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install --legacy-peer-deps`

### Step 3: Add Frontend Environment Variables on Vercel
Expand **Environment Variables** and add:

| Key | Value | Description |
| :--- | :--- | :--- |
| `REACT_APP_BACKEND_URL` | `https://car-castle-backend.onrender.com` | Your Render Backend URL (from Part 1) |

4. Click **Deploy**. Vercel will build and publish your React frontend!

---

## Part 3: Verify Deployment

1. Open your Vercel App URL (e.g. `https://car-castle.vercel.app`).
2. Log in with the pre-seeded admin credentials:
   - **Email**: `admin@carcastlegoa.com`
   - **Password**: `admin123`
3. Verify that Dashboard metrics, Bookings, Car Drivers, and Ledger screens fetch data smoothly from your Render backend!
