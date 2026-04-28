import { AppShell } from "@/components/AppShell";
import { GeminiPanel } from "@/components/dashboard/GeminiPanel";
import { Anchor, AlertTriangle, CloudRain, Ship, Clock, TrendingUp } from "lucide-react";

const Disruption = () => {
  return (
    <AppShell title="Disruption · DSR-2026-0428-014" subtitle="Singapore PSA · port congestion · severity 0.87">
      <div className="max-w-[1600px] mx-auto space-y-4">
        <div className="glass rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 to-transparent pointer-events-none" />
          <div className="relative grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-destructive/15 border border-destructive/30 text-destructive text-[10px] font-semibold uppercase tracking-wider">CRITICAL</span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Active · 4h 12m</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">APAC port congestion cascade</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Vessel bunching at Singapore PSA following Typhoon Koinu has elevated dwell times across 14 downstream lanes. Risk propagation modeled across Rotterdam, Hamburg, Jebel Ali corridors.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {["Singapore PSA", "Rotterdam", "Hamburg", "+11 lanes"].map((t) => (
                  <span key={t} className="px-2 py-1 text-[11px] rounded-md bg-secondary/50 border border-border text-muted-foreground">{t}</span>
                ))}
              </div>
            </div>

            {[
              { l: "Severity", v: "0.87", c: "destructive", icon: AlertTriangle },
              { l: "Affected lanes", v: "14", c: "warning", icon: Ship },
              { l: "ETA Recovery", v: "5d 14h", c: "primary", icon: Clock },
            ].map((m) => (
              <div key={m.l} className="rounded-xl border border-border bg-secondary/30 p-4">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                  <m.icon className={`h-3.5 w-3.5 text-${m.c}`} /> {m.l}
                </div>
                <div className={`font-mono text-3xl font-bold tabular-nums text-${m.c}`}>{m.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold mb-4">Signal Timeline</h3>
            <div className="space-y-3">
              {[
                { t: "−4h 12m", e: "NOAA — Typhoon Koinu category 3 advisory", icon: CloudRain, c: "warning" },
                { t: "−3h 41m", e: "AIS data shows vessel queue grew to 38 (baseline 14)", icon: Anchor, c: "warning" },
                { t: "−2h 18m", e: "MPA Singapore — labor shift advisory issued", icon: AlertTriangle, c: "destructive" },
                { t: "−1h 44m", e: "Spot freight rates SG→RTM up 14% (Drewry)", icon: TrendingUp, c: "destructive" },
                { t: "−0h 22m", e: "Chronyx auto-dispatch — 12 mitigations queued", icon: Ship, c: "primary" },
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-border/40 last:border-0">
                  <div className={`h-8 w-8 rounded-lg bg-${s.c}/10 border border-${s.c}/20 grid place-items-center text-${s.c} shrink-0`}>
                    <s.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">{s.e}</div>
                    <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{s.t}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <GeminiPanel />
        </div>
      </div>
    </AppShell>
  );
};

export default Disruption;
