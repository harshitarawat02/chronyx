import { AppShell } from "@/components/AppShell";

const rows = Array.from({ length: 18 }).map((_, i) => {
  const dri = (0.62 + Math.random() * 0.22).toFixed(2);
  const conf = Math.floor(60 + Math.random() * 36);
  const actions = [
    "Reroute APAC→EU via Port Klang",
    "Pre-position inventory at DC-Hamburg",
    "Switch SKU-tier1 to air freight",
    "Halt PO #88241 — supplier viability",
    "Swap carrier on lane LA → ORD",
    "Notify VP Supply — force majeure",
    "Hold release window 6h — port surge",
    "Activate alt supplier Dongguan-12",
  ];
  const status = ["EXECUTED", "EXECUTED", "PENDING", "ESCALATED"][Math.floor(Math.random() * 4)];
  const hex = Math.random().toString(16).slice(2, 10).toUpperCase();
  const ts = new Date(Date.now() - i * 1000 * 60 * 37).toISOString().replace("T", " ").slice(0, 19);
  return {
    id: hex,
    ts,
    action: actions[Math.floor(Math.random() * actions.length)],
    dri,
    conf,
    status,
  };
});

const statusColor: Record<string, string> = {
  EXECUTED: "success",
  PENDING: "warning",
  ESCALATED: "destructive",
};

const Audit = () => {
  return (
    <AppShell title="Audit Log" subtitle="Immutable, tamper-evident record of every autonomous & human-approved action">
      <div className="max-w-[1600px] mx-auto space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { l: "Total entries", v: "184,209" },
            { l: "Last 24h", v: "1,284" },
            { l: "Auto-executed", v: "92.4%" },
            { l: "Chain integrity", v: "100%" },
          ].map((s) => (
            <div key={s.l} className="glass rounded-xl p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
              <div className="font-mono text-lg font-bold tabular-nums mt-0.5">{s.v}</div>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">Recent entries</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Sorted by timestamp · descending</p>
            </div>
            <div className="flex items-center gap-2">
              <input className="h-8 w-56 rounded-md border border-border bg-secondary/40 px-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:border-primary/40" placeholder="Filter by entry ID, action…" />
              <button className="h-8 px-3 text-xs rounded-md border border-border bg-secondary/40 hover:bg-secondary transition-colors">Export CSV</button>
            </div>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground border-b border-border bg-secondary/20">
                  <th className="text-left font-medium px-5 py-3">Entry ID</th>
                  <th className="text-left font-medium px-3 py-3">Timestamp (UTC)</th>
                  <th className="text-left font-medium px-3 py-3">Action</th>
                  <th className="text-right font-medium px-3 py-3">DRI</th>
                  <th className="text-right font-medium px-3 py-3">Confidence</th>
                  <th className="text-right font-medium px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.id} className="border-b border-border/40 hover:bg-secondary/20 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-primary">0x{r.id}</td>
                    <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{r.ts}</td>
                    <td className="px-3 py-3">{r.action}</td>
                    <td className="px-3 py-3 text-right font-mono tabular-nums">{r.dri}</td>
                    <td className="px-3 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <div className="h-1 w-16 rounded-full bg-secondary overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${r.conf}%` }} />
                        </div>
                        <span className="font-mono text-xs tabular-nums w-9">{r.conf}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-${statusColor[r.status]}/10 border border-${statusColor[r.status]}/30 text-${statusColor[r.status]} text-[10px] font-semibold uppercase tracking-wider`}>
                        <span className={`h-1.5 w-1.5 rounded-full bg-${statusColor[r.status]}`} />
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Audit;
