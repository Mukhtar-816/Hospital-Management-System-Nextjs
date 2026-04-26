"use client";

import { useEffect, useState } from "react";
import { ProfileTemplate } from "@/components/modules/ProfileTemplate";

export default function ReceptionistProfile() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/receptionist/me");

        if (!res.ok) throw new Error();

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to load receptionist profile");
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return <p className="p-4">Loading profile...</p>;
  }

  return (
    <ProfileTemplate
      user={{
        username: user.username,
        useremail: user.useremail,
        role: user.role,
      }}
    />
  );
}