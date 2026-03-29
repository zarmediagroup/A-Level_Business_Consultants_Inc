"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Bell,
  ClipboardList,
  LogOut,
  Shield,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/portal/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/admin/clients", label: "Clients", icon: Users },
  { href: "/portal/admin/documents", label: "Documents", icon: FileText },
  { href: "/portal/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/portal/admin/audit-log", label: "Audit Log", icon: ClipboardList },
];

interface AdminSidebarProps {
  unreadCount?: number;
  adminName?: string;
}

export default function AdminSidebar({ unreadCount = 0, adminName = "Admin" }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/portal/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 px-5 py-6 border-b border-slate-800",
        collapsed && "justify-center px-3"
      )}>
        <div className="w-9 h-9 rounded-md bg-white flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-slate-900" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-white font-semibold text-sm leading-tight whitespace-nowrap">
              A-Level Business
            </div>
            <div className="text-blue-200/90 text-[10px] tracking-[0.15em] uppercase whitespace-nowrap">
              Admin Portal
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto portal-scroll">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const hasNotif = item.href.includes("notifications") && unreadCount > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 relative group",
                isActive
                  ? "sidebar-active text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white",
                collapsed && "justify-center"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="flex-1">{item.label}</span>
              )}
              {hasNotif && (
                <span className={cn(
                  "bg-blue-700 text-white text-xs font-semibold rounded-full flex-shrink-0",
                  collapsed ? "absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px]" : "px-2 py-0.5"
                )}>
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
              {/* Tooltip for collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-3 bg-slate-800 text-white text-xs px-3 py-2 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg border border-slate-700">
                  {item.label}
                  {hasNotif && ` (${unreadCount})`}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: User + Collapse */}
      <div className="border-t border-slate-800 p-3 space-y-2">
        {/* Admin info */}
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5">
            <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-100 text-xs font-semibold">
                {adminName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-white text-xs font-semibold truncate">{adminName}</p>
              <p className="text-slate-500 text-xs">Administrator</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full rounded-xl px-3 py-3 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-colors",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>

        {/* Collapse button - desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "hidden lg:flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-colors",
            collapsed && "justify-center"
          )}
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform duration-300", collapsed && "rotate-180")} />
          {!collapsed && <span>Collapse sidebar</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-slate-950 border border-slate-700 rounded-lg flex items-center justify-center text-white shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "lg:hidden fixed left-0 top-0 bottom-0 z-50 w-72 bg-slate-950 border-r border-slate-800 transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-slate-950 border-r border-slate-800 flex-shrink-0 transition-all duration-300",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
