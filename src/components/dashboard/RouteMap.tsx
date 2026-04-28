import { useEffect, useState } from "react";
import { Anchor } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Node { id: string; x: number; y: number; label: string; type: "port" | "warehouse" | "hub"; dri: number; delay: string; }

const nodes: Node[] = [
  { id: "SIN", x: 70, y: 55, label: "Singapore PSA", type: "port", dri: 0.81, delay: "+72h" },
  { id: "PKG", x: 58, y: 50, label: "Port Klang", type: "port", dri: 0.41, delay: "+4h" },
  { id: "DXB", x: 45, y: 45, label: "Jebel Ali", type: "hub", dri: 0.52, delay: "+8h" },
  { id: "RTM", x: 22, y: 28, label: "Rotterdam", type: "port", dri: 0.48, delay: "+6h" },
  { id: "HAM", x: 28, y: 22, label: "Hamburg DC", type: "warehouse", dri: 0.39, delay: "0h" },
  { id: "SHA", x: 78, y: 38, label: "Shanghai", type: "port", dri: 0.66, delay: "+18h" },
  { id: "LA",  x: 12, y: 55, label: "Los Angeles", type: "port", dri: 0.58, delay: "+12h" },
];

const edges = [
  { f: "SIN", t: "DXB", s: "critical", old: true },
  { f: "DXB", t: "RTM", s: "elevated" },
  { f: "SHA", t: "SIN", s: "elevated" },
  { f: "SIN", t: "PKG", s: "safe", neo: true },
  { f: "PKG", t: "DXB", s: "safe", neo: true },
  { f: "RTM", t: "HAM", s: "safe" },
  { f: "LA",  t: "SHA", s: "elevated" },
];

const colorOf = (s: string) =>
  s === "critical" ? "hsl(var(--destructive))" :
  s === "elevated" ? "hsl(var(--warning))" :
  "hsl(var(--success))";

const findNode = (id: string) => nodes.find((n) => n.id === id)!;

export function RouteMap() {
  const [highlightOld, setHighlightOld] = useState(false);

  // Auto-pulse the rerouted highlight every ~12s for demo storytelling
  useEffect(() => {
    const t = setInterval(() => {
      setHighlightOld(true);
      setTimeout(() => setHighlightOld(false), 1800);
    }, 12000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="glass rounded-2xl p-5 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold tracking-tight">Dynamic Route Optimization Engine</h2>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">DROE</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-success/10 text-success border border-success/30 animate-pulse-soft">Reroute Applied</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 font-mono">Optimization Objective: <span className="text-foreground">Min(Time + λ × DRI)</span></p>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          {[
            { c: "success", l: "Safe" },
            { c: "warning", l: "Elevated" },
            { c: "destructive", l: "Critical" },
          ].map((x) => (
            <div key={x.l} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full bg-${x.c}`} />
              <span className="text-muted-foreground uppercase tracking-wider">{x.l}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative aspect-[2.2/1] rounded-xl border border-border bg-secondary/20 overflow-hidden grid-bg">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 30% 40%, hsl(var(--primary)/0.08), transparent 60%)" }} />

        <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          <defs>
            {edges.map((e, i) => (
              <marker key={i} id={`arr-${i}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                <path d="M0,0 L10,5 L0,10 z" fill={colorOf(e.s)} />
              </marker>
            ))}
          </defs>
          {edges.map((e, i) => {
            const a = findNode(e.f); const b = findNode(e.t);
            const isOld = !!e.old;
            const isNeo = !!e.neo;
            return (
              <line
                key={i}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={colorOf(e.s)}
                strokeWidth={isNeo ? 0.7 : 0.4}
                strokeDasharray={isOld ? "1.2 1.2" : isNeo ? "4 3" : undefined}
                opacity={isOld ? (highlightOld ? 0.95 : 0.5) : 0.95}
                markerEnd={`url(#arr-${i})`}
                className={isNeo ? "animate-dash-flow" : isOld && highlightOld ? "animate-pulse-soft" : undefined}
                style={isNeo ? { filter: `drop-shadow(0 0 1.4px ${colorOf(e.s)})` } : undefined}
              />
            );
          })}
        </svg>

        {/* nodes */}
        {nodes.map((n) => {
          const ringColor = n.dri >= 0.75 ? "destructive" : n.dri >= 0.5 ? "warning" : "success";
          return (
            <Popover key={n.id}>
              <PopoverTrigger asChild>
                <button
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                  title="Click for node details"
                >
                  <div className="relative">
                    <div className={`absolute inset-0 rounded-full bg-${ringColor}/40 blur-md animate-pulse-soft group-hover:bg-${ringColor}/70 transition-colors`} />
                    <div className={`relative h-8 w-8 rounded-full bg-card border border-${ringColor}/60 grid place-items-center backdrop-blur-sm transition-all group-hover:scale-110 group-hover:shadow-[0_0_20px_-2px_hsl(var(--${ringColor})/0.7)]`}>
                      <Anchor className={`h-3 w-3 text-${ringColor}`} />
                    </div>
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap">
                    <div className="font-mono text-[9px] font-semibold text-foreground bg-background/80 px-1.5 py-0.5 rounded border border-border">
                      {n.id}
                    </div>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 glass border-primary/30 p-3">
                <div className="space-y-2">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{n.type}</div>
                    <div className="text-sm font-semibold">{n.label}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="rounded bg-secondary/50 px-2 py-1.5">
                      <div className="text-[9px] text-muted-foreground uppercase">DRI</div>
                      <div className={`text-${ringColor} font-semibold`}>{n.dri.toFixed(2)}</div>
                    </div>
                    <div className="rounded bg-secondary/50 px-2 py-1.5">
                      <div className="text-[9px] text-muted-foreground uppercase">Delay risk</div>
                      <div className="font-semibold">{n.delay}</div>
                    </div>
                  </div>
                  <div className="text-[10px] flex items-center gap-1.5 text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-soft" />
                    Mitigation active
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          );
        })}

        <div className="absolute bottom-3 left-3 flex flex-col gap-1.5 text-[10px]">
          <div className="px-2 py-1 rounded-md bg-background/70 border border-border backdrop-blur-sm flex items-center gap-2">
            <span className="h-0.5 w-4" style={{ background: "repeating-linear-gradient(90deg, hsl(var(--destructive)) 0 3px, transparent 3px 6px)" }} />
            <span className="text-muted-foreground">Original route</span>
          </div>
          <div className="px-2 py-1 rounded-md bg-background/70 border border-border backdrop-blur-sm flex items-center gap-2">
            <svg width="16" height="2"><line x1="0" y1="1" x2="16" y2="1" stroke="hsl(var(--success))" strokeWidth="1.5" strokeDasharray="4 3" className="animate-dash-flow" /></svg>
            <span className="text-muted-foreground">Optimized route</span>
          </div>
        </div>

        <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-background/70 border border-border backdrop-blur-sm font-mono text-[10px] text-muted-foreground">
          47 lanes · 12 active mitigations
        </div>
      </div>
    </div>
  );
}
