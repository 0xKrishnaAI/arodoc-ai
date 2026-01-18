# Render.com Deployment - Step by Step Guide

## 🎯 Quick Overview
You'll deploy the backend on Render (with free PostgreSQL) and frontend as a static site.

---

## Part 1: Deploy Backend (API + Database)

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (recommended for easy repo access)

### Step 2: Create PostgreSQL Database
1. Click **"New +"** → **"PostgreSQL"**
2. Settings:
   - **Name**: `arodoc-db`
   - **Database**: `arodoc_db`
   - **User**: `arodoc_user`
   - **Region**: Choose closest to you
   - **Plan**: **Free**
3. Click **"Create Database"**
4. Wait ~2 minutes for provisioning
5. **Copy the "Internal Database URL"** (you'll need this)

### Step 3: Deploy Backend Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Settings:
   - **Name**: `arodoc-backend`
   - **Region**: Same as database
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: **Free**

4. **Environment Variables** (click "Advanced" then "Add Environment Variable"):
   ```
   DATABASE_URL = <paste your PostgreSQL Internal URL>
   SECRET_KEY = <generate with: openssl rand -hex 32>
   GEMINI_API_KEY = <your Google AI Studio API key - get from https://aistudio.google.com/app/apikey>
   ALGORITHM = HS256
   ACCESS_TOKEN_EXPIRE_MINUTES = 30
   ```

5. Click **"Create Web Service"**
6. Wait ~5 minutes for deployment
7. **Copy your backend URL** (e.g., `https://arodoc-backend.onrender.com`)

---

## Part 2: Deploy Frontend (Static Site)

### Step 1: Update Frontend API URL
Before deploying, you need to tell the frontend where your backend is:

1. Create `frontend/.env.production`:
   ```
   VITE_API_TARGET=https://arodoc-backend.onrender.com
   ```

2. Update `frontend/vite.config.js` to use production env:
   ```javascript
   export default defineConfig(({ mode }) => {
       const env = loadEnv(mode, process.cwd(), '')
       return {
           plugins: [react()],
           server: {
               host: true,
               proxy: mode === 'development' ? {
                   '/api': {
                       target: env.VITE_API_TARGET || 'http://localhost:8000',
                       changeOrigin: true,
                   }
               } : {}
           }
       }
   })
   ```

### Step 2: Deploy Frontend to Render
1. Click **"New +"** → **"Static Site"**
2. Connect same GitHub repository
3. Settings:
   - **Name**: `arodoc-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Environment Variables**:
   ```
   VITE_API_TARGET = https://arodoc-backend.onrender.com
   ```

5. Click **"Create Static Site"**
6. Wait ~3 minutes
7. **Your app is live!** Visit the URL Render provides

---

## Part 3: Update Backend CORS

After deployment, update CORS to allow your frontend domain:

1. Edit `backend/main.py`, update origins:
   ```python
   origins = [
       "http://localhost:5173",
       "http://localhost:3000",
       "https://arodoc-frontend.onrender.com",  # Add your Render frontend URL
       "https://your-custom-domain.com",        # If you have one
   ]
   ```

2. Commit and push changes
3. Render will auto-redeploy backend

---

## 🎉 Testing Your Deployment

1. Visit your frontend URL: `https://arodoc-frontend.onrender.com`
2. Click **"Sign Up"** and create an account
3. Log in and test features:
   - Upload a medical report
   - Add vitals
   - Try hospital locator
   - Test SOS button

---

## ⚠️ Important Notes

### Free Tier Limitations:
- **Backend spins down after 15 minutes of inactivity** (first request after sleep takes ~30 seconds)
- **Database**: 90 days free, then $7/month
- **Build time**: ~5 minutes per deployment

### Keeping Your App Awake (Optional):
Use a service like [UptimeRobot](https://uptimerobot.com) to ping your backend every 10 minutes.

---

## 🔧 Troubleshooting

**Frontend shows connection error:**
- Check backend URL in frontend environment variables
- Verify CORS settings in `main.py`

**Backend won't start:**
- Check logs in Render dashboard
- Verify `DATABASE_URL` is correct
- Ensure all dependencies in `requirements.txt`

**Database connection error:**
- Make sure you're using the **Internal Database URL** (not External)
- Check if database is in same region as backend

---

## 🚀 Next Steps

Once deployed:
1. Set up a custom domain (optional, Render supports this)
2. Monitor your app in Render dashboard
3. Check logs for any errors
4. Consider upgrading to paid plan for always-on service ($7/month)

**Ready to deploy? Let me know if you need help with any step!**
