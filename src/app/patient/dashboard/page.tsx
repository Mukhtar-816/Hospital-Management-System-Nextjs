"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import React from "react";
import { 
  ClipboardList, 
  Calendar, 
  History, 
  User, 
  Activity, 
  Loader2,
  CalendarPlus
} from "lucide-react";

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
        console.error("Dashboard Load Error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-textMuted font-medium">Loading your health portal...</p>
      </div>
    );
  }

  const stats = [
    { label: "Requests", value: data?.stats.total_requests || "0", icon: ClipboardList, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Upcoming", value: data?.stats.upcoming_appointments || "0", icon: Calendar, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Visits", value: data?.stats.past_visits || "0", icon: History, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  const nextApp = data?.nextAppointment;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between bg-surface p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-text tracking-tight">Patient Portal</h1>
          <p className="text-textMuted mt-1">Manage your health records and appointments securely.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="group hover:border-primary/50 transition-all duration-300 relative overflow-hidden"
          >
            <div className={`absolute top-4 right-4 p-3 ${stat.bg} rounded-xl`}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <div className="pt-2">
               <h3 className="text-4xl font-black text-text mb-1 group-hover:scale-105 transition-transform origin-left">
                 {stat.value}
               </h3>
               <p className="text-xs font-bold text-textMuted uppercase tracking-widest">
                 {stat.label}
               </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card 
          title="Next Visit" 
          subtitle="Your immediate upcoming appointment details"
          className="bg-surface/50 backdrop-blur-sm border-none shadow-xl"
        >
          {nextApp ? (
            <div className="flex items-center gap-6 p-6 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl border border-primary/10">
              <div className="w-20 h-20 bg-primary text-white rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-xs font-black uppercase tracking-tighter opacity-80">
                  {new Date(nextApp.starttime).toLocaleDateString(undefined, { month: 'short' })}
                </span>
                <span className="text-3xl font-black leading-none">
                  {new Date(nextApp.starttime).toLocaleDateString(undefined, { day: '2-digit' })}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-text mb-1">{nextApp.type || "General Consultation"}</h4>
                <div className="flex flex-col gap-1">
                   <p className="text-sm text-textMuted flex items-center gap-2">
                     <User size={14} className="text-primary" />
                     Dr. {nextApp.doctorname}
                   </p>
                   <p className="text-sm text-textMuted flex items-center gap-2">
                     <Calendar size={14} className="text-primary" />
                     {new Date(nextApp.starttime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </p>
                </div>
                <div className="mt-6 flex gap-3">
                  <Button size="sm" className="shadow-md">Add to Calendar</Button>
                  <Button size="sm" variant="outline">Reschedule</Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-textMuted border-2 border-dashed border-border rounded-2xl bg-border/5">
              <div className="bg-surface p-4 rounded-full w-fit mx-auto mb-4 shadow-sm border border-border">
                <CalendarPlus size={32} className="text-primary opacity-60" />
              </div>
              <h4 className="text-lg font-bold text-text">No visits scheduled</h4>
              <p className="max-w-xs mx-auto mt-1">You don't have any upcoming appointments. Visit the requests page to book one.</p>
            </div>
          )}
        </Card>

        <Card 
          title="Recent Activity" 
          subtitle="Updates on your latest interactions and visits"
          className="bg-surface/50 backdrop-blur-sm border-none shadow-xl"
        >
          <div className="space-y-4">
            {data?.activity && data.activity.length > 0 ? (
              data.activity.map((activity: any) => (
                <div
                  key={activity.id}
                  className="group flex items-center justify-between p-4 rounded-2xl border border-border hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-border/5 rounded-xl text-primary">
                      <Activity size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text group-hover:text-primary transition-colors">
                        {activity.title}
                      </p>
                      <p className="text-xs text-textMuted">
                        {new Date(activity.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      activity.status === "completed" ? "success" :
                        activity.status === "scheduled" ? "warning" : "info"
                    }
                    className="rounded-lg px-3 py-1"
                  >
                    {activity.type}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-textMuted italic">
                <p>No recent activity logged in your history.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
