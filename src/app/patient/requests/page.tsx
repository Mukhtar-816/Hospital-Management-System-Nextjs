"use client";

import { devLog, devError } from "@/lib/logger";
import Link from "next/link";
import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, TableCell, TableRow } from "@/components/ui/Table";
import { useLoading } from "@/lib/LoadingContext";

export default function PatientRequests() {
  const { showLoading, hideLoading } = useLoading();
  const [requests, setRequests] = React.useState<any[]>([]);

  const fetchRequests = async () => {
    showLoading();
    try {
      const res = await fetch("/api/appointmentrequests/patient");
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests);
      }
    } catch (error) {
      devError("Failed to fetch requests:", error);
    } finally {
      hideLoading();
    }
  };

  React.useEffect(() => {
    fetchRequests();
  }, []);

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
          headers={["Priority", "Symptoms", "Preferred Time", "Status"]}
        >
          {requests.length > 0 ? requests.map((req) => (
            <TableRow key={req.requestid}>
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
              <TableCell>{new Date(req.preferredtime).toLocaleString()}</TableCell>
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
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-textMuted">
                No requests found
              </TableCell>
            </TableRow>
          )}
        </Table>
      </Card>
    </div>
  );
}
