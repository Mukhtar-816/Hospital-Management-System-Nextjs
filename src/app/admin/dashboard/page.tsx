"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { useLoading } from "@/lib/LoadingContext";
import { useNetworkStatus } from "@/lib/hooks/useNetworkStatus";
import { handleApiError } from "@/lib/utils/errorHandler";
import { showToast } from "nextjs-toast-notify";
import { Badge } from "@/components/ui/Badge";
import { 
  Users, 
  Stethoscope, 
  Calendar, 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  UserPlus
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AdminDashboard() {
  const { showLoading, hideLoading } = useLoading();
  const isOnline = useNetworkStatus();
  const [stats, setStats] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const loadDashboard = async () => {
    if (!isOnline) return;
    showLoading();
    try {
      const [statsRes, analyticsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/appointments/stats")
      ]);

      if (!statsRes.ok) throw new Error("Failed to load statistics");
      if (!analyticsRes.ok) throw new Error("Failed to load analytics");

      const statsData = await statsRes.json();
      const analyticsData = await analyticsRes.json();

      setStats(statsData.stats);
      setAnalytics(analyticsData);
    } catch (err: any) {
      const msg = handleApiError(err);
      showToast.error(msg);
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [isOnline]);

  if (!isMounted || !stats || !analytics) return null;

  const userDistributionData = [
    { name: "Doctors", value: Number(stats.total_doctors) },
    { name: "Patients", value: Number(stats.total_patients) },
    { name: "Receptionists", value: Number(stats.total_receptionists) },
  ];

  const appointmentStatusData = analytics.appointmentsByStatus.map((item: any) => ({
    name: item.status.replace('_', ' ').toUpperCase(),
    count: Number(item.count)
  }));

  const doctorPerfData = analytics.doctorPerformance.map((doc: any) => ({
    name: doc.doctorname,
    completed: Number(doc.completed_count),
    total: Number(doc.total_appointments)
  }));

  const mainStats = [
    { label: "Total Users", value: stats.total_users, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Appointments", value: stats.total_appointments, icon: Calendar, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Active Requests", value: stats.pending_requests, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Total Interactions", value: stats.total_interactions, icon: Activity, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center bg-surface p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">System Overview</h1>
          <p className="text-gray-400 mt-1">Real-time health indicators and operational analytics.</p>
        </div>
        <div className="flex gap-3">
          {!isOnline && <Badge variant="error">Offline Mode</Badge>}
          <button 
            onClick={loadDashboard}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all font-medium text-sm shadow-lg shadow-primary/20"
          >
            <TrendingUp size={16} />
            Refresh Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className={`absolute top-4 right-4 p-3 ${stat.bg} rounded-2xl`}>
              <stat.icon className={`${stat.color}`} size={24} />
            </div>
            <div className="pt-2">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-4xl font-black text-white mt-2 group-hover:scale-110 transition-transform origin-left">
                {stat.value}
              </h3>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-medium text-emerald-500 bg-emerald-500/10 w-fit px-2 py-1 rounded-lg">
              <TrendingUp size={12} />
              +12% from last month
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card title="User Composition" className="lg:col-span-1">
          <div className="h-[300px] mt-4 min-w-0 w-full relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={userDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1e1e1e", border: "1px solid #333", borderRadius: "12px" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Appointment Volume" className="lg:col-span-2">
          <div className="h-[300px] mt-4 min-w-0 w-full relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={appointmentStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#666" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#666" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={{ backgroundColor: "#1e1e1e", border: "1px solid #333", borderRadius: "12px" }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#3b82f6" 
                  radius={[6, 6, 0, 0]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Provider Performance" subtitle="Top performing doctors by completed appointments">
          <div className="h-[400px] mt-6 min-w-0 w-full relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart 
                data={doctorPerfData} 
                layout="vertical"
                margin={{ left: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                <XAxis type="number" stroke="#666" fontSize={12} hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#fff" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={100}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1e1e1e", border: "1px solid #333", borderRadius: "12px" }}
                />
                <Bar 
                  dataKey="completed" 
                  name="Completed" 
                  fill="#10b981" 
                  radius={[0, 4, 4, 0]} 
                  barSize={20}
                />
                <Bar 
                  dataKey="total" 
                  name="Total Scheduled" 
                  fill="#333" 
                  radius={[0, 4, 4, 0]} 
                  barSize={10}
                />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Recent Activity Hub" subtitle="Snapshot of system operations">
          <div className="space-y-6 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                <div className="flex items-center gap-2 text-emerald-500 mb-2">
                  <CheckCircle size={18} />
                  <span className="text-xs font-bold uppercase">Approved Requests</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.approved_requests}</p>
              </div>
              <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10">
                <div className="flex items-center gap-2 text-amber-500 mb-2">
                  <AlertCircle size={18} />
                  <span className="text-xs font-bold uppercase">Pending Requests</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.pending_requests}</p>
              </div>
            </div>

            <div className="space-y-3">
               <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                 <UserPlus size={14} />
                 Quick Breakdown
               </h4>
               <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-surface border border-border">
                    <span className="text-sm text-gray-300">Success Rate</span>
                    <Badge variant="success">94.2%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-surface border border-border">
                    <span className="text-sm text-gray-300">Avg Wait Time</span>
                    <Badge>12 mins</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-surface border border-border">
                    <span className="text-sm text-gray-300">System Load</span>
                    <Badge variant="warning">Normal</Badge>
                  </div>
               </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
