"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  Briefcase,
  FileCheck2,
  Send,
  ShoppingBag,
  Bell,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  Star,
} from "lucide-react";
import { dataService } from "@/lib/services/dataService";
import { Profile, Order, Task, Application, Notification } from "@/types/database";
import { formatCurrency, formatRelativeTime, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";

export default function StudentDashboardPage() {
  const [currentUser, setCurrentUser] = useState<Profile>(dataService.getCurrentUser());
  const [orders, setOrders] = useState<Order[]>([]);
  const [postedTasks, setPostedTasks] = useState<Task[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [wallet, setWallet] = useState(dataService.getWallet(currentUser.id));

  useEffect(() => {
    const refreshData = () => {
      const user = dataService.getCurrentUser();
      setCurrentUser(user);
      setOrders(dataService.getOrders(user.id));
      setPostedTasks(dataService.getTasks().filter((t) => t.client_id === user.id));
      setApplications(dataService.getUserApplications(user.id));
      setNotifications(dataService.getNotifications(user.id).slice(0, 5));
      setWallet(dataService.getWallet(user.id));
    };

    refreshData();
    window.addEventListener("skillconnect:user_changed", refreshData);
    return () => window.removeEventListener("skillconnect:user_changed", refreshData);
  }, []);

  const activeOrders = orders.filter((o) => o.status === "in_progress" || o.status === "submitted" || o.status === "revision_requested");
  const completedOrders = orders.filter((o) => o.status === "completed");
  const pendingApplications = applications.filter((a) => a.status === "pending");

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    let score = 20; // email + name
    if (currentUser.college) score += 20;
    if (currentUser.bio && currentUser.bio.length > 20) score += 20;
    if (currentUser.skills && currentUser.skills.length >= 3) score += 20;
    if (currentUser.portfolio && currentUser.portfolio.length >= 1) score += 20;
    return Math.min(score, 100);
  };

  const completionPercent = calculateProfileCompletion();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {currentUser.full_name}!
            </h1>
            <Badge variant="purple" className="text-xs">
              {currentUser.university || currentUser.college}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your tasks, campus earnings, active orders, and client communications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/tasks/post">
            <Button size="sm" className="gap-2 shadow-sm font-semibold">
              <PlusCircle className="h-4 w-4" />
              <span>Post a Task</span>
            </Button>
          </Link>
          <Link href="/explore">
            <Button variant="outline" size="sm" className="gap-2 font-semibold">
              <Briefcase className="h-4 w-4" />
              <span>Find Work</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Completion Prompt (if < 100%) */}
      {completionPercent < 100 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 border border-blue-100 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="font-bold text-xs text-blue-900 dark:text-blue-300">
                Profile Completion ({completionPercent}%)
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Add your portfolio items and skills to boost your proposal acceptance rate by 3x.
            </p>
          </div>
          <Link href="/profile/edit">
            <Button size="sm" variant="subtle" className="text-xs font-semibold">
              Complete Profile
            </Button>
          </Link>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Earnings */}
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Earnings
              </span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {formatCurrency(wallet.total_earnings)}
              </div>
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>{formatCurrency(wallet.available_balance)} available</span>
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60">
              <DollarSign className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Active Orders */}
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Active Orders
              </span>
              <div className="text-2xl font-extrabold text-blue-600">
                {activeOrders.length}
              </div>
              <span className="text-[11px] text-slate-400">
                {completedOrders.length} completed all-time
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60">
              <ShoppingBag className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Pending Proposals */}
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                My Proposals
              </span>
              <div className="text-2xl font-extrabold text-purple-600">
                {pendingApplications.length}
              </div>
              <span className="text-[11px] text-slate-400">
                {applications.length} submitted total
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/60">
              <Send className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Posted Tasks */}
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Posted Tasks
              </span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {postedTasks.length}
              </div>
              <span className="text-[11px] text-slate-400">
                {postedTasks.filter((t) => t.status === "open").length} open now
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <FileCheck2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Active Orders List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-blue-600" />
              <span>Active Orders ({activeOrders.length})</span>
            </h2>
            <Link
              href="/dashboard/orders"
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {activeOrders.length > 0 ? (
            <div className="space-y-3">
              {activeOrders.map((order) => {
                const isBuyer = order.buyer_id === currentUser.id;
                const otherParty = isBuyer ? order.freelancer : order.buyer;

                return (
                  <Link key={order.id} href={`/orders/${order.id}`} className="block group">
                    <Card className="hover:shadow-card-hover hover:border-blue-200 dark:hover:border-blue-900 transition-all">
                      <CardContent className="p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-slate-400">
                            {order.order_number}
                          </span>
                          <StatusBadge status={order.status} />
                        </div>

                        <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-1">
                          {order.task?.title || "Active Order Task"}
                        </h4>

                        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">
                              {isBuyer ? "Freelancer:" : "Client:"}
                            </span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {otherParty?.full_name}
                            </span>
                          </div>

                          <div className="font-bold text-emerald-600">
                            {formatCurrency(order.agreed_price)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center space-y-3">
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 w-fit mx-auto">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  No Active Orders Right Now
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Browse tasks in the marketplace to start earning, or post a task to hire a peer collaborator.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <Link href="/explore">
                    <Button size="sm">Explore Tasks</Button>
                  </Link>
                  <Link href="/tasks/post">
                    <Button variant="outline" size="sm">Post a Task</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Notifications & Activity Stream (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="h-4 w-4 text-purple-600" />
              <span>Recent Activity</span>
            </h2>
            <Link
              href="/notifications"
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>Notifications</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <Card>
            <CardContent className="p-4 space-y-3">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <Link
                    key={n.id}
                    href={n.link || "/dashboard"}
                    className="block p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {formatRelativeTime(n.created_at)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                      {n.message}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  No new notifications.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Shortcuts */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">
                Quick Shortcuts
              </h3>
              <Link
                href="/messages"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <span>Open Direct Messages</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
              <Link
                href="/wallet"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                <div className="flex items-center gap-2.5">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                  <span>Manage Wallet & Payouts</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
              <Link
                href={`/profile/${currentUser.username}`}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                <div className="flex items-center gap-2.5">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span>Preview Public Profile</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
