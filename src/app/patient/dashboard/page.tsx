"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import React from "react";

export default function PatientDashboard() {
  const [data, setData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/patient/dashboard");
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = [
    { label: "Total Requests", value: data?.stats.total_requests || "0", icon: "📝" },
    { label: "Upcoming Appointments", value: data?.stats.upcoming_appointments || "0", icon: "📅" },
    { label: "Past Visits", value: data?.stats.past_visits || "0", icon: "🏥" },
  ];

  const nextApp = data?.nextAppointment;

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
          {nextApp ? (
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex flex-col items-center justify-center text-primary border border-primary/20 text-center">
                <span className="text-xs font-bold uppercase">
                  {new Date(nextApp.starttime).toLocaleDateString(undefined, { month: 'short' })}
                </span>
                <span className="text-2xl font-bold">
                  {new Date(nextApp.starttime).toLocaleDateString(undefined, { day: '2-digit' })}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-text">{nextApp.type || "Consultation"}</h4>
                <p className="text-sm text-textMuted">
                  Dr. {nextApp.doctorname} • {new Date(nextApp.starttime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <div className="mt-4 flex gap-3">
                  <Button size="sm">Add to Calendar</Button>
                  <Button size="sm" variant="secondary">
                    Reschedule
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-textMuted">
              No upcoming appointments scheduled.
            </div>
          )}
        </Card>

        <Card title="Recent Activity" subtitle="Your latest health updates">
          <div className="space-y-4">
            {data?.activity && data.activity.length > 0 ? (
              data.activity.map((activity: any) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-border/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-2 h-10 rounded-full ${activity.type === "Appointment"
                          ? "bg-success"
                          : "bg-primary"
                        }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-text">
                        {activity.title}
                      </p>
                      <p className="text-xs text-textMuted">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      activity.status === "completed" ? "success" :
                        activity.status === "scheduled" ? "warning" : "info"
                    }
                  >
                    {activity.type}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-textMuted">
                No recent activity found.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
