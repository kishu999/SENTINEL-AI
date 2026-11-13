"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Users,
  Briefcase,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  Scale,
  FileText,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { dataService } from "@/lib/services/dataService";
import { formatCurrency, formatDate, formatRelativeTime } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(dataService.getAdminStats());
  const [auditLogs, setAuditLogs] = useState(dataService.getAdminAuditLogs().slice(0, 5));

  useEffect(() => {
    setStats(dataService.getAdminStats());
    setAuditLogs(dataService.getAdminAuditLogs().slice(0, 5));
  }, []);

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Executive Administration & Compliance
            </h1>
            <Badge variant="danger" className="text-[10px]">Root Console</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time platform metrics, collegiate trust oversight, escrow balances, and audit records.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Registered Students */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Registered Students</span>
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.totalUsers}</div>
          <div className="text-[11px] text-slate-400">100% verified campus IDs</div>
        </div>

        {/* Total Tasks */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Tasks</span>
            <Briefcase className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.totalTasks}</div>
          <div className="text-[11px] text-slate-400">Active marketplace listings</div>
        </div>

        {/* Completed Orders */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Completed Orders</span>
            <ShoppingBag className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{stats.completedOrders}</div>
          <div className="text-[11px] text-slate-400">Across {stats.totalOrders} total contracts</div>
        </div>

        {/* Platform Revenue */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Platform Revenue (5%)</span>
            <DollarSign className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400">
            {formatCurrency(stats.platformRevenue)}
          </div>
          <div className="text-[11px] text-slate-400">Retained from completed payouts</div>
        </div>
      </div>

      {/* Moderation Alerts Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/disputes" className="block p-5 rounded-2xl bg-rose-950/40 border border-rose-900/60 hover:bg-rose-950/60 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scale className="h-6 w-6 text-rose-400" />
              <div>
                <h3 className="font-bold text-sm text-white">Open Order Disputes</h3>
                <p className="text-xs text-rose-300">
                  {stats.openDisputes} {stats.openDisputes === 1 ? "order requires" : "orders require"} arbitration ruling
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-rose-400" />
          </div>
        </Link>

        <Link href="/admin/reports" className="block p-5 rounded-2xl bg-amber-950/40 border border-amber-900/60 hover:bg-amber-950/60 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-amber-400" />
              <div>
                <h3 className="font-bold text-sm text-white">Integrity & Policy Flags</h3>
                <p className="text-xs text-amber-300">
                  {stats.pendingReports} {stats.pendingReports === 1 ? "flag pending" : "flags pending"} compliance review
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-amber-400" />
          </div>
        </Link>
      </div>

      {/* Recent Audit Logs */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-400" />
              <span>System & Moderation Audit Stream</span>
            </h2>
            <p className="text-xs text-slate-400">
              Immutable event history logged by administrators and automated integrity monitors.
            </p>
          </div>

          <Link href="/admin/audit" className="text-xs text-blue-400 hover:underline">
            View All Logs
          </Link>
        </div>

        <div className="space-y-2">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <Badge variant="purple" className="text-[10px] font-mono">
                  {log.action}
                </Badge>
                <span className="text-slate-300">
                  Target: <strong>{log.target_type}</strong> ({log.target_id || "global"})
                </span>
              </div>
              <span className="text-slate-500">{formatRelativeTime(log.created_at)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
