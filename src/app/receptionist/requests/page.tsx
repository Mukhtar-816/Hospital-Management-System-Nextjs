"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, TableCell, TableRow } from "@/components/ui/Table";
import { useLoading } from "@/lib/LoadingContext";
import { AppointmentModal } from "@/components/modules/AppointmentModal";

export default function ReceptionistRequests() {
  const { showLoading, hideLoading } = useLoading();
  const [requests, setRequests] = React.useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedRequest, setSelectedRequest] = React.useState<any>(null);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/appointmentrequests");
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    }
  };

  React.useEffect(() => {
    fetchRequests();
  }, []);

  const handleApproveClick = (req: any) => {
    const dateObj = new Date(req.preferredtime);
    const date = dateObj.toISOString().split('T')[0];
    const time = dateObj.toTimeString().split(' ')[0].substring(0, 5);

    setSelectedRequest({
      patientid: req.patientid,
      patientname: req.patientname,
      date,
      time,
      requestid: req.requestid
    });
    setIsModalOpen(true);
  };

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject this request?")) return;
    
    showLoading();
    try {
      const res = await fetch(`/api/appointmentrequests/${id}/reject`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to reject request");
      fetchRequests();
    } catch (error: any) {
      alert(error.message);
    } finally {
      hideLoading();
    }
  };

  const handleAppointmentSuccess = () => {
    fetchRequests();
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Patient Requests</h1>
        <p className="text-textMuted">
          Approve or reject incoming appointment requests.
        </p>
      </div>

      <Card>
        <Table
          headers={[
            "Patient",
            "Priority",
            "Symptoms",
            "Preferred Time",
            "Status",
            "Actions",
          ]}
        >
          {requests.length > 0 ? requests.map((req) => (
            <TableRow key={req.requestid}>
              <TableCell className="font-medium">{req.patientname}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    req.priority === "high" ? "error" :
                    req.priority === "medium" ? "warning" : "info"
                  }
                >
                  {req.priority}
                </Badge>
              </TableCell>
              <TableCell className="max-w-xs truncate">{req.symptoms}</TableCell>
              <TableCell className="text-sm">
                {new Date(req.preferredtime).toLocaleString()}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    req.status === "pending" ? "warning" :
                    req.status === "approved" ? "success" : "error"
                  }
                >
                  {req.status}
                </Badge>
              </TableCell>
              <TableCell>
                {req.status === "pending" && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleApproveClick(req)}>
                      Approve
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleReject(req.requestid)}>
                      Reject
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-textMuted">
                No requests found
              </TableCell>
            </TableRow>
          )}
        </Table>
      </Card>

      {selectedRequest && (
        <AppointmentModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedRequest(null); }}
          onSuccess={handleAppointmentSuccess}
          initialData={selectedRequest}
        />
      )}
    </div>
  );
}
