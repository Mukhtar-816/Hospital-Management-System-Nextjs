"use client";

import { ProfileTemplate } from "@/components/modules/ProfileTemplate";
import { Input, Select } from "@/components/ui/Forms";
import { showToast } from "nextjs-toast-notify";
import { useEffect, useState } from "react";

export default function PatientProfile() {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);

  async function getUserProfile() {
    setLoading(true);
    try {
      const res = await fetch("/api/patient/me");

      if (!res.ok) {
        showToast.error("Error Getting Profile");
        return;
      }

      const data = await res.json();
      setUserData(data);
      setFormData(data); // 👈 editable copy

    } catch {
      showToast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    try {
      const res = await fetch(`/api/patient/${userData.patientid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.name,
          address: formData.address,
          gender: formData.gender,
        }),
      });

      if (!res.ok) {
        showToast.error("Update failed");
        return;
      }

      showToast.success("Profile updated");
      getUserProfile();

    } catch {
      showToast.error("Something went wrong");
    }
  }

  useEffect(() => {
    getUserProfile();
  }, []);

  if (loading || !formData) {
    return <div className="p-4">Loading...</div>;
  }

  const details = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* ❌ READ ONLY */}
      <Input
        label="Patient Number"
        value={userData.patientnumber || ""}
        readOnly
      />

      <Input
        label="Email"
        value={userData.useremail || ""}
        readOnly
      />

      {/* ✅ EDITABLE */}
      <Input
        label="Full Name"
        value={formData.name || ""}
        onChange={(e) =>
          setFormData({ ...formData, name: e.target.value })
        }
      />

      <div className="md:col-span-2">
        <Input
          label="Address"
          value={formData.address || ""}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
        />
      </div>

      <Select
        label="Gender"
        value={formData.gender || ""}
        onChange={(value: string) =>
          setFormData({ ...formData, gender: value })
        }
        options={[
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "other", label: "Other" },
        ]}
      />

      {/* SAVE BUTTON */}
      <div className="md:col-span-2">
        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </div>

    </div>
  );

  return (
    <ProfileTemplate
      user={{
        userName: userData.username || "",
        userEmail: userData.useremail || "",
        role: "patient",
      }}
      details={details}
    />
  );
}