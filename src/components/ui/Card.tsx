import type React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string | React.ReactNode;
  subtitle?: string;
  footer?: React.ReactNode;
  hoverable?: boolean;
}

export const Card = ({
  children,
  className = "",
  title,
  subtitle,
  footer,
  hoverable = false,
}: CardProps) => {
  return (
    <div
      className={cn(
        "bg-surface border border-border rounded-2xl shadow-sm overflow-hidden transition-all duration-300",
        hoverable &&
          "hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/20",
        className,
      )}
    >
      {(title || subtitle) && (
        <div className="px-6 py-5 border-b border-border/50 bg-surface/50 backdrop-blur-sm">
          {title && (
            <div className="text-lg font-bold text-text tracking-tight">
              {title}
            </div>
          )}
          {subtitle && (
            <p className="text-sm text-textMuted mt-1 font-medium">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-4 bg-border/5 border-t border-border/50">
          {footer}
        </div>
      )}
    </div>
  );
};
