import type React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "pending" | "rejected" | "info" | "warning" | "error" | "outline";
  className?: string;
  dot?: boolean;
}

export const Badge = ({
  children,
  variant = "info",
  className = "",
  dot = false,
}: BadgeProps) => {
  const variants = {
    success: "bg-success/10 text-success border-success/20",
    pending: "bg-warning/10 text-warning border-warning/20",
    rejected: "bg-error/10 text-error border-error/20",
    error: "bg-error/10 text-error border-error/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    info: "bg-primary/10 text-primary border-primary/20",
    outline: "bg-transparent text-text border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors",
        variants[variant],
        className
      )}
    >
      {dot && (
        <span className={cn(
          "mr-1.5 h-1.5 w-1.5 rounded-full",
          variant === "success" ? "bg-success animate-pulse" : 
          variant === "warning" || variant === "pending" ? "bg-warning" :
          variant === "error" || variant === "rejected" ? "bg-error" : "bg-primary"
        )} />
      )}
      {children}
    </span>
  );
};

export const Skeleton = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("animate-pulse rounded-2xl bg-border/20 backdrop-blur-sm", className)}
      {...props}
    />
  );
};

