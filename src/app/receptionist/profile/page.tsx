"use client";
import { Shield, User } from "lucide-react";

import { useEffect, useState } from "react";
import { ProfileTemplate } from "@/components/modules/ProfileTemplate";
import { Input } from "@/components/ui/Forms";
import { useLoading } from "@/lib/LoadingContext";
import { devError, devLog } from "@/lib/logger";

export default function ReceptionistProfile() {
  const { showLoading, hideLoading } = useLoading();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      showLoading();
      try {
        const res = await fetch("/api/receptionist/me");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUser(data);
      } catch (_err) {
        devError("Failed to load receptionist profile");
      } finally {
        hideLoading();
      }
    };

    fetchProfile();
  }, []);

  if (!user) return null;

  const details = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative group">
          <Input
            label="Staff Member Name"
            value={user.fullname || "Active Support Staff"}
            readOnly
            className="pl-10 opacity-80"
          />
          <User
            className="absolute left-3 top-10 text-textMuted group-focus-within:text-primary transition-colors"
            size={18}
          />
        </div>
        <div className="relative group">
          <Input
            label="Assigned Terminal"
            value="Front Desk Main"
            readOnly
            className="pl-10 opacity-80"
          />
          <Shield
            className="absolute left-3 top-10 text-textMuted group-focus-within:text-primary transition-colors"
            size={18}
          />
        </div>
      </div>
      <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
          Authorization Note
        </p>
        <p className="text-sm text-textMuted italic">
          Your account is provisioned for clinical intake and appointment
          orchestration. Personal detail updates must be requested via the
          administration portal.
        </p>
      </div>
    </div>
  );

  return (
    <ProfileTemplate
      user={{
        userid: user.userid,
        useremail: user.useremail,
        role: user.role,
      }}
      details={details}
    />
  );
}
