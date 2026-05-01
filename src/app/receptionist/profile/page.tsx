"use client";

import { useEffect, useState } from "react";
import { ProfileTemplate } from "@/components/modules/ProfileTemplate";
import { useLoading } from "@/lib/LoadingContext";

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
        console.error("Failed to load receptionist profile");
      } finally {
        hideLoading();
      }
    };

    fetchProfile();
  }, []);

  if (!user) return null;

  return (
    <ProfileTemplate
      editable={false}
      user={{
        userid: user.userid,
        useremail: user.useremail,
        role: user.role,
      }}
    />
  );
}
