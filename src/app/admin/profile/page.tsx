"use client";
import { ShieldAlert, Terminal } from "lucide-react";

import { useEffect, useState } from "react";
import { ProfileTemplate } from "@/components/modules/ProfileTemplate";
import { Input } from "@/components/ui/Forms";
import { devError, devLog } from "@/lib/logger";

export default function AdminProfile() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/admin/me", {
          headers: {
            "Content-Type": "application/json",
          },
          method: "GET",
        });
        if (!res.ok) throw new Error();

        const data = await res.json();
        setUser(data);
      } catch (err: any) {
        devError("Failed to load admin profile synchronization.");
      }
    };

    fetchProfile();
  }, []);

  if (!user)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-textMuted font-medium">
          Synchronizing Secure Session...
        </p>
      </div>
    );

  const details = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative group">
          <Input
            label="Root Administrator"
            value={user.fullname || "System Architect"}
            readOnly
            className="pl-10 opacity-80"
          />
          <ShieldAlert
            className="absolute left-3 top-10 text-primary transition-colors"
            size={18}
          />
        </div>
        <div className="relative group">
          <Input
            label="Console Environment"
            value="Production Primary"
            readOnly
            className="pl-10 opacity-80"
          />
          <Terminal
            className="absolute left-3 top-10 text-primary transition-colors"
            size={18}
          />
        </div>
      </div>
      <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 flex items-start gap-4">
        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
          <ShieldAlert size={20} />
        </div>
        <div>
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">
            Privileged Access
          </p>
          <p className="text-sm text-textMuted">
            You are currently operating with{" "}
            <span className="font-black text-text">Root Permissions</span>. This
            account has full read/write access to clinical, financial, and user
            identity systems.
          </p>
        </div>
      </div>
    </div>
  );

  return <ProfileTemplate user={user} details={details} />;
}
