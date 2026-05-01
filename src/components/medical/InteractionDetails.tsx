"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Table, TableCell, TableRow } from "@/components/ui/Table";

interface InteractionData {
  notes: string;
  diagnoses: { description: string }[];
  prescriptions: {
    medicine: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
}

export function InteractionDetails({ appointmentId }: { appointmentId: string }) {
  const [data, setData] = React.useState<InteractionData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/appointments/${appointmentId}/interaction`);
        const json = await res.json();
        if (json.success) {
          setData(json.interaction);
        } else {
          setError(json.error || "Failed to load interaction details");
        }
      } catch (err) {
        setError("An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [appointmentId]);

  if (isLoading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-textMuted">Loading record details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center text-error border border-error/20 bg-error/5 rounded-xl">
        {error}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="space-y-6">
        <Card title="Clinical Notes">
          <p className="text-text leading-relaxed whitespace-pre-wrap">
            {data.notes || "No clinical notes recorded."}
          </p>
        </Card>

        <Card title="Diagnoses">
          <div className="space-y-2">
            {data.diagnoses && data.diagnoses.length > 0 ? (
              data.diagnoses.map((d, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-bg border border-border">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-text font-medium">{d.description}</span>
                </div>
              ))
            ) : (
              <p className="text-textMuted italic">No diagnoses recorded.</p>
            )}
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card title="Prescriptions">
          <Table headers={["Medicine", "Frequency", "Duration", "Instructions"]}>
            {data.prescriptions && data.prescriptions.length > 0 ? (
              data.prescriptions.map((p, i) => (
                <TableRow key={i}>
                  <TableCell className="font-bold text-primary">{p.medicine}</TableCell>
                  <TableCell>{p.frequency}</TableCell>
                  <TableCell>{p.duration}</TableCell>
                  <TableCell className="text-textMuted italic">{p.instructions || "None"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-textMuted">
                  No prescriptions given for this visit.
                </TableCell>
              </TableRow>
            )}
          </Table>
        </Card>
      </div>
    </div>
  );
}
