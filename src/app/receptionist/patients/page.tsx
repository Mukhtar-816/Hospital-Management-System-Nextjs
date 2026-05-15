"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Forms";
import { Modal } from "@/components/ui/Modal";
import { Table, TableCell, TableRow } from "@/components/ui/Table";
import { useLoading } from "@/lib/LoadingContext";
import dynamic from "next/dynamic";

const MapInput = dynamic(() => import("@/components/ui/MapInput").then(mod => mod.MapInput), { 
  ssr: false,
  loading: () => <div className="h-10 w-full bg-surface/50 border border-border rounded-xl animate-pulse flex items-center justify-center text-[10px] font-black text-textMuted uppercase">Loading Map...</div>
});

import { devLog, devError } from "@/lib/logger";
import { 
  validateEmail, 
  validatePhone, 
  validateRequired, 
} from "@/lib/validation-helper";
import { showToast } from "nextjs-toast-notify";


type Patient = {
  userid: string;
  patientid: string;
  fullname: string;
  useremail: string;
  patientnumber: string;
  address?: string;
  gender?: string;
  location?: [number, number];
};

export default function ReceptionistPatients() {
  const { showLoading, hideLoading } = useLoading();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    countryCode: "+92",
    phone: "",
    address: "",
    gender: "other",
    location: null as [number, number] | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadPatients = async () => {
    showLoading();
    try {
      const res = await fetch("/api/receptionist/patients");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPatients(data || []);
    } catch (_err) {
      devError("Failed to load patients");
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
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[e.target.name];
        return next;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    const required = validateRequired({
      fullname: formData.fullname,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
    });

    if (!required.isValid) {
      required.missingFields.forEach(field => {
        newErrors[field] = "This field is required";
      });
    }

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (formData.phone && !validatePhone(formData.countryCode, formData.phone)) {
      newErrors.phone = "Invalid phone number (7-15 digits)";
    }

    if (!formData.location) {
      newErrors.location = "Please select a location on the map";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast.error("Please fix the errors before submitting.");
      return;
    }

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
          patientnumber: `${formData.countryCode}${formData.phone}`,
          location: formData.location,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create patient");

      showToast.success("Patient registered successfully!");
      setIsModalOpen(false);
      setFormData({
        fullname: "",
        email: "",
        password: "",
        countryCode: "+92",
        phone: "",
        address: "",
        gender: "other",
        location: null,
      });
      setErrors({});
      loadPatients();
    } catch (err: any) {
      devError("Failed to create patient:", err);
      showToast.error(err.message || "Failed to create patient");
    } finally {
      hideLoading();
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-text tracking-tight uppercase">Patients Directory</h1>
          <p className="text-textMuted font-medium italic">Manage and view patient registrations.</p>
        </div>
        <Button 
          variant="primary" 
          className="rounded-2xl shadow-xl shadow-primary/20 font-black uppercase text-xs tracking-widest px-8"
          onClick={() => setIsModalOpen(true)}
        >
          Add New Patient
        </Button>
      </div>

      <Card className="border-none glass overflow-hidden">
        <Table headers={["Name", "Email", "Phone", "Location", "Actions"]}>
          {patients.map((patient) => (
            <TableRow key={patient.patientid}>
              <TableCell className="font-black text-primary">
                {patient.fullname}
              </TableCell>
              <TableCell className="font-medium">{patient.useremail}</TableCell>
              <TableCell className="font-mono text-xs">{patient.patientnumber || "N/A"}</TableCell>
              <TableCell>
                {patient.location ? (
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-textMuted uppercase tracking-tighter bg-surface/50 px-2 py-1 rounded-lg border border-border/50">
                    Lat: {Number(patient.location[0]).toFixed(3)} Lng: {Number(patient.location[1]).toFixed(3)}
                  </div>
                ) : <span className="text-xs italic text-textMuted/50">Not set</span>}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-widest hover:bg-primary/10">View History</Button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Patient"
        className="max-w-4xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Personal Information</h4>
            <Input
              name="fullname"
              label="Full Name"
              placeholder="e.g. John Doe"
              value={formData.fullname}
              onChange={handleChange}
              error={errors.fullname}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="email"
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
               <Input
                name="password"
                label="Login Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />
            </div>
            
            <div className="flex gap-4">
              <div className="w-24">
                <Input
                  name="countryCode"
                  label="Code"
                  value={formData.countryCode}
                  onChange={handleChange}
                />
              </div>
              <div className="flex-1">
                <Input
                  name="phone"
                  label="Phone Number"
                  placeholder="3001234567"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                />
              </div>
            </div>

            <Select 
              name="gender"
              label="Gender"
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
              value={formData.gender}
              onChange={handleChange}
            />

            <Input
              name="address"
              label="Physical Address"
              placeholder="e.g. 123 Main St, Karachi"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Geospatial Data</h4>
            <MapInput 
              label="Precise Location"
              onLocationChange={(lat, lng) => setFormData(prev => ({ ...prev, location: [lat, lng] }))}
              initialLocation={formData.location || undefined}
            />
            {errors.location && <p className="text-xs text-error font-black">{errors.location}</p>}
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-6 border-t border-border/50 mt-4">
          <Button variant="secondary" className="rounded-xl px-6" onClick={() => setIsModalOpen(false)}>
            Discard
          </Button>
          <Button 
            variant="primary" 
            className="rounded-xl px-10 shadow-lg shadow-primary/20" 
            onClick={handleSubmit}
          >
            Create Patient Record
          </Button>
        </div>
      </Modal>
    </div>
  );
}