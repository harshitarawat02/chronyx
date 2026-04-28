# Chronyx Control Tower

AI-powered supply chain intelligence platform for proactive disruption prediction and autonomous mitigation.

---

## 🚀 Overview

Chronyx is a narrative-driven, multi-agent system that transforms real-time global signals into actionable disruption intelligence.

It predicts risks before they escalate and executes optimized mitigation strategies using a confidence-gated decision framework.

---

## 🧠 Core Concepts

* **Disruption Risk Index (DRI)**
  A composite metric that quantifies supply chain risk using signal volatility, disruption frequency, route stress, and supplier sentiment.

* **Narrative Intelligence**
  Combines structured and unstructured signals (news, weather, logistics data) to understand root causes.

* **Autonomous Execution**
  Actions are triggered based on confidence thresholds:

  * ≥ 85% → Auto Execution
  * 70–84% → Human Approval
  * < 70% → Escalation

---

## ⚙️ System Architecture

Chronyx follows a multi-agent pipeline:

Data Sources
→ IngestAgent
→ SignalAgent
→ DRI Engine
→ ForecastAgent
→ DetectAgent
→ RootCauseAgent (Gemini)
→ DecisionAgent
→ ExecuteAgent
→ Dashboard

---

## 🤖 AI Integration

* **Gemini Pro** → Root cause analysis and reasoning
* **Vertex AI** → Signal embeddings and semantic processing
* **Rule-based + Heuristic Models** → DRI computation and decision logic

---

## 📊 Key Features

* Real-time disruption monitoring
* AI-powered root cause analysis
* Dynamic route optimization (DROE)
* Confidence-gated autonomous decisions
* Audit logging with tamper-evident entries
* Business impact tracking (cost, SLA, shipments)

---

## 🖥️ Tech Stack

* **Frontend:** React + TypeScript + Vite
* **Styling:** Tailwind CSS
* **Visualization:** Custom charts / SVG
* **AI:** Google Gemini API

---

## 📈 Demo Highlights

* Detects disruption via rising DRI
* Explains root cause using AI
* Recommends optimal rerouting
* Executes mitigation based on confidence

---

## 📦 Deployment

Deployed using Vercel.

---

## 👩‍💻 Author

Harshita Rawat

---

## 📌 Note

This project was built as part of a hackathon to demonstrate an AI-driven supply chain control tower system.
