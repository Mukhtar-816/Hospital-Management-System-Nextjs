"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  Heart,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Settings,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "../ui/LogoutButton";

export type UserRole = "patient" | "receptionist" | "doctor" | "admin";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: Record<UserRole, NavItem[]> = {
  patient: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Requests", href: "/requests", icon: MessageSquare },
    { label: "Appointments", href: "/appointments", icon: Calendar },
    { label: "Records", href: "/records", icon: FileText },
    { label: "Profile", href: "/profile", icon: User },
  ],
  receptionist: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Requests", href: "/requests", icon: MessageSquare },
    { label: "Appointments", href: "/appointments", icon: Calendar },
    { label: "Patients", href: "/patients", icon: Users },
    { label: "Profile", href: "/profile", icon: User },
  ],
  doctor: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Appointments", href: "/appointments", icon: Calendar },
    { label: "Profile", href: "/profile", icon: User },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Users", href: "/users", icon: Users },
    { label: "Profile", href: "/profile", icon: User },
  ],
};

export const Sidebar = ({ userRole }: { userRole: UserRole }) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const items = navItems[userRole] || [];

  const roleBase =
    userRole === "admin"
      ? "/admin"
      : userRole === "doctor"
        ? "/doctor"
        : userRole === "receptionist"
          ? "/receptionist"
          : "/patient";

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className={cn(
        "h-full bg-surface border-r border-border flex flex-col hidden lg:flex relative transition-all duration-300 ease-in-out z-50",
        isCollapsed ? "items-center" : "",
      )}
    >
      <div
        className={cn(
          "p-6 w-full flex items-center justify-between",
          isCollapsed ? "justify-center px-0" : "",
        )}
      >
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="full-logo"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-3 overflow-hidden"
            >
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
                <Heart size={22} fill="currentColor" />
              </div>
              <Link
                href="/"
                className="font-bold text-xl tracking-tight text-text hover:text-primary transition-colors whitespace-nowrap"
              >
                MedCloud
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed-logo"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20"
            >
              <Heart size={22} fill="currentColor" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-surface border border-border rounded-full flex items-center justify-center text-textMuted hover:text-primary hover:border-primary transition-all shadow-md z-50"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar w-full">
        {items?.map((item, index) => {
          const Icon = item.icon;
          const fullHref = `${roleBase}${item.href === "/" ? "" : item.href}`;
          const isActive =
            pathname === fullHref ||
            (item.href !== "/" && pathname?.startsWith(fullHref));

          return (
            <Link
              key={item.href}
              href={fullHref}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-textMuted hover:bg-primary/5 hover:text-primary",
                isCollapsed && "justify-center",
              )}
            >
              <motion.div
                initial={false}
                animate={{ scale: isActive ? 1.1 : 1 }}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>

              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-semibold"
                >
                  {item.label}
                </motion.span>
              )}

              {isCollapsed && (
                <div className="absolute left-16 bg-surface border border-border px-3 py-1.5 rounded-lg text-xs font-bold shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100]">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div
        className={cn(
          "p-4 border-t border-border space-y-2 w-full",
          isCollapsed ? "items-center px-2" : "",
        )}
      >
        {!isCollapsed && (
          <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <p className="text-[10px] text-primary uppercase font-black tracking-widest mb-2">
              Status: Online
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-sm font-bold text-text capitalize">
                {userRole}
              </p>
            </div>
          </div>
        )}
        <LogoutButton showLabel={!isCollapsed} />
      </div>
    </motion.aside>
  );
};
