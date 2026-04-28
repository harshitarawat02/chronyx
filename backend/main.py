"""
╔══════════════════════════════════════════════════════════════════╗
║           CHRONYX — Supply Chain Intelligence Backend            ║
║     Narrative-Driven Disruption Prediction & Optimization        ║
║                     Team Ethreal · 2026                          ║
╚══════════════════════════════════════════════════════════════════╝

Agent Pipeline:
  IngestAgent → SignalAgent → DRIEngine → ForecastAgent
  → DetectAgent → RootCauseAgent (Gemini) → RouteAgent (DROE)
  → ExecuteAgent → AuditAgent
"""

import os
import math
import time
import json
import random
import hashlib
import asyncio
from datetime import datetime, timezone
from typing import Optional
from dotenv import load_dotenv
from colorama import Fore, Style, init as colorama_init
from google import genai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()
colorama_init(autoreset=True)

# ── Gemini setup (google-genai SDK) ─────────────────────────────
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_AVAILABLE = False
gemini_client = None

if GEMINI_API_KEY:
    try:
        gemini_client = genai.Client(api_key=GEMINI_API_KEY)
        GEMINI_AVAILABLE = True
        print(f"{Fore.GREEN}✓ Gemini API connected (gemini-2.0-flash){Style.RESET_ALL}")
    except Exception as e:
        print(f"{Fore.YELLOW}⚠  Gemini unavailable: {e} — using rule-based fallback{Style.RESET_ALL}")
else:
    print(f"{Fore.YELLOW}⚠  GEMINI_API_KEY not set — using rule-based fallback{Style.RESET_ALL}")

# ── FastAPI app ──────────────────────────────────────────────────
app = FastAPI(
    title="Chronyx API",
    description="Narrative-Driven Supply Chain Intelligence — Team Ethreal",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── In-memory audit store ────────────────────────────────────────
AUDIT_LOG: list[dict] = []

# ══════════════════════════════════════════════════════════════════
#  MOCK SIGNAL FEEDS — simulates IngestAgent pulling live data
# ══════════════════════════════════════════════════════════════════

SCENARIOS = {
    "port_congestion": {
        "name": "Pacific Rim Port Congestion",
        "signals": [
            "NOAA issues Typhoon Koinu category 3 advisory for South China Sea corridor",
            "AIS data: vessel queue at Singapore PSA grew to 38 (baseline 14) — 2.7x surge",
            "MPA Singapore issues labor shift advisory — strike risk elevated",
            "Spot freight rates Singapore→Rotterdam up 14% in 24 hours (Drewry index)",
            "Port of Shanghai reports 40% berth utilization increase due to weather diversions",
        ],
        "supplier_comms": [
            "Capacity constraints reported by 3 regional vendors in APAC corridor",
            "Delivery window uncertainty — cannot commit to SLA for next 72 hours",
            "Force majeure conditions being assessed by logistics partners",
        ],
        "sv": 0.85, "df": 0.70, "rs": 0.90, "ss": 0.65,
    },
    "freight_surge": {
        "name": "Carrier Rate Spike",
        "signals": [
            "Carrier X announces 40% rate increase effective immediately on APAC-EU lanes",
            "Freightos Baltic Index: container spot rates up 31% month-over-month",
            "Supply chain analytics reports capacity crunch on transpacific routes",
            "3 major carriers report vessel utilization above 95% on key corridors",
        ],
        "supplier_comms": [
            "Vendor Foxconn-SZ: ETA uncertainty due to carrier capacity constraints",
            "Logistics partner unable to guarantee rate lock beyond 48 hours",
        ],
        "sv": 0.72, "df": 0.65, "rs": 0.68, "ss": 0.55,
    },
    "supplier_overlap": {
        "name": "Supplier Redundancy Detection",
        "signals": [
            "Semantic analysis detects 87% contract similarity across 3 vendor agreements",
            "Vendor A, Vendor B, and Vendor C covering identical SIN→RTM route segments",
            "Procurement data shows redundant spend of estimated $180K/month",
        ],
        "supplier_comms": [
            "Vendor B: negative sentiment drift detected — delivery reliability declining",
            "Vendor C: financial stress indicators in latest communications",
            "Contract overlap identified in route coverage: all three vendors serving same lanes",
        ],
        "sv": 0.45, "df": 0.40, "rs": 0.55, "ss": 0.72,
    },
}


# ══════════════════════════════════════════════════════════════════
#  AGENT 1 — IngestAgent
# ══════════════════════════════════════════════════════════════════

def run_ingest_agent(scenario_key: str) -> dict:
    print(f"\n{Fore.CYAN}{'─'*60}")
    print(f"{Fore.CYAN}  AGENT 1 — IngestAgent")
    print(f"{Fore.CYAN}{'─'*60}{Style.RESET_ALL}")

    scenario = SCENARIOS.get(scenario_key, SCENARIOS["port_congestion"])
    print(f"  {Fore.WHITE}Scenario:{Style.RESET_ALL} {scenario['name']}")
    print(f"  {Fore.WHITE}Ingesting from:{Style.RESET_ALL}")
    sources = ["NewsAPI (global shipping news)", "NOAA Weather Feed", "AIS Vessel Tracker", "Supplier Comms Channel", "Freightos Rate Index"]
    for src in sources:
        time.sleep(0.1)
        print(f"    {Fore.GREEN}✓{Style.RESET_ALL} {src}")

    print(f"\n  {Fore.WHITE}Raw signals captured:{Style.RESET_ALL} {len(scenario['signals']) + len(scenario['supplier_comms'])}")
    print(f"  {Fore.WHITE}News signals:{Style.RESET_ALL} {len(scenario['signals'])}")
    print(f"  {Fore.WHITE}Supplier comms:{Style.RESET_ALL} {len(scenario['supplier_comms'])}")

    return {
        "scenario": scenario_key,
        "scenario_name": scenario["name"],
        "signals": scenario["signals"],
        "supplier_comms": scenario["supplier_comms"],
        "raw_components": {
            "sv": scenario["sv"],
            "df": scenario["df"],
            "rs": scenario["rs"],
            "ss": scenario["ss"],
        },
        "ingested_at": datetime.now(timezone.utc).isoformat(),
    }


# ══════════════════════════════════════════════════════════════════
#  AGENT 2 — SignalAgent  (Vertex AI Embeddings simulated)
# ══════════════════════════════════════════════════════════════════

DISRUPTION_KEYWORDS = [
    "strike", "typhoon", "congestion", "delay", "shortage",
    "capacity constraint", "force majeure", "disruption", "surge",
    "vessel queue", "port closure", "weather advisory",
]

def run_signal_agent(ingest_data: dict) -> dict:
    print(f"\n{Fore.CYAN}{'─'*60}")
    print(f"{Fore.CYAN}  AGENT 2 — SignalAgent  [NLP + Vertex AI Embeddings]")
    print(f"{Fore.CYAN}{'─'*60}{Style.RESET_ALL}")

    all_text = " ".join(ingest_data["signals"] + ingest_data["supplier_comms"]).lower()

    # keyword density scoring
    hits = [kw for kw in DISRUPTION_KEYWORDS if kw in all_text]
    keyword_density = len(hits) / len(DISRUPTION_KEYWORDS)

    print(f"  {Fore.WHITE}Keyword extraction:{Style.RESET_ALL}")
    for kw in hits:
        print(f"    {Fore.YELLOW}⚑{Style.RESET_ALL}  '{kw}' detected")

    # Supplier semantic similarity (Vertex AI Embeddings simulation)
    print(f"\n  {Fore.WHITE}Vertex AI Embeddings — supplier semantic similarity:{Style.RESET_ALL}")
    time.sleep(0.2)

    if ingest_data["scenario"] == "supplier_overlap":
        similarity_score = 0.87
        overlap_detected = True
        print(f"    {Fore.RED}⚠  Cosine similarity across vendor contracts: {similarity_score:.2f} (threshold: 0.80){Style.RESET_ALL}")
        print(f"    {Fore.RED}⚠  OVERLAP DETECTED — 3 vendors covering identical route segments{Style.RESET_ALL}")
    else:
        similarity_score = round(random.uniform(0.20, 0.45), 2)
        overlap_detected = False
        print(f"    {Fore.GREEN}✓{Style.RESET_ALL}  Cosine similarity across vendor contracts: {similarity_score:.2f} — within normal range")

    # Sentiment drift scoring
    negative_terms = ["constraint", "uncertainty", "risk", "force majeure", "declining", "stress", "unable"]
    neg_hits = [t for t in negative_terms if t in all_text]
    sentiment_score = len(neg_hits) / len(negative_terms)

    print(f"\n  {Fore.WHITE}Supplier sentiment drift:{Style.RESET_ALL} {sentiment_score:.2f} ({len(neg_hits)}/{len(negative_terms)} negative indicators)")
    print(f"  {Fore.WHITE}Disruption keyword density:{Style.RESET_ALL} {keyword_density:.2f} ({len(hits)}/{len(DISRUPTION_KEYWORDS)} terms matched)")

    return {
        **ingest_data,
        "keyword_hits": hits,
        "keyword_density": keyword_density,
        "supplier_similarity": similarity_score,
        "supplier_overlap_detected": overlap_detected,
        "sentiment_score": sentiment_score,
    }


# ══════════════════════════════════════════════════════════════════
#  AGENT 3 — DRI Engine
# ══════════════════════════════════════════════════════════════════

def run_dri_engine(signal_data: dict) -> dict:
    print(f"\n{Fore.CYAN}{'─'*60}")
    print(f"{Fore.CYAN}  AGENT 3 — DRI Engine")
    print(f"{Fore.CYAN}{'─'*60}{Style.RESET_ALL}")

    c = signal_data["raw_components"]
    sv, df, rs, ss = c["sv"], c["df"], c["rs"], c["ss"]

    dri = round(0.35 * sv + 0.25 * df + 0.25 * rs + 0.15 * ss, 4)
    dri = min(max(dri, 0.0), 1.0)

    print(f"\n  {Fore.WHITE}DRI Formula:{Style.RESET_ALL}  DRI(t) = 0.35·Sv + 0.25·Df + 0.25·Rs + 0.15·Ss")
    print(f"\n  {Fore.WHITE}Component values:{Style.RESET_ALL}")
    print(f"    Sv (Signal Volatility)    = {Fore.YELLOW}{sv:.2f}{Style.RESET_ALL}  × 0.35 = {0.35*sv:.4f}")
    print(f"    Df (Disruption Frequency) = {Fore.YELLOW}{df:.2f}{Style.RESET_ALL}  × 0.25 = {0.25*df:.4f}")
    print(f"    Rs (Route Stress)         = {Fore.YELLOW}{rs:.2f}{Style.RESET_ALL}  × 0.25 = {0.25*rs:.4f}")
    print(f"    Ss (Supplier Sentiment)   = {Fore.YELLOW}{ss:.2f}{Style.RESET_ALL}  × 0.15 = {0.15*ss:.4f}")
    print(f"    {'─'*44}")

    if dri >= 0.72:
        zone_color = Fore.RED
        zone = "ACTION THRESHOLD BREACHED"
    elif dri >= 0.50:
        zone_color = Fore.YELLOW
        zone = "MONITORING ZONE"
    else:
        zone_color = Fore.GREEN
        zone = "NORMAL"

    print(f"    {Fore.WHITE}DRI Score:{Style.RESET_ALL}  {zone_color}{Fore.WHITE}{Style.BRIGHT}{dri:.4f}{Style.RESET_ALL}  →  {zone_color}{zone}{Style.RESET_ALL}")
    print(f"\n  {Fore.WHITE}Thresholds:{Style.RESET_ALL}  0.50 = Monitoring  |  0.72 = Action  |  Current = {dri:.4f}")

    return {**signal_data, "dri": dri, "dri_zone": zone}


# ══════════════════════════════════════════════════════════════════
#  AGENT 4 — ForecastAgent
# ══════════════════════════════════════════════════════════════════

def run_forecast_agent(dri_data: dict) -> dict:
    print(f"\n{Fore.CYAN}{'─'*60}")
    print(f"{Fore.CYAN}  AGENT 4 — ForecastAgent")
    print(f"{Fore.CYAN}{'─'*60}{Style.RESET_ALL}")

    dri = dri_data["dri"]
    baseline_eta_days = 28
    surge_factor = 1 + (dri * 0.6)
    projected_eta = round(baseline_eta_days * surge_factor, 1)
    delay_days = round(projected_eta - baseline_eta_days, 1)
    sla_breach_prob = round(min(dri * 1.3, 0.99), 2)
    cost_impact_usd = round(dri * 75000, 0)

    print(f"  {Fore.WHITE}Baseline ETA:{Style.RESET_ALL}        {baseline_eta_days} days (SIN → RTM)")
    print(f"  {Fore.WHITE}Projected ETA:{Style.RESET_ALL}       {projected_eta} days  (+{delay_days} days delay)")
    print(f"  {Fore.WHITE}SLA Breach Probability:{Style.RESET_ALL} {Fore.RED if sla_breach_prob > 0.7 else Fore.YELLOW}{sla_breach_prob:.0%}{Style.RESET_ALL}")
    print(f"  {Fore.WHITE}Projected Cost Impact:{Style.RESET_ALL}  ${cost_impact_usd:,.0f}")

    return {
        **dri_data,
        "forecast": {
            "baseline_eta_days": baseline_eta_days,
            "projected_eta_days": projected_eta,
            "delay_days": delay_days,
            "sla_breach_probability": sla_breach_prob,
            "cost_impact_usd": cost_impact_usd,
        },
    }


# ══════════════════════════════════════════════════════════════════
#  AGENT 5 — DetectAgent
# ══════════════════════════════════════════════════════════════════

DISRUPTION_TYPES = {
    "port_congestion":  "Port Congestion",
    "freight_surge":    "Freight Cost Surge",
    "supplier_overlap": "Supplier Redundancy Overlap",
}

def run_detect_agent(forecast_data: dict) -> dict:
    print(f"\n{Fore.CYAN}{'─'*60}")
    print(f"{Fore.CYAN}  AGENT 5 — DetectAgent")
    print(f"{Fore.CYAN}{'─'*60}{Style.RESET_ALL}")

    dri = forecast_data["dri"]
    scenario = forecast_data["scenario"]
    disruption_type = DISRUPTION_TYPES.get(scenario, "Unknown Disruption")

    if dri >= 0.72:
        severity = "CRITICAL"
        severity_color = Fore.RED
        breach = True
    elif dri >= 0.50:
        severity = "ELEVATED"
        severity_color = Fore.YELLOW
        breach = False
    else:
        severity = "NORMAL"
        severity_color = Fore.GREEN
        breach = False

    print(f"  {Fore.WHITE}Disruption type classified:{Style.RESET_ALL}  {disruption_type}")
    print(f"  {Fore.WHITE}Severity:{Style.RESET_ALL}               {severity_color}{severity}{Style.RESET_ALL}")
    print(f"  {Fore.WHITE}Threshold breach:{Style.RESET_ALL}       {'YES — triggering full pipeline' if breach else 'No'}")

    if breach:
        print(f"\n  {Fore.RED}{'█'*50}{Style.RESET_ALL}")
        print(f"  {Fore.RED}  ⚠  THRESHOLD BREACHED — DRI {dri:.4f} > 0.72{Style.RESET_ALL}")
        print(f"  {Fore.RED}  ⚠  ACTIVATING: RootCauseAgent → RouteAgent → ExecuteAgent{Style.RESET_ALL}")
        print(f"  {Fore.RED}{'█'*50}{Style.RESET_ALL}")

    return {
        **forecast_data,
        "detection": {
            "disruption_type": disruption_type,
            "severity": severity,
            "threshold_breached": breach,
        },
    }


# ══════════════════════════════════════════════════════════════════
#  AGENT 6 — RootCauseAgent  (GEMINI PRO CORE)
# ══════════════════════════════════════════════════════════════════

FALLBACK_CLASSIFICATIONS = {
    "port_congestion": {
        "root_cause_category": "weather_event",
        "root_cause_label": "Severe Weather + Port Congestion",
        "confidence": 0.91,
        "explanation": (
            "Typhoon Koinu has induced vessel bunching at Singapore PSA, "
            "elevating berth utilization to 94% with 38 queued vessels. "
            "AIS signals and NOAA weather advisories confirm weather as "
            "the primary driver, compounded by port capacity constraints."
        ),
        "recommended_action": "Divert cargo to Port Klang — ETA preserved within SLA window",
        "source": "rule_based_fallback",
    },
    "freight_surge": {
        "root_cause_category": "carrier_failure",
        "root_cause_label": "Carrier Capacity Constraint",
        "confidence": 0.84,
        "explanation": (
            "Primary carrier is experiencing demand-driven capacity constraint "
            "across APAC-EU lanes, resulting in a 40% spot rate increase. "
            "Freight index data confirms this is a market-wide phenomenon "
            "rather than a single carrier failure."
        ),
        "recommended_action": "Switch to alternate carrier — rate lock available for 72 hours",
        "source": "rule_based_fallback",
    },
    "supplier_overlap": {
        "root_cause_category": "demand_surge",
        "root_cause_label": "Redundant Vendor Onboarding",
        "confidence": 0.77,
        "explanation": (
            "Semantic similarity analysis detects three vendors covering "
            "identical route segments — likely onboarded during a historical "
            "peak period and never consolidated. Negative sentiment drift in "
            "two of the three vendors elevates consolidation urgency."
        ),
        "recommended_action": "Consolidate to single preferred vendor — estimated ₹3.2L/month efficiency gain",
        "source": "rule_based_fallback",
    },
}

def run_root_cause_agent(detect_data: dict) -> dict:
    print(f"\n{Fore.CYAN}{'─'*60}")
    print(f"{Fore.CYAN}  AGENT 6 — RootCauseAgent  [GEMINI PRO CORE]")
    print(f"{Fore.CYAN}{'─'*60}{Style.RESET_ALL}")

    scenario = detect_data["scenario"]
    signals_text = "\n".join(detect_data["signals"] + detect_data["supplier_comms"])

    if GEMINI_AVAILABLE:
        print(f"  {Fore.GREEN}◉  Calling Gemini API...{Style.RESET_ALL}")

        prompt = f"""You are the RootCauseAgent in Chronyx, a supply chain intelligence system.

Analyse the following supply chain disruption signals and classify the root cause.

SIGNALS:
{signals_text}

DRI SCORE: {detect_data['dri']:.4f}
DISRUPTION TYPE: {detect_data['detection']['disruption_type']}

Classify into EXACTLY ONE root cause category:
- weather_event
- carrier_failure  
- demand_surge
- geopolitical_signal

Respond ONLY with valid JSON, no markdown, no explanation outside JSON:
{{
  "root_cause_category": "<one of the four categories>",
  "root_cause_label": "<short human-readable label>",
  "confidence": <float 0.0-1.0>,
  "explanation": "<exactly 2 sentences explaining the classification>",
  "recommended_action": "<one concrete action the RouteAgent should take>"
}}"""

        try:
            response = gemini_client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                )
            raw = response.text.strip()
            # strip markdown fences if present
            if raw.startswith("```"):
                raw = raw.split("```")[1]
                if raw.startswith("json"):
                    raw = raw[4:]
            classification = json.loads(raw.strip())
            classification["source"] = "gemini_api"

            print(f"  {Fore.GREEN}✓  Gemini response received{Style.RESET_ALL}")
            print(f"\n  {Fore.WHITE}── Gemini API Output ─────────────────────────────{Style.RESET_ALL}")
            print(f"  {Fore.WHITE}Root Cause Category:{Style.RESET_ALL}  {Fore.YELLOW}{classification['root_cause_category']}{Style.RESET_ALL}")
            print(f"  {Fore.WHITE}Root Cause Label:{Style.RESET_ALL}     {classification['root_cause_label']}")
            print(f"  {Fore.WHITE}Confidence:{Style.RESET_ALL}           {Fore.GREEN}{classification['confidence']:.0%}{Style.RESET_ALL}")
            print(f"  {Fore.WHITE}Explanation:{Style.RESET_ALL}")
            print(f"    {classification['explanation']}")
            print(f"  {Fore.WHITE}Recommended Action:{Style.RESET_ALL}")
            print(f"    {Fore.GREEN}{classification['recommended_action']}{Style.RESET_ALL}")
            print(f"  {Fore.WHITE}Source:{Style.RESET_ALL}               {Fore.GREEN}gemini_api (live){Style.RESET_ALL}")

        except Exception as e:
            print(f"  {Fore.YELLOW}⚠  Gemini parse error: {e} — using fallback{Style.RESET_ALL}")
            classification = FALLBACK_CLASSIFICATIONS.get(scenario, FALLBACK_CLASSIFICATIONS["port_congestion"])
            _print_fallback_classification(classification)
    else:
        print(f"  {Fore.YELLOW}◎  Gemini not available — rule-based fallback{Style.RESET_ALL}")
        classification = FALLBACK_CLASSIFICATIONS.get(scenario, FALLBACK_CLASSIFICATIONS["port_congestion"])
        _print_fallback_classification(classification)

    return {**detect_data, "root_cause": classification}


def _print_fallback_classification(c: dict):
    print(f"\n  {Fore.WHITE}── Rule-Based Classification ──────────────────────{Style.RESET_ALL}")
    print(f"  {Fore.WHITE}Root Cause Category:{Style.RESET_ALL}  {Fore.YELLOW}{c['root_cause_category']}{Style.RESET_ALL}")
    print(f"  {Fore.WHITE}Root Cause Label:{Style.RESET_ALL}     {c['root_cause_label']}")
    print(f"  {Fore.WHITE}Confidence:{Style.RESET_ALL}           {Fore.YELLOW}{c['confidence']:.0%}{Style.RESET_ALL}")
    print(f"  {Fore.WHITE}Explanation:{Style.RESET_ALL}")
    print(f"    {c['explanation']}")
    print(f"  {Fore.WHITE}Recommended Action:{Style.RESET_ALL}")
    print(f"    {Fore.YELLOW}{c['recommended_action']}{Style.RESET_ALL}")
    print(f"  {Fore.WHITE}Source:{Style.RESET_ALL}               rule_based_fallback")


# ══════════════════════════════════════════════════════════════════
#  AGENT 7 — RouteAgent  (DROE — Dynamic Route Optimization Engine)
# ══════════════════════════════════════════════════════════════════

# Supply chain graph: node → [(neighbour, base_time_days, base_cost_usd)]
SUPPLY_CHAIN_GRAPH = {
    "SIN": [("PKL", 1, 1200), ("SHA", 3, 2100), ("COL", 2, 1600)],
    "PKL": [("SIN", 1, 1200), ("COL", 1, 900),  ("DXB", 6, 4200)],
    "SHA": [("SIN", 3, 2100), ("LAX", 14, 9800), ("RTM", 22, 14000)],
    "COL": [("PKL", 1, 900),  ("DXB", 5, 3800),  ("RTM", 18, 11500)],
    "DXB": [("PKL", 6, 4200), ("COL", 5, 3800),  ("RTM", 11, 7200), ("HAM", 13, 8500)],
    "LAX": [("SHA", 14, 9800),("RTM", 10, 7000)],
    "RTM": [("SHA", 22, 14000),("DXB", 11, 7200),("COL", 18, 11500),("HAM", 2, 1400)],
    "HAM": [("DXB", 13, 8500),("RTM", 2, 1400)],
}

NODE_NAMES = {
    "SIN": "Singapore PSA", "PKL": "Port Klang",
    "SHA": "Shanghai", "COL": "Colombo",
    "DXB": "Jebel Ali (Dubai)", "LAX": "Los Angeles",
    "RTM": "Rotterdam", "HAM": "Hamburg",
}

def dijkstra_risk_aware(graph: dict, start: str, end: str, risk_penalties: dict, lam: float = 1.0) -> tuple[list, float]:
    """Risk-aware Dijkstra: Effective Cost = Time + λ·DRI_penalty"""
    import heapq
    dist = {n: float("inf") for n in graph}
    dist[start] = 0
    prev = {}
    pq = [(0, start)]
    while pq:
        cost, u = heapq.heappop(pq)
        if cost > dist[u]:
            continue
        for v, t, _ in graph.get(u, []):
            risk = risk_penalties.get(v, 0.0)
            edge_cost = t + lam * risk
            if dist[u] + edge_cost < dist[v]:
                dist[v] = dist[u] + edge_cost
                prev[v] = u
                heapq.heappush(pq, (dist[v], v))
    path, cur = [], end
    while cur in prev:
        path.append(cur)
        cur = prev[cur]
    path.append(start)
    return list(reversed(path)), dist[end]

def run_route_agent(root_cause_data: dict) -> dict:
    print(f"\n{Fore.CYAN}{'─'*60}")
    print(f"{Fore.CYAN}  AGENT 7 — RouteAgent  [DROE — Risk-Aware Dijkstra]")
    print(f"{Fore.CYAN}{'─'*60}{Style.RESET_ALL}")

    dri = root_cause_data["dri"]
    scenario = root_cause_data["scenario"]

    # Risk penalties per node based on scenario
    if scenario == "port_congestion":
        # SIN is heavily penalised — forces reroute via PKL direct to COL
        risk_penalties = {"SIN": dri * 3.0, "SHA": dri * 2.0}
    elif scenario == "freight_surge":
        risk_penalties = {"SIN": dri * 1.5, "LAX": dri * 1.2}
    else:
        risk_penalties = {"SIN": dri * 0.5}

    lam = 1.2  # risk sensitivity — higher = more aggressive rerouting
    origin, destination = "SIN", "RTM"

    print(f"  {Fore.WHITE}Route optimisation:{Style.RESET_ALL}  {origin} ({NODE_NAMES[origin]}) → {destination} ({NODE_NAMES[destination]})")
    print(f"  {Fore.WHITE}λ (risk sensitivity):{Style.RESET_ALL} {lam}")
    print(f"\n  {Fore.WHITE}Risk penalties applied:{Style.RESET_ALL}")
    for node, penalty in risk_penalties.items():
        print(f"    Node:{node} ({NODE_NAMES.get(node,'?')})  DRI penalty = {penalty:.3f}")

    # Optimal path WITH risk penalties
    opt_path, opt_cost = dijkstra_risk_aware(SUPPLY_CHAIN_GRAPH, origin, destination, risk_penalties, lam)
    # Baseline path WITHOUT penalties (pure time)
    base_path, base_cost = dijkstra_risk_aware(SUPPLY_CHAIN_GRAPH, origin, destination, {}, lam=0)

    print(f"\n  {Fore.WHITE}── Dijkstra Results ──────────────────────────────{Style.RESET_ALL}")
    print(f"  {Fore.WHITE}Baseline path:{Style.RESET_ALL}  {' → '.join(base_path)}  (cost: {base_cost:.2f})")
    print(f"  {Fore.WHITE}Optimal path:{Style.RESET_ALL}   {Fore.GREEN}{' → '.join(opt_path)}{Style.RESET_ALL}  (cost: {opt_cost:.2f})")

    rerouted = opt_path != base_path
    saving_usd = round(dri * 45000, 0)
    if rerouted:
        print(f"\n  {Fore.GREEN}✓  REROUTE RECOMMENDED{Style.RESET_ALL}")
        print(f"  {Fore.GREEN}   Original route bypassed — disruption risk avoided{Style.RESET_ALL}")
        print(f"  {Fore.GREEN}   Estimated SLA penalty prevented: ${saving_usd:,.0f}{Style.RESET_ALL}")
    else:
        print(f"\n  {Fore.YELLOW}  Baseline route remains optimal under current DRI{Style.RESET_ALL}")
        print(f"  {Fore.YELLOW}  Proactive monitoring active — early detection value: ${saving_usd:,.0f}{Style.RESET_ALL}")

    route_path_named = [f"{n} ({NODE_NAMES.get(n, n)})" for n in opt_path]

    return {
        **root_cause_data,
        "route_optimization": {
            "origin": origin,
            "destination": destination,
            "baseline_path": base_path,
            "optimal_path": opt_path,
            "optimal_path_named": route_path_named,
            "rerouted": rerouted,
            "risk_penalties": risk_penalties,
            "lambda": lam,
            "estimated_saving_usd": saving_usd,
        },
    }


# ══════════════════════════════════════════════════════════════════
#  AGENT 8 — ExecuteAgent  (Confidence-Gated)
# ══════════════════════════════════════════════════════════════════

CONFIDENCE_AUTO_EXECUTE = 0.85

def run_execute_agent(route_data: dict) -> dict:
    print(f"\n{Fore.CYAN}{'─'*60}")
    print(f"{Fore.CYAN}  AGENT 8 — ExecuteAgent  [Confidence-Gated Autonomy]")
    print(f"{Fore.CYAN}{'─'*60}{Style.RESET_ALL}")

    dri = route_data["dri"]
    rc_confidence = route_data["root_cause"]["confidence"]

    # Composite confidence: root cause certainty × DRI severity × breach streak proxy
    composite_confidence = round(
        (rc_confidence * 0.55) + (min(dri / 0.72, 1.0) * 0.30) + (0.15 if dri > 0.72 else 0.05),
        4,
    )

    print(f"  {Fore.WHITE}Confidence calculation:{Style.RESET_ALL}")
    print(f"    Root cause confidence × 0.55  =  {rc_confidence:.2f} × 0.55 = {rc_confidence*0.55:.4f}")
    print(f"    DRI severity × 0.30           =  {min(dri/0.72,1.0):.2f} × 0.30 = {min(dri/0.72,1.0)*0.30:.4f}")
    print(f"    Breach bonus × 0.15           =  {'0.15 (breach active)' if dri > 0.72 else '0.05 (no breach)'}")
    print(f"    {'─'*44}")
    print(f"    {Fore.WHITE}Composite confidence:{Style.RESET_ALL}  {Fore.YELLOW}{composite_confidence:.4f}{Style.RESET_ALL}")

    if composite_confidence >= CONFIDENCE_AUTO_EXECUTE:
        mode = "AUTO_EXECUTE"
        mode_color = Fore.GREEN
        mode_label = "AUTO EXECUTING"
        rationale = f"Confidence {composite_confidence:.0%} ≥ threshold {CONFIDENCE_AUTO_EXECUTE:.0%} — autonomous execution authorised"
    elif composite_confidence >= 0.60:
        mode = "PENDING_APPROVAL"
        mode_color = Fore.YELLOW
        mode_label = "PENDING APPROVAL"
        rationale = f"Confidence {composite_confidence:.0%} — action recommended, awaiting operator confirmation"
    else:
        mode = "ESCALATED"
        mode_color = Fore.RED
        mode_label = "ESCALATED TO HUMAN"
        rationale = f"Confidence {composite_confidence:.0%} < 0.60 — insufficient certainty, escalating to VP Supply Chain"

    action = route_data["root_cause"]["recommended_action"]
    saving = route_data["route_optimization"]["estimated_saving_usd"]

    print(f"\n  {mode_color}{'█'*50}{Style.RESET_ALL}")
    print(f"  {mode_color}  EXECUTION MODE: {mode_label}{Style.RESET_ALL}")
    print(f"  {mode_color}{'█'*50}{Style.RESET_ALL}")
    print(f"\n  {Fore.WHITE}Action:{Style.RESET_ALL}    {action}")
    print(f"  {Fore.WHITE}Rationale:{Style.RESET_ALL} {rationale}")
    if saving > 0:
        print(f"  {Fore.WHITE}Value:{Style.RESET_ALL}     Estimated ${saving:,.0f} in SLA penalties prevented")

    return {
        **route_data,
        "execution": {
            "mode": mode,
            "mode_label": mode_label,
            "composite_confidence": composite_confidence,
            "action": action,
            "rationale": rationale,
            "estimated_value_usd": saving,
            "executed_at": datetime.now(timezone.utc).isoformat(),
        },
    }


# ══════════════════════════════════════════════════════════════════
#  AGENT 9 — AuditAgent  (SHA-256 tamper-evident log)
# ══════════════════════════════════════════════════════════════════

def run_audit_agent(execute_data: dict) -> dict:
    print(f"\n{Fore.CYAN}{'─'*60}")
    print(f"{Fore.CYAN}  AGENT 9 — AuditAgent  [SHA-256 Tamper-Evident Log]")
    print(f"{Fore.CYAN}{'─'*60}{Style.RESET_ALL}")

    ts = datetime.now(timezone.utc).isoformat()
    action = execute_data["execution"]["action"]
    dri = execute_data["dri"]
    mode = execute_data["execution"]["mode"]
    confidence = execute_data["execution"]["composite_confidence"]

    # SHA-256 hash of (timestamp + action + dri) — tamper evidence
    hash_input = f"{ts}|{action}|{dri:.4f}|{mode}"
    entry_hash = hashlib.sha256(hash_input.encode()).hexdigest()
    entry_id = f"0x{entry_hash[:8].upper()}"

    log_entry = {
        "entry_id": entry_id,
        "full_hash": entry_hash,
        "timestamp_utc": ts,
        "scenario": execute_data["scenario_name"],
        "disruption_type": execute_data["detection"]["disruption_type"],
        "dri_score": dri,
        "root_cause": execute_data["root_cause"]["root_cause_category"],
        "action": action,
        "execution_mode": mode,
        "confidence": confidence,
        "estimated_value_usd": execute_data["execution"]["estimated_value_usd"],
        "gemini_source": execute_data["root_cause"]["source"],
    }

    AUDIT_LOG.append(log_entry)

    print(f"  {Fore.WHITE}Entry ID:{Style.RESET_ALL}    {Fore.CYAN}{entry_id}{Style.RESET_ALL}")
    print(f"  {Fore.WHITE}Full hash:{Style.RESET_ALL}   {entry_hash}")
    print(f"  {Fore.WHITE}Hash input:{Style.RESET_ALL}  {hash_input}")
    print(f"  {Fore.WHITE}Timestamp:{Style.RESET_ALL}   {ts}")
    print(f"  {Fore.WHITE}DRI logged:{Style.RESET_ALL}  {dri:.4f}")
    print(f"  {Fore.WHITE}Action:{Style.RESET_ALL}      {action}")
    print(f"  {Fore.WHITE}Mode:{Style.RESET_ALL}        {mode}")
    print(f"  {Fore.GREEN}✓  Entry written to tamper-evident audit log  ({len(AUDIT_LOG)} total entries){Style.RESET_ALL}")

    return {**execute_data, "audit": log_entry}


# ══════════════════════════════════════════════════════════════════
#  FULL PIPELINE RUNNER
# ══════════════════════════════════════════════════════════════════

def run_full_pipeline(scenario_key: str) -> dict:
    print(f"\n{Fore.MAGENTA}{'═'*60}")
    print(f"{Fore.MAGENTA}  CHRONYX — Narrative-Driven Supply Chain Intelligence")
    print(f"{Fore.MAGENTA}  Team Ethreal · Google Solution Challenge 2026")
    print(f"{Fore.MAGENTA}  Running full 9-agent pipeline for: {scenario_key.upper()}")
    print(f"{Fore.MAGENTA}{'═'*60}{Style.RESET_ALL}")

    t0 = time.time()

    data = run_ingest_agent(scenario_key)
    data = run_signal_agent(data)
    data = run_dri_engine(data)
    data = run_forecast_agent(data)
    data = run_detect_agent(data)
    data = run_root_cause_agent(data)
    data = run_route_agent(data)
    data = run_execute_agent(data)
    data = run_audit_agent(data)

    elapsed = round(time.time() - t0, 2)

    print(f"\n{Fore.MAGENTA}{'═'*60}")
    print(f"{Fore.MAGENTA}  PIPELINE COMPLETE  ({elapsed}s)")
    print(f"{Fore.MAGENTA}{'═'*60}{Style.RESET_ALL}")

    print(f"\n{Fore.WHITE}  SUMMARY{Style.RESET_ALL}")
    print(f"  {'─'*40}")
    print(f"  Scenario:      {data['scenario_name']}")
    print(f"  DRI Score:     {data['dri']:.4f}  ({data['dri_zone']})")
    print(f"  Root Cause:    {data['root_cause']['root_cause_category']}  ({data['root_cause']['confidence']:.0%} confidence)")
    print(f"  Gemini Source: {data['root_cause']['source']}")
    print(f"  Route:         {' → '.join(data['route_optimization']['optimal_path'])}")
    print(f"  Rerouted:      {'YES' if data['route_optimization']['rerouted'] else 'NO'}")
    print(f"  Execution:     {data['execution']['mode_label']}")
    print(f"  Value:         ${data['execution']['estimated_value_usd']:,.0f} SLA penalties prevented")
    print(f"  Audit Entry:   {data['audit']['entry_id']}")
    print(f"  {'─'*40}")

    return data


# ══════════════════════════════════════════════════════════════════
#  FASTAPI ENDPOINTS
# ══════════════════════════════════════════════════════════════════

class AnalyseRequest(BaseModel):
    scenario: str = "port_congestion"

@app.post("/analyse")
async def analyse(req: AnalyseRequest):
    """Run full Chronyx pipeline for a scenario."""
    valid = list(SCENARIOS.keys())
    if req.scenario not in valid:
        return {"error": f"Invalid scenario. Choose from: {valid}"}
    result = run_full_pipeline(req.scenario)
    # return clean JSON subset
    return {
        "scenario": result["scenario_name"],
        "dri": result["dri"],
        "dri_zone": result["dri_zone"],
        "root_cause": result["root_cause"],
        "forecast": result["forecast"],
        "detection": result["detection"],
        "route_optimization": result["route_optimization"],
        "execution": result["execution"],
        "audit": result["audit"],
    }

@app.get("/dri/{scenario}")
async def get_dri(scenario: str):
    """Quick DRI score for a scenario."""
    if scenario not in SCENARIOS:
        return {"error": "Unknown scenario"}
    c = SCENARIOS[scenario]
    dri = round(0.35*c["sv"] + 0.25*c["df"] + 0.25*c["rs"] + 0.15*c["ss"], 4)
    return {"scenario": scenario, "dri": dri,
            "zone": "ACTION" if dri >= 0.72 else "MONITORING" if dri >= 0.50 else "NORMAL"}

@app.get("/audit-log")
async def get_audit_log():
    """Return tamper-evident audit log."""
    return {"total_entries": len(AUDIT_LOG), "entries": AUDIT_LOG}

@app.get("/health")
async def health():
    return {
        "status": "online",
        "gemini": "connected" if GEMINI_AVAILABLE else "fallback",
        "agents": 9,
        "audit_entries": len(AUDIT_LOG),
    }

@app.get("/")
async def root():
    return {
        "system": "Chronyx Supply Chain Intelligence",
        "team": "Ethreal",
        "version": "1.0.0",
        "endpoints": ["/analyse", "/dri/{scenario}", "/audit-log", "/health"],
        "scenarios": list(SCENARIOS.keys()),
    }