# Nav Drishti (नव दृष्टि) 🛡️⚡
### AI-Powered Industrial Safety Observation & SIF Precursor Intelligence Platform

[![Deploy to GitHub Pages](https://github.com/yashkarwa15-maker/sih2026-frontend/actions/workflows/deploy.yml/badge.svg)](https://github.com/yashkarwa15-maker/sih2026-frontend/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-brightgreen)](https://yashkarwa15-maker.github.io/sih2026-frontend/)
[![Version](https://img.shields.io/badge/version-2.4--RC-blue.svg)](https://github.com/yashkarwa15-maker/sih2026-frontend)

**Nav Drishti** is an advanced AI-driven industrial safety platform engineered for complex facilities (refineries, petrochemical complexes, and high-hazard plants). It captures safety observations, detects **Serious Injury & Fatality (SIF)** precursors before incidents occur, maps operational risks against **IOGP Life-Saving Rules**, and provides actionable barrier health analytics in real time.

---

## 🌟 Key Capabilities

- **SIF Precursor Prediction**: Real-time scoring of observations to identify high-potential precursors and degradation of critical safety barriers.
- **8 × 8 Unit Risk Matrix & Heatmaps**: Granular operational risk tracking across complex plant processing units and ongoing activities (hot work, line breaking, confined space, etc.).
- **IOGP Life-Saving Rules Integration**: Automated compliance alignment with the 10 International Oil & Gas Producers Life-Saving Rules.
- **AI Unstructured Text Extraction**: Turn unstructured field reports, voice notes, and worker logs into structured SIF precursor data.
- **Multimodal Support**: Runs across **Web (React + Vite)**, **Desktop (Electron)**, and **Mobile (Capacitor Android)** with offline synchronization.
- **Interactive Action Tracking**: Complete lifecycle tracking of corrective barrier restoration actions and ownership.

---

## 🚀 Live Demo
Access the live deployment on GitHub Pages:  
👉 **[https://yashkarwa15-maker.github.io/sih2026-frontend/](https://yashkarwa15-maker.github.io/sih2026-frontend/)**

---

## 💻 Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS, Lucide Icons
- **Visualizations**: Recharts, Custom Industrial Risk Gauges & Matrices
- **Desktop**: Electron
- **Mobile**: Capacitor Android
- **Build / Tooling**: Vite 6, PostCSS
- **CI/CD**: GitHub Actions auto-deployment to GitHub Pages

---

## 🛠️ Quickstart Guide

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation & Local Run

```bash
# 1. Clone the repository
git clone https://github.com/yashkarwa15-maker/sih2026-frontend.git

# 2. Enter directory
cd sih2026-frontend

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) or [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

---

## 📱 Mobile & Desktop Builds

- **Desktop (Electron)**: `npm run desktop`
- **Package Windows Executable**: `npm run desktop:pack`
- **Android App (Capacitor)**: `npx cap open android`

---

## 📄 License
Private & Confidential — Developed for Smart India Hackathon (SIH 2026).
