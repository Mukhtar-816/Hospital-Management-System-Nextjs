"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function PatientDashboard() {
  const stats = [
    { label: "Total Requests", value: "12", icon: "📝" },
    { label: "Upcoming Appointments", value: "2", icon: "📅" },
    { label: "Past Visits", value: "8", icon: "🏥" },
  ];

  const recentActivity = [
    {
      id: "act-1",
      type: "Request",
      title: "Consultation for headache",
      status: "pending",
      date: "2 hours ago",
    },
    {
      id: "act-2",
      type: "Appointment",
      title: "Checkup with Dr. Smith",
      status: "success",
      date: "Yesterday",
    },
    {
      id: "act-3",
      type: "Record",
      title: "Prescription updated",
      status: "info",
      date: "2 days ago",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text">Dashboard</h1>
        <p className="text-textMuted">Welcome back to your health portal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="flex flex-col items-center text-center"
          >
            <span className="text-4xl mb-4">{stat.icon}</span>
            <h3 className="text-3xl font-bold text-text">{stat.value}</h3>
            <p className="text-sm text-textMuted uppercase tracking-wider font-semibold mt-1">
              {stat.label}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Upcoming Appointment" subtitle="Your next scheduled visit">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex flex-col items-center justify-center text-primary border border-primary/20">
              <span className="text-xs font-bold uppercase">Oct</span>
              <span className="text-2xl font-bold">24</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-text">General Checkup</h4>
              <p className="text-sm text-textMuted">
                Dr. Sarah Johnson • 10:30 AM
              </p>
              <div className="mt-4 flex gap-3">
                <Button size="sm">Add to Calendar</Button>
                <Button size="sm" variant="secondary">
                  Reschedule
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Recent Activity" subtitle="Your latest health updates">
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-border/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-2 h-10 rounded-full ${
                      activity.type === "Request"
                        ? "bg-warning"
                        : activity.type === "Appointment"
                          ? "bg-success"
                          : "bg-primary"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-text">
                      {activity.title}
                    </p>
                    <p className="text-xs text-textMuted">{activity.date}</p>
                  </div>
                </div>
                <Badge
                  variant={
                    activity.status as
                      | "pending"
                      | "success"
                      | "info"
                      | "warning"
                      | "error"
                      | "default"
                  }
                >
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
