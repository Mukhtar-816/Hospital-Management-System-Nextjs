"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { InteractionDetails } from "@/components/medical/InteractionDetails";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Forms";
import { useLoading } from "@/lib/LoadingContext";
import { devError, devLog } from "@/lib/logger";

interface DiagnosisEntry {
  id: string;
  value: string;
}

interface PrescriptionEntry {
  id: string;
  medicine: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export default function InteractionPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const { showLoading, hideLoading } = useLoading();
  const router = useRouter();
  const params = React.use(paramsPromise);
  const [appointment, setAppointment] = React.useState<any>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [notes, setNotes] = React.useState("");
  const [diagnoses, setDiagnoses] = React.useState<DiagnosisEntry[]>([
    { id: "d1", value: "" },
  ]);
  const [prescriptions, setPrescriptions] = React.useState<PrescriptionEntry[]>(
    [{ id: "p1", medicine: "", frequency: "", duration: "", instructions: "" }],
  );

  React.useEffect(() => {
    async function fetchAppointment() {
      try {
        const res = await fetch(`/api/appointments/${params.id}`);
        const json = await res.json();
        if (json.success) {
          setAppointment(json.appointment);
        }
      } catch (err) {
        devError("Failed to fetch appointment:", err);
      }
    }
    fetchAppointment();
  }, [params.id]);

  const addDiagnosis = () =>
    setDiagnoses([...diagnoses, { id: `d${Date.now()}`, value: "" }]);

  const updateDiagnosis = (id: string, value: string) => {
    setDiagnoses(diagnoses.map((d) => (d.id === id ? { ...d, value } : d)));
  };

  const addPrescription = () =>
    setPrescriptions([
      ...prescriptions,
      {
        id: `p${Date.now()}`,
        medicine: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ]);

  const updatePrescription = (
    id: string,
    field: keyof Omit<PrescriptionEntry, "id">,
    value: string,
  ) => {
    setPrescriptions(
      prescriptions.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    showLoading();
    try {
      const finalDiagnoses = diagnoses
        .map((d) => d.value)
        .filter((v) => v.trim() !== "");
      const finalPrescriptions = prescriptions
        .filter((p) => p.medicine.trim() !== "")
        .map((p) => ({
          medicine: p.medicine,
          frequency: p.frequency,
          duration: p.duration,
          instructions: p.instructions,
        }));

      const res = await fetch(`/api/appointments/${params.id}/interaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes,
          diagnoses: finalDiagnoses,
          prescriptions: finalPrescriptions,
        }),
      });

      if (!res.ok) throw new Error("Failed to save interaction");

      router.push("/doctor/appointments");
    } catch (error) {
      devError("Submission failed:", error);
      alert("Failed to save interaction. Please try again.");
    } finally {
      setIsSubmitting(false);
      hideLoading();
    }
  };

  const isCompleted = appointment?.status === "completed";

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
              {isCompleted
                ? "View completed record"
                : "Finalizing appointment record"}{" "}
              (ID: {params.id})
            </p>
          </div>
        </div>
        {!isCompleted && (
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Finalize Interaction"}
            </Button>
          </div>
        )}
      </div>

      {isCompleted ? (
        <InteractionDetails appointmentId={params.id} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card title="Clinical Notes">
              <Textarea
                placeholder="Record detailed observations and patient symptoms..."
                className="min-h-[300px]"
                value={notes}
                onChange={(e: any) => setNotes(e.target.value)}
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
                  <Input
                    key={diag.id}
                    placeholder="Enter diagnosis..."
                    value={diag.value}
                    onChange={(e: any) =>
                      updateDiagnosis(diag.id, e.target.value)
                    }
                  />
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
                    <Input
                      label="Medicine Name"
                      placeholder="e.g. Paracetamol"
                      value={presc.medicine}
                      onChange={(e: any) =>
                        updatePrescription(presc.id, "medicine", e.target.value)
                      }
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Frequency"
                        placeholder="e.g. 2x daily"
                        value={presc.frequency}
                        onChange={(e: any) =>
                          updatePrescription(
                            presc.id,
                            "frequency",
                            e.target.value,
                          )
                        }
                      />
                      <Input
                        label="Duration"
                        placeholder="e.g. 5 days"
                        value={presc.duration}
                        onChange={(e: any) =>
                          updatePrescription(
                            presc.id,
                            "duration",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <Input
                      label="Instructions"
                      placeholder="e.g. Take after meals"
                      value={presc.instructions}
                      onChange={(e: any) =>
                        updatePrescription(
                          presc.id,
                          "instructions",
                          e.target.value,
                        )
                      }
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
                  <p className="text-sm font-medium text-text">
                    Mild Dermatitis
                  </p>
                  <p className="text-xs text-textMuted">Dr. Michael Chen</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
