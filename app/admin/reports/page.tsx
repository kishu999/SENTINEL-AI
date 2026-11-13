"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { dataService } from "@/lib/services/dataService";
import { Report } from "@/types/database";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);

  const loadReports = () => {
    setReports(dataService.getAdminReports());
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleAction = (reportId: string, status: "resolved" | "dismissed") => {
    dataService.resolveReport(reportId, status, "Reviewed by compliance operations.");
    loadReports();
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-amber-400" />
          <span>Trust & Academic Integrity Reports Queue</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review peer reports regarding off-platform circumvention, academic cheating, or abusive behavior.
        </p>
      </div>

      <div className="space-y-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Badge variant={rep.status === "pending" ? "warning" : "default"} className="text-[10px]">
                  {rep.status.toUpperCase()}
                </Badge>
                <span className="font-bold text-white text-sm">{rep.reason}</span>
              </div>
              <span className="text-xs text-slate-400">{formatDate(rep.created_at)}</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 bg-slate-950 p-4 rounded-2xl border border-slate-800 leading-relaxed">
              "{rep.details}"
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs pt-1">
              <div className="space-y-0.5 text-slate-400">
                <div>Reporter: <strong className="text-white">{rep.reporter?.full_name}</strong></div>
                {rep.reported_user && (
                  <div>Reported Student: <strong className="text-rose-400">{rep.reported_user.full_name} (@{rep.reported_user.username})</strong></div>
                )}
              </div>

              {rep.status === "pending" && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction(rep.id, "dismissed")}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    <span>Dismiss</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAction(rep.id, "resolved")}
                    className="text-xs bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    <span>Resolve & Log Warning</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
