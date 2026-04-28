import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, AlertTriangle, Route, FileSearch, Settings, Activity, Network } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Disruption Detail", url: "/disruption", icon: AlertTriangle },
  { title: "Route Optimization", url: "/routes", icon: Route },
  { title: "Audit Log", url: "/audit", icon: FileSearch },
  { title: "Agent Architecture", url: "/architecture", icon: Network },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const isActive = (path: string) => path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2.5 px-2 py-3">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <Activity className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-success animate-pulse-soft" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-base font-bold tracking-tight">Chronyx</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-medium">Control Tower</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-1 pt-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70 px-3">
            Operations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active} className="h-10">
                      <NavLink to={item.url} className="flex items-center gap-3 rounded-md text-sm">
                        <item.icon className={`h-4 w-4 shrink-0 ${active ? "text-primary" : ""}`} />
                        {!collapsed && <span className={active ? "font-medium" : ""}>{item.title}</span>}
                        {active && !collapsed && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft" />}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {!collapsed ? (
          <div className="glass rounded-lg p-3 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-soft" />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Live ingest</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-sm font-semibold">12,847</span>
              <span className="text-[10px] text-muted-foreground">signals/min</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse-soft" />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
