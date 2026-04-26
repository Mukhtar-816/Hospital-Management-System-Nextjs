"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export interface Prescription {
  name: string;
  dosage: string;
  frequency: string;
}

export interface MedicalRecord {
  id: string;
  date: string;
  doctor: string;
  diagnosis: string;
  notes: string;
  prescriptions: Prescription[];
}

export default function PatientRecords() {
  const records: MedicalRecord[] = [
    {
      id: "REC-101",
      date: "2023-09-15",
      doctor: "Dr. Sarah Johnson",
      diagnosis: "Seasonal Allergies",
      notes:
        "Patient presented with sneezing, itchy eyes, and nasal congestion. Symptoms worsen during morning hours.",
      prescriptions: [
        { name: "Cetirizine", dosage: "10mg", frequency: "Once daily" },
        {
          name: "Fluticasone Spray",
          dosage: "50mcg",
          frequency: "Two sprays in each nostril daily",
        },
      ],
    },
    {
      id: "REC-098",
      date: "2023-07-22",
      doctor: "Dr. Michael Chen",
      diagnosis: "Mild Dermatitis",
      notes: "Localized rash on left forearm. Likely contact dermatitis.",
      prescriptions: [
        {
          name: "Hydrocortisone Cream",
          dosage: "1%",
          frequency: "Apply twice daily",
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Medical Records</h1>
        <p className="text-textMuted">
          Your past interactions and prescriptions.
        </p>
      </div>

      <div className="space-y-4">
        {records.map((record) => (
          <RecordItem key={record.id} record={record} />
        ))}
      </div>
    </div>
  );
}

function RecordItem({ record }: { record: MedicalRecord }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Card
      className="cursor-pointer hover:border-primary/30 transition-all overflow-hidden"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="text-sm font-bold text-primary">{record.date}</div>
          <div>
            <h3 className="font-semibold text-text">{record.diagnosis}</h3>
            <p className="text-sm text-textMuted">{record.doctor}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge>Visit Completed</Badge>
          <svg
            role="img"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="mt-6 pt-6 border-t border-border space-y-6 animate-in slide-in-from-top-2 duration-200">
          <div>
            <h4 className="text-sm font-semibold text-text uppercase tracking-wider mb-2">
              Doctor's Notes
            </h4>
            <p className="text-sm text-textMuted leading-relaxed">
              {record.notes}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text uppercase tracking-wider mb-3">
              Prescriptions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {record.prescriptions.map((p) => (
                <div
                  key={p.name}
                  className="p-3 rounded-xl bg-border/5 border border-border"
                >
                  <p className="font-medium text-text">{p.name}</p>
                  <p className="text-xs text-textMuted">
                    {p.dosage} • {p.frequency}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
