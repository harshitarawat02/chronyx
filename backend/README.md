# Chronyx — Backend (AI Pipeline)

This folder contains the full 9-agent supply chain intelligence pipeline powering Chronyx.
The frontend is deployed at https://gen-lang-client-0312993678.web.app — this backend
demonstrates the AI reasoning and optimization logic behind it.

## Stack
- Python 3.10+
- Google Gemini 2.5 Flash (live reasoning via google-genai SDK)
- FastAPI (REST API server, optional)
- Dijkstra-based risk-aware route optimization (DROE)
- SHA-256 tamper-evident audit logging

## Agent Pipeline
IngestAgent → SignalAgent → DRIEngine → ForecastAgent
→ DetectAgent → RootCauseAgent (Gemini) → RouteAgent (DROE)
→ ExecuteAgent → AuditAgent

| Agent | Role |
|---|---|
| IngestAgent | Pulls signals from news, weather, AIS, supplier comms |
| SignalAgent | NLP keyword extraction + semantic similarity scoring |
| DRIEngine | Computes Disruption Risk Index: `0.35·Sv + 0.25·Df + 0.25·Rs + 0.15·Ss` |
| ForecastAgent | Projects ETA delay and SLA breach probability |
| DetectAgent | Classifies severity and triggers pipeline if DRI > 0.72 |
| RootCauseAgent | Gemini 2.5 Flash zero-shot classification of disruption root cause |
| RouteAgent | Risk-aware Dijkstra optimization across supply chain graph |
| ExecuteAgent | Confidence-gated autonomous or human-approval execution |
| AuditAgent | SHA-256 tamper-evident log entry for every decision |

## Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env      # add your Gemini API key inside
```

## Run the demo (terminal)

```bash
# All 3 scenarios
python run_demo.py

# Single scenario
python run_demo.py port_congestion
python run_demo.py freight_surge
python run_demo.py supplier_overlap
```

## Scenarios

| Scenario | DRI | Severity | Execution Mode |
|---|---|---|---|
| `port_congestion` | 0.7950 | CRITICAL | AUTO EXECUTE |
| `freight_surge` | 0.6670 | ELEVATED | PENDING APPROVAL |
| `supplier_overlap` | 0.5030 | ELEVATED | PENDING APPROVAL |

## Optional: Run as API server

```bash
uvicorn main:app --reload
```

Then open `http://localhost:8000` — endpoints available:
- `POST /analyse` — run full pipeline for a scenario
- `GET /dri/{scenario}` — quick DRI score
- `GET /audit-log` — tamper-evident log
- `GET /health` — connection status

## Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Your Google AI Studio API key |

Get your key at https://aistudio.google.com/apikey