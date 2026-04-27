"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Forms";
import { Modal } from "@/components/ui/Modal";
import { Table, TableCell, TableRow } from "@/components/ui/Table";

type Patient = {
    patientid: string;
    username: string;
    useremail: string;
    patientnumber: string;
    createdat?: string;
};

export default function ReceptionistPatients() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        gender: "other",
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
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // 🔹 Create patient
    const handleSubmit = async () => {
        try {
            setSubmitting(true);

            const res = await fetch("/api/patient", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.username,
                    email: formData.email,
                    password: formData.password,
                    address: formData.address,
                    gender: formData.gender,
                    patientnumber: formData.phone,
                }),
            });

            if (!res.ok) throw new Error();

            setIsModalOpen(false);

            setFormData({
                username: "",
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
            setSubmitting(false);
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
                                    {patient.username}
                                </TableCell>

                                <TableCell>
                                    {patient.useremail}
                                </TableCell>

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
                        name="username"
                        label="Full Name"
                        value={formData.username}
                        onChange={handleChange}
                    />

                    <Input
                        name="email"
                        label="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <Input
                        name="password"
                        label="Password"
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
                        <Button
                            variant="secondary"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleSubmit}
                            disabled={submitting}
                        >
                            {submitting ? "Saving..." : "Save Patient"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}