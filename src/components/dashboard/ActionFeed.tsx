import { Ship, Truck, Plane, Warehouse, Zap, Clock, AlertOctagon, ChevronRight } from "lucide-react";

const actions = [
  {
    icon: Ship,
    title: "Reroute shipment via Port Klang",
    detail: "Container MSKU-7831204 · 2,400 TEU · Singapore → Rotterdam",
    confidence: 92,
    status: "executing",
    eta: "Auto-exec in 4m",
  },
  {
    icon: Plane,
    title: "Switch tier-1 SKUs to air freight",
    detail: "47 SKUs · supplier Foxconn-SZ · ETA recovery 6 days",
    confidence: 87,
    status: "pending",
    eta: "Awaiting Ops Lead",
  },
  {
    icon: Warehouse,
    title: "Pre-position inventory at DC-Hamburg",
    detail: "+18,200 units · buffer against Hamburg port slowdown",
    confidence: 81,
    status: "executing",
    eta: "Auto-exec in 11m",
  },
  {
    icon: Truck,
    title: "Swap carrier on lane LA → Chicago",
    detail: "Replace Carrier-B with Carrier-D · SLA risk 0.41 → 0.12",
    confidence: 76,
    status: "pending",
    eta: "Awaiting Ops Lead",
  },
  {
    icon: AlertOctagon,
    title: "Halt PO #88241 to supplier Yangtze-04",
    detail: "Force majeure indicators · supplier viability at 0.31",
    confidence: 68,
    status: "escalated",
    eta: "Escalated to VP Supply",
  },
];

const statusMap = {
  executing: { label: "Auto Executing", color: "success", icon: Zap },
  pending: { label: "Pending Approval", color: "warning", icon: Clock },
  escalated: { label: "Escalated", color: "destructive", icon: AlertOctagon },
} as const;

export function ActionFeed() {
  return (
    <div className="glass rounded-2xl p-5 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold tracking-tight">Autonomous Intervention Engine</h2>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">LIVE</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-secondary/60 text-muted-foreground border border-border">Confidence-Gated Execution</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">Agent-driven decisions ranked by impact · auto-exec ≥ 90% · approval 70–89% · escalate &lt; 70%</p>
        </div>
        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          View all <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      <div className="space-y-2">
        {actions.map((a, i) => {
          const s = statusMap[a.status as keyof typeof statusMap];
          const Si = s.icon;
          return (
            <div key={i} className="group glass-hover rounded-xl border border-border/60 bg-secondary/20 p-3.5 flex items-start gap-3">
              <div className={`h-9 w-9 shrink-0 rounded-lg bg-${s.color}/10 border border-${s.color}/20 grid place-items-center text-${s.color}`}>
                <a.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-medium leading-snug">{a.title}</h3>
                  <div className={`shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-${s.color}/10 border border-${s.color}/30 text-${s.color} text-[10px] font-medium uppercase tracking-wider`}>
                    <Si className="h-2.5 w-2.5" />
                    {s.label}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">{a.detail}</p>
                <div className="flex items-center justify-between mt-2.5 gap-3">
                  <div className="flex-1 flex items-center gap-2">
                    <div className="h-1 flex-1 max-w-[140px] rounded-full bg-secondary overflow-hidden">
                      <div className={`h-full bg-${s.color} rounded-full transition-all`} style={{ width: `${a.confidence}%` }} />
                    </div>
                    <span className="font-mono text-xs font-semibold tabular-nums">{a.confidence}%</span>
                    <span className="text-[10px] text-muted-foreground">confidence</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">{a.eta}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
