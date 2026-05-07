"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, TableCell, TableRow } from "@/components/ui/Table";
import React from "react";
import { useNetworkStatus } from "@/lib/hooks/useNetworkStatus";
import { handleApiError } from "@/lib/utils/errorHandler";
import { showToast } from "nextjs-toast-notify";
import { useRouter } from "next/navigation";
import { AppointmentModal } from "@/components/modules/AppointmentModal";
import { 
  ClipboardList, 
  Users, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Loader2
} from "lucide-react";

export default function ReceptionistDashboard() {
  const router = useRouter();
  const isOnline = useNetworkStatus();
  const [data, setData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedRequest, setSelectedRequest] = React.useState<any>(null);

  const fetchDashboard = async () => {
    if (!isOnline) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/receptionist/dashboard");
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        throw new Error(json.error || "Failed to load dashboard data");
      }
    } catch (err: any) {
      const friendlyError = handleApiError(err);
      showToast.error(friendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDashboard();
  }, [isOnline]);

  const handleApproveClick = (req: any) => {
    const dateObj = new Date(req.preferredtime);
    const date = dateObj.toISOString().split('T')[0];
    const time = dateObj.toTimeString().split(' ')[0].substring(0, 5);

    setSelectedRequest({
      patientid: req.patientid || "",
      patientname: req.patientname || "",
      date,
      time,
      requestid: req.requestid
    });
    setIsModalOpen(true);
  };

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject this request?")) return;

    try {
      const res = await fetch(`/api/appointmentrequests/${id}/reject`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to reject request");
      showToast.success("Request rejected successfully");
      fetchDashboard();
    } catch (error: any) {
      const msg = handleApiError(error);
      showToast.error(msg);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-textMuted font-medium">Syncing operations...</p>
      </div>
    );
  }

  const stats = [
    {
      label: "Pending Requests",
      value: data?.stats?.pending_requests || "0",
      icon: ClipboardList,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Today's Appointments",
      value: data?.stats?.today_appointments || "0",
      icon: Calendar,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Total Patients",
      value: data?.stats?.total_patients?.toLocaleString() || "0",
      icon: Users,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between bg-surface p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-text tracking-tight">Reception Center</h1>
          <p className="text-textMuted mt-1">Real-time hospital flow and patient intake.</p>
        </div>
        {!isOnline && (
          <Badge variant="error" className="px-4 py-1.5">Offline</Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="group hover:border-primary/50 transition-all duration-300 relative overflow-hidden"
          >
            <div className={`absolute top-4 right-4 p-3 ${stat.bg} rounded-xl`}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <div className="pt-2">
               <h3 className="text-4xl font-black text-text mb-1 group-hover:scale-105 transition-transform origin-left">
                 {stat.value}
               </h3>
               <p className="text-xs font-bold text-textMuted uppercase tracking-widest">
                 {stat.label}
               </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card
          title="Incoming Requests"
          subtitle="New patient submissions awaiting clinical review"
          className="border-none shadow-xl bg-surface/50 backdrop-blur-sm"
          footer={
            <Button 
              variant="outline" 
              className="w-full gap-2 hover:bg-primary hover:text-white transition-all" 
              onClick={() => router.push("/receptionist/requests")}
            >
              Manage All Requests
              <ArrowRight size={16} />
            </Button>
          }
        >
          <div className="overflow-x-auto">
            <Table headers={["Patient", "Symptoms", "Priority", "Actions"]}>
              {data?.recentRequests && data.recentRequests.length > 0 ? (
                data.recentRequests.map((req: any) => (
                  <TableRow key={req.requestid} className="hover:bg-border/5 transition-colors">
                    <TableCell className="font-bold text-text">{req.patientname || "Anonymous"}</TableCell>
                    <TableCell className="max-w-xs truncate text-textMuted">{req.symptoms || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={req.priority === "high" ? "error" : req.priority === "medium" ? "warning" : "info"} className="capitalize">
                        {req.priority || "low"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="gap-1.5"
                          onClick={() => handleApproveClick(req)} 
                          disabled={!isOnline}
                        >
                          <CheckCircle2 size={14} />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="danger" 
                          className="gap-1.5"
                          onClick={() => handleReject(req.requestid)} 
                          disabled={!isOnline}
                        >
                          <XCircle size={14} />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12">
                    <div className="flex flex-col items-center text-textMuted">
                      <ClipboardList size={40} className="mb-2 opacity-20" />
                      <p>Queue is clear. No pending requests.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </Table>
          </div>
        </Card>
      </div>

      {selectedRequest && (
        <AppointmentModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedRequest(null); }}
          onSuccess={() => { fetchDashboard(); setIsModalOpen(false); }}
          initialData={selectedRequest}
        />
      )}
    </div>
  );
}
