"use client";

import type React from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Forms";

interface ProfileTemplateProps {
  user: {
    username: string;
    useremail: string;
    role: string;
  };
  details?: React.ReactNode;
  editable?: boolean;
}

export const ProfileTemplate = ({ user, details, editable = true }: ProfileTemplateProps) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text">Profile</h1>
        <p className="text-textMuted">Manage your account information.</p>
      </div>

      <div className="space-y-6">
        <Card title="Account Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <Input label="Username" defaultValue={user.username} readOnly />
            <Input label="Email" defaultValue={user.useremail} readOnly />
            <div className="md:col-span-2">
              <Input
                label="Account Role"
                defaultValue={user.role}
                readOnly
                className="capitalize"
              />
            </div>
          </div>
        </Card>

        {details && (
          <Card title="Personal Details">
            <div className="pt-4">{details}</div>
          </Card>
        )}

        <div className="flex justify-end gap-3">
          {editable && <Button variant="secondary" type="button">
            Edit Profile
          </Button>}
          {editable && <Button type="submit">Save Changes</Button>}
        </div>
      </div>
    </div>
  );
};
