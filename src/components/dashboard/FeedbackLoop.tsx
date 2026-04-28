import { Brain, CheckCircle2 } from "lucide-react";

export function FeedbackLoop() {
  const confidence = 87;
  return (
    <div className="glass rounded-2xl p-5 animate-slide-up">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="h-8 w-8 rounded-lg bg-accent/10 border border-accent/20 grid place-items-center text-accent">
          <Brain className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold tracking-tight">Feedback Learning Loop</h2>
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Continuous reinforcement</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="rounded-lg bg-secondary/30 border border-border p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Actions Executed</div>
          <div className="font-mono text-xl font-bold tabular-nums mt-1">1,284</div>
          <div className="text-[10px] text-success mt-0.5">+126 this week</div>
        </div>
        <div className="rounded-lg bg-secondary/30 border border-border p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Avg DRI Reduction</div>
          <div className="font-mono text-xl font-bold tabular-nums mt-1">−0.34</div>
          <div className="text-[10px] text-success mt-0.5">post-intervention</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Model Confidence Improving</span>
          <span className="font-mono font-semibold">{confidence}%</span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-primary via-accent to-success rounded-full transition-all relative" style={{ width: `${confidence}%` }}>
            <div className="absolute inset-0 animate-pulse-soft bg-white/20" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground pt-1">
          <CheckCircle2 className="h-3 w-3 text-success" />
          Last retrain: 14h ago · 2,847 labeled outcomes ingested
        </div>
      </div>
    </div>
  );
}
