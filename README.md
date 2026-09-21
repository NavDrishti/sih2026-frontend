# Nav Drishti (नव दृष्टि) 🛡️⚡
### AI-Powered Industrial Safety Observation & SIF Precursor Intelligence Platform

[![Deploy to GitHub Pages](https://github.com/NavDrishti/sih2026-frontend/actions/workflows/deploy.yml/badge.svg)](https://github.com/NavDrishti/sih2026-frontend/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-brightgreen)](https://navdrishti.github.io/sih2026-frontend/)
[![Version](https://img.shields.io/badge/version-2.5--PROD-blue.svg)](https://github.com/NavDrishti/sih2026-frontend)

**Nav Drishti** is an advanced AI-driven industrial safety platform engineered for complex facilities (refineries, petrochemical complexes, and high-hazard plants). It captures safety observations, detects **Serious Injury & Fatality (SIF)** precursors before incidents occur, maps operational risks against **IOGP Life-Saving Rules**, and provides actionable barrier health analytics in real time.

---

## 🌟 Key Capabilities

- **SIF Precursor Prediction**: Real-time scoring of observations to identify high-potential precursors and degradation of critical safety barriers.
- **10-Parameter Refinery Dataset**: Complete classification of refinery units, equipment, line-breaking activities, process hazards, energy sources, pressure/temp conditions, barrier health, and consequences.
- **Role-Based Workflows**:
  - **Field Worker View**: Streamlined rapid logging, personal observation feed, and real-time chat with AI safety co-pilot.
  - **Safety Inspector & Management View**: Facility-wide analytics, heatmaps, approval workflows, and corrective barrier management.
- **Interactive AI Clarification & Messaging**: AI automatically detects missing critical parameters in worker narratives and prompts for clarification directly in the thread.
- **Dual Architecture (Online Backend + Offline Static Mode)**:
  - **Real SQLite Backend**: High-performance local Node.js Express server (`DatabaseSync` SQLite) for full persistence.
  - **Zero-Config GitHub Pages Support**: Automatic localStorage fallback so the live web demo runs seamlessly in the browser.
- **8 × 8 Unit Risk Matrix & Heatmaps**: Granular operational risk tracking across complex plant processing units and ongoing activities (hot work, line breaking, confined space, etc.).
- **Multimodal Support**: Runs across **Web (React + Vite)**, **Desktop (Electron)**, and **Mobile (Capacitor Android)**.

---

## 🚀 Live Demo
Access the live deployment on GitHub Pages:  
👉 **[https://navdrishti.github.io/sih2026-frontend/](https://navdrishti.github.io/sih2026-frontend/)**

---

## 💻 Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS, Lucide Icons, Recharts
- **Backend API**: Node.js, Express, CORS, SQLite 3 (`node:sqlite` DatabaseSync)
- **Desktop**: Electron 44
- **Mobile**: Capacitor 8 Android
- **Build / Tooling**: Vite 6, PostCSS, TypeScript
- **CI/CD**: GitHub Actions auto-deployment to GitHub Pages

---

## 🛠️ Quickstart Guide

### Prerequisites
- Node.js (v20 or v22 recommended)
- npm or yarn

### 1-Click Launch (Windows Laptop)
Simply double-click:
```cmd
START_ON_LAPTOP.bat
```
This automatically launches:
1. The **SQLite Backend API Server** on `http://localhost:5001`
2. The **Vite Frontend Server** on `http://localhost:3000`
3. Opens your default browser to `http://localhost:3000`

---

### Manual Setup & Commands

```bash
# 1. Clone the repository
git clone https://github.com/NavDrishti/sih2026-frontend.git

# 2. Enter directory
cd sih2026-frontend

# 3. Install dependencies
npm install

# 4. Start the SQLite Backend Server (Port 5001)
npm run server

# 5. In a separate terminal, start the Frontend (Port 3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 Backend API Endpoints

The backend server runs on `http://localhost:5001/api`:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend status & SQLite database connectivity check |
| `POST` | `/api/auth/login` | Role-based authentication (Field Worker / Safety Inspector) |
| `GET` | `/api/reports` | Get observations (filterable by user role and ID) |
| `POST` | `/api/reports` | Submit new 10-parameter safety observation |
| `PATCH` | `/api/reports/:id` | Update report status, severity, or parameters |
| `GET` | `/api/reports/:id/messages` | Fetch discussion thread and AI clarifications |
| `POST` | `/api/reports/:id/messages` | Send message (triggers AI natural language parameter extraction) |
| `POST` | `/api/reports/:id/ai-clarify` | Manually trigger AI SIF Co-Pilot inquiry |
| `GET` | `/api/alerts` | Fetch critical notifications and SIF precursor alerts |
| `PATCH` | `/api/alerts/:id/read` | Mark alert as read |

---

## 📱 Mobile & Desktop Builds

- **Desktop (Electron)**: `npm run desktop`
- **Package Windows Executable**: `npm run desktop:pack`
- **Android App (Capacitor)**: `npx cap open android`

---

## 📄 License
Private & Confidential — Developed for Smart India Hackathon (SIH 2026).
