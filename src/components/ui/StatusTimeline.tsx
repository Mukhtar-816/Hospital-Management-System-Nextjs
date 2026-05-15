"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, Calendar, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export type AppointmentStatus = "SCHEDULED" | "CHECKED_IN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

interface StatusTimelineProps {
  currentStatus: AppointmentStatus;
  className?: string;
}

const statusSteps: { status: AppointmentStatus; label: string; icon: any }[] = [
  { status: "SCHEDULED", label: "Scheduled", icon: Calendar },
  { status: "CHECKED_IN", label: "Checked-in", icon: Clock },
  { status: "IN_PROGRESS", label: "In Progress", icon: CheckCircle2 },
  { status: "COMPLETED", label: "Completed", icon: CheckCircle },
];

export const StatusTimeline = ({ currentStatus, className }: StatusTimelineProps) => {
  if (currentStatus === "CANCELLED") {
    return (
      <div className={cn("p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm font-bold flex items-center gap-2", className)}>
        <CheckCircle size={16} />
        Appointment Cancelled
      </div>
    );
  }

  const currentIndex = statusSteps.findIndex((s) => s.status === currentStatus);

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative flex justify-between">
        {/* Progress Bar Background */}
        <div className="absolute top-5 left-0 w-full h-1 bg-border/30 -z-10" />
        
        {/* Active Progress Bar */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(currentIndex / (statusSteps.length - 1)) * 100}%` }}
          className="absolute top-5 left-0 h-1 bg-primary -z-10 shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
        />

        {statusSteps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div key={step.status} className="flex flex-col items-center gap-2">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.2 : 1,
                  backgroundColor: isCompleted || isActive ? "var(--primary)" : "var(--surface)",
                  borderColor: isCompleted || isActive ? "var(--primary)" : "var(--border)",
                }}
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors shadow-sm",
                  isActive && "ring-4 ring-primary/20"
                )}
              >
                <Icon 
                  size={18} 
                  className={cn(
                    isCompleted || isActive ? "text-white" : "text-textMuted"
                  )} 
                />
              </motion.div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider",
                isActive ? "text-primary" : "text-textMuted"
              )}>
                {step.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="pulse"
                  className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse mt--1"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
