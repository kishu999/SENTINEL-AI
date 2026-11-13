"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Send, Clock, DollarSign, Calendar, ArrowRight, XCircle } from "lucide-react";
import { dataService } from "@/lib/services/dataService";
import { Application } from "@/types/database";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export default function MyApplicationsPage() {
  const currentUser = dataService.getCurrentUser();
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    setApplications(dataService.getUserApplications(currentUser.id));
  }, [currentUser.id]);

  const handleWithdraw = (appId: string) => {
    if (!confirm("Are you sure you want to withdraw this application?")) return;
    const app = applications.find((a) => a.id === appId);
    if (app) {
      app.status = "withdrawn";
      (dataService as any).persist();
      setApplications([...applications]);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Submitted Proposals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track your bids, proposed prices, and client decisions across campus tasks.
          </p>
        </div>

        <Link href="/explore">
          <Button size="sm" variant="outline" className="gap-2 font-semibold">
            <span>Browse More Tasks</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app.id} className="hover:shadow-card-hover transition-all">
              <CardContent className="p-5 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-slate-400">
                      Applied on {formatDate(app.created_at)}
                    </span>
                    <Link href={`/tasks/${app.task_id}`} className="block group mt-0.5">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {app.task?.title || "Project Task"}
                      </h3>
                    </Link>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-extrabold text-sm text-emerald-600">
                        {formatCurrency(app.proposed_price)}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        in {app.estimated_delivery_days} days
                      </div>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    Your Cover Letter:
                  </span>
                  "{app.cover_letter}"
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="text-slate-500">
                    Client: <strong>{app.task?.client?.full_name}</strong> ({app.task?.client?.university})
                  </div>

                  <div className="flex items-center gap-2">
                    {app.status === "pending" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleWithdraw(app.id)}
                        className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      >
                        <XCircle className="h-3.5 w-3.5 mr-1" />
                        <span>Withdraw</span>
                      </Button>
                    )}

                    <Link href={`/tasks/${app.task_id}`}>
                      <Button variant="outline" size="sm" className="text-xs">
                        View Task
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Send}
          title="No Proposals Submitted"
          description="Explore tasks in the marketplace matching your skills, and submit competitive proposals to start earning."
          actionLabel="Explore Open Tasks"
          onAction={() => window.location.href = "/explore"}
        />
      )}
    </div>
  );
}
