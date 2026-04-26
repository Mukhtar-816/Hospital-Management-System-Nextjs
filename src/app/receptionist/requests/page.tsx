"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, TableCell, TableRow } from "@/components/ui/Table";

export default function ReceptionistRequests() {
  const requests = [
    {
      id: "REQ-101",
      patient: "John Doe",
      symptom: "Recurring knee pain",
      priority: "Medium",
      date: "2023-10-24 09:00",
    },
    {
      id: "REQ-102",
      patient: "Alice Wilson",
      symptom: "Annual physical",
      priority: "Low",
      date: "2023-10-24 10:30",
    },
    {
      id: "REQ-103",
      patient: "Bob Miller",
      symptom: "Severe allergic reaction",
      priority: "High",
      date: "2023-10-24 11:15",
    },
  ];

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
            "Symptoms",
            "Priority",
            "Submitted At",
            "Actions",
          ]}
        >
          {requests.map((req) => (
            <TableRow key={req.id}>
              <TableCell className="font-medium">{req.patient}</TableCell>
              <TableCell className="max-w-xs truncate">{req.symptom}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    req.priority === "High"
                      ? "rejected"
                      : req.priority === "Medium"
                        ? "warning"
                        : "info"
                  }
                >
                  {req.priority}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-textMuted">
                {req.date}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm">Approve</Button>
                  <Button size="sm" variant="danger">
                    Reject
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
}
