"use client";
import { Loader2, LogOut } from "lucide-react";

import { useRouter } from "next/navigation";
import React from "react";
import { devError, devLog } from "@/lib/logger";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  className?: string;
  showLabel?: boolean;
}

export const LogoutButton = ({
  className,
  showLabel = true,
}: LogoutButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      devError("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-textMuted hover:bg-error/10 hover:text-error w-full font-semibold",
        !showLabel && "justify-center px-0",
        className,
      )}
      title="Logout"
    >
      {isLoading ? (
        <Loader2 size={20} className="animate-spin shrink-0" />
      ) : (
        <LogOut size={20} className="shrink-0" />
      )}
      {showLabel && (
        <span className="whitespace-nowrap">
          {isLoading ? "Logging out..." : "Logout"}
        </span>
      )}
    </button>
  );
};
