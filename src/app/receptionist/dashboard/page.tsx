"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, TableCell, TableRow } from "@/components/ui/Table";

export default function ReceptionistDashboard() {
  const stats = [
    {
      label: "Pending Requests",
      value: "24",
      icon: "📩",
      color: "text-warning",
    },
    {
      label: "Today's Appointments",
      value: "18",
      icon: "📅",
      color: "text-primary",
    },
    {
      label: "Total Patients",
      value: "1,284",
      icon: "👥",
      color: "text-success",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text">Receptionist Dashboard</h1>
        <p className="text-textMuted">
          Overview of hospital operations and patient flow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="flex flex-col items-center text-center"
          >
            <span className="text-4xl mb-4">{stat.icon}</span>
            <h3 className={`text-3xl font-bold ${stat.color}`}>{stat.value}</h3>
            <p className="text-sm text-textMuted uppercase tracking-wider font-semibold mt-1">
              {stat.label}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card
          title="Pending Requests"
          subtitle="Action required on new patient requests"
          footer={
            <Button variant="outline" className="w-full">
              View All Requests
            </Button>
          }
        >
          <Table headers={["Patient", "Symptoms", "Priority", "Actions"]}>
            <TableRow>
              <TableCell className="font-medium">John Doe</TableCell>
              <TableCell>Recurring knee pain</TableCell>
              <TableCell>
                <Badge variant="warning">Medium</Badge>
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
            <TableRow>
              <TableCell className="font-medium">Jane Smith</TableCell>
              <TableCell>Emergency flu symptoms</TableCell>
              <TableCell>
                <Badge variant="rejected">High</Badge>
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
          </Table>
        </Card>
      </div>
    </div>
  );
}
