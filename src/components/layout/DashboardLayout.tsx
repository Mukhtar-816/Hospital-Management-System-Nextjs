"use client";

import { usePathname } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { LogoutButton } from "../ui/LogoutButton";
import { Sidebar, type UserRole } from "./Sidebar";
import { ErrorBoundary } from "../common/ErrorBoundary";
import {
  Menu,
  X,
  Bell,
  Search,
  Heart,
} from "lucide-react";
import { useRouter } from 'next/navigation';
interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
}

export const DashboardLayout = ({
  children,
  userRole,
}: DashboardLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const _pathname = usePathname();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/notifications');
  };

  return (
    <div className="flex h-screen bg-bg overflow-hidden font-sans">
      <Sidebar userRole={userRole} />

      {isMobileMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden w-full h-full border-none cursor-default"
          onClick={() => setIsMobileMenuOpen(false)}
          onKeyUp={(e) => e.key === "Escape" && setIsMobileMenuOpen(false)}
          aria-label="Close menu"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 w-64 bg-surface z-50 transform transition-transform duration-300 lg:hidden shadow-2xl ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 border-b border-border flex items-center justify-between bg-surface/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Heart size={18} fill="currentColor" />
            </div>
            <span className="font-bold text-lg text-text tracking-tight">MedCloud</span>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-textMuted hover:text-text transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-xs font-bold text-textMuted uppercase tracking-widest mb-6">
            Navigation
          </p>
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <p className="text-xs text-primary font-bold uppercase mb-1">Access Level</p>
              <p className="text-sm font-medium text-text capitalize">{userRole}</p>
            </div>
            <LogoutButton className="w-full justify-start py-3 border border-border" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 bg-surface/80 backdrop-blur-md border-b border-border px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <button
              type="button"
              className="lg:hidden p-2 text-textMuted hover:bg-border/10 rounded-xl transition-all"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>

            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="bg-border/10 border border-border/20 rounded-xl pl-10 pr-4 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50 w-64 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={handleClick} className="p-2 text-textMuted hover:bg-border/10 rounded-xl relative transition-all">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-surface animate-pulse"></span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-text">John Doe</p>
                <p className="text-[10px] text-textMuted uppercase tracking-tighter font-black">{userRole}</p>
              </div>
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/20">
                JD
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-bg/50 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
};
