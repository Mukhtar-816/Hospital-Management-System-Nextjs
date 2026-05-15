"use client";
import { AlertCircle, Briefcase, CheckCircle2, Save, User } from "lucide-react";
import { showToast } from "nextjs-toast-notify";
import type React from "react";
import { useEffect, useState } from "react";
import { ProfileTemplate } from "@/components/modules/ProfileTemplate";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Forms";
import { useLoading } from "@/lib/LoadingContext";
import { devError, devLog } from "@/lib/logger";

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
        const [userRes, doctorRes] = await Promise.all([
          fetch("/api/users/me"),
          fetch("/api/doctor/me"),
        ]);

        if (!userRes.ok || !doctorRes.ok)
          throw new Error("Synchronization failure.");

        const userData = await userRes.json();
        const doctorData = await doctorRes.json();

        setUser({
          userid: userData.userid,
          useremail: userData.useremail,
          role: userData.role,
        });

        setForm({
          fullname: doctorData.doctor.fullname || "",
          specialization: doctorData.doctor.specialization || "",
          status: doctorData.doctor.status || "active",
        });
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
          fullname: form.fullname,
          specialization: form.specialization,
        }),
      });

      if (!res.ok) throw new Error("Commit protocol rejected.");
      setSuccess("Profile information updated.");

      if (typeof document !== "undefined") {
        document
          .querySelectorAll(".toast-nextjs, .toast-container")
          .forEach((el) => el.remove());
      }
      showToast.success("Profile records updated.");
    } catch (err: any) {
      setError(err.message);
      if (typeof document !== "undefined") {
        document
          .querySelectorAll(".toast-nextjs, .toast-container")
          .forEach((el) => el.remove());
      }
      showToast.error(err.message);
    } finally {
      hideLoading();
    }
  };

  const details = (
    <div className="space-y-6">
      {(error || success) && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 animate-in slide-in-from-top-1 ${error ? "bg-error/10 border-error/20 text-error" : "bg-success/10 border-success/20 text-success"}`}
        >
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
          <User
            className="absolute left-3 top-10 text-textMuted group-focus-within:text-primary transition-colors"
            size={18}
          />
        </div>
        <div className="relative group">
          <Input
            name="specialization"
            label="Clinical Specialization"
            value={form.specialization}
            onChange={handleChange}
            className="pl-10"
          />
          <Briefcase
            className="absolute left-3 top-10 text-textMuted group-focus-within:text-primary transition-colors"
            size={18}
          />
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
