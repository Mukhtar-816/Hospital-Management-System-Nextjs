"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Forms";
import { Modal } from "@/components/ui/Modal";
import { Table, TableCell, TableHeader, TableRow } from "@/components/ui/Table";

type BadgeVariant =
  | "default"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info";

interface Appointment {
  id: string;
  patient: string;
  doctor: string;
  date: string;
  time: string;
  status: BadgeVariant;
}

export default function ReceptionistAppointments() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingApp, setEditingApp] = React.useState<Appointment | null>(null);

  const appointments: Appointment[] = [
    {
      id: "APP-101",
      patient: "John Doe",
      doctor: "Dr. Sarah Johnson",
      date: "2023-10-24",
      time: "10:30 AM",
      status: "warning",
    },
    {
      id: "APP-102",
      patient: "Jane Smith",
      doctor: "Dr. Michael Chen",
      date: "2023-10-25",
      time: "02:00 PM",
      status: "success",
    },
    {
      id: "APP-103",
      patient: "Robert Wilson",
      doctor: "Dr. Sarah Johnson",
      date: "2023-10-24",
      time: "11:30 AM",
      status: "error",
    },
  ];

  const handleEdit = (app: Appointment) => {
    setEditingApp(app);
    setIsModalOpen(true);
  };

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
        headers={["ID", "Patient", "Doctor", "Date/Time", "Status", "Actions"]}
      >
        {appointments.map((app) => (
          <TableRow key={app.id}>
            <TableCell className="font-bold text-primary">{app.id}</TableCell>
            <TableCell>{app.patient}</TableCell>
            <TableCell>{app.doctor}</TableCell>
            <TableCell>
              <p className="text-sm font-medium">{app.date}</p>
              <p className="text-xs text-textMuted">{app.time}</p>
            </TableCell>
            <TableCell>
              <Badge variant={app.status}>{app.status}</Badge>
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(app)}
              >
                Edit
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </Table>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingApp(null);
        }}
        title={editingApp ? "Edit Appointment" : "New Appointment"}
      >
        <form className="space-y-4">
          <Input label="Patient Name" defaultValue={editingApp?.patient} />
          <Select
            label="Doctor"
            defaultValue={editingApp?.doctor}
            options={[
              { value: "Dr. Sarah Johnson", label: "Dr. Sarah Johnson" },
              { value: "Dr. Michael Chen", label: "Dr. Michael Chen" },
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              defaultValue={editingApp?.date}
              required
            />
            <Input
              label="Time"
              type="time"
              defaultValue={editingApp?.time}
              required
            />
          </div>
          <Select
            label="Status"
            defaultValue={editingApp?.status}
            options={[
              { value: "warning", label: "Pending" },
              { value: "success", label: "Confirmed" },
              { value: "error", label: "Cancelled" },
            ]}
          />
          <div className="pt-4 flex gap-3">
            <Button className="flex-1" onClick={() => setIsModalOpen(false)}>
              {editingApp ? "Update Appointment" : "Create Appointment"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
