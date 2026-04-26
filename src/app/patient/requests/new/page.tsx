"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Select, Textarea } from "@/components/ui/Forms";

export default function NewRequest() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/patient/requests");
    }, 1000);
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
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Preferred Date & Time"
              type="datetime-local"
              required
            />
            <Select
              label="Priority Level"
              options={[
                { value: "low", label: "Low - Routine checkup" },
                { value: "medium", label: "Medium - Not urgent" },
                { value: "high", label: "High - Urgent care" },
              ]}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Submit Request
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
