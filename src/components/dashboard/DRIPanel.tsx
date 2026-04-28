import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Activity, AlertTriangle, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const DRI_SEQUENCE = [0.72, 0.74, 0.76, 0.78, 0.79, 0.80, 0.78, 0.76, 0.75, 0.77, 0.79];
const THRESHOLD = 0.72;

interface MetricDetail {
  title: string;
  body: React.ReactNode;
}

export function DRIPanel() {
  const [idx, setIdx] = useState(4);
  const [confPct, setConfPct] = useState(89);
  const [updatedAgo, setUpdatedAgo] = useState(0);
  const [breachFlash, setBreachFlash] = useState(false);
  const [showCritical, setShowCritical] = useState(false);
  const [detail, setDetail] = useState<MetricDetail | null>(null);

  const dri = DRI_SEQUENCE[idx];
  const trend = dri - DRI_SEQUENCE[(idx + DRI_SEQUENCE.length - 1) % DRI_SEQUENCE.length];

  // Live simulation
  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => {
        const next = (i + 1) % DRI_SEQUENCE.length;
        if (DRI_SEQUENCE[next] >= THRESHOLD && DRI_SEQUENCE[i] < THRESHOLD) {
          setBreachFlash(true);
          setTimeout(() => setBreachFlash(false), 1600);
        }
        return next;
      });
      setConfPct((c) => Math.max(82, Math.min(95, c + Math.round((Math.random() - 0.5) * 4))));
      setUpdatedAgo(0);
    }, 4000);
    const t2 = setInterval(() => setUpdatedAgo((s) => s + 1), 1000);
    return () => { clearInterval(t); clearInterval(t2); };
  }, []);

  const status = dri >= 0.75 ? "critical" : dri >= 0.5 ? "monitoring" : "stable";
  const conf = {
    critical: { label: "Critical Risk", color: "destructive", glow: "from-destructive/30" },
    monitoring: { label: "Monitoring", color: "warning", glow: "from-warning/30" },
    stable: { label: "Stable", color: "success", glow: "from-success/30" },
  }[status];

  const radius = 110;
  const circ = Math.PI * radius;
  const dash = dri * circ;

  // DRI subcomponents
  const components = [
    { k: "Sv", label: "Signal Volatility", value: 82, weight: 0.35 },
    { k: "Df", label: "Disruption Frequency", value: 71, weight: 0.25 },
    { k: "Rs", label: "Route Stress", value: 88, weight: 0.25 },
    { k: "Ss", label: "Supplier Sentiment", value: 64, weight: 0.15 },
  ];

  const metricDetails: Record<string, MetricDetail> = {
    lanes: {
      title: "Active Lanes Under Risk",
      body: (
        <ul className="space-y-1.5 text-xs">
          {[
            ["SIN → RTM", "DRI 0.81", "destructive"],
            ["SHA → LA", "DRI 0.76", "warning"],
            ["DXB → HAM", "DRI 0.74", "warning"],
            ["LA → ORD", "DRI 0.69", "warning"],
          ].map(([l, d, c]) => (
            <li key={l} className="flex justify-between font-mono">
              <span>{l}</span>
              <span className={`text-${c}`}>{d}</span>
            </li>
          ))}
        </ul>
      ),
    },
    signals: {
      title: "Live Signal Stream",
      body: (
        <ul className="space-y-1.5 text-xs">
          <li>⚓ Port strike advisory · MPA Singapore</li>
          <li>🌀 Typhoon Koinu intensifying — NOAA</li>
          <li>📈 Spot freight rates +14% (24h)</li>
          <li>🚢 AIS queue +172% Singapore PSA</li>
        </ul>
      ),
    },
    models: {
      title: "Models Live",
      body: (
        <ul className="space-y-1.5 text-xs">
          <li>✓ Gemini RootCauseAgent — active</li>
          <li>✓ DROE Optimizer — active</li>
          <li>✓ Signal Fusion v2.4 — streaming</li>
          <li>✓ Confidence Calibrator — nominal</li>
        </ul>
      ),
    },
    confidence: {
      title: "Confidence Bands",
      body: (
        <ul className="space-y-1.5 text-xs">
          <li><span className="text-success font-mono">≥ 85%</span> → Auto-execute</li>
          <li><span className="text-warning font-mono">70–84%</span> → Ops approval</li>
          <li><span className="text-destructive font-mono">&lt; 70%</span> → Escalation</li>
          <li className="pt-1 border-t border-border/50 mt-2">Current: <span className="font-mono text-primary">{confPct}%</span></li>
        </ul>
      ),
    },
  };

  const metrics = [
    { l: "Active Lanes", v: "1,284", k: "lanes" },
    { l: "Signals / min", v: "12,847", k: "signals" },
    { l: "Models live", v: "07", k: "models" },
    { l: "Confidence", v: `${confPct}%`, k: "confidence" },
  ];

  return (
    <div className="glass rounded-2xl p-6 relative overflow-hidden animate-slide-up">
      <div className={`absolute inset-0 bg-gradient-to-br ${conf.glow} to-transparent opacity-40 pointer-events-none`} />

      {/* Threshold breach flash */}
      {breachFlash && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 animate-flash">
          <div className="px-4 py-2 rounded-lg bg-destructive/20 border border-destructive text-destructive font-semibold text-sm flex items-center gap-2 backdrop-blur-md shadow-[0_0_24px_-4px_hsl(var(--destructive)/0.6)]">
            <AlertTriangle className="h-4 w-4" />
            Threshold Breach Detected
          </div>
        </div>
      )}

      <div className="relative grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-8 items-center">
        {/* Gauge — clickable */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="relative w-[260px] h-[150px] mx-auto group cursor-pointer transition-transform hover:scale-[1.02]" title="Click to view DRI breakdown">
              <svg viewBox="0 0 260 150" className="w-full h-full">
                <defs>
                  <linearGradient id="dri-grad" x1="0" x2="1">
                    <stop offset="0%" stopColor="hsl(var(--success))" />
                    <stop offset="50%" stopColor="hsl(var(--warning))" />
                    <stop offset="100%" stopColor="hsl(var(--destructive))" />
                  </linearGradient>
                </defs>
                <path d="M 20 130 A 110 110 0 0 1 240 130" fill="none" stroke="hsl(var(--border))" strokeWidth="14" strokeLinecap="round" />
                <path d="M 20 130 A 110 110 0 0 1 240 130" fill="none" stroke="url(#dri-grad)" strokeWidth="14" strokeLinecap="round"
                  strokeDasharray={`${dash} ${circ}`} className="animate-glow transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                <div className="font-mono text-5xl font-bold tracking-tight tabular-nums transition-all">{dri.toFixed(2)}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">Disruption Risk Index</div>
              </div>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">Click for breakdown</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 glass border-primary/30">
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold">DRI Composition</h3>
                <p className="font-mono text-[10px] text-muted-foreground mt-0.5">DRI = 0.35·Sv + 0.25·Df + 0.25·Rs + 0.15·Ss</p>
              </div>
              <div className="space-y-2.5">
                {components.map((c) => (
                  <div key={c.k}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span><span className="font-mono text-primary mr-1.5">{c.k}</span>{c.label}</span>
                      <span className="font-mono tabular-nums">{c.value}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${c.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-border text-[10px] text-muted-foreground font-mono">
                Weighted DRI → <span className="text-foreground">{dri.toFixed(2)}</span>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Status */}
        <div className="space-y-3 lg:border-l lg:border-border lg:pl-8">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full bg-${conf.color} animate-pulse-soft`} style={{ boxShadow: `0 0 12px hsl(var(--${conf.color}))` }} />
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Network Status</span>
          </div>
          <button
            onClick={() => setShowCritical((v) => !v)}
            className={`text-2xl font-bold text-${conf.color} hover:underline underline-offset-4 cursor-pointer text-left transition-all`}
            title="Click to view trigger reason"
          >
            {conf.label}
          </button>
          {showCritical ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 space-y-2 relative animate-fade-in">
              <button onClick={() => setShowCritical(false)} className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
              <div className="text-[10px] uppercase tracking-wider text-destructive font-semibold">Trigger Reason</div>
              <p className="text-xs text-foreground/90 leading-relaxed">
                Threshold exceeded due to spike in <span className="text-destructive font-medium">Route Stress</span> and <span className="text-destructive font-medium">Signal Volatility</span> on APAC ↔ EU corridors.
              </p>
              <div className="pt-1">
                <div className="text-[10px] text-muted-foreground mb-1">24h DRI timeline</div>
                <svg viewBox="0 0 200 36" className="w-full h-9">
                  <polyline
                    fill="none"
                    stroke="hsl(var(--destructive))"
                    strokeWidth="1.5"
                    points={DRI_SEQUENCE.map((v, i) => `${(i / (DRI_SEQUENCE.length - 1)) * 200},${36 - (v - 0.6) * 120}`).join(" ")}
                  />
                  <line x1="0" y1={36 - (THRESHOLD - 0.6) * 120} x2="200" y2={36 - (THRESHOLD - 0.6) * 120} stroke="hsl(var(--warning))" strokeWidth="0.5" strokeDasharray="2 2" />
                </svg>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Elevated risk detected across <span className="text-foreground font-medium">APAC ↔ EU</span> corridors. 47 lanes under active surveillance, 12 mitigations in flight.
            </p>
          )}

          <Popover>
            <PopoverTrigger asChild>
              <button className="font-mono text-[11px] px-2.5 py-1.5 rounded-md bg-destructive/10 border border-destructive/30 text-destructive inline-flex items-center gap-2 w-fit hover:bg-destructive/20 hover:shadow-[0_0_16px_-2px_hsl(var(--destructive)/0.5)] transition-all cursor-pointer">
                <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse-soft" />
                Threshold: 0.72 │ Current: {dri.toFixed(2)} → <span className="font-semibold">Action Triggered</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 glass border-destructive/30">
              <div className="space-y-2">
                <div className="text-[10px] uppercase tracking-wider text-destructive font-semibold">Autonomous Trigger</div>
                <p className="text-sm leading-relaxed">DRI crossed threshold (0.72) → <span className="font-semibold text-destructive">Autonomous decision triggered</span></p>
                <p className="text-[11px] text-muted-foreground">DROE re-planned 4 lanes · Intervention Engine queued 5 actions</p>
              </div>
            </PopoverContent>
          </Popover>

          <div className="flex items-center gap-2 pt-1">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-md bg-${trend > 0 ? "destructive" : "success"}/10 text-${trend > 0 ? "destructive" : "success"} text-xs font-mono font-medium`}>
              {trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {trend > 0 ? "+" : ""}{trend.toFixed(2)} 24h
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Activity className="h-3 w-3 animate-pulse-soft text-primary" /> {updatedAgo < 2 ? "Updated just now" : `updated ${updatedAgo}s ago`}
            </div>
          </div>
        </div>

        {/* Mini metrics — clickable */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:border-l lg:border-border lg:pl-8 lg:min-w-[200px]">
          {metrics.map((m) => (
            <Popover key={m.k}>
              <PopoverTrigger asChild>
                <button
                  onMouseEnter={() => setDetail(metricDetails[m.k])}
                  className="px-3 py-2 rounded-lg bg-secondary/40 border border-border text-left hover-lift hover:border-primary/40 cursor-pointer"
                  title="Click to view details"
                >
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.l}</div>
                  <div className="font-mono text-sm font-semibold tabular-nums">{m.v}</div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 glass border-primary/30">
                <div className="space-y-2">
                  <div className="text-xs font-semibold">{metricDetails[m.k].title}</div>
                  <div className="text-foreground/90">{metricDetails[m.k].body}</div>
                </div>
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </div>
    </div>
  );
}
