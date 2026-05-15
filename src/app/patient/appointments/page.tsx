"use client";

import { AlertCircle, Calendar, Clock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { showToast } from "nextjs-toast-notify";
import React from "react";
import { Badge, Skeleton } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Table, TableCell, TableRow } from "@/components/ui/Table";
import { useLoading } from "@/lib/LoadingContext";
import { devError, devLog } from "@/lib/logger";

type Appointment = {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  scheduledAt: string;
  status: string;
};

export default function PatientAppointments() {
  const { showLoading, hideLoading } = useLoading();
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedApp, setSelectedApp] = React.useState<Appointment | null>(
    null,
  );

  const loadAppointments = async () => {
    try {
      const res = await fetch("/api/appointments/patient");
      const data = await res.json();
      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (error) {
      devError("Failed to load appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const router = useRouter();

  React.useEffect(() => {
    loadAppointments();
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    showLoading();
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Cancellation failed");
      showToast.success("Appointment successfully cancelled");
      setSelectedApp(null);
      loadAppointments();
    } catch (err: any) {
      showToast.error(err.message);
    } finally {
      hideLoading();
    }
  };

  const statusMap: Record<string, any> = {
    scheduled: "warning",
    checked_in: "info",
    in_progress: "primary",
    completed: "success",
    no_show: "error",
    cancelled: "error",
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-text tracking-tight">
            My Appointments
          </h1>
          <p className="text-textMuted font-medium italic mt-1">
            Track your healthcare journey and upcoming consultations.
          </p>
        </div>
        <Button
          onClick={() => {
            router.push("/patient/requests/new");
          }}
          variant="primary"
          className="rounded-2xl shadow-xl shadow-primary/20"
        >
          Request Appointment
        </Button>
      </div>

      <Card className="border-none shadow-2xl shadow-black/5 overflow-hidden">
        <Table
          headers={[
            "Appointment Details",
            "Provider",
            "Date & Time",
            "Status",
            "Actions",
          ]}
        >
          {isLoading ? (
            Array(5)
              .fill(0)
              .map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5} className="py-6">
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                </TableRow>
              ))
          ) : appointments.length > 0 ? (
            appointments.map((app) => (
              <TableRow
                key={app.appointmentId}
                onClick={() => setSelectedApp(app)}
                className="cursor-pointer hover:bg-primary/[0.02] transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="font-black text-text">
                        #{app.appointmentId}
                      </p>
                      <p className="text-[10px] text-textMuted font-black uppercase tracking-widest">
                        Consultation
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 font-bold text-text">
                    <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                      <User size={12} />
                    </div>
                    Dr. {app.doctorId}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-bold text-text">
                      {new Date(app.scheduledAt).toLocaleDateString(undefined, {
                        dateStyle: "medium",
                      })}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-textMuted font-medium">
                      <Clock size={12} />
                      {new Date(app.scheduledAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={statusMap[app.status.toLowerCase()] || "info"}
                    dot
                  >
                    {app.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-black text-[10px] uppercase tracking-[0.2em] text-primary"
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-16">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-border/5 rounded-full text-textMuted">
                    <Calendar size={32} />
                  </div>
                  <p className="text-textMuted font-medium">
                    No appointments found in your record.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Book Your First Visit
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </Table>
      </Card>

      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title="Consultation Details"
        maxWidth="max-w-4xl"
      >
        {selectedApp && (
          <div className="space-y-6 py-2 ">
            <div className="flex flex-col items-center text-center p-6 bg-surface rounded-3xl border border-border/50 space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Calendar size={32} />
              </div>
              <div>
                <p className="text-[10px] text-textMuted font-black uppercase tracking-widest mb-1">
                  Appointment ID
                </p>
                <p className="text-xl font-black text-text">
                  #{selectedApp.appointmentId}
                </p>
              </div>
            </div>

            <div className="space-y-4 px-2">
              <div className="flex justify-between items-center py-3 border-b border-border/50">
                <span className="text-[10px] font-black text-textMuted uppercase">
                  Current Status
                </span>
                <Badge
                  variant={
                    statusMap[selectedApp.status.toLowerCase()] || "info"
                  }
                  dot
                >
                  {selectedApp.status.toUpperCase()}
                </Badge>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border/50">
                <span className="text-[10px] font-black text-textMuted uppercase">
                  Assigned Doctor
                </span>
                <span className="text-sm font-bold text-text">
                  Dr. {selectedApp.doctorId}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border/50">
                <span className="text-[10px] font-black text-textMuted uppercase">
                  Date & Time
                </span>
                <span className="text-sm font-bold text-text">
                  {new Date(selectedApp.scheduledAt).toLocaleDateString()} @{" "}
                  {new Date(selectedApp.scheduledAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            <div className="pt-4 px-2 space-y-3">
              {selectedApp.status === "scheduled" && (
                <Button
                  className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-red-500/10"
                  variant="danger"
                  onClick={() => handleCancel(selectedApp.appointmentId)}
                >
                  Cancel Appointment
                </Button>
              )}
              <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 flex items-start gap-3">
                <AlertCircle
                  size={16}
                  className="text-amber-500 shrink-0 mt-0.5"
                />
                <p className="text-[10px] text-amber-800 font-bold leading-relaxed italic">
                  Cancellations within 24 hours of the appointment may incur a
                  late cancellation fee.
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
