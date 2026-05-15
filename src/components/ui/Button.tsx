"use client";

import { type HTMLMotionProps, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost" | "glass";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading,
  className = "",
  ...props
}: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary/90 focus:ring-primary shadow-lg shadow-primary/20",
    secondary:
      "bg-surface border border-border text-text hover:bg-border/20 focus:ring-border shadow-sm",
    danger:
      "bg-error text-white hover:bg-error/90 focus:ring-error shadow-lg shadow-error/20",
    outline:
      "bg-transparent border-2 border-primary text-primary hover:bg-primary/5 focus:ring-primary",
    ghost: "bg-transparent text-text hover:bg-border/10 focus:ring-border",
    glass:
      "glass text-text hover:bg-white/10 focus:ring-white/20 border-white/10",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      {...(props as any)}
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </motion.button>
  );
};
