import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Bell, Search } from "lucide-react";

interface Props {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AppShell({ children, title, subtitle }: Props) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center gap-4 border-b border-border px-6 bg-background/60 backdrop-blur-xl sticky top-0 z-30">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="h-6 w-px bg-border" />
            <div className="flex flex-col leading-tight min-w-0">
              <h1 className="text-base font-semibold tracking-tight truncate">{title}</h1>
              {subtitle && <span className="text-xs text-muted-foreground truncate">{subtitle}</span>}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-3 h-9 rounded-md border border-border bg-secondary/40 text-xs text-muted-foreground w-64">
                <Search className="h-3.5 w-3.5" />
                <span>Search lanes, suppliers, ports…</span>
                <kbd className="ml-auto font-mono text-[10px] px-1.5 py-0.5 rounded bg-background border border-border">⌘K</kbd>
              </div>
              <button className="h-9 w-9 grid place-items-center rounded-md border border-border bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-destructive animate-pulse-soft" />
              </button>
              <div className="h-6 w-px bg-border mx-1" />
              <div className="flex items-center gap-2.5 pr-1">
                <div className="hidden sm:flex flex-col items-end leading-tight">
                  <span className="text-xs font-medium text-foreground">Harshita</span>
                  <span className="text-[10px] text-muted-foreground">Ops Lead</span>
                </div>
                <div className="h-9 w-9 rounded-full grid place-items-center text-xs font-semibold text-primary-foreground bg-gradient-to-br from-primary to-accent shadow-[0_0_16px_-2px_hsl(var(--primary)/0.5)] border border-primary/40">
                  HA
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
