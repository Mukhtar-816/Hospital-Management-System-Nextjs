"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, TableCell, TableRow } from "@/components/ui/Table";

export default function DoctorAppointments() {
  const appointments = [
    {
      id: "1",
      patient: "John Doe",
      age: "28",
      gender: "M",
      time: "10:30 AM",
      reason: "Follow-up",
      status: "ready",
    },
    {
      id: "2",
      patient: "Alice Wilson",
      age: "34",
      gender: "F",
      time: "11:15 AM",
      reason: "Consultation",
      status: "waiting",
    },
    {
      id: "3",
      patient: "Bob Miller",
      age: "45",
      gender: "M",
      time: "12:00 PM",
      reason: "Emergency",
      status: "emergency",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Today's Schedule</h1>
        <p className="text-textMuted">
          View and manage your appointments for today.
        </p>
      </div>

      <Card>
        <Table
          headers={["Patient", "Info", "Time", "Reason", "Status", "Actions"]}
        >
          {appointments.map((app) => (
            <TableRow key={app.id}>
              <TableCell className="font-medium">{app.patient}</TableCell>
              <TableCell className="text-xs text-textMuted">
                {app.gender} • {app.age}yrs
              </TableCell>
              <TableCell className="font-semibold text-primary">
                {app.time}
              </TableCell>
              <TableCell>{app.reason}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    app.status === "emergency"
                      ? "rejected"
                      : app.status === "waiting"
                        ? "warning"
                        : "success"
                  }
                >
                  {app.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Link href={`/doctor/interactions/${app.id}`}>
                  <Button size="sm">Start Interaction</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
}
