import { Sparkles, CloudRain, Anchor, AlertTriangle, TrendingUp, ArrowRight } from "lucide-react";

export function GeminiPanel() {
  return (
    <div className="glass rounded-2xl p-5 animate-slide-up relative overflow-hidden border-primary/30 ring-1 ring-primary/20 shadow-[0_0_40px_-12px_hsl(var(--primary)/0.4)]">
      <div className="absolute -top-20 -right-20 h-64 w-64 bg-gradient-to-br from-primary/20 to-accent/10 blur-3xl rounded-full pointer-events-none" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center animate-glow">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight">AI Root Cause Analysis</h2>
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Powered by Gemini</p>
            </div>
          </div>
          <span className="font-mono text-[10px] px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
            v2.4 · streaming
          </span>
        </div>

        {/* Root cause */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="rounded-lg border border-border bg-secondary/30 p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Root Cause Category</div>
            <div className="flex items-center gap-2">
              <Anchor className="h-4 w-4 text-warning" />
              <span className="text-sm font-semibold">Port Congestion</span>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-secondary/30 p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Confidence</div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold text-primary tabular-nums">89%</span>
              <div className="flex-1 h-1 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: "89%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3.5 mb-3 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-accent" />
          <p className="text-sm leading-relaxed text-foreground/90 pl-2">
            Berth utilization at <span className="text-primary font-medium">Singapore PSA</span> reached 94% due to typhoon-induced vessel bunching. AIS signals show 38 queued vessels (2.7× baseline), with projected dwell times exceeding <span className="text-warning font-medium">72 hours</span>.
          </p>
          <p className="text-[10px] text-muted-foreground mt-2 pl-2 font-mono">
            Narrative signals fused: Weather alerts · Port advisories · AIS congestion data
          </p>
        </div>

        {/* Signals */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {[
            { icon: CloudRain, l: "Typhoon Koinu (NOAA)" },
            { icon: Anchor, l: "AIS vessel queue +172%" },
            { icon: AlertTriangle, l: "MPA labor advisory" },
            { icon: TrendingUp, l: "Spot rates +14%" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary/50 border border-border text-[10px] text-muted-foreground">
              <s.icon className="h-3 w-3" />
              {s.l}
            </div>
          ))}
        </div>

        {/* Suggested action */}
        <div className="rounded-lg border border-success/30 bg-success/5 p-3 flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-success/15 grid place-items-center text-success shrink-0">
            <ArrowRight className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-success font-semibold">Suggested Action</div>
            <div className="text-sm font-medium truncate">Reroute APAC→EU via Port Klang transshipment · ETA preserved</div>
          </div>
          <button className="text-xs font-medium px-3 py-1.5 rounded-md bg-success text-success-foreground hover:opacity-90 transition-opacity shrink-0">
            Execute
          </button>
        </div>
      </div>
    </div>
  );
}
