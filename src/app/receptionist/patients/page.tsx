"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Forms";
import { Modal } from "@/components/ui/Modal";
import { Table, TableCell, TableRow } from "@/components/ui/Table";
import { useLoading } from "@/lib/LoadingContext";

type Patient = {
  userid: string;
  patientid: string;
  fullname: string;
  useremail: string;
  patientnumber: string;
  address?: string;
  gender?: string;
};

export default function ReceptionistPatients() {
  const { showLoading, hideLoading } = useLoading();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    gender: "other",
  });

  const loadPatients = async () => {
    showLoading();
    try {
      const res = await fetch("/api/receptionist/patients");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPatients(data || []);
    } catch (_err) {
      console.log("Failed to load patients");
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    showLoading();
    try {
      const res = await fetch("/api/patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: formData.fullname,
          useremail: formData.email,
          password: formData.password,
          address: formData.address,
          gender: formData.gender,
          patientnumber: formData.phone,
        }),
      });

      if (!res.ok) throw new Error();

      setIsModalOpen(false);
      setFormData({
        fullname: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        gender: "other",
      });

      loadPatients();
    } catch {
      console.error("Failed to create patient");
    } finally {
      hideLoading();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Patients Directory</h1>
          <p className="text-textMuted">Manage and view patient registrations.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Add New Patient</Button>
      </div>

      <Card>
        <Table headers={["Name", "Email", "Phone", "Actions"]}>
          {patients.map((patient) => (
            <TableRow key={patient.patientid}>
              <TableCell className="font-medium text-primary">
                {patient.fullname}
              </TableCell>
              <TableCell>{patient.useremail}</TableCell>
              <TableCell>{patient.patientnumber || "N/A"}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">View History</Button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Patient"
      >
        <div className="space-y-4">
          <Input
            name="fullname"
            label="Full Name"
            value={formData.fullname}
            onChange={handleChange}
          />
          <Input
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          <Input
            name="phone"
            label="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />
          <Input
            name="address"
            label="Address"
            value={formData.address}
            onChange={handleChange}
          />
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Save Patient
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}