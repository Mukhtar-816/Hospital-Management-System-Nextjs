"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { Sidebar, type UserRole } from "./Sidebar";
import { LogoutButton } from "../ui/LogoutButton";


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

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar userRole={userRole} />

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden w-full h-full border-none cursor-default"
          onClick={() => setIsMobileMenuOpen(false)}
          onKeyUp={(e) => e.key === "Escape" && setIsMobileMenuOpen(false)}
          aria-label="Close menu"
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-surface z-50 transform transition-transform duration-300 lg:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <svg
                role="img"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
            </div>
            <span className="font-bold text-lg text-text">MedCloud</span>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-textMuted"
          >
            <svg
              role="img"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="p-4">
          <p className="text-xs font-bold text-textMuted uppercase px-4 mb-4">
            Menu
          </p>
          <div className="space-y-2">
            <p className="px-4 py-2 text-sm text-text">
              Navigation is managed by role:{" "}
              <span className="capitalize font-bold text-primary">
                {userRole}
              </span>
            </p>
            <LogoutButton className="border border-border" />
          </div>
        </div>

      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-surface border-b border-border px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="lg:hidden p-2 text-textMuted hover:bg-border/10 rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <svg
                role="img"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <h2 className="font-semibold text-text hidden md:block">
              Welcome back,{" "}
              <span className="text-primary capitalize">{userRole}</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="p-2 text-textMuted hover:bg-border/10 rounded-lg relative"
            >
              <svg
                role="img"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-text">John Doe</p>
                <p className="text-xs text-textMuted capitalize">{userRole}</p>
              </div>
              <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                JD
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

interface LocalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
}

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: LocalButtonProps) => {
  const variants = {
    primary: "bg-primary text-white",
    outline: "border border-border text-text hover:bg-border/10",
  };
  return (
    <button
      type="button"
      className={`px-4 py-2 rounded-xl font-medium transition-all ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
