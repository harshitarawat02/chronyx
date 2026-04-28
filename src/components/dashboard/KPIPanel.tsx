import { IndianRupee, Package, Activity, ShieldCheck, TrendingUp, TrendingDown } from "lucide-react";

const kpis = [
  { icon: IndianRupee, label: "Total Cost Prevented", value: "₹4.82 Cr", sub: "this quarter", trend: 18.4, color: "primary" },
  { icon: Package, label: "Shipments Protected", value: "2,847", sub: "of 3,104 at-risk", trend: 12.1, color: "accent" },
  { icon: Activity, label: "Avg DRI at Intervention", value: "0.71", sub: "vs 0.84 baseline", trend: -15.5, color: "success" },
  { icon: ShieldCheck, label: "SLA Breaches Avoided", value: "138", sub: "94.2% prevention rate", trend: 8.7, color: "warning" },
];

export function KPIPanel() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-slide-up">
      {kpis.map((k, i) => {
        const positive = k.label.includes("DRI") ? k.trend < 0 : k.trend > 0;
        return (
          <div key={i} className="glass glass-hover rounded-xl p-4 relative overflow-hidden">
            <div className={`absolute -top-8 -right-8 h-24 w-24 rounded-full bg-${k.color}/10 blur-2xl`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className={`h-8 w-8 rounded-lg bg-${k.color}/10 border border-${k.color}/20 grid place-items-center text-${k.color}`}>
                  <k.icon className="h-4 w-4" />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded ${positive ? "text-success bg-success/10" : "text-destructive bg-destructive/10"}`}>
                  {positive ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                  {Math.abs(k.trend).toFixed(1)}%
                </div>
              </div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-1">{k.label}</div>
              <div className="font-mono text-2xl font-bold tabular-nums">{k.value}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{k.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
