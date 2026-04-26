import type React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
}

export const Card = ({
  children,
  className = "",
  title,
  subtitle,
  footer,
}: CardProps) => {
  return (
    <div
      className={`bg-surface border border-border rounded-xl shadow-sm overflow-hidden ${className}`}
    >
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-border">
          {title && (
            <h3 className="text-lg font-semibold text-text">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-textMuted mt-1">{subtitle}</p>
          )}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-4 bg-border/5 border-t border-border">
          {footer}
        </div>
      )}
    </div>
  );
};
