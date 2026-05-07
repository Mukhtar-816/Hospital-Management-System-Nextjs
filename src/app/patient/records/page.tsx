"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, TableCell, TableRow } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { InteractionDetails } from "@/components/medical/InteractionDetails";
import { useLoading } from "@/lib/LoadingContext";

export default function PatientRecords() {
  const { showLoading, hideLoading } = useLoading();
  const [records, setRecords] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false);
  const [selectedAppId, setSelectedAppId] = React.useState<string | null>(null);

  const fetchRecords = async () => {
    try {
      const res = await fetch("/api/patient/records");
      const data = await res.json();
      if (data.success) {
        setRecords(data.records);
      }
    } catch (error) {
      console.error("Failed to load records:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRecords();
  }, []);

  const handleViewRecord = (appointmentId: string) => {
    setSelectedAppId(appointmentId);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Medical Records</h1>
        <p className="text-textMuted">View your past consultation records and prescriptions.</p>
      </div>

      <Card>
        <Table
          headers={[
            "Date",
            "Doctor",
            "Type",
            "Actions",
          ]}
        >
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-textMuted">
                Loading records...
              </TableCell>
            </TableRow>
          ) : records.length > 0 ? (
            records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  {new Date(record.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="font-medium">Dr. {record.doctorname}</TableCell>
                <TableCell>
                  <Badge variant="info">{record.type}</Badge>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onClick={() => handleViewRecord(record.appointmentid)}
                  >
                    View Record
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-textMuted">
                No medical records found.
              </TableCell>
            </TableRow>
          )}
        </Table>
      </Card>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Clinical Record"
        className="max-w-6xl"
      >
        {selectedAppId && (
          <div className="max-h-[80vh] overflow-y-auto pr-2">
            <InteractionDetails appointmentId={selectedAppId} />
          </div>
        )}
      </Modal>
    </div>
  );
}
