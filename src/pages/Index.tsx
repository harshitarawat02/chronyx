import { AppShell } from "@/components/AppShell";
import { DRIPanel } from "@/components/dashboard/DRIPanel";
import { ActionFeed } from "@/components/dashboard/ActionFeed";
import { GeminiPanel } from "@/components/dashboard/GeminiPanel";
import { RouteMap } from "@/components/dashboard/RouteMap";
import { KPIPanel } from "@/components/dashboard/KPIPanel";
import { FeedbackLoop } from "@/components/dashboard/FeedbackLoop";

const Index = () => {
  return (
    <AppShell title="Global Supply Chain Control Tower" subtitle="AI-driven disruption sensing & autonomous mitigation · APAC ↔ EU ↔ NAM">
      <div className="space-y-4 max-w-[1600px] mx-auto">
        <DRIPanel />
        <KPIPanel />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 space-y-4">
            <RouteMap />
            <ActionFeed />
          </div>
          <div className="space-y-4">
            <GeminiPanel />
            <FeedbackLoop />
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Index;
