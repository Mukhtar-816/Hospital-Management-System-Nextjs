"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { useLoading } from "@/lib/LoadingContext";
import { useNetworkStatus } from "@/lib/hooks/useNetworkStatus";
import { handleApiError } from "@/lib/utils/errorHandler";
import { showToast } from "nextjs-toast-notify";
import { Badge, Skeleton } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
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
  UserPlus,
  ArrowUpRight,
  Zap,
  MoreVertical,
  ChevronRight,
  Shield
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
  Legend,
  AreaChart,
  Area
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"];

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
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [isOnline]);

  if (!isMounted) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (!stats || !analytics) {
    return (
      <div className="space-y-8 pb-10">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-[400px] lg:col-span-1" />
          <Skeleton className="h-[400px] lg:col-span-2" />
        </div>
      </div>
    );
  }

  const userDistributionData = [
    { name: "Doctors", value: Number(stats.total_doctors) },
    { name: "Patients", value: Number(stats.total_patients) },
    { name: "Receptionists", value: Number(stats.total_receptionists) },
  ];

  const appointmentStatusData = analytics.appointmentsByStatus.map((item: any) => ({
    name: item.status.replace('_', ' ').toUpperCase(),
    count: Number(item.count)
  }));

  const mainStats = [
    { label: "Total Users", value: stats.total_users, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+12%" },
    { label: "Appointments", value: stats.total_appointments, icon: Calendar, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "+5.4%" },
    { label: "Active Requests", value: stats.pending_requests, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", trend: "-2.1%" },
    { label: "Interactions", value: stats.total_interactions, icon: Activity, color: "text-purple-500", bg: "bg-purple-500/10", trend: "+18%" },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-10"
    >
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden glass p-8 rounded-[2rem] border-primary/20 shadow-2xl shadow-primary/5"
      >
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Zap size={100} className="text-primary" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-text tracking-tight flex items-center gap-3">
              Good Morning, Admin <span className="animate-wave inline-block">👋</span>
            </h1>
            <p className="text-textMuted mt-1 font-medium italic">
              System performance is at <span className="text-success font-black">99.8%</span> capacity. All services are operational.
            </p>
          </div>
          <div className="flex gap-3">
            {!isOnline && <Badge variant="error" dot>Offline</Badge>}
            <button 
              onClick={loadDashboard}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl transition-all font-bold text-sm shadow-xl shadow-primary/20 group"
            >
              <TrendingUp size={16} className="group-hover:scale-110 transition-transform" />
              Refresh Analytics
            </button>
          </div>
        </div>
      </motion.div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, index) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <Card hoverable className="relative group border-none glass overflow-hidden">
              <div className={cn("absolute top-0 left-0 w-1 h-full", stat.color.replace('text-', 'bg-'))} />
              <div className="flex justify-between items-start mb-4">
                <div className={cn("p-3 rounded-2xl", stat.bg)}>
                  <stat.icon className={stat.color} size={24} />
                </div>
                <div className={cn("flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg bg-surface border border-border shadow-sm", 
                  stat.trend.startsWith('+') ? "text-success" : "text-error"
                )}>
                  {stat.trend} <ArrowUpRight size={10} />
                </div>
              </div>
              <div>
                <p className="text-xs font-black text-textMuted uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-4xl font-black text-text mt-1 group-hover:scale-105 transition-transform origin-left">
                  {stat.value}
                </h3>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Composition - Bento Sm */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card title="User Demographics" className="h-full glass border-none">
            <div className="h-[300px] mt-4 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {userDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", backdropFilter: "blur(10px)" }}
                    itemStyle={{ color: "#fff", fontWeight: "bold" }}
                  />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-3xl font-black text-text leading-none">{stats.total_users}</p>
                <p className="text-[10px] text-textMuted uppercase font-black mt-1">Total</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Appointment Volume - Bento Lg */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card title="Appointment Flow" className="glass border-none">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={appointmentStatusData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.2} />
                  <XAxis 
                    dataKey="name" 
                    stroke="var(--text-muted)" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    dy={10}
                    fontWeight="bold"
                  />
                  <YAxis 
                    stroke="var(--text-muted)" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    fontWeight="bold"
                  />
                  <Tooltip 
                    cursor={{ stroke: "var(--primary)", strokeWidth: 2 }}
                    contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", backdropFilter: "blur(10px)" }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="var(--primary)" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions / Activity - Bento Sm */}
        <motion.div variants={itemVariants}>
          <Card title="Recent Activity Hub" className="glass border-none h-full">
            <div className="space-y-4 mt-4">
              {[
                { label: "New Doctor Registration", time: "2 mins ago", status: "PENDING", icon: UserPlus, color: "text-primary" },
                { label: "System Backup Completed", time: "45 mins ago", status: "SUCCESS", icon: Shield, color: "text-success" },
                { label: "Emergency Request #402", time: "1 hour ago", status: "ACTIVE", icon: Zap, color: "text-amber-500" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-surface/50 border border-border/50 hover:border-primary/20 transition-all cursor-pointer group">
                  <div className={cn("p-3 rounded-xl bg-bg", activity.color)}>
                    <activity.icon size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-text group-hover:text-primary transition-colors">{activity.label}</p>
                    <p className="text-[10px] text-textMuted font-medium">{activity.time}</p>
                  </div>
                  <Badge variant={activity.status === "SUCCESS" ? "success" : "pending"} className="font-black text-[9px]">
                    {activity.status}
                  </Badge>
                  <ChevronRight size={14} className="text-textMuted opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 rounded-xl bg-primary/5 text-primary text-xs font-black uppercase tracking-widest hover:bg-primary/10 transition-colors">
              View All System Logs
            </button>
          </Card>
        </motion.div>

        {/* Resource Load - Bento Sm */}
        <motion.div variants={itemVariants}>
          <Card title="Operational Performance" className="glass border-none h-full">
             <div className="space-y-6 mt-6">
                <div>
                   <div className="flex justify-between items-end mb-2">
                      <p className="text-sm font-bold text-text">Database Load</p>
                      <p className="text-xs font-black text-primary">24%</p>
                   </div>
                   <div className="h-2 w-full bg-bg rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "24%" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-primary" 
                      />
                   </div>
                </div>
                <div>
                   <div className="flex justify-between items-end mb-2">
                      <p className="text-sm font-bold text-text">API Latency</p>
                      <p className="text-xs font-black text-success">120ms</p>
                   </div>
                   <div className="h-2 w-full bg-bg rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "40%" }}
                        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                        className="h-full bg-success" 
                      />
                   </div>
                </div>
                <div>
                   <div className="flex justify-between items-end mb-2">
                      <p className="text-sm font-bold text-text">Active Connections</p>
                      <p className="text-xs font-black text-accent">1,204</p>
                   </div>
                   <div className="h-2 w-full bg-bg rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "72%" }}
                        transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
                        className="h-full bg-accent" 
                      />
                   </div>
                </div>

                <div className="pt-6 grid grid-cols-2 gap-4">
                   <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 text-center">
                      <p className="text-[10px] text-textMuted font-black uppercase tracking-widest mb-1">Success Rate</p>
                      <p className="text-2xl font-black text-text">99.9%</p>
                   </div>
                   <div className="p-4 bg-accent/5 rounded-2xl border border-accent/10 text-center">
                      <p className="text-[10px] text-textMuted font-black uppercase tracking-widest mb-1">Uptime</p>
                      <p className="text-2xl font-black text-text">100%</p>
                   </div>
                </div>
             </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

