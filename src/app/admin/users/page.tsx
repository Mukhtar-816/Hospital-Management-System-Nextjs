"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Forms";
import { Modal } from "@/components/ui/Modal";
import { Table, TableCell, TableRow } from "@/components/ui/Table";

type Role = { roleid: string; name: string };

type User = {
    userid: string;
    fullname: string;
    email: string;
    role: string;
    specialization?: string;
    address?: string;
    gender?: string;
    status?: string;
};

export default function AdminUsers() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [selectedRole, setSelectedRole] = useState("");

    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        id: "",
        fullname: "",
        email: "",
        password: "",
        specialization: "",
        address: "",
        gender: "",
    });

    const loadData = async () => {
        setLoading(true);
        setError("");

        try {

            const usersRes = await fetch("/api/admin/users");
            const rolesRes = await fetch("/api/roles");


            if (!usersRes.ok || !rolesRes.ok) {
                throw new Error("Failed to fetch data");
            }

            const usersData = await usersRes.json();
            const rolesData = await rolesRes.json();


            setUsers(usersData);
            setRoles(Array.isArray(rolesData) ? rolesData : rolesData.data || []);

        } catch (err) {
            console.error(err);
            setError("Something went wrong loading data");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadData();
    }, []);

    // ================= FORM =================
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const resetForm = () => {
        setFormData({
            id: "",
            fullname: "",
            email: "",
            password: "",
            specialization: "",
            address: "",
            gender: "",
        });
        setSelectedRole("");
        setIsEditing(false);
        setError("");
        setSuccess("");
    };

    const handleOpenCreate = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleOpenEdit = (user: User) => {
        resetForm();

        setFormData({
            id: user.userid,
            fullname: user.fullname,
            email: user.email,
            password: "",
            specialization: user.specialization || "",
            address: user.address || "",
            gender: user.gender || "",
        });

        setSelectedRole(user.role);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    // ================= SUBMIT =================
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedRole) {
            setError("Please select a role");
            return;
        }

        setError("");
        setSuccess("");

        try {
            const endpoint =
                selectedRole === "admin"
                    ? "/api/admin"
                    : `/api/${selectedRole.toLowerCase()}`;

            const method = isEditing ? "PUT" : "POST";

            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error(`Failed to ${isEditing ? "update" : "create"} user`);
            }

            setSuccess(`User ${isEditing ? "updated" : "created"} successfully`);

            await loadData();

            setTimeout(() => {
                setIsModalOpen(false);
            }, 1000);

        } catch (err: any) {
            setError(err.message || "Something went wrong");
        }
    };

    // ================= DELETE =================
    const handleDelete = async (id: string) => {
        if (!confirm("Delete this user?")) return;

        setError("");
        setSuccess("");
        console.log("id", id);
        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Delete failed");

            setSuccess("User deleted successfully");

            await loadData();

        } catch (err: any) {
            setError(err.message);
        }
    };

    // ================= UI =================
    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">User Management</h1>
                    <p className="text-gray-500">
                        Create users and assign roles dynamically
                    </p>
                </div>

                <Button onClick={handleOpenCreate}>
                    Create User
                </Button>
            </div>

            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

            <Card>
                {loading ? (
                    <p className="p-4 text-white">Loading...</p>
                ) : (
                    <Table headers={["Name", "Email", "Role", "Actions"]}>
                        {users.map((user) => (
                            <TableRow key={user.userid}>
                                <TableCell>{user.fullname}</TableCell>
                                <TableCell>{user.email}</TableCell>

                                <TableCell>
                                    <Badge>{user.role}</Badge>
                                </TableCell>

                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={() => handleOpenEdit(user)}>
                                            Edit
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleDelete(user.userid)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </Table>
                )}
            </Card>

            {/* ================= MODAL ================= */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isEditing ? "Edit User" : "Create User"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">

                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        disabled={isEditing}
                        className="w-full bg-black border p-2 text-white border-white"
                    >
                        <option value="" className="bg-black/30">Select role</option>
                        {roles?.map((r) => (
                            <option key={r.roleid} value={r.name} className="bg-black/30">
                                {r.name}
                            </option>
                        ))}
                    </select>

                    {selectedRole && (
                        <>
                            <Input name="fullname" placeholder="Name" value={formData.fullname} onChange={handleChange} required />
                            <Input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />

                            {!isEditing && (
                                <Input
                                    name="password" placeholder="Password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            )}

                            {selectedRole === "doctor" && (
                                <Input
                                    name="specialization" placeholder="Specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    required
                                />
                            )}

                            {selectedRole === "patient" && (
                                <>
                                    <Input
                                        name="address" placeholder="Address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Input
                                        name="gender" placeholder="Gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        required
                                    />
                                </>
                            )}
                        </>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button type="button" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>

                        <Button type="submit">
                            {isEditing ? "Update" : "Create"}
                        </Button>
                    </div>

                </form>
            </Modal>
        </div>
    );
}