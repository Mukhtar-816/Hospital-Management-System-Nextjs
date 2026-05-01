"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

import { useRouter } from "next/navigation";
import React from "react";

export default function DoctorDashboard() {
  const router = useRouter();
  const [data, setData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/doctor/dashboard");
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
    {
      label: "Today's Appointments",
      value: data?.stats.today_appointments || "0",
      icon: "📅",
      color: "text-primary",
    },
    { label: "Patients Seen", value: data?.stats.patients_seen || "0", icon: "✅", color: "text-success" },
    { label: "Pending Records", value: data?.stats.pending_records || "0", icon: "📝", color: "text-warning" },
  ];

  const nextPatient = data?.nextPatient;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text">Doctor Dashboard</h1>
        <p className="text-textMuted">
          Hello Dr. {data?.doctor?.fullname || "Doctor"}, here is your schedule for today.
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
          {nextPatient ? (
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/20">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20">
                  {nextPatient.patientname.split(' ').map((n: any) => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-text">{nextPatient.patientname}</h4>
                  <p className="text-sm text-textMuted">
                    {nextPatient.gender || "Patient"} • {nextPatient.type || "Checkup"}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {nextPatient.status === 'in_progress' ? (
                      <Badge variant="info">In Progress</Badge>
                    ) : (
                      <Badge variant="warning">Checked In</Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  {new Date(nextPatient.starttime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-sm text-textMuted">Scheduled Time</p>
                <Button
                  className="mt-4"
                  onClick={() => router.push(`/doctor/interactions/${nextPatient.appointmentid}`)}
                >
                  {nextPatient.status === 'in_progress' ? "Continue Interaction" : "Start Interaction"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-textMuted">
              No patients currently waiting.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
