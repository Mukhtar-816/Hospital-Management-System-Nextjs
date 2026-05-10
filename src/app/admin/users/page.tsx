"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Forms";
import { Modal } from "@/components/ui/Modal";
import { Table, TableCell, TableRow } from "@/components/ui/Table";
import { useLoading } from "@/lib/LoadingContext";
import { 
  UserPlus, 
  Edit2, 
  Trash2, 
  Filter, 
  Search, 
  Mail, 
  User as UserIcon,
  Briefcase,
  MapPin,
  Loader2
} from "lucide-react";

type Role = { roleid: string; name: string };

type User = {
  userid: string;
  useremail: string;
  fullname?: string;
  specialization?: string;
  address?: string;
  gender?: string;
  role: string;
  status?: string;
};

export default function AdminUsers() {
  const { showLoading, hideLoading } = useLoading();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [role, setRole] = useState<Role[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [filterRole, setFilterRole] = useState("all");

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
    showLoading();
    setError("");

    try {
      const usersRes = await fetch("/api/admin/users");
      const roleRes = await fetch("/api/roles");

      if (!usersRes.ok || !roleRes.ok) {
        throw new Error("Failed to fetch user directory");
      }

      const usersData = await usersRes.json();
      const rolesData = await roleRes.json();

      setUsers(usersData);
      setRole(Array.isArray(rolesData) ? rolesData : rolesData.role || []);
    } catch (err: any) {
      setError("Unable to synchronize with the user database.");
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
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
      fullname: user.fullname || "",
      email: user.useremail,
      password: "",
      specialization: user.specialization || "",
      address: user.address || "",
      gender: user.gender || "",
    });

    setSelectedRole(user.role);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      setError("Please assign a role to the user.");
      return;
    }

    setError("");
    setSuccess("");
    showLoading();

    try {
      const endpoint =
        selectedRole === "admin"
          ? "/api/admin"
          : `/api/${selectedRole.toLowerCase()}`;

      const method = isEditing ? "PUT" : "POST";
      const payload: Record<string, string> = {
        userid: formData.id,
        useremail: formData.email,
        fullname: formData.fullname,
      };

      if (selectedRole === "doctor") {
        payload.specialization = formData.specialization;
      }

      if (selectedRole === "patient") {
        payload.address = formData.address;
        payload.gender = formData.gender;
      }

      if (!isEditing) {
        payload.password = formData.password;
      }

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Critical error during user ${isEditing ? "update" : "creation"}.`);
      }

      setSuccess(`User profile successfully ${isEditing ? "updated" : "created"}.`);
      await loadData();
      setTimeout(() => setIsModalOpen(false), 1000);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      hideLoading();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this user? This action cannot be undone.")) return;

    setError("");
    setSuccess("");
    showLoading();

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Deletion protocol failed.");

      setSuccess("User account successfully purged.");
      await loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      hideLoading();
    }
  };

  const filteredUsers = users.filter((user) => {
    if (filterRole === "all") return true;
    return user.role === filterRole;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-text tracking-tight">Identity Management</h1>
          <p className="text-textMuted mt-1">
            Provision users and manage system-wide access controls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-primary transition-colors" size={16} />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-bg border border-border pl-10 pr-8 py-2.5 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/50 outline-none transition-all text-text appearance-none cursor-pointer"
            >
              <option value="all">All Access Levels</option>
              <option value="admin">Administrators</option>
              <option value="doctor">Medical Staff</option>
              <option value="receptionist">Support Staff</option>
              <option value="patient">Patients</option>
            </select>
          </div>
          <Button onClick={handleOpenCreate} className="gap-2 px-6">
            <UserPlus size={18} />
            Create User
          </Button>
        </div>
      </div>

      {(error || success) && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 ${error ? "bg-error/10 border-error/20 text-error" : "bg-success/10 border-success/20 text-success"}`}>
           <div className={`w-8 h-8 rounded-full flex items-center justify-center ${error ? "bg-error/20" : "bg-success/20"}`}>
             {error ? "!" : "✓"}
           </div>
           <p className="text-sm font-medium">{error || success}</p>
        </div>
      )}

      <Card className="border-none shadow-xl bg-surface/50 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table headers={["Profile", "Credentials", "Access Level", "Actions"]}>
            {filteredUsers.length > 0 ? filteredUsers.map((user) => (
              <TableRow key={user.userid} className="hover:bg-border/5 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold">
                      {user.fullname?.charAt(0) || <UserIcon size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-text">{user.fullname || "Unnamed User"}</p>
                      <p className="text-[10px] text-textMuted uppercase tracking-tighter">ID: {user.userid.slice(0, 8)}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                   <div className="flex items-center gap-2 text-textMuted">
                     <Mail size={14} className="text-primary/50" />
                     <span className="text-sm">{user.useremail}</span>
                   </div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'info' : user.role === 'doctor' ? 'success' : 'pending'} className="capitalize px-3 rounded-md">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="p-2 h-9 w-9" 
                      onClick={() => handleOpenEdit(user)}
                      title="Edit User"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      className="p-2 h-9 w-9 bg-error/5 border-error/10 text-error hover:bg-error hover:text-white"
                      onClick={() => handleDelete(user.userid)}
                      title="Delete User"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-16">
                  <div className="flex flex-col items-center text-textMuted opacity-30">
                    <Search size={48} className="mb-2" />
                    <p className="text-lg font-bold">No Users Found</p>
                    <p className="text-sm">Try adjusting your filters.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </Table>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? "Modify Identity" : "Provision New User"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-textMuted ml-1">Access Assignment</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              disabled={isEditing}
              className="w-full bg-bg border border-border p-3 text-text rounded-xl focus:ring-2 focus:ring-primary/50 transition-all outline-none"
            >
              <option value="">Select organizational role</option>
              {role?.map((r) => (
                <option key={r.roleid} value={r.name}>{r.name}</option>
              ))}
            </select>
          </div>

          {selectedRole && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
              <div className="relative group">
                <Input
                  name="email"
                  label="Email Address"
                  placeholder="name@medcloud.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Mail className="absolute right-4 top-10 text-textMuted group-focus-within:text-primary" size={18} />
              </div>
              
              <div className="relative group">
                <Input
                  name="fullname"
                  label="Legal Full Name"
                  placeholder="John Doe"
                  value={formData.fullname}
                  onChange={handleChange}
                  required
                />
                <UserIcon className="absolute right-4 top-10 text-textMuted group-focus-within:text-primary" size={18} />
              </div>

              {!isEditing && (
                <Input
                  name="password"
                  label="Security Password"
                  placeholder="••••••••"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              )}

              {selectedRole === "doctor" && (
                <div className="relative group">
                  <Input
                    name="specialization"
                    label="Clinical Specialization"
                    placeholder="e.g. Cardiology"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                  />
                  <Briefcase className="absolute right-4 top-10 text-textMuted group-focus-within:text-primary" size={18} />
                </div>
              )}

              {selectedRole === "patient" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <Input
                      name="address"
                      label="Residential Address"
                      placeholder="Street, City"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                    <MapPin className="absolute right-4 top-10 text-textMuted group-focus-within:text-primary" size={18} />
                  </div>
                  <Select
                    name="gender"
                    label="Gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    options={[
                      { value: "", label: "Select" },
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Other", label: "Other" },
                    ]}
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Discard
            </Button>
            <Button type="submit" className="px-8 shadow-lg shadow-primary/20">
              {isEditing ? "Update Identity" : "Finalize Provisioning"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
