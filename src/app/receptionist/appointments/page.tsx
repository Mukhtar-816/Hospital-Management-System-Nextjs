"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Forms";
import { Modal } from "@/components/ui/Modal";
import { Table, TableCell, TableRow } from "@/components/ui/Table";
import { useLoading } from "@/lib/LoadingContext";

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
  doctorName: string;
  scheduledat: string;
  status: "scheduled" | "checked_in" | "in_progress" | "completed" | "no_show" | "cancelled";
};

type Doctor = {
  doctorid: string;
  fullname: string;
  specialization: string;
  is_busy?: boolean;
};

const SPECIALIZATIONS = [
  { value: "General Medicine", label: "General Medicine" },
  { value: "Pediatrics", label: "Pediatrics" },
  { value: "Cardiology", label: "Cardiology" },
  { value: "Dermatology", label: "Dermatology" },
  { value: "Neurology", label: "Neurology" },
  { value: "Orthopedics", label: "Orthopedics" },
];

export default function Receptionist() {
  const { showLoading, hideLoading } = useLoading();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isLoadingDoctors, setIsLoadingDoctors] = React.useState(false);
  const [patientSearch, setPatientSearch] = React.useState("");
  const [patientResults, setPatientResults] = React.useState<any[]>([]);
  const [doctors, setDoctors] = React.useState<Doctor[]>([]);

  const [formData, setFormData] = React.useState({
    patientid: "",
    patientname: "",
    patientnumber: "",
    date: "",
    time: "",
    specialization: "",
    doctorid: "",
    doctorName: "",
  });

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
      console.log(id)
      const res = await fetch(`/api/appointments/${id}/${action}`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to update status");
      loadAppointments();
    } catch (error) {
      console.error(`Failed to ${action} appointment:`, error);
    } finally {
      hideLoading();
    }
  };

  const loadAppointments = async () => {
    try {
      const res = await fetch("/api/appointments");
      const data = await res.json();
      console.log(data)
      setAppointments(data.appointments || []);
    } catch (error) {
      console.error("Failed to load appointments:", error);
    }
  };

  const handleSearchDoctors = async () => {
    setIsLoadingDoctors(true);
    try {
      // Combine date and time for the search
      const fullDateTime = `${formData.date} ${formData.time}`;

      const res = await fetch(
        `/api/doctor/search?specialization=${encodeURIComponent(formData.specialization)}&time=${encodeURIComponent(fullDateTime)}`
      );

      // Consume the JSON only once
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Search failed");
      }

      setDoctors(data.doctors || []);
      setCurrentStep(2);
    } catch (error: any) {
      console.log("Failed to load doctors:", error.message);
    } finally {
      setIsLoadingDoctors(false);
    }
  };

  React.useEffect(() => {
    loadAppointments();
  }, []);

  const handlePatientSearch = async (value: string) => {
    setPatientSearch(value);
    if (value.length < 2) {
      setPatientResults([]);
      return;
    }

    try {
      const res = await fetch(`/api/patient/search?q=${value}`);
      const data = await res.json();
      setPatientResults(data.patients || []);
    } catch (error) {
      console.error("Failed to search patients:", error);
    }
  };

  const handleSelectPatient = (p: any) => {
    setFormData((prev) => ({
      ...prev,
      patientid: p.patientid,
      patientname: p.fullname,
      patientnumber: p.patientnumber,
    }));
    setPatientSearch(p.fullname);
    setPatientResults([]);
  };

  const handleSubmit = async () => {
    // Use the date and time from formData to create a ISO string for the backend
    const startTimestamp = `${formData.date} ${formData.time}`;

    try {
      showLoading();
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientid: formData.patientid,
          doctorid: formData.doctorid,
          // receptionistid: attacthed from backend cookies,
          starttime: startTimestamp, // Ensure this matches your column name 'startTime'
          type: "walk-in", // Or logic to determine if this is online/walk-in
          status: "scheduled",
        }),
      });

      if (!res.ok) throw new Error("Failed to save appointment");

      setIsModalOpen(false);
      resetForm();
      loadAppointments(); // Refresh the table list
    } catch (error) {
      console.error("Failed to create appointment:", error);
    } finally {
      hideLoading();
    }
  };

  const resetForm = () => {
    setFormData({
      patientid: "",
      patientname: "",
      patientnumber: "",
      date: "",
      time: "",
      specialization: "",
      doctorid: "",
      doctorName: "",
    });
    setPatientSearch("");
    setPatientResults([]);
    setCurrentStep(1);
    setDoctors([]);
  };

  const isStep1Valid =
    formData.patientid &&
    formData.date &&
    formData.time &&
    formData.specialization;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Appointments</h1>
          <p className="text-textMuted">
            Manage all scheduled visits and patient check-ins.
          </p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>+ New Appointment</Button>
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
                {/* Notice the lowercase 'a' in scheduledat */}
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
              No   found
            </TableCell>
          </TableRow>
        )}
      </Table>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Appointment"
        footer={
          <div className="flex justify-between w-full">
            {currentStep === 2 && (
              <Button variant="secondary" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
            )}
            <div className="ml-auto flex gap-3">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              {currentStep === 1 ? (
                <Button
                  onClick={handleSearchDoctors}
                  disabled={!isStep1Valid || isLoadingDoctors}
                >
                  {isLoadingDoctors ? "Searching..." : "Next: Select Doctor"}
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.doctorid}
                >
                  Confirm Appointment
                </Button>
              )}
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Stepper */}
          <div className="flex items-center justify-between px-2 mb-8">
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${currentStep >= 1 ? "bg-primary text-white" : "bg-border text-textMuted"}`}>
                1
              </div>
              <span className={`text-xs font-medium ${currentStep >= 1 ? "text-primary" : "text-textMuted"}`}>Details</span>
            </div>
            <div className={`flex-1 h-0.5 mx-4 transition-colors ${currentStep === 2 ? "bg-primary" : "bg-border"}`} />
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${currentStep === 2 ? "bg-primary text-white" : "bg-border text-textMuted"}`}>
                2
              </div>
              <span className={`text-xs font-medium ${currentStep === 2 ? "text-primary" : "text-textMuted"}`}>Doctor</span>
            </div>
          </div>

          {currentStep === 1 ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="relative">
                <Input
                  label="Search Patient"
                  placeholder="Type patient name or id..."
                  value={patientSearch}
                  onChange={(e) => handlePatientSearch(e.target.value)}
                />
                {patientResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-surface border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {patientResults.map((p) => (
                      <button
                        key={p.patientid}
                        type="button"
                        className="w-full text-left p-3 hover:bg-bg transition-colors border-b border-border last:border-0 flex flex-col"
                        onClick={() => handleSelectPatient(p)}
                      >
                        <span className="font-medium text-text">{p.fullname}</span>
                        <span className="text-xs text-textMuted">{p.patientnumber}</span>
                      </button>
                    ))}
                  </div>
                )}
                {formData.patientid && !patientResults.length && patientSearch === formData.patientname && (
                  <div className="mt-1 flex items-center gap-2 text-xs text-success px-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    Patient selected: {formData.patientname}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
                <Input
                  label="Time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>

              <Select
                label="Department / Specialization"
                value={formData.specialization}
                onChange={(e: any) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                options={[
                  { value: "", label: "Select Specialization" },
                  ...SPECIALIZATIONS
                ]}
              />
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-textMuted uppercase tracking-wider">Available Doctors</h3>
                <Badge variant="info">{formData.specialization}</Badge>
              </div>

              {isLoadingDoctors ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-textMuted">Finding available specialists...</p>
                </div>
              ) : doctors.length > 0 ? (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {doctors.map((doctor) => (
                    <button
                      key={doctor.doctorid}
                      disabled={doctor.is_busy}
                      onClick={() => setFormData(prev => ({ ...prev, doctorid: doctor.doctorid, doctorName: doctor.fullname }))}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between group ${doctor.is_busy
                        ? "bg-bg border-border opacity-60 cursor-not-allowed"
                        : formData.doctorid === doctor.doctorid
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:border-primary hover:bg-primary/5"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-primary font-bold ${formData.doctorid === doctor.doctorid ? "bg-primary text-white" : "bg-primary/10"}`}>
                          {doctor.fullname.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-text">{doctor.fullname}</p>
                          <p className="text-xs text-textMuted">{doctor.specialization}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {doctor.is_busy ? (
                          <Badge variant="error">Conflict</Badge>
                        ) : (
                          <Badge variant="success">Available</Badge>
                        )}
                        {formData.doctorid === doctor.doctorid && (
                          <div className="text-primary">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center border-2 border-dashed border-border rounded-2xl">
                  <p className="text-textMuted">No doctors found for this specialization.</p>
                  <Button variant="ghost" size="sm" className="mt-2" onClick={() => setCurrentStep(1)}>
                    Change Specialization
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}