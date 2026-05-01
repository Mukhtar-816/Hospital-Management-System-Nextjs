"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, TableCell, TableRow } from "@/components/ui/Table";
import { useRouter } from "next/navigation";
import { useLoading } from "@/lib/LoadingContext";
import { Modal } from "@/components/ui/Modal";
import { InteractionDetails } from "@/components/medical/InteractionDetails";

type Appointment = {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  scheduledAt: string;
  status: string;
};

export default function DoctorAppointments() {
  const { showLoading, hideLoading } = useLoading();
  const router = useRouter();
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false);
  const [selectedAppId, setSelectedAppId] = React.useState<string | null>(null);

  const loadAppointments = async () => {
    try {
      const res = await fetch("/api/appointments/doctor");
      const data = await res.json();
      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (error) {
      console.error("Failed to load appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadAppointments();
  }, []);

  const statusMap: Record<string, any> = {
    scheduled: "warning",
    checked_in: "info",
    in_progress: "default",
    completed: "success",
    no_show: "error",
    cancelled: "error",
  };

  const handleStatusUpdate = async (id: string, action: string) => {
    try {
      showLoading();
      const res = await fetch(`/api/appointments/${id}/${action}`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to update status");

      if (action === "start") {
        router.push(`/doctor/interactions/${id}`);
      } else {
        loadAppointments();
      }
    } catch (error) {
      console.error(`Failed to ${action} appointment:`, error);
    } finally {
      hideLoading();
    }
  };

  const handleViewRecord = (id: string) => {
    setSelectedAppId(id);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">My Appointments</h1>
        <p className="text-textMuted">
          View and manage your scheduled appointments.
        </p>
      </div>

      <Card>
        <Table
          headers={["Appointment ID", "Patient ID", "Date", "Time", "Status", "Actions"]}
        >
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-textMuted">
                Loading appointments...
              </TableCell>
            </TableRow>
          ) : appointments.length > 0 ? (
            appointments.map((app) => (
              <TableRow key={app.appointmentId}>
                <TableCell className="font-medium text-primary">
                  {app.appointmentId}
                </TableCell>
                <TableCell>{app.patientId}</TableCell>
                <TableCell>
                  {new Date(app.scheduledAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="font-semibold text-primary">
                  {new Date(app.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </TableCell>
                <TableCell>
                  <Badge variant={statusMap[app.status] || "default"}>
                    {app.status}
                  </Badge>
                </TableCell>
                <TableCell className="flex gap-2">
                  {app.status === "checked_in" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(app.appointmentId, "start")}
                    >
                      Start Session
                    </Button>
                  )}
                  {app.status === "in_progress" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => router.push(`/doctor/interactions/${app.appointmentId}`)}
                    >
                      Continue Session
                    </Button>
                  )}
                  {app.status === "completed" && (
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleViewRecord(app.appointmentId)}
                    >
                      View Record
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-textMuted">
                No appointments found.
              </TableCell>
            </TableRow>
          )}
        </Table>
      </Card>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Clinical Record"
        className="max-w-6xl"
      >
        {selectedAppId && (
          <div className="max-h-[80vh] overflow-y-auto pr-2">
            <InteractionDetails appointmentId={selectedAppId} />
          </div>
        )}
      </Modal>
    </div>
  );
}
