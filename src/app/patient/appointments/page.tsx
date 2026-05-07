"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, TableCell, TableRow } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { InteractionDetails } from "@/components/medical/InteractionDetails";

type Appointment = {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  scheduledAt: string;
  status: string;
};

export default function PatientAppointments() {
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const loadAppointments = async () => {
    try {
      const res = await fetch("/api/appointments/patient");
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">My Appointments</h1>
        <p className="text-textMuted">Upcoming visits and consultations.</p>
      </div>

      <Card>
        <Table
          headers={[
            "ID",
            "Doctor ID",
            "Date",
            "Time",
            "Status",
            "Actions",
          ]}
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
                <TableCell>{app.doctorId}</TableCell>
                <TableCell>
                  {new Date(app.scheduledAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(app.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </TableCell>
                <TableCell>
                  <Badge variant={statusMap[app.status] || "default"}>
                    {app.status}
                  </Badge>
                </TableCell>
                <TableCell className="flex gap-2">
                  {app.status === "scheduled" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-error hover:bg-error/10"
                    >
                      Cancel
                    </Button>
                  ) : (
                    <span className="text-xs text-textMuted italic">No actions</span>
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

    </div>
  );
}
