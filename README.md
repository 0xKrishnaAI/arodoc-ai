# Arodoc AI - Advanced Healthcare Companion

![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)
![React](https://img.shields.io/badge/React-18-61dafb.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

Arodoc AI is a production-ready healthcare application designed to empower users, especially seniors, with AI-driven health insights, vitals tracking, and emergency coordination. Built with a modern tech stack ensuring scalability, security, and a premium user experience.

## 🌐 Live Demo

**Frontend**: https://arodoc-frontend.onrender.com  
**Backend API**: https://arodoc-backend.onrender.com/docs

## 🚀 Features

-   **AI Health Analysis**: Upload PDF/Image medical reports. The system analyzes the content, extracts biomarkers, assesses risk levels (Green/Yellow/RED), and provides a summary.
-   **Health Dashboard**: Centralized view of health status classified into Good (GREEN), Attention (YELLOW), or Critical (RED) based on recent data.
-   **Vitals Tracking**: Progressive, low-friction entry for Heart Rate, Blood Pressure, Blood Sugar, Temperature, and Weight.
-   **Smart Health Insights**: Personalized diet, activity, and specialist recommendations based on your unique health trends.
-   **Hospital Locator**: Find and contact nearby medical facilities and specialists directly from your insights.
-   **Emergency SOS**: One-tap emergency trigger that notifies contacts or provides immediate guidance.
-   **Elderly-Friendly UI**: High-legibility design with 18px base fonts and large, touch-friendly interactive targets.
-   **Privacy & Control**: Secure encryption for all data and full control with one-click report deletion (including server-side cleanup).

## ✅ Verification Scripts

We have included scripts to verify the core functionality:

1.  **AI Analysis**: `python backend/verify_ai.py` (Uploads a test image and validates AI response)
2.  **Authentication**: `python backend/verify_auth.py` (Tests Signup -> Login -> Protected Route)

## 🛠️ Tech Stack

### Frontend
-   **Framework**: React 18 + Vite
-   **Styling**: Tailwind CSS + Framer Motion (Animations)
-   **Icons**: Lucide React
-   **Networking**: Axios

### Backend
-   **Framework**: FastAPI (Python)
-   **Database**: PostgreSQL / SQLite (Local)
-   **ORM**: SQLAlchemy
-   **Authentication**: OAuth2 with JWT (Passlib + Python-Jose)
-   **AI Integration**: Google Gemini API

## 🏃‍♂️ Getting Started

### Prerequisites
-   Node.js 18+
-   Python 3.10+
-   Gemini API Key

### Quick Start (Local Development)

#### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
# Set your GEMINI_API_KEY in backend/config.py or environment
python -m uvicorn main:app --reload
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

-   **Frontend**: [http://localhost:5173](http://localhost:5173)
-   **Backend Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

## 📂 Project Structure

```
VIBE APP/
├── backend/            # FastAPI Application
│   ├── routers/        # API Endpoints (auth, analysis, health, emergency)
│   ├── models.py       # Database Models
│   └── main.py         # Entry Point
├── frontend/           # React Application
│   ├── src/
│   │   ├── components/ # Reusable UI Components (VitalsForm, Disclaimer, etc.)
│   │   ├── pages/      # Full Page Views (Dashboard, Insights, Locator, etc.)
│   │   └── App.jsx     # Routing & Layout
│   └── vite.config.js  # Vite Configuration
└── docker-compose.yml  # Container Orchestration
```

## 🔒 Security & Privacy

-   **JWT Tokens**: Securely stored and used for API authentication.
-   **Data cleanup**: Deleting a report removes it from both the DB and the physical storage.
-   **Medical Disclaimer**: Integrated disclaimers on all AI-generated content to ensure responsible use.

## 📄 License
MIT

