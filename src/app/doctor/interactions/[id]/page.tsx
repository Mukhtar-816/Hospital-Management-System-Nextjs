"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Forms";

interface DiagnosisEntry {
  id: string;
  value: string;
}

interface PrescriptionEntry {
  id: string;
  name: string;
  dosage: string;
}

export default function InteractionPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [diagnoses, setDiagnoses] = React.useState<DiagnosisEntry[]>([
    { id: "d1", value: "" },
  ]);
  const [prescriptions, setPrescriptions] = React.useState<PrescriptionEntry[]>(
    [{ id: "p1", name: "", dosage: "" }],
  );

  const addDiagnosis = () =>
    setDiagnoses([...diagnoses, { id: `d${Date.now()}`, value: "" }]);
  const addPrescription = () =>
    setPrescriptions([
      ...prescriptions,
      { id: `p${Date.now()}`, name: "", dosage: "" },
    ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
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
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-text">
              Patient Interaction
            </h1>
            <p className="text-textMuted">
              Interacting with John Doe (ID: {params.id})
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button>Finalize Interaction</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Clinical Notes">
            <Textarea
              placeholder="Record detailed observations and patient symptoms..."
              className="min-h-[300px]"
            />
          </Card>

          <Card
            title="Diagnosis"
            footer={
              <Button variant="outline" size="sm" onClick={addDiagnosis}>
                + Add Another Diagnosis
              </Button>
            }
          >
            <div className="space-y-4">
              {diagnoses.map((diag) => (
                <Input key={diag.id} placeholder="Enter diagnosis..." />
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card
            title="Prescriptions"
            footer={
              <Button
                variant="outline"
                size="sm"
                onClick={addPrescription}
                className="w-full"
              >
                + Add Prescription
              </Button>
            }
          >
            <div className="space-y-6">
              {prescriptions.map((presc) => (
                <div
                  key={presc.id}
                  className="p-4 rounded-xl bg-border/5 border border-border space-y-3"
                >
                  <Input label="Medicine Name" placeholder="e.g. Paracetamol" />
                  <Input
                    label="Dosage & Frequency"
                    placeholder="e.g. 500mg, 2 times daily"
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card title="Patient History Preview">
            <div className="space-y-4">
              <div className="p-3 rounded-xl border border-border">
                <p className="text-xs font-bold text-primary mb-1">
                  2023-09-15
                </p>
                <p className="text-sm font-medium text-text">
                  Seasonal Allergies
                </p>
                <p className="text-xs text-textMuted">Dr. Sarah Johnson</p>
              </div>
              <div className="p-3 rounded-xl border border-border">
                <p className="text-xs font-bold text-primary mb-1">
                  2023-07-22
                </p>
                <p className="text-sm font-medium text-text">Mild Dermatitis</p>
                <p className="text-xs text-textMuted">Dr. Michael Chen</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
