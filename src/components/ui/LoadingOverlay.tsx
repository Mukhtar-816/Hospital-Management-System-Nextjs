"use client";

import React from "react";
import { useLoading } from "@/lib/LoadingContext";

export function LoadingOverlay() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div 
      id="loading-overlay"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-300"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative flex flex-col items-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
        <div className="absolute inset-0 h-16 w-16 animate-pulse rounded-full bg-white/5 shadow-[0_0_30px_rgba(255,255,255,0.2)]"></div>
        <p className="mt-4 text-sm font-medium tracking-widest text-white/80 uppercase">
          Processing
        </p>
      </div>
    </div>
  );
}
