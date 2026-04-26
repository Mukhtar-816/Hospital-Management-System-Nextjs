"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, TableCell, TableRow } from "@/components/ui/Table";

export default function PatientRequests() {
  const requests = [
    {
      id: "REQ-001",
      symptom: "Severe headache and fever",
      date: "2023-10-20",
      priority: "High",
      status: "pending",
    },
    {
      id: "REQ-002",
      symptom: "Monthly skin checkup",
      date: "2023-10-18",
      priority: "Low",
      status: "success",
    },
    {
      id: "REQ-003",
      symptom: "Lower back pain",
      date: "2023-10-15",
      priority: "Medium",
      status: "rejected",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">My Requests</h1>
          <p className="text-textMuted">
            View and manage your appointment requests.
          </p>
        </div>
        <Link href="/patient/requests/new">
          <Button>New Request</Button>
        </Link>
      </div>

      <Card>
        <Table
          headers={["Request ID", "Symptoms", "Date", "Priority", "Status"]}
        >
          {requests.map((req) => (
            <TableRow key={req.id}>
              <TableCell className="font-medium text-primary">
                {req.id}
              </TableCell>
              <TableCell className="max-w-xs truncate">{req.symptom}</TableCell>
              <TableCell>{req.date}</TableCell>
              <TableCell>
                <span
                  className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    req.priority === "High"
                      ? "bg-error"
                      : req.priority === "Medium"
                        ? "bg-warning"
                        : "bg-success"
                  }`}
                />
                {req.priority}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    req.status as
                      | "pending"
                      | "success"
                      | "info"
                      | "warning"
                      | "error"
                      | "default"
                  }
                >
                  {req.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
}
