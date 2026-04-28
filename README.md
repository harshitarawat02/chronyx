<div align="center">

# Chronyx
### Narrative-Driven Supply Chain Intelligence & Optimization System

[![Google Solution Challenge 2026](https://img.shields.io/badge/Google%20Solution%20Challenge-2026-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/community/gdsc-solution-challenge)
[![PS3 Smart Supply Chains](https://img.shields.io/badge/PS3-Smart%20Supply%20Chains-34A853?style=for-the-badge)](https://hack2skill.com)
[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Gemini%202.5%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Vertex AI](https://img.shields.io/badge/Vertex%20AI-Embeddings-EA4335?style=for-the-badge&logo=google-cloud&logoColor=white)](https://cloud.google.com/vertex-ai)
[![Cloud Run](https://img.shields.io/badge/Google-Cloud%20Run-FBBC04?style=for-the-badge&logo=google-cloud&logoColor=white)](https://cloud.google.com/run)

**Team Ethreal · Team Leader: Aditi Rathore**

[🚀 Live Demo](https://gen-lang-client-0312993678.web.app/) · [🎥 Demo Video](https://drive.google.com/file/d/1uOgXXdeZuYJgfLseG7_AVXP0Up9U20MA/view?usp=sharing) · [📂 Technical Research](https://drive.google.com/drive/folders/1KR3A9_VLpeCBtGn6Dx8e7284jJjwT4wq?usp=sharing)

---

> **Chronyx reads the news before your supply chain breaks — and reroutes your shipments before the dashboard turns red.**

</div>

---

## 📑 Table of Contents

- [The Problem](#-the-problem)
- [Our Solution](#-our-solution)
- [System Architecture](#️-system-architecture)
- [Disruption Risk Index (DRI)](#-disruption-risk-index-dri)
- [Dynamic Route Optimization Engine (DROE)](#️-dynamic-route-optimization-engine-droe)
- [Confidence-Gated Decision Framework](#-confidence-gated-decision-framework)
- [Google AI Integration](#️-google-ai-integration)
- [POC Demonstration](#-poc-demonstration-pacific-rim-disruption)
- [Three Core Scenarios](#-three-core-scenarios)
- [Competitive Differentiation](#-competitive-differentiation)
- [Research Foundation](#-research-foundation)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
- [Backend — AI Pipeline](#-backend--ai-pipeline-live)
- [Project Structure](#-project-structure)
- [Business Viability](#-business-viability)
- [Future Development](#-future-development)
- [Team](#-team)

---

## 📌 The Problem

Modern supply chain platforms — FourKites, project44, SAP TM — are **reactive dashboards**. They surface disruptions *after* a delay has already begun, *after* a carrier has failed, *after* a port has congested. By the time the system flags the issue, the operational window for effective intervention has closed.

**PS3 puts it exactly:** *"critical transit disruptions are chronically identified only after delivery timelines are already compromised."*

The gap isn't dashboards. The gap is **lead time**.

---

## 💡 Our Solution

Chronyx is a **nine-agent AI system** that ingests real-time narrative signals — news, supplier communications, port alerts, freight bulletins — and transforms them into structured disruption intelligence *before* disruptions manifest operationally.

At its core is the **Disruption Risk Index (DRI)**, a real-time composite risk metric computed from four independent signal dimensions. When DRI crosses a threshold, Chronyx doesn't just alert you — it classifies the root cause via **Gemini 2.5 Flash**, computes the optimal alternate route via a **graph-based optimization engine**, and autonomously executes or escalates the action based on a **confidence-gated decision framework**.

```
DRI(t) = 0.35·Sv(t) + 0.25·Df(t) + 0.25·Rs(t) + 0.15·Ss(t)

Sv = Signal Volatility   |  Df = Disruption Frequency
Rs = Route Stress        |  Ss = Supplier Sentiment

DRI > 0.50 → Monitoring Zone
DRI > 0.72 → Autonomous Action Triggered
```

---

## 🏗️ System Architecture

```
╔══════════════════════════════════════════════════════════════════╗
║                        SIGNAL LAYER                              ║
║   News APIs ──┐                                                  ║
║   Weather  ───┼──▶  IngestAgent ──▶  SignalAgent                 ║
║   Suppliers ──┤     (raw ingest)     (NLP + Vertex AI Embeddings)║
║   Port Feeds ─┘                                                  ║
╠══════════════════════════════════════════════════════════════════╣
║                      INTELLIGENCE LAYER                          ║
║                                                                  ║
║   SignalAgent ──▶  DRI Engine ──▶  ForecastAgent                 ║
║                        │               │                         ║
║                         ──────────▶  DetectAgent                 ║
║                                        │                         ║
║                                         ──▶  RootCauseAgent      ║
║                                              [GEMINI 2.5 FLASH]  ║
╠══════════════════════════════════════════════════════════════════╣
║                        ACTION LAYER                              ║
║                                                                  ║
║   RootCauseAgent ──▶  RouteAgent (DROE) ──▶  ExecuteAgent        ║
║                                                    │             ║
║                                                    ▼             ║
║                                              AuditAgent          ║
║                                         (SHA-256 tamper log)     ║
╠══════════════════════════════════════════════════════════════════╣
║                     FEEDBACK LEARNING LOOP                       ║
║   Post-action outcomes refine routing weights over time          ║
╚══════════════════════════════════════════════════════════════════╝
```

### Agent Pipeline — Full Specification

| # | Agent | Layer | Role |
|---|-------|-------|------|
| 1 | **IngestAgent** | Signal | Pulls real-time data from shipping news, port feeds, freight APIs, supplier alerts |
| 2 | **SignalAgent** | Signal | Extracts disruption signals via NLP; uses Vertex AI Embeddings for semantic similarity |
| 3 | **DRI Engine** | Intelligence | Computes Disruption Risk Index per time window; detects threshold crossings |
| 4 | **ForecastAgent** | Intelligence | Projects delivery timelines and cost trajectories under active DRI conditions |
| 5 | **DetectAgent** | Intelligence | Classifies breach type: Port Congestion / Freight Surge / Supplier Overlap / SLA Breach |
| 6 | **RootCauseAgent** | Intelligence | **Gemini 2.5 Flash** zero-shot classifies root cause: `weather_event` / `carrier_failure` / `demand_surge` / `geopolitical_signal` |
| 7 | **RouteAgent** | Action | DROE: graph-based supply chain model, risk-aware Dijkstra, optimal rerouting |
| 8 | **ExecuteAgent** | Action | Auto-executes (≥85% confidence) or escalates; computes realised penalty prevention |
| 9 | **AuditAgent** | Action | SHA-256 hashed tamper-evident log of every detection and action |

---

## 🧠 Disruption Risk Index (DRI)

The DRI is methodologically inspired by the **Economic Policy Uncertainty (EPU) Index** (Baker, Bloom & Davis, 2016) — the first framework to prove that news-language volatility acts as a leading indicator for economic disruptions. Chronyx applies the same philosophy to logistics language.

### Formula

$$DRI(t) = 0.35 \cdot S_v(t) + 0.25 \cdot D_f(t) + 0.25 \cdot R_s(t) + 0.15 \cdot S_s(t)$$

| Component | Symbol | Description | Weight |
|-----------|--------|-------------|--------|
| Signal Volatility | $S_v$ | Rate of change in news volume and alert frequency | 35% |
| Disruption Frequency | $D_f$ | Keyword density of high-risk terms in ingested corpus | 25% |
| Route Stress | $R_s$ | Port congestion + weather alerts + transit delay proxies | 25% |
| Supplier Sentiment | $S_s$ | Negative drift in supplier communications (Vertex AI) | 15% |

All components normalised to `[0.0, 1.0]`. DRI clamped to `[0.0, 1.0]`.

### Decision Thresholds

| DRI Range | Zone | System Response |
|-----------|------|-----------------|
| 0.00 – 0.49 | 🟢 Normal | Passive monitoring |
| 0.50 – 0.71 | 🟡 Monitoring | ForecastAgent activated, elevated watch |
| 0.72 – 1.00 | 🔴 Action | Full pipeline triggered, autonomous or escalated response |

---

## 🛣️ Dynamic Route Optimization Engine (DROE)

Supply chain modelled as a weighted directed graph:
- **Nodes** = ports, warehouses, logistics hubs
- **Edges** = transportation routes
- **Weights** = time + cost + disruption risk

### Risk-Aware Effective Cost

$$\text{Effective Cost}(e, t) = \text{Time}(e) + \lambda \cdot DRI(e, t)$$

Where `λ` controls risk sensitivity per shipment priority. DROE uses risk-adjusted Dijkstra to recompute optimal routes in real time when DRI breaches are detected on any edge.

> **Key insight:** Chronyx doesn't just avoid existing delays — it avoids *future* disruptions by routing around elevated-DRI edges before they fail.

---

## ✅ Confidence-Gated Decision Framework

Every action proposed by the system carries a confidence score:

| Confidence | Mode | Behaviour |
|------------|------|-----------|
| ≥ 85% | 🟢 **Auto-Execute** | ExecuteAgent acts autonomously |
| 60–84% | 🟡 **Pending Approval** | Recommended to operator, awaits confirmation |
| < 60% | 🔴 **Escalated** | Full human-in-the-loop; Gemini generates plain-English rationale |

This is not a black box. Every autonomous action is explainable, auditable, and reversible.

---

## ☁️ Google AI Integration

| Google Service | Agent | Why Here |
|----------------|-------|----------|
| **Gemini 2.5 Flash** | RootCauseAgent | Zero-shot disruption root cause classification across 4 categories. Generates natural-language decision rationale. Enables differentiated response per disruption type. |
| **Vertex AI Text Embeddings** | SignalAgent | Semantic similarity across supplier contracts to detect overlap and redundancy. Encodes unstructured text into vector space for comparison. |
| **Google Cloud Run** | Deployment | Containerised FastAPI backend with auto-scaling. Handles burst ingestion events without manual capacity management. |

> **Google AI is not a checkbox in Chronyx — it is load-bearing architecture.** Gemini 2.5 Flash is the only component capable of zero-shot root cause classification across novel disruption patterns. Vertex AI Embeddings is the only component capable of semantic supplier overlap detection at scale.

---

## 📊 POC Demonstration: Pacific Rim Disruption

**Scenario:** Port of Singapore labor strike + Typhoon Koinu + supplier capacity constraints

**T-Minus 72 Hours:**
```json
{
  "timestamp": "2026-04-28T09:35:00Z",
  "classification_confidence": 0.942,
  "root_cause": ["Port Congestion", "Weather Constraints"],
  "dri_score": 0.79,
  "recommended_action": "Divert cargo vessel MSC-402 to Port Klang",
  "graph_weight_adjustment": "+0.79 penalty to Node:SGP"
}
```

**DRI Computation:**
```
DRI = 0.35(0.85) + 0.25(0.70) + 0.25(0.90) + 0.15(0.65) = 0.79 → CRITICAL
```

**Outcome:** Disruption detected and bypassed **3 days before** standard telematics dashboards would flag the delay. **$45,000** in SLA breach penalties and demurrage fees prevented. Reroute executed autonomously at confidence 0.94.

---

## 🎯 Three Core Scenarios

### Scenario 1 — Port Congestion Early Warning
| Metric | Value |
|--------|-------|
| DRI at detection | 0.7950 |
| Lead time | 6 hours before physical congestion |
| Shipments protected | 3 |
| Penalty prevented | **₹2.1L** |
| Execution | Auto (confidence 95%) |

### Scenario 2 — Freight Cost Surge Optimisation
| Metric | Value |
|--------|-------|
| DRI at detection | 0.6670 |
| Trigger | Carrier rate spike +40% in news feeds |
| Shipments protected | 7 |
| Monthly saving | **₹1.8L/month** |
| Execution | Auto (confidence 85%) |

### Scenario 3 — Supplier Redundancy Optimisation
| Metric | Value |
|--------|-------|
| DRI at detection | 0.5030 |
| Trigger | Vertex AI cosine similarity >0.87 across 3 vendor contracts |
| Contracts consolidated | 12 |
| Monthly efficiency gain | **₹3.2L/month** |
| Execution | Human-approved (confidence 67%) |

**Combined monthly disruption cost prevented: ₹7.1L+**

---

## 🆚 Competitive Differentiation

| Feature | FourKites | project44 | SAP TM | **Chronyx** |
|---------|-----------|-----------|--------|-------------|
| Trigger timing | Post-disruption | Post-disruption | Post-disruption | **Pre-disruption** |
| Data handled | Structured (GPS) | Structured (GPS) | Structured | **Unstructured + Structured** |
| Response time | T+24 to T+72 hrs | T+24 hrs | T+48 hrs | **T-72 hrs** |
| Root cause reasoning | ❌ | ❌ | ❌ | **✅ Gemini 2.5 Flash** |
| Autonomous rerouting | ❌ | Partial | ❌ | **✅ Confidence-gated** |
| Audit trail (hashed) | ❌ | ❌ | Partial | **✅ SHA-256** |
| LLM integration | ❌ | ❌ | ❌ | **✅** |

---

## 🔬 Research Foundation

Every architectural decision in Chronyx is grounded in published research:

1. **Brintrup et al. (2020)** — *Supply chain data analytics for predicting supplier disruptions*, International Journal of Production Research  
   → Directly proves news analytics predicts supply chain risks with measurable lead time. **Primary academic validation of Chronyx's core thesis.**

2. **Baker, Bloom & Davis (2016)** — *Measuring Economic Policy Uncertainty*, Quarterly Journal of Economics  
   → DRI formula is methodologically derived from the EPU Index. Proves narrative volatility as a leading economic indicator.

3. **Giannakis & Louis (2011)** — *A multi-agent based framework for supply chain risk identification*, Journal of Purchasing and Supply Management  
   → Establishes that unstructured supplier text contains early warning signals. Grounds the SignalAgent and $S_s$ component.

4. **Yang, Liu & Li (2020)** — *FinBERT: A Pretrained Language Model for Financial Communications*, arXiv  
   → Grounds NLP scoring approach. Logistics disruption reports use identical language patterns to financial risk communications.

5. **Tordecilla et al. (2021)** — *Simulation-optimisation for resilient supply chain networks*, International Journal of Production Research  
   → Validates autonomous rerouting under uncertainty. Grounds the DROE strategy and confidence-gated execution model.

6. **Brown et al. (2020)** — *Language Models are Few-Shot Learners (GPT-3)*, NeurIPS  
   → Establishes zero-shot reasoning in LLMs. Foundation for RootCauseAgent's use of Gemini 2.5 Flash for zero-shot classification without fine-tuning.

---

## 🛠️ Tech Stack

```
Frontend     │ React (TypeScript) · Vite · Tailwind CSS · shadcn/ui
Visualisation│ Recharts (DRI time series) · Custom SVG route graph
Backend      │ Python 3.11 · FastAPI · Uvicorn · google-genai SDK
AI / ML      │ Gemini 2.5 Flash (live) · Vertex AI Text Embeddings
Algorithms   │ Risk-aware Dijkstra (DROE) · SHA-256 audit logging
Deployment   │ Google Cloud Run · Firebase Hosting
Dev Tools    │ GitHub · VS Code
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- Python ≥ 3.11
- Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

### Frontend Setup

```bash
git clone https://github.com/harshitarawat02/chronyx.git
cd chronyx
npm install
npm run dev
```

Runs on `http://localhost:5173`

### Frontend Environment Variables

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=Chronyx
```

---

## 🤖 Backend — AI Pipeline (Live)

The `backend/` folder contains the complete 9-agent Python pipeline powering Chronyx's intelligence layer. The frontend at [gen-lang-client-0312993678.web.app](https://gen-lang-client-0312993678.web.app) shows the UI — the backend demonstrates the live Gemini AI reasoning behind every decision.

> **Gemini 2.5 Flash is live and connected** — every run calls the Gemini API for real zero-shot root cause classification, not a mock or fallback.

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt

# Add your Gemini API key
cp .env.example .env
# Open .env and set GEMINI_API_KEY=your_key_here
```

Get your free key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

### Run the Demo (Terminal — no server needed)

```bash
# All 3 scenarios end-to-end
python run_demo.py

# Or run a single scenario
python run_demo.py port_congestion
python run_demo.py freight_surge
python run_demo.py supplier_overlap
```

### Live Pipeline Output (Verified)

```
✓ Gemini API connected (gemini-2.5-flash)

AGENT 6 — RootCauseAgent  [GEMINI 2.5 FLASH]
  ◉  Calling Gemini API...
  ✓  Gemini response received
  Root Cause Category:  weather_event
  Root Cause Label:     Major Weather Event
  Confidence:           95%
  Source:               gemini_api (live)

PIPELINE COMPLETE (8.55s)
  DRI Score:     0.7950  (ACTION THRESHOLD BREACHED)
  Gemini Source: gemini_api
  Execution:     AUTO EXECUTING
  Value:         $35,775 SLA penalties prevented
  Audit Entry:   0xC82CD7F7
```

### Scenario Results (Live Gemini Verified)

| Scenario | DRI | Zone | Gemini Confidence | Execution | Value Saved |
|----------|-----|------|-------------------|-----------|-------------|
| `port_congestion` | 0.7950 | 🔴 CRITICAL | 95% | AUTO EXECUTE | $35,775 |
| `freight_surge` | 0.6670 | 🟡 ELEVATED | 95% | AUTO EXECUTE | $30,015 |
| `supplier_overlap` | 0.5030 | 🟡 ELEVATED | 75% | PENDING APPROVAL | $22,635 |

**Total: $88,425 in SLA penalties prevented across 3 live scenarios**

### Optional: Run as API Server

```bash
uvicorn main:app --reload
# Available at http://localhost:8000
```

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/analyse` | POST | Run full 9-agent pipeline for a scenario |
| `/dri/{scenario}` | GET | Quick DRI score lookup |
| `/audit-log` | GET | Full SHA-256 tamper-evident log |
| `/health` | GET | Gemini connection + system status |

---

## 📁 Project Structure

```
chronyx/
├── src/
│   ├── pages/
│   │   ├── Index.tsx          # Main dashboard (DRI + KPIs + Actions)
│   │   ├── Disruption.tsx     # Disruption detail + Gemini analysis
│   │   ├── Routes.tsx         # DROE route optimization view
│   │   ├── Architecture.tsx   # Agent pipeline visualization
│   │   ├── Audit.tsx          # Tamper-evident audit log
│   │   └── Settings.tsx       # System configuration
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── DRIPanel.tsx       # Live DRI gauge + components
│   │   │   ├── GeminiPanel.tsx    # Root cause analysis panel
│   │   │   ├── ActionFeed.tsx     # Confidence-gated action engine
│   │   │   ├── RouteMap.tsx       # DROE graph visualization
│   │   │   ├── KPIPanel.tsx       # Business impact metrics
│   │   │   └── FeedbackLoop.tsx   # Learning loop status
│   │   └── ui/                    # shadcn/ui component library
│   └── App.tsx
├── backend/
│   ├── main.py                # Full 9-agent FastAPI pipeline (Gemini live)
│   ├── run_demo.py            # Terminal demo runner (no server needed)
│   ├── requirements.txt       # Python dependencies
│   ├── .env.example           # Environment variable template
│   └── README.md              # Backend-specific setup guide
├── public/
└── README.md
```

---

## 📈 Business Viability

**Target Market:** Supply chain operations teams at mid-to-large enterprises managing cross-border logistics — logistics managers, supply chain risk officers, procurement teams at manufacturers, retailers, and 3PL providers.

**Market Context:** Global supply chain disruptions cost enterprises an estimated $184 billion annually. Current tools are reactive — the proactive intelligence market is structurally underserved.

**Deployment Model:**
- **MVP (now):** Live dashboard with DRI computation, 3 demo scenarios, Gemini root cause panel, confidence-gated actions
- **Phase 2:** Live API integrations (FreightWaves, MarineTraffic, NewsAPI), real DRI feed
- **Phase 3:** Multi-tenant SaaS, Vertex AI fine-tuned DRI weights, enterprise audit compliance, ERP integration

**Cost Model:**
- Initial prototype/pilot: $3,000 – $8,000
- At scale: $10,000+ depending on usage
- Pay-as-you-go Cloud Run — zero idle infrastructure cost

---

## 🔮 Future Development

**Near Term**
- IoT and real-time telematics integration for deeper operational visibility
- Advanced multi-modal logistics (air, sea, land) coverage
- Adaptive DRI with dynamic weight calibration from real-world feedback

**Long Term**
- Enterprise ERP and supply chain platform integration (SAP, Oracle)
- Fully autonomous, self-learning supply chain ecosystem
- Deployment across e-commerce, manufacturing, and global logistics verticals

---

## 👥 Team

**Team Ethreal** · Google Solution Challenge 2026

| Role | Name | GitHub |
|------|------|--------|
| Team Leader | **Aditi Rathore** | [@AditiR-21](https://github.com/AditiR-21) |
| Team Member | **Harshita Rawat** | [@harshitarawat02](https://github.com/harshitarawat02) |

---

## 📄 License

This project is submitted for the Google Solution Challenge 2026 (Build with AI · Hack2Skill).

---

<div align="center">

**Chronyx** — Transforming supply chains from reactive networks into proactive intelligence engines.

*Predict. Optimize. Execute. Before the disruption arrives.*

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-gen--lang--client--0312993678.web.app-4285F4?style=for-the-badge)](https://gen-lang-client-0312993678.web.app/)

</div>
