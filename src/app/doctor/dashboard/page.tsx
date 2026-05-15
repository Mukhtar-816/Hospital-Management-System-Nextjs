"use client";

import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Coffee,
  FileEdit,
  Loader2,
  User,
  WifiOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { showToast } from "nextjs-toast-notify";
import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useNetworkStatus } from "@/lib/hooks/useNetworkStatus";
import { handleApiError } from "@/lib/utils/errorHandler";

export default function DoctorDashboard() {
  const router = useRouter();
  const isOnline = useNetworkStatus();
  const [data, setData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [_isRetrying, setIsRetrying] = React.useState(false);

  const fetchDashboard = async () => {
    if (!isOnline) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/doctor/dashboard");
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        throw new Error(json.error || "Failed to load dashboard data");
      }
    } catch (err: any) {
      const friendlyError = handleApiError(err);
      showToast.error(friendlyError);
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  };

  React.useEffect(() => {
    fetchDashboard();
  }, [isOnline]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-textMuted font-medium">Syncing clinic records...</p>
      </div>
    );
  }

  if (!isOnline && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <div className="p-6 bg-error/10 rounded-full text-error">
          <WifiOff size={48} />
        </div>
        <h2 className="text-2xl font-bold">Offline Connection</h2>
        <p className="text-textMuted max-w-md">
          Please check your internet connection to access patient records and
          your schedule.
        </p>
        <Button onClick={fetchDashboard} variant="outline">
          Retry Connection
        </Button>
      </div>
    );
  }

  const stats = [
    {
      label: "Today's Appointments",
      value: data?.stats?.today_appointments || "0",
      icon: Calendar,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Patients Seen",
      value: data?.stats?.patients_seen || "0",
      icon: CheckCircle,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Pending Records",
      value: data?.stats?.pending_records || "0",
      icon: FileEdit,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  const nextPatient = data?.nextPatient;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between bg-surface p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-text tracking-tight">
            Clinical Workspace
          </h1>
          <p className="text-textMuted mt-1">
            Welcome, Dr. {data?.doctor?.fullname || "Provider"}. You have{" "}
            {data?.stats?.today_appointments || 0} patients scheduled today.
          </p>
        </div>
        {!isOnline && (
          <Badge variant="error" className="px-4 py-1.5 animate-pulse">
            Connection Lost
          </Badge>
        )}
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

      <div className="grid grid-cols-1 gap-8">
        <Card
          title="Current Patient Focus"
          subtitle="Direct action required for the next scheduled appointment"
          className="bg-surface/50 backdrop-blur-sm border-none shadow-xl"
        >
          {nextPatient ? (
            <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-gradient-to-r from-primary/10 to-transparent rounded-2xl border border-primary/20 gap-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-3xl shadow-xl shadow-primary/30">
                  {nextPatient.patientname
                    ?.split(" ")
                    .map((n: any) => n[0])
                    .join("") || <User size={32} />}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-text">
                    {nextPatient.patientname || "Patient Unknown"}
                  </h4>
                  <p className="text-sm text-textMuted flex items-center gap-2 mt-1">
                    <Badge variant="info" className="rounded-md">
                      {nextPatient.gender || "N/A"}
                    </Badge>
                    <span className="opacity-50">•</span>
                    <span className="font-medium">
                      {nextPatient.type || "General Consultation"}
                    </span>
                  </p>
                  <div className="flex gap-2 mt-4">
                    {nextPatient.status === "in_progress" ? (
                      <Badge
                        variant="success"
                        className="px-3 py-1 animate-pulse"
                      >
                        In Progress
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="px-3 py-1">
                        Ready for Consultation
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-center md:text-right flex flex-col items-center md:items-end gap-2">
                <div className="flex items-center gap-2 text-primary">
                  <Clock size={20} />
                  <p className="text-4xl font-black">
                    {nextPatient.starttime
                      ? new Date(nextPatient.starttime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "--:--"}
                  </p>
                </div>
                <p className="text-xs font-bold text-textMuted uppercase tracking-widest mb-4">
                  Target Consultation Time
                </p>
                <Button
                  size="lg"
                  className="gap-2 px-8 shadow-lg shadow-primary/20"
                  disabled={!isOnline}
                  onClick={() =>
                    router.push(
                      `/doctor/interactions/${nextPatient.appointmentid}`,
                    )
                  }
                >
                  {nextPatient.status === "in_progress"
                    ? "Continue Session"
                    : "Start Consultation"}
                  <ArrowRight size={18} />
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-textMuted border-2 border-dashed border-border rounded-2xl bg-border/5">
              <div className="bg-surface p-4 rounded-full w-fit mx-auto mb-4 shadow-sm border border-border">
                <Coffee size={32} className="text-primary opacity-60" />
              </div>
              <h4 className="text-lg font-bold text-text">
                No pending patients
              </h4>
              <p className="max-w-xs mx-auto mt-1">
                All currently scheduled appointments have been processed. Time
                for a well-deserved break!
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
