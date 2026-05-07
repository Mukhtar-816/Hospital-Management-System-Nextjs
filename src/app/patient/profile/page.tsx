"use client";

import { showToast } from "nextjs-toast-notify";
import { useEffect, useState } from "react";
import { ProfileTemplate } from "@/components/modules/ProfileTemplate";
import { Input, Select } from "@/components/ui/Forms";
import { useLoading } from "@/lib/LoadingContext";
import { Button } from "@/components/ui/Button";
import { Save, User, MapPin, Hash, VenetianMask } from "lucide-react";

export default function PatientProfile() {
  const { showLoading, hideLoading } = useLoading();
  const [userData, setUserData] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);

  async function getUserProfile() {
    showLoading();
    try {
      const res = await fetch("/api/patient/me");
      if (!res.ok) {
        showToast.error("Security retrieval failure.");
        return;
      }
      const data = await res.json();
      setUserData(data);
      setFormData(data);
    } catch {
      showToast.error("Connection synchronization error.");
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
        showToast.error("Update protocol rejected by server.");
        return;
      }

      showToast.success("Identity profile successfully committed.");
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative group">
          <Input
            label="Internal Patient Number"
            value={formData.patientnumber || ""}
            onChange={(e) =>
              setFormData({ ...formData, patientnumber: e.target.value })
            }
            className="pl-10"
          />
          <Hash className="absolute left-3 top-10 text-textMuted group-focus-within:text-primary transition-colors" size={18} />
        </div>
        
        <div className="relative group">
          <Input
            label="Legal Full Name"
            value={formData.fullname || ""}
            onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
            className="pl-10"
          />
          <User className="absolute left-3 top-10 text-textMuted group-focus-within:text-primary transition-colors" size={18} />
        </div>

        <div className="md:col-span-2 relative group">
          <Input
            label="Registered Residence"
            value={formData.address || ""}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="pl-10"
          />
          <MapPin className="absolute left-3 top-10 text-textMuted group-focus-within:text-primary transition-colors" size={18} />
        </div>

        <div className="relative group">
          <Select
            label="Gender Identity"
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
        </div>
      </div>

      <div className="pt-6 border-t border-border flex justify-end">
        <Button
          onClick={handleUpdate}
          className="gap-2 px-8 shadow-lg shadow-primary/20"
        >
          <Save size={18} />
          Commit Changes
        </Button>
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
      details={details}
    />
  );
}
