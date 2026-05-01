"use client";

import { showToast } from "nextjs-toast-notify";
import { useEffect, useState } from "react";
import { ProfileTemplate } from "@/components/modules/ProfileTemplate";
import { Input, Select } from "@/components/ui/Forms";
import { useLoading } from "@/lib/LoadingContext";

export default function PatientProfile() {
  const { showLoading, hideLoading } = useLoading();
  const [userData, setUserData] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);

  async function getUserProfile() {
    showLoading();
    try {
      const res = await fetch("/api/patient/me");
      if (!res.ok) {
        showToast.error("Error Getting Profile");
        return;
      }
      const data = await res.json();
      setUserData(data);
      setFormData(data);
    } catch {
      showToast.error("Something went wrong");
    } finally {
      hideLoading();
    }
  }

  async function handleUpdate() {
    showLoading();
    try {
      const res = await fetch("/api/patient/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientid: userData.patientid,
          userid: userData.userid,
          fullname: formData.fullname,
          useremail: formData.useremail,
          address: formData.address,
          gender: formData.gender,
          patientnumber: formData?.patientnumber,
        }),
      });

      if (!res.ok) {
        showToast.error("Update failed");
        return;
      }

      showToast.success("Profile updated");
      getUserProfile();
    } catch (err: any) {
      showToast.error(err.message);
    } finally {
      hideLoading();
    }
  }

  useEffect(() => {
    getUserProfile();
  }, []);

  if (!formData) return null;

  const details = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        label="Patient Number"
        value={formData.patientnumber || ""}
        onChange={(e) =>
          setFormData({ ...formData, patientnumber: e.target.value })
        }
      />
      <Input label="Email" value={formData.useremail || ""} readOnly />
      <Input
        label="Full Name"
        value={formData.fullname || ""}
        onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
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
      <div className="md:col-span-2">
        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded active:animate-pulse"
        >
          Save Changes
        </button>
      </div>
    </div>
  );

  return (
    <ProfileTemplate
      user={{
        userid: userData.userid || "",
        useremail: userData.useremail || "",
        role: "patient",
      }}
      editable={false}
      details={details}
    />
  );
}
