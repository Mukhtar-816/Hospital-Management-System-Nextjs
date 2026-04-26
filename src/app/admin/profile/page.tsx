"use client";

import { useEffect, useState } from "react";
import { ProfileTemplate } from "@/components/modules/ProfileTemplate";

export default function AdminProfile() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/admin/me", {
          headers: {
            'Content-Type': 'application/json',
          },
          method: "GET"
        });
        if (!res.ok) throw new Error();

        const data = await res.json();
        console.log(data);

        setUser(data);
      } catch {
        console.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  if (!user) return <p className="p-4">Loading...</p>;

  return <ProfileTemplate user={user} editable={false} />;
}