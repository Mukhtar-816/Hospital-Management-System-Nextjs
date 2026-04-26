"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Forms";
import { Modal } from "@/components/ui/Modal";
import { Table, TableCell, TableRow } from "@/components/ui/Table";

type Patient = {
  patientid: string;
  name: string;
  useremail: string;
  patientnumber: string; // 🔥 phone
  createdat?: string;
};

export default function ReceptionistPatients() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    gender: "",
  });

  // 🔹 Load patients
  const loadPatients = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/patient");

      if (!res.ok) throw new Error();

      const data = await res.json();
      setPatients(data);
    } catch {
      console.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  // 🔹 Handle input
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Create patient
  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password || "123456", // temp
          address: formData.address || "",
          gender: formData.gender || "other",
          patientnumber: formData.phone, // 🔥 map phone
        }),
      });

      if (!res.ok) throw new Error();

      setIsModalOpen(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        gender: "",
      });

      loadPatients();
    } catch {
      console.error("Failed to create patient");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">
            Patients Directory
          </h1>
          <p className="text-textMuted">
            Manage and view patient registrations.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)}>
          Add New Patient
        </Button>
      </div>

      {/* Table */}
      <Card>
        {loading ? (
          <p className="p-4 text-textMuted">Loading...</p>
        ) : (
          <Table headers={["Name", "Email", "Phone", "Actions"]}>
            {patients.map((patient) => (
              <TableRow key={patient.patientid}>
                <TableCell className="font-medium text-primary">
                  {patient.name}
                </TableCell>

                <TableCell>{patient.useremail}</TableCell>

                <TableCell>
                  {patient.patientnumber || "N/A"}
                </TableCell>

                <TableCell>
                  <Button variant="ghost" size="sm">
                    View History
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        )}
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Patient"
      >
        <div className="space-y-4">
          <Input
            name="name"
            label="Full Name"
            value={formData.username}
            onChange={handleChange}
          />

          <Input
            name="email"
            label="Email"
            value={formData.useremail}
            onChange={handleChange}
          />

          <Input
            name="phone"
            label="Phone Number"
            value={formData.patientnumber}
            onChange={handleChange}
          />

          <Input
            name="address"
            label="Address"
            value={formData.address}
            onChange={handleChange}
          />

          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
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