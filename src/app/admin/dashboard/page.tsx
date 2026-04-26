"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";

type User = {
  userid: string;
  name: string;
  email: string;
  role: string;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error();

      const users: User[] = await res.json();

      // 🔹 Compute stats
      const totalUsers = users.length;
      const doctors = users.filter((u) => u.role === "doctor").length;
      const patients = users.filter((u) => u.role === "patient").length;
      const receptionists = users.filter((u) => u.role === "receptionist").length;

      setStats([
        { label: "Total Users", value: totalUsers, icon: "👤", color: "text-primary" },
        { label: "Doctors", value: doctors, icon: "🩺", color: "text-accent" },
        { label: "Receptionists", value: receptionists, icon: "🛎️", color: "text-warning" },
        { label: "Total Patients", value: patients, icon: "👥", color: "text-success" },
      ]);

      // 🔹 Recent users (latest 5)
      setRecentUsers(users.slice(0, 5));

    } catch (err) {
      console.error("Dashboard error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return <p className="p-6 text-textMuted">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text">Admin Control Center</h1>
        <p className="text-textMuted">
          System-wide overview and user management.
        </p>
      </div>

      {/* 🔹 Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="flex flex-col items-center text-center">
            <span className="text-4xl mb-4">{stat.icon}</span>
            <h3 className={`text-3xl font-bold ${stat.color}`}>
              {stat.value}
            </h3>
            <p className="text-sm text-textMuted uppercase tracking-wider font-semibold mt-1">
              {stat.label}
            </p>
          </Card>
        ))}
      </div>

      {/* 🔹 Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* System Health */}
        <Card title="System Health" subtitle="Server and database status">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-success/10 border border-success/20">
              <span className="text-sm font-medium text-success">
                Database Connection
              </span>
              <span className="text-xs font-bold text-success uppercase">
                Connected
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-success/10 border border-success/20">
              <span className="text-sm font-medium text-success">
                Auth Service
              </span>
              <span className="text-xs font-bold text-success uppercase">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-warning/10 border border-warning/20">
              <span className="text-sm font-medium text-warning">
                Storage Usage
              </span>
              <span className="text-xs font-bold text-warning uppercase">
                Monitor
              </span>
            </div>
          </div>
        </Card>

        {/* Recent Users */}
        <Card title="Recent Registrations" subtitle="Newly joined users">
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div
                key={user.userid}
                className="flex items-center gap-4 p-3 rounded-xl border border-border"
              >
                <div className="w-10 h-10 rounded-full bg-border/20 flex items-center justify-center font-bold text-textMuted">
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-text">
                    {user.name}
                  </p>
                  <p className="text-xs text-textMuted">
                    {user.email}
                  </p>
                </div>

                <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-lg uppercase">
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}