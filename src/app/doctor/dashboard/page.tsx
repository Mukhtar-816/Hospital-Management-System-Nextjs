"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function DoctorDashboard() {
  const stats = [
    {
      label: "Today's Appointments",
      value: "8",
      icon: "📅",
      color: "text-primary",
    },
    { label: "Patients Seen", value: "42", icon: "✅", color: "text-success" },
    { label: "Pending Records", value: "3", icon: "📝", color: "text-warning" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text">Doctor Dashboard</h1>
        <p className="text-textMuted">
          Hello Dr. Johnson, here is your schedule for today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="flex flex-col items-center text-center"
          >
            <span className="text-4xl mb-4">{stat.icon}</span>
            <h3 className={`text-3xl font-bold ${stat.color}`}>{stat.value}</h3>
            <p className="text-sm text-textMuted uppercase tracking-wider font-semibold mt-1">
              {stat.label}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card
          title="Next Patient"
          subtitle="Your immediate upcoming appointment"
        >
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/20">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20">
                JD
              </div>
              <div>
                <h4 className="text-lg font-bold text-text">John Doe</h4>
                <p className="text-sm text-textMuted">
                  Male • 28 years • Follow-up
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="warning">High Priority</Badge>
                  <Badge>Chest Pain</Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">10:30 AM</p>
              <p className="text-sm text-textMuted">In 15 minutes</p>
              <Button className="mt-4">Start Interaction</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
