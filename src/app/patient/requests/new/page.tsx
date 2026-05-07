"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Select, Textarea } from "@/components/ui/Forms";
import { useLoading } from "@/lib/LoadingContext";

export default function NewRequest() {
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();
  const [formData, setFormData] = React.useState({
    preferredtime: "",
    symptoms: "",
    priority: "low",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoading();
    try {
      const res = await fetch("/api/appointmentrequests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit request");
      }

      router.push("/patient/requests");
    } catch (error: any) {
      alert(error.message);
    } finally {
      hideLoading();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">New Request</h1>
        <p className="text-textMuted">
          Describe your symptoms to request an appointment.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Textarea
            label="What symptoms are you experiencing?"
            placeholder="Please describe your symptoms in detail..."
            required
            value={formData.symptoms}
            onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Preferred Date & Time"
              type="datetime-local"
              required
              value={formData.preferredtime}
              onChange={(e) => setFormData({ ...formData, preferredtime: e.target.value })}
            />
            <Select
              label="Priority Level"
              value={formData.priority}
              onChange={(e: any) => setFormData({ ...formData, priority: e.target.value })}
              options={[
                { value: "low", label: "Low - Routine" },
                { value: "medium", label: "Medium - Urgent" },
                { value: "high", label: "High - Emergency" },
              ]}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit">
              Submit Request
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
