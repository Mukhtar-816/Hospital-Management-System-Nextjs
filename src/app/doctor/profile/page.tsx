"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { ProfileTemplate } from "@/components/modules/ProfileTemplate";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Forms";
import { useLoading } from "@/lib/LoadingContext";

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
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();

        setUser({
          userid: data.userid,
          useremail: data.useremail,
          role: "doctor",
        });

        setForm({
          fullname: data.fullname || "",
          specialization: data.specialization || "",
          status: data.status || "active",
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
          useremail: user.useremail,
          fullname: form.fullname,
          specialization: form.specialization,
        }),
      });

      if (!res.ok) throw new Error("Update failed");
      setSuccess("Profile updated successfully");
    } catch (err: any) {
      setError(err.message);
    } finally {
      hideLoading();
    }
  };

  const details = (
    <div className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="fullname"
          label="Full Name"
          value={form.fullname}
          onChange={handleChange}
        />
        <Input
          name="specialization"
          label="Specialization"
          value={form.specialization}
          onChange={handleChange}
        />
      </div>

      <Button onClick={handleUpdate}>Update Profile</Button>
    </div>
  );

  if (!user.userid) return null;

  return <ProfileTemplate user={user} details={details} editable={false} />;
}
