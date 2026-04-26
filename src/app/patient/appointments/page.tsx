"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, TableCell, TableRow } from "@/components/ui/Table";

export default function PatientAppointments() {
  const appointments = [
    {
      id: "APP-001",
      doctor: "Dr. Sarah Johnson",
      department: "General Medicine",
      date: "2023-10-24",
      time: "10:30 AM",
      status: "pending",
    },
    {
      id: "APP-002",
      doctor: "Dr. Michael Chen",
      department: "Dermatology",
      date: "2023-11-02",
      time: "02:15 PM",
      status: "pending",
    },
  ];

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
            "Doctor",
            "Department",
            "Date & Time",
            "Status",
            "Actions",
          ]}
        >
          {appointments.map((app) => (
            <TableRow key={app.id}>
              <TableCell className="font-medium text-primary">
                {app.id}
              </TableCell>
              <TableCell>{app.doctor}</TableCell>
              <TableCell>{app.department}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{app.date}</span>
                  <span className="text-xs text-textMuted">{app.time}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    app.status as
                      | "pending"
                      | "success"
                      | "info"
                      | "warning"
                      | "error"
                      | "default"
                  }
                >
                  {app.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-error hover:bg-error/10"
                >
                  Cancel
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
}
