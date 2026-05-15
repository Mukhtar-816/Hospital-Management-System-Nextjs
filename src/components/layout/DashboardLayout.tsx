"use client";

import { usePathname } from "next/navigation";
import type React from "react";
import { useState, useMemo, useEffect } from "react";
import { showToast } from "nextjs-toast-notify";
import { Sidebar, type UserRole } from "./Sidebar";
import { ErrorBoundary } from "../common/ErrorBoundary";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Bell,
  Search,
  ChevronRight,
  Home,
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
  const pathname = usePathname();
  const router = useRouter();
  const [userData, setUserData] = useState<{ fullname: string; role: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          setUserData(data);
          
          // Clear previous toasts aggressively to prevent stacking
          if (typeof document !== 'undefined') {
            document.querySelectorAll('.toast-nextjs, .toast-container, .toast-item').forEach(el => el.remove());
          }

          showToast.success(`Welcome back, ${data.fullname || 'User'}`);
        } else {
          if (typeof document !== 'undefined') {
            document.querySelectorAll('.toast-nextjs, .toast-container').forEach(el => el.remove());
          }
          showToast.error("Authentication synchronization failed.");
        }
      } catch (err) {
        if (typeof document !== 'undefined') {
          document.querySelectorAll('.toast-nextjs, .toast-container').forEach(el => el.remove());
        }
        showToast.error("Connection to identity services lost.");
      }
    };
    fetchUser();
  }, []);

  const breadcrumbs = useMemo(() => {
    const paths = pathname.split("/").filter(Boolean);
    return paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join("/")}`;
      return {
        label: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " "),
        href,
        isLast: index === paths.length - 1,
      };
    });
  }, [pathname]);

  const handleNotificationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/notifications');
  };

  return (
    <div className="flex h-screen bg-bg overflow-hidden font-sans">
      <Sidebar userRole={userRole} />

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-surface z-[60] lg:hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                    <Home size={18} />
                  </div>
                  <span className="font-bold text-lg text-text">MedCloud</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-border/10 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {/* Mobile menu content would go here, can reuse sidebar logic */}
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 mb-6">
                  <p className="text-[10px] text-primary font-black uppercase mb-1">Role</p>
                  <p className="text-sm font-bold text-text capitalize">{userRole}</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-20 bg-surface/80 backdrop-blur-md border-b border-border px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <button
              type="button"
              className="lg:hidden p-2.5 text-textMuted hover:bg-border/10 rounded-xl transition-all"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={22} />
            </button>

            <nav className="hidden md:flex items-center gap-2 text-sm">
              <div className="flex items-center gap-2 text-textMuted">
                <Home size={14} />
                <ChevronRight size={14} />
              </div>
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex items-center gap-2">
                  <span className={cn(
                    "font-bold transition-colors",
                    crumb.isLast ? "text-primary" : "text-textMuted hover:text-text cursor-pointer"
                  )}
                  onClick={() => !crumb.isLast && router.push(crumb.href)}
                  >
                    {crumb.label}
                  </span>
                  {!crumb.isLast && <ChevronRight size={14} className="text-textMuted/50" />}
                </div>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" size={16} />
              <input
                type="text"
                placeholder="Search anything..."
                className="bg-bg border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50 w-72 transition-all shadow-sm"
              />
            </div>

            <button 
              onClick={handleNotificationClick} 
              className="p-2.5 text-textMuted hover:bg-border/10 rounded-xl relative transition-all group"
            >
              <Bell size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-surface animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-border/50">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-text tracking-tight">
                  {userData?.fullname || "Synchronizing..."}
                </p>
                <p className="text-[10px] text-primary font-black uppercase tracking-widest">
                  {userData?.role || "Pending"}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary/20 ring-2 ring-surface">
                {userData?.fullname ? userData.fullname.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : "..."}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar bg-bg/50">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 md:p-10 max-w-7xl mx-auto"
          >
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

