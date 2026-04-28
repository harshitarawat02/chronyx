import { AppShell } from "@/components/AppShell";
import { RouteMap } from "@/components/dashboard/RouteMap";

const lanes = [
  { id: "SIN→RTM", old: 28, neo: 26, save: "₹42L", risk: "0.84 → 0.21" },
  { id: "SHA→LAX", old: 14, neo: 14, save: "₹0", risk: "0.32 → 0.32" },
  { id: "SIN→HAM", old: 32, neo: 30, save: "₹38L", risk: "0.79 → 0.24" },
  { id: "DXB→RTM", old: 11, neo: 11, save: "₹0", risk: "0.41 → 0.38" },
  { id: "LA→ORD",  old: 4,  neo: 4,  save: "₹6L",  risk: "0.51 → 0.18" },
];

const Routes = () => {
  return (
    <AppShell title="Dynamic Route Optimization Engine (DROE)" subtitle="Multi-objective re-planning · Min(Time + λ × DRI) · cost · SLA">
      <div className="max-w-[1600px] mx-auto space-y-4">
        <RouteMap />
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold">Lane Re-plans</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Active optimizations across 47 monitored lanes</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground border-b border-border bg-secondary/20">
                <th className="text-left font-medium px-5 py-3">Lane</th>
                <th className="text-right font-medium px-3 py-3">Original ETA (d)</th>
                <th className="text-right font-medium px-3 py-3">Optimized ETA (d)</th>
                <th className="text-right font-medium px-3 py-3">Risk Δ</th>
                <th className="text-right font-medium px-5 py-3">Cost Saved</th>
              </tr>
            </thead>
            <tbody>
              {lanes.map((l) => (
                <tr key={l.id} className="border-b border-border/40 hover:bg-secondary/20 transition-colors">
                  <td className="px-5 py-3 font-mono text-primary">{l.id}</td>
                  <td className="px-3 py-3 text-right font-mono tabular-nums">{l.old}</td>
                  <td className="px-3 py-3 text-right font-mono tabular-nums text-success">{l.neo}</td>
                  <td className="px-3 py-3 text-right font-mono text-xs">{l.risk}</td>
                  <td className="px-5 py-3 text-right font-mono font-semibold">{l.save}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
};

export default Routes;
