import { AppShell } from "@/components/AppShell";

const Settings = () => {
  return (
    <AppShell title="Settings" subtitle="Thresholds · model configuration · integrations">
      <div className="max-w-3xl mx-auto space-y-4">
        {[
          { t: "Autonomy thresholds", d: "Confidence ≥ 85% executes automatically. Below threshold routes to Ops Lead.", v: "85%" },
          { t: "DRI alert sensitivity", d: "Critical alerts trigger at DRI ≥ 0.75. Escalation to VP at DRI ≥ 0.85.", v: "0.75 / 0.85" },
          { t: "Gemini model version", d: "Active reasoning model for root-cause analysis.", v: "gemini-2.0-flash · v2.4" },
          { t: "Signal sources", d: "NOAA · AIS · MPA · Drewry · Foxconn supplier feed · 14 more", v: "19 active" },
          { t: "Notification channels", d: "Slack #ops-control · PagerDuty · email digest", v: "3 channels" },
        ].map((s) => (
          <div key={s.t} className="glass rounded-xl p-5 flex items-center gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-semibold">{s.t}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.d}</p>
            </div>
            <div className="font-mono text-sm font-semibold text-primary px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20 whitespace-nowrap">
              {s.v}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
};

export default Settings;
