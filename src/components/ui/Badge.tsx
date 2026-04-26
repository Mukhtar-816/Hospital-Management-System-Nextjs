import type React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "pending" | "rejected" | "info" | "warning";
  className?: string;
}

export const Badge = ({
  children,
  variant = "info",
  className = "",
}: BadgeProps) => {
  const variants = {
    success: "bg-success/10 text-success border-success/20",
    pending: "bg-warning/10 text-warning border-warning/20",
    rejected: "bg-error/10 text-error border-error/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    info: "bg-primary/10 text-primary border-primary/20",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
    >
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
      className={`animate-pulse rounded-md bg-border/20 ${className}`}
      {...props}
    />
  );
};
