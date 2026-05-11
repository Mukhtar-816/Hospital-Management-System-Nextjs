"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { ProfileTemplate } from "@/components/modules/ProfileTemplate";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Forms";
import { useLoading } from "@/lib/LoadingContext";
import { Save, User, Briefcase, CheckCircle2, AlertCircle } from "lucide-react";
import { showToast } from "nextjs-toast-notify";

export default function DoctorProfile() {
  const { showLoading, hideLoading } = useLoading();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [user, setUser] = useState({
    userid: "",
    useremail: "",
    role: "doctor",
  });

  const [form, setForm] = useState({
    fullname: "",
    specialization: "",
    status: "active",
  });

  useEffect(() => {
    const loadProfile = async () => {
      showLoading();
      try {
        const res = await fetch("/api/doctor/me");
        if (!res.ok) throw new Error("Synchronization failure.");
        const data = await res.json();
        console.log(data);


        setForm(data.doctor);
      } catch (err: any) {
        setError(err.message);
      } finally {
        hideLoading();
      }
    };

    loadProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setError("");
    setSuccess("");
    showLoading();

    try {
      const res = await fetch("/api/doctor", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userid: user.userid,
          useremail: user.useremail,
          fullname: form.fullname,
          specialization: form.specialization,
        }),
      });

      if (!res.ok) throw new Error("Commit protocol rejected.");
      setSuccess("Profile information updated.");
      showToast.success("Profile records updated.");
    } catch (err: any) {
      setError(err.message);
      showToast.error(err.message);
    } finally {
      hideLoading();
    }
  };

  const details = (
    <div className="space-y-6">
      {(error || success) && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in slide-in-from-top-1 ${error ? "bg-error/10 border-error/20 text-error" : "bg-success/10 border-success/20 text-success"}`}>
          {error ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <p className="text-sm font-medium">{error || success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative group">
          <Input
            name="fullname"
            label="Full Professional Name"
            value={form.fullname}
            onChange={handleChange}
            className="pl-10"
          />
          <User className="absolute left-3 top-10 text-textMuted group-focus-within:text-primary transition-colors" size={18} />
        </div>
        <div className="relative group">
          <Input
            name="specialization"
            label="Clinical Specialization"
            value={form.specialization}
            onChange={handleChange}
            className="pl-10"
          />
          <Briefcase className="absolute left-3 top-10 text-textMuted group-focus-within:text-primary transition-colors" size={18} />
        </div>
      </div>

      <div className="pt-6 border-t border-border flex justify-end">
        <Button
          onClick={handleUpdate}
          className="gap-2 px-8 shadow-lg shadow-primary/20"
        >
          <Save size={18} />
          Sync Records
        </Button>
      </div>
    </div>
  );

  if (!user.userid) return null;

  return <ProfileTemplate user={user} details={details} />;
}
