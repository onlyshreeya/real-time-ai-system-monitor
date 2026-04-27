# 🚀 AI System Monitor

A modern, real-time system monitoring dashboard that not only tracks performance metrics but also predicts future load and explains unusual system behavior.

---

## 🧠 Overview

AI System Monitor is a full-stack web application designed to provide **real-time insights into system performance** along with **predictive analytics and anomaly detection**.

Unlike traditional dashboards, this project focuses on:

* Understanding *why* something is happening
* Not just showing *what* is happening

---

## ✨ Key Features

### 📊 Real-Time Monitoring

* CPU, Memory, Disk, and Network tracking
* Live updates from backend
* Clean, developer-friendly UI

### 🤖 Predictive Analytics

* Forecasts future CPU load based on recent trends
* Displays confidence level and trend direction

### ⚠️ Anomaly Detection

* Detects unusual spikes in system behavior
* Highlights anomalies directly on charts
* Provides **human-readable causes** (not just flags)

### 🔔 Smart Alert System

* Severity-based alerts (Info / Warning / Critical)
* Toast notifications for real-time feedback
* Context-aware messages (e.g., *“CPU may exceed 90% soon”*)

### 💾 Storage Insights

* Disk usage monitoring
* Intelligent suggestions based on usage levels
* Simulated “Top Storage Consumers” for realistic UX

### 📈 Interactive Visualization

* Smooth charts with Chart.js
* CPU vs Prediction comparison
* Highlighted anomaly points

---

## 🛠️ Tech Stack

**Frontend**

* React
* Chart.js
* Custom UI styling (no heavy UI frameworks)

**Backend**

* Node.js
* Express

**Database**

* MongoDB (Atlas)

**Prediction Logic**

* Python-based model (lightweight)
* Custom trend + anomaly detection logic

---
🖥️ Live Demo

This dashboard currently displays real-time system metrics from Shreeya’s machine (hosted agent).

👉 Open the live app:
https://real-time-ai-system-monitor.vercel.app
## ⚙️ Local Setup

### 1. Clone the repository

```
git clone https://github.com/YOUR_USERNAME/ai-system-monitor.git
cd ai-system-monitor
```

---

### 2. Backend setup

```
cd backend
npm install
npm run dev
```

---

### 3. Frontend setup

```bash
cd frontend
npm install
npm start
```

---

⚙️ Run Locally (Monitor Your Own PC)

To monitor your own system:
```
git clone <repo>
cd project
npm install
```

Start backend:
```
cd backend
npm run dev
```
Start frontend:
```
cd frontend
npm run dev
```

Now the dashboard will display your own system metrics.
---

## 💡 Highlights

* Combines **real-time monitoring + predictive intelligence**
* Focuses on **explainability**, not just detection
* Designed with **clean UI and practical usability**
* Simulates real-world monitoring scenarios effectively

---

## 📌 Future Improvements

- Monitor user's own system via local agent
- Multi-device support
- Real-time WebSocket updates
- Downloadable desktop client

---
## 📄 Documentation

- 📊 [Technical Audit](docs/AUDIT.md)
- 📘 [Project Report (LaTeX)](docs/report.tex)
- 📑 [Project Report PDF](docs/report.pdf)
---

## 👤 Author

**Shreeya Srivastava**

---

## ⭐ Support

If you found this project interesting, consider giving it a star ⭐
