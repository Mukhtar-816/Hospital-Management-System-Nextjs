"use client";

import type React from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Forms";
import { User, Mail, Shield, ShieldCheck } from "lucide-react";

interface ProfileTemplateProps {
  user: {
    userid: string;
    useremail: string;
    role: string;
  };
  details?: React.ReactNode;
  editable?: boolean;
}

export const ProfileTemplate = ({
  user,
  details,
}: ProfileTemplateProps) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center justify-between bg-surface p-6 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
              <User size={32} />
           </div>
           <div>
              <h1 className="text-3xl font-bold text-text tracking-tight">Identity Profile</h1>
              <p className="text-textMuted mt-1">Authorized access level: <span className="text-primary font-bold capitalize">{user.role}</span></p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card title="Account Metadata">
             <div className="space-y-4 mt-4">
                <div className="p-4 bg-border/5 rounded-xl border border-border/10">
                   <div className="flex items-center gap-2 text-textMuted mb-2">
                      <ShieldCheck size={14} className="text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Internal ID</span>
                   </div>
                   <p className="text-xs font-mono text-text break-all">{user.userid}</p>
                </div>
                
                <div className="p-4 bg-border/5 rounded-xl border border-border/10">
                   <div className="flex items-center gap-2 text-textMuted mb-2">
                      <Mail size={14} className="text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Primary Contact</span>
                   </div>
                   <p className="text-sm font-bold text-text">{user.useremail}</p>
                </div>

                <div className="p-4 bg-border/5 rounded-xl border border-border/10">
                   <div className="flex items-center gap-2 text-textMuted mb-2">
                      <Shield size={14} className="text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Verification Status</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-sm font-bold text-text">Fully Verified</p>
                   </div>
                </div>
             </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
           {details && (
             <Card title="Personal Information" subtitle="Update your profile details and clinical records">
                <div className="mt-6">{details}</div>
             </Card>
           )}
        </div>
      </div>
    </div>
  );
};
