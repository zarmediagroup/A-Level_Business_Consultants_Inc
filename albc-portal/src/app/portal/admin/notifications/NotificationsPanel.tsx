"use client";

import { useState } from "react";
import { Bell, Check, CheckCheck, FileText, User, AlertTriangle, Info } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import type { Notification } from "@/lib/types";
import Link from "next/link";

type EnrichedNotification = Notification & {
  related_client?: { full_name: string; company?: string } | null;
};

interface NotificationsPanelProps {
  initialNotifications: EnrichedNotification[];
  userId: string;
}

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  document_uploaded: { icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
  document_status_changed: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
  client_created: { icon: User, color: "text-green-600", bg: "bg-green-50" },
  default: { icon: Info, color: "text-slate-600", bg: "bg-slate-50" },
};

export default function NotificationsPanel({ initialNotifications, userId }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [marking, setMarking] = useState(false);

  const unread = notifications.filter((n) => !n.read);

  const markAllRead = async () => {
    setMarking(true);
    try {
      await fetch(`/api/notifications/mark-read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, all: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } finally {
      setMarking(false);
    }
  };

  const markRead = async (id: string) => {
    await fetch(`/api/notifications/mark-read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId: id }),
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0b1d3a]">Notification Centre</h1>
          <p className="text-slate-500 text-sm mt-1">
            {unread.length} unread · {notifications.length} total
          </p>
        </div>
        {unread.length > 0 && (
          <button
            onClick={markAllRead}
            disabled={marking}
            className="flex items-center gap-2 text-sm text-[#0b1d3a] hover:text-[#c9a84c] font-semibold transition-colors disabled:opacity-50"
          >
            {marking ? (
              <div className="w-4 h-4 border-2 border-slate-300 border-t-[#0b1d3a] rounded-full animate-spin" />
            ) : (
              <CheckCheck className="w-4 h-4" />
            )}
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
          <Bell className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <h3 className="text-[#0b1d3a] font-semibold mb-2">All caught up!</h3>
          <p className="text-slate-400 text-sm">No notifications yet. Client activity will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Unread */}
          {unread.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Unread ({unread.length})
              </h2>
              <div className="space-y-2">
                {unread.map((n) => (
                  <NotificationCard key={n.id} notification={n} onMarkRead={markRead} />
                ))}
              </div>
            </div>
          )}

          {/* Read */}
          {notifications.filter((n) => n.read).length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 mt-6">
                Earlier
              </h2>
              <div className="space-y-2">
                {notifications
                  .filter((n) => n.read)
                  .map((n) => (
                    <NotificationCard key={n.id} notification={n} onMarkRead={markRead} />
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NotificationCard({
  notification: n,
  onMarkRead,
}: {
  notification: EnrichedNotification;
  onMarkRead: (id: string) => void;
}) {
  const config = typeConfig[n.type] ?? typeConfig.default;
  const Icon = config.icon;

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 ${
        !n.read ? "border-[#c9a84c]/20 shadow-sm" : "border-slate-100"
      }`}
    >
      <div className="flex items-start gap-4 p-5">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg}`}>
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className={`text-sm font-semibold ${!n.read ? "text-[#0b1d3a]" : "text-slate-600"}`}>
                {n.title}
              </p>
              <p className="text-slate-500 text-sm mt-0.5 leading-relaxed">{n.message}</p>
            </div>
            {!n.read && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-[#c9a84c]" />
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-slate-400 text-xs">{formatDateTime(n.created_at)}</p>
            <div className="flex items-center gap-3">
              {n.related_document_id && (
                <Link
                  href={`/portal/admin/documents`}
                  className="text-[#c9a84c] hover:text-[#b8923c] text-xs font-medium transition-colors"
                >
                  View Document
                </Link>
              )}
              {n.related_client_id && (
                <Link
                  href={`/portal/admin/clients/${n.related_client_id}`}
                  className="text-[#0b1d3a] hover:text-[#1a2f5e] text-xs font-medium transition-colors"
                >
                  View Client
                </Link>
              )}
              {!n.read && (
                <button
                  onClick={() => onMarkRead(n.id)}
                  className="text-slate-400 hover:text-[#0b1d3a] text-xs flex items-center gap-1 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  Mark read
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
