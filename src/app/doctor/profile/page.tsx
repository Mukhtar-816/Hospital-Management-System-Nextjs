"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { ProfileTemplate } from "@/components/modules/ProfileTemplate";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Forms";

export default function DoctorProfile() {
  const [loading, setLoading] = useState(true);
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

  // 🔥 LOAD DATA
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch("/api/doctor/me");

        if (!res.ok) throw new Error("Failed to load profile");

        const data = await res.json();

        console.log(data);

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
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // 🔥 HANDLE CHANGE
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 UPDATE PROFILE
  const handleUpdate = async () => {
    setError("");
    setSuccess("");

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

  if (loading) {
    return <p className="p-4 text-textMuted">Loading profile...</p>;
  }

  return <ProfileTemplate user={user} details={details} editable={false} />;
}
