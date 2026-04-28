import { AppShell } from "@/components/AppShell";
import {
  Database, Filter, Gauge, LineChart, AlertTriangle, Sparkles, Brain, Zap, Monitor,
  Cloud, Cpu, Server, ArrowRight,
} from "lucide-react";

type Agent = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
  highlight?: boolean;
};

const signalLayer: Agent[] = [
  { id: "ingest", name: "IngestAgent", icon: Database, desc: "Collects raw signals (news, weather, logistics)" },
  { id: "signal", name: "SignalAgent", icon: Filter, desc: "Processes signals using NLP and embeddings" },
];

const intelligenceLayer: Agent[] = [
  { id: "dri", name: "DRI Engine", icon: Gauge, desc: "Computes Disruption Risk Index" },
  { id: "forecast", name: "ForecastAgent", icon: LineChart, desc: "Predicts future disruption trends" },
  { id: "detect", name: "DetectAgent", icon: AlertTriangle, desc: "Identifies threshold breaches" },
  { id: "rootcause", name: "RootCauseAgent", icon: Sparkles, desc: "Uses Gemini Pro for reasoning and explanation", highlight: true },
];

const actionLayer: Agent[] = [
  { id: "decision", name: "DecisionAgent", icon: Brain, desc: "Determines optimal mitigation strategy" },
  { id: "execute", name: "ExecuteAgent", icon: Zap, desc: "Applies actions based on confidence thresholds" },
];

const pipeline = [
  { name: "Data Sources", icon: Database },
  { name: "IngestAgent", icon: Database },
  { name: "SignalAgent", icon: Filter },
  { name: "DRI Engine", icon: Gauge },
  { name: "ForecastAgent", icon: LineChart },
  { name: "DetectAgent", icon: AlertTriangle },
  { name: "RootCauseAgent", icon: Sparkles, gemini: true },
  { name: "DecisionAgent", icon: Brain },
  { name: "ExecuteAgent", icon: Zap },
  { name: "Dashboard Output", icon: Monitor },
];

function AgentCard({ agent }: { agent: Agent }) {
  const Icon = agent.icon;
  return (
    <div
      className={`glass rounded-xl p-3.5 hover-lift ${
        agent.highlight
          ? "border-primary/40 ring-1 ring-primary/30 shadow-[0_0_30px_-10px_hsl(var(--primary)/0.6)]"
          : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`h-9 w-9 rounded-lg grid place-items-center shrink-0 ${
            agent.highlight
              ? "bg-gradient-to-br from-primary to-accent text-primary-foreground animate-glow"
              : "bg-secondary/60 text-primary"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <div className="text-sm font-semibold tracking-tight truncate">{agent.name}</div>
            {agent.highlight && (
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-primary/15 text-primary border border-primary/30">
                Gemini Pro
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground leading-snug mt-0.5">{agent.desc}</p>
        </div>
      </div>
    </div>
  );
}

function LayerGroup({
  label, color, agents, cols,
}: { label: string; color: string; agents: Agent[]; cols: string }) {
  return (
    <div className="glass rounded-2xl p-5 relative overflow-hidden">
      <div
        className={`absolute top-0 left-0 h-full w-1 bg-${color}`}
        style={{ background: `hsl(var(--${color}))` }}
      />
      <div className="flex items-center justify-between mb-4 pl-2">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Layer</div>
          <h2 className="text-sm font-semibold tracking-tight">{label}</h2>
        </div>
        <span
          className="font-mono text-[10px] px-2 py-1 rounded-md border"
          style={{
            color: `hsl(var(--${color}))`,
            borderColor: `hsl(var(--${color}) / 0.3)`,
            background: `hsl(var(--${color}) / 0.08)`,
          }}
        >
          {agents.length} agents
        </span>
      </div>
      <div className={`grid gap-3 pl-2 ${cols}`}>
        {agents.map((a) => (
          <AgentCard key={a.id} agent={a} />
        ))}
      </div>
    </div>
  );
}

const Architecture = () => {
  return (
    <AppShell
      title="Chronyx System Architecture"
      subtitle="Multi-agent pipeline for narrative-driven disruption prediction and autonomous decision-making"
    >
      <div className="max-w-[1600px] mx-auto space-y-5">
        {/* Pipeline */}
        <div className="glass rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[60%] bg-gradient-to-b from-primary/10 to-transparent blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4 relative">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">End-to-end pipeline</div>
              <h2 className="text-sm font-semibold tracking-tight">Signal → Intelligence → Action</h2>
            </div>
            <span className="font-mono text-[10px] px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
              Streaming · 12,847 sig/min
            </span>
          </div>
          <div className="overflow-x-auto pb-2">
            <div className="flex items-center gap-2 min-w-max relative">
              {pipeline.map((node, i) => {
                const Icon = node.icon;
                return (
                  <div key={node.name} className="flex items-center gap-2">
                    <div
                      className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border min-w-[110px] ${
                        node.gemini
                          ? "border-primary/50 bg-primary/10 shadow-[0_0_24px_-6px_hsl(var(--primary)/0.6)] animate-glow"
                          : "border-border bg-secondary/30"
                      }`}
                    >
                      <div
                        className={`h-8 w-8 rounded-lg grid place-items-center ${
                          node.gemini
                            ? "bg-gradient-to-br from-primary to-accent text-primary-foreground"
                            : "bg-background/60 text-primary"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="text-[11px] font-medium text-center leading-tight">{node.name}</div>
                      {node.gemini && (
                        <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                          Gemini Pro
                        </span>
                      )}
                    </div>
                    {i < pipeline.length - 1 && (
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Three layers */}
        <div className="grid grid-cols-1 gap-4">
          <LayerGroup label="Signal Layer" color="accent" agents={signalLayer} cols="md:grid-cols-2" />
          <LayerGroup label="Intelligence Layer" color="primary" agents={intelligenceLayer} cols="md:grid-cols-2 lg:grid-cols-4" />
          <LayerGroup label="Action Layer" color="success" agents={actionLayer} cols="md:grid-cols-2" />
        </div>

        {/* Google AI Integration */}
        <div className="glass rounded-2xl p-5 border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Powered by</div>
              <h2 className="text-sm font-semibold tracking-tight">Google AI Integration</h2>
            </div>
            <span className="font-mono text-[10px] px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
              GCP · Production
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { icon: Sparkles, name: "Gemini Pro", desc: "Root cause reasoning and classification" },
              { icon: Cpu, name: "Vertex AI", desc: "Embeddings for semantic signal processing" },
              { icon: Cloud, name: "Cloud Run", desc: "Scalable deployment" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.name} className="rounded-xl border border-border bg-secondary/30 p-4 hover-lift">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 grid place-items-center text-primary border border-primary/20">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="text-sm font-semibold">{s.name}</div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug">{s.desc}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
            <Server className="h-3 w-3" />
            Pub/Sub event bus · BigQuery feature store · Cloud Logging audit trail
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Architecture;
