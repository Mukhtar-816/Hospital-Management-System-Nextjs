"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { LogoutButton } from "../ui/LogoutButton";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Calendar, 
  FileText, 
  User, 
  Users, 
  Activity,
  Settings,
  Heart
} from "lucide-react";

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
    <aside className="w-64 h-full bg-surface border-r border-border flex flex-col hidden lg:flex">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Heart size={22} fill="currentColor" />
          </div>
          <Link href="/" className="font-bold text-xl tracking-tight text-text hover:text-primary transition-colors">
            MedCloud
          </Link>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {items?.map((item) => {
          const Icon = item.icon;
          const fullHref = `${roleBase}${item.href === "/" ? "" : item.href}`;
          const isActive =
            pathname === fullHref ||
            (item.href !== "/" && pathname?.startsWith(fullHref));

          return (
            <Link
              key={item.href}
              href={fullHref}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-textMuted hover:bg-border/10 hover:text-text"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-2">
        <div className="p-4 bg-border/5 rounded-xl border border-border/10">
          <p className="text-xs text-textMuted uppercase font-semibold mb-2">
            Logged in as
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-sm font-bold text-text capitalize">{userRole}</p>
          </div>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
};
