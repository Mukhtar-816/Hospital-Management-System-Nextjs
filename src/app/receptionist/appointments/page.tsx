"use client"; import { devLog, devError } from "@/lib/logger";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, TableCell, TableRow } from "@/components/ui/Table";
import { useLoading } from "@/lib/LoadingContext";
import { AppointmentModal } from "@/components/modules/AppointmentModal";

type BadgeVariant =
  | "default"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info";

type Appointment = {
  id: string;
  patientid: string;
  patientname: string;
  doctorid: string;
  doctorname: string;
  scheduledat: string;
  status: "scheduled" | "checked_in" | "in_progress" | "completed" | "no_show" | "cancelled";
};

export default function Receptionist() {
  const { showLoading, hideLoading } = useLoading();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);

  const statusMap: Record<string, BadgeVariant> = {
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
      loadAppointments();
    } catch (error) {
      devError(`Failed to ${action} appointment:`, error);
    } finally {
      hideLoading();
    }
  };

  const loadAppointments = async () => {
    try {
      const res = await fetch("/api/appointments");
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (error) {
      devError("Failed to load appointments:", error);
    }
  };

  React.useEffect(() => {
    loadAppointments();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Appointments</h1>
          <p className="text-textMuted">
            Manage all scheduled visits and patient check-ins.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ New Appointment</Button>
      </div>

      <Table
        headers={["id", "Patient", "Doctor", "Date/Time", "Status", "Actions"]}
      >
        {appointments?.length > 0 ? appointments.map((app) => (
          <TableRow key={app.id}>
            <TableCell className="font-bold text-primary">
              {app.id}
            </TableCell>
            <TableCell>{app.patientname}</TableCell>
            <TableCell>{app.doctorname}</TableCell>
            <TableCell>
              <p className="text-sm font-medium">
                {app.scheduledat ? new Date(app.scheduledat).toLocaleDateString() : "N/A"}
              </p>
              <p className="text-xs text-textMuted">
                {app.scheduledat ? new Date(app.scheduledat).toLocaleTimeString() : ""}
              </p>
            </TableCell>
            <TableCell>
              <Badge variant={statusMap[app.status]}>
                {app.status}
              </Badge>
            </TableCell>
            <TableCell className="flex gap-2">
              <Button variant="ghost" size="sm">
                View
              </Button>
              {app.status === "scheduled" && (
                <>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleStatusUpdate(app.id, "checkin")}
                  >
                    Check-in
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-error hover:bg-error/10"
                    onClick={() => handleStatusUpdate(app.id, "no-show")}
                  >
                    No-show
                  </Button>
                </>
              )}
            </TableCell>
          </TableRow>
        )) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-textMuted">
              No appointments found
            </TableCell>
          </TableRow>
        )}
      </Table>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => loadAppointments()}
      />
    </div>
  );
}