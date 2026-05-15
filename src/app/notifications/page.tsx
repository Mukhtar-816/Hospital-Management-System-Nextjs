"use client";

import { Bell, ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface NotificationItem {
  notificationId: string;
  TStamp: string;
  messageText: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(setNotifications)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const timeAgo = (ts: string) => {
    const s = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
    if (s < 60) return "Just now";
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return new Date(ts).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-bg text-text p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <header className="flex items-center gap-3 mb-8">
          <Link
            href="/"
            className="p-2 hover:bg-surface rounded-full border border-border transition-colors"
          >
            <ChevronLeft size={18} />
          </Link>
          <h1 className="text-xl font-semibold">Notifications</h1>
        </header>

        {loading && (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-primary" size={28} />
          </div>
        )}

        {error && (
          <div className="text-center py-24">
            <p className="text-error text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && notifications.length === 0 && (
          <div className="flex flex-col items-center py-24 text-center">
            <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center mb-3">
              <Bell size={20} className="text-textMuted" />
            </div>
            <p className="font-medium">All caught up</p>
            <p className="text-sm text-textMuted mt-1">
              No notifications right now.
            </p>
          </div>
        )}

        {!loading && !error && notifications.length > 0 && (
          <div className="space-y-2">
            {notifications.map((n) => (
              <div
                key={n.notificationId}
                className="flex items-start gap-3 p-4 rounded-xl border border-border bg-surface"
              >
                <span className="mt-2 w-2 h-2 rounded-full bg-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed text-text">
                    {n.messageText}
                  </p>
                  <p className="text-xs text-textMuted mt-1">
                    {timeAgo(n.TStamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
