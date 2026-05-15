"use client"; import { devLog, devError } from "@/lib/logger";

import React, { Activity } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Forms";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { useLoading } from "@/lib/LoadingContext";
import { validateInput } from "@/lib/utils/inputValidator";
import { handleApiError } from "@/lib/utils/errorHandler";
import { useNetworkStatus } from "@/lib/hooks/useNetworkStatus";
import { showToast } from "nextjs-toast-notify";
import {
  User,
  Stethoscope,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Search,
  Loader2,
  AlertCircle
} from "lucide-react";

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
  { value: "Dentist", label: "Dentist" },
];

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (requestId?: string) => void;
  initialData?: {
    patientid?: string;
    patientname?: string;
    patientnumber?: string;
    doctorid?: string;
    doctorName?: string;
    date?: string;
    time?: string;
    specialization?: string;
    requestid?: string;
  };
}

export function AppointmentModal({ isOpen, onClose, onSuccess, initialData }: AppointmentModalProps) {
  const { showLoading, hideLoading } = useLoading();
  const isOnline = useNetworkStatus();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isLoadingDoctors, setIsLoadingDoctors] = React.useState(false);
  const [patientSearch, setPatientSearch] = React.useState(initialData?.patientname || "");
  const [patientResults, setPatientResults] = React.useState<any[]>([]);
  const [doctors, setDoctors] = React.useState<Doctor[]>([]);

  const [formData, setFormData] = React.useState({
    patientid: initialData?.patientid || "",
    patientname: initialData?.patientname || "",
    patientnumber: initialData?.patientnumber || "",
    date: initialData?.date || "",
    time: initialData?.time || "",
    specialization: initialData?.specialization || "",
    doctorid: initialData?.doctorid || "",
    doctorName: initialData?.doctorName || "",
    requestid: initialData?.requestid || "",
  });

  React.useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        patientid: initialData.patientid || "",
        patientname: initialData.patientname || "",
        patientnumber: initialData.patientnumber || "",
        date: initialData.date || "",
        time: initialData.time || "",
        specialization: initialData.specialization || "",
        doctorid: initialData.doctorid || "",
        doctorName: initialData.doctorName || "",
        requestid: initialData.requestid || "",
      });
      setPatientSearch(initialData.patientname || "");
      setCurrentStep(initialData.doctorid ? 2 : 1);
    }
  }, [isOpen, initialData]);

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
      devError("Patient search failed:", error);
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

  const handleSearchDoctors = async () => {
    if (!isOnline) {
      showToast.error("No internet connection.");
      return;
    }

    const dateErr = validateInput({ type: "date", value: formData.date, fieldName: "Date" });
    if (dateErr) return showToast.error(dateErr);

    const timeErr = validateInput({ type: "time", value: formData.time, fieldName: "Time" });
    if (timeErr) return showToast.error(timeErr);

    if (!formData.patientid) return showToast.error("Please select a patient");
    if (!formData.specialization) return showToast.error("Please select a specialization");

    setIsLoadingDoctors(true);
    try {
      const fullDateTime = `${formData.date} ${formData.time}`;
      const res = await fetch(
        `/api/doctor/search?specialization=${encodeURIComponent(formData.specialization)}&time=${encodeURIComponent(fullDateTime)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Search failed");
      setDoctors(data.doctors || []);
      setCurrentStep(2);
    } catch (error: any) {
      const msg = handleApiError(error);
      showToast.error(msg);
    } finally {
      setIsLoadingDoctors(false);
    }
  };

  const handleSubmit = async () => {
    if (!isOnline) {
      showToast.error("Network unavailable.");
      return;
    }

    const startTimestamp = `${formData.date} ${formData.time}`;
    try {
      showLoading();
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientid: formData.patientid,
          doctorid: formData.doctorid,
          starttime: startTimestamp,
          type: formData.requestid ? "online" : "walk-in",
          requestid: formData.requestid || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save appointment");
      }

      showToast.success("Appointment created successfully!");
      onSuccess(formData.requestid);
      onClose();
    } catch (error: any) {
      const msg = handleApiError(error);
      showToast.error(msg);
    } finally {
      hideLoading();
    }
  };

  const isStep1Valid =
    formData.patientid &&
    formData.date &&
    formData.time &&
    formData.specialization;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Guided Appointment Scheduling"
      footer={
        <div className="flex justify-between w-full">
          {currentStep === 2 && (
            <Button variant="secondary" className="gap-2" onClick={() => setCurrentStep(1)}>
              <ChevronLeft size={16} />
              Back
            </Button>
          )}
          <div className="ml-auto flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            {currentStep === 1 ? (
              <Button
                className="gap-2"
                onClick={handleSearchDoctors}
                disabled={!isStep1Valid || isLoadingDoctors}
              >
                {isLoadingDoctors ? "Searching..." : "Select Doctor"}
                <ChevronRight size={16} />
              </Button>
            ) : (
              <Button
                className="gap-2"
                onClick={handleSubmit}
                disabled={!formData.doctorid}
              >
                <CheckCircle2 size={16} />
                Confirm Appointment
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center justify-between px-6 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-0.5 bg-border -z-10" />

          <div className="flex flex-col items-center gap-2 bg-surface px-2">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${currentStep >= 1 ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" : "bg-border text-textMuted"}`}>
              <User size={20} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${currentStep >= 1 ? "text-primary" : "text-textMuted"}`}>Patient</span>
          </div>

          <div className="flex flex-col items-center gap-2 bg-surface px-2">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${currentStep === 2 ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" : "bg-border text-textMuted"}`}>
              <Stethoscope size={20} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${currentStep === 2 ? "text-primary" : "text-textMuted"}`}>Doctor</span>
          </div>
        </div>

        {currentStep === 1 ? (
          <div className="space-y-5">
            <div className="relative group">
              <Input
                label="Search Patient"
                placeholder="Name or Patient ID..."
                value={patientSearch}
                onChange={(e) => handlePatientSearch(e.target.value)}
                disabled={!!formData.requestid}
                className="pl-10"
              />
              <Search className="absolute left-3 top-[38px] text-textMuted group-focus-within:text-primary transition-colors" size={18} />

              {patientResults.length > 0 && (
                <div className="absolute z-20 w-full mt-2 bg-surface border border-border rounded-2xl shadow-2xl max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                  {patientResults.map((p) => (
                    <button
                      key={p.patientid}
                      type="button"
                      className="w-full text-left p-4 hover:bg-primary/5 transition-colors border-b border-border last:border-0 flex items-center justify-between group"
                      onClick={() => handleSelectPatient(p)}
                    >
                      <div>
                        <p className="font-bold text-text group-hover:text-primary transition-colors">{p.fullname}</p>
                        <p className="text-xs text-textMuted">ID: {p.patientnumber}</p>
                      </div>
                      <ChevronRight size={16} className="text-textMuted group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative group">
                <Input
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="relative group">
                <Input
                  label="Time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>

            <Select
              label="Department / Specialty"
              value={formData.specialization}
              onChange={(e: any) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
              options={[
                { value: "", label: "Select Clinical Specialty" },
                ...SPECIALIZATIONS
              ]}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <Activity size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest">Active Filters</p>
                  <p className="text-sm font-bold text-text">{formData.specialization}</p>
                </div>
              </div>
              <Badge variant="info" className="px-3">{new Date(formData.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at {formData.time}</Badge>
            </div>

            {isLoadingDoctors ? (
              <div className="py-16 flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm text-textMuted font-medium italic">Querying specialist availability...</p>
              </div>
            ) : doctors.length > 0 ? (
              <div className="grid gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {doctors.map((doctor) => (
                  <button
                    key={doctor.doctorid}
                    disabled={doctor.is_busy}
                    onClick={() => setFormData(prev => ({ ...prev, doctorid: doctor.doctorid, doctorName: doctor.fullname }))}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between group relative overflow-hidden ${doctor.is_busy
                      ? "bg-border/5 border-border opacity-50 grayscale cursor-not-allowed"
                      : formData.doctorid === doctor.doctorid
                        ? "border-primary bg-primary/5 ring-2 ring-primary shadow-lg shadow-primary/10"
                        : "border-border hover:border-primary/50 hover:bg-surface/80"
                      }`}
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg transition-all ${formData.doctorid === doctor.doctorid ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-primary/10 text-primary"}`}>
                        {doctor.fullname.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-text">{doctor.fullname}</p>
                        <p className="text-xs text-textMuted font-medium">{doctor.specialization}</p>
                      </div>
                    </div>
                    <div className="relative z-10">
                      {doctor.is_busy ? (
                        <div className="flex items-center gap-1.5 text-error">
                          <AlertCircle size={14} />
                          <span className="text-[10px] font-black uppercase">Conflict</span>
                        </div>
                      ) : (
                        <Badge variant="success" className="px-3 rounded-md">Available</Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center border-2 border-dashed border-border rounded-3xl bg-border/5">
                <AlertCircle size={40} className="mx-auto text-textMuted mb-3 opacity-20" />
                <h4 className="text-lg font-bold text-text">No Specialists Found</h4>
                <p className="text-sm text-textMuted max-w-xs mx-auto mt-1 mb-6">We couldn't find any available doctors in this specialty for the selected time.</p>
                <Button variant="outline" size="sm" onClick={() => setCurrentStep(1)}>
                  Modify Search Criteria
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
