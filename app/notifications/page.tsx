"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  ShoppingBag,
  Send,
  MessageSquare,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { dataService } from "@/lib/services/dataService";
import { Notification } from "@/types/database";
import { formatRelativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotificationsPage() {
  const currentUser = dataService.getCurrentUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadNotifications = () => {
    setNotifications(dataService.getNotifications(currentUser.id));
  };

  useEffect(() => {
    loadNotifications();
  }, [currentUser.id]);

  const handleMarkAllRead = () => {
    dataService.markAllNotificationsAsRead(currentUser.id);
    loadNotifications();
  };

  const handleMarkRead = (id: string) => {
    dataService.markNotificationAsRead(id);
    loadNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-3xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="purple" className="text-xs">
                {unreadCount} unread
              </Badge>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time updates regarding bids, deliverables, escrow payouts, and reviews.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            className="gap-1.5 text-xs font-semibold"
          >
            <CheckCheck className="h-4 w-4" />
            <span>Mark All as Read</span>
          </Button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleMarkRead(n.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                !n.is_read
                  ? "bg-blue-50/50 dark:bg-slate-800/80 border-blue-200 dark:border-slate-700 shadow-sm"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-80"
              }`}
            >
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  !n.is_read
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                }`}
              >
                <Bell className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {n.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {formatRelativeTime(n.created_at)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {n.message}
                </p>

                {n.link && (
                  <div className="pt-2">
                    <Link
                      href={n.link}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                    >
                      <span>View Details</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title="All Caught Up!"
          description="You don't have any pending notifications right now. Activity on your tasks and orders will appear here."
        />
      )}
    </div>
  );
}
