"use client";

import React, { useState } from "react";
import { ShieldAlert, AlertTriangle, CheckCircle2, Send } from "lucide-react";
import { dataService } from "@/lib/services/dataService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function ReportIssuePage() {
  const currentUser = dataService.getCurrentUser();
  const [submitted, setSubmitted] = useState(false);
  const [reason, setReason] = useState("academic_dishonesty");
  const [reportedUsername, setReportedUsername] = useState("");
  const [taskId, setTaskId] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    let reportedUserId: string | undefined = undefined;
    if (reportedUsername.trim()) {
      const target = dataService.getProfileByUsername(reportedUsername.trim());
      if (target) reportedUserId = target.id;
    }

    // Save report via mockData / service
    const newReport = {
      id: `rep-${Date.now()}`,
      reporter_id: currentUser.id,
      reporter: currentUser,
      reported_user_id: reportedUserId,
      task_id: taskId.trim() || undefined,
      reason: reason === "academic_dishonesty" 
        ? "Suspected Academic Dishonesty / Cheating"
        : reason === "off_platform"
        ? "Off-Platform Payment Solicitation"
        : reason === "harassment"
        ? "Harassment / Inappropriate Communication"
        : "Fraud / Fake Deliverables",
      details: details.trim(),
      status: "pending" as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    (dataService as any).reports.unshift(newReport);
    setSubmitted(true);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-2xl">
      <div className="text-center mb-8 space-y-2">
        <Badge variant="danger" className="gap-1">
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Trust & Safety Enforcement</span>
        </Badge>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Report Suspicious Activity
        </h1>
        <p className="text-sm text-slate-500">
          Help maintain academic integrity and a safe community on SkillConnect. All reports are confidential and reviewed by administrators.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Report Registered</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              Thank you for keeping SkillConnect trustworthy. Our compliance and safety officers will review the evidence and take action.
            </p>
            <Button onClick={() => setSubmitted(false)} variant="outline" size="sm">
              Submit Another Report
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Violation Type
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
              >
                <option value="academic_dishonesty">Academic Dishonesty / Homework Solicitation</option>
                <option value="off_platform">Off-Platform Payment Solicitation (Circumvention)</option>
                <option value="harassment">Inappropriate Behavior or Harassment</option>
                <option value="fraud">Fraudulent Work or Impersonation</option>
                <option value="other">Other Violation</option>
              </select>
            </div>

            <Input
              label="Reported Student Username (Optional)"
              placeholder="e.g. arivera_tech"
              value={reportedUsername}
              onChange={(e) => setReportedUsername(e.target.value)}
              helperText="The username of the individual violating guidelines."
            />

            <Input
              label="Task ID or Order ID (Optional)"
              placeholder="e.g. task-1 or SC-2026-8812"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
            />

            <Textarea
              label="Detailed Explanation"
              required
              rows={4}
              placeholder="Describe specifically what occurred and paste any relevant message snippets or links..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />

            <div className="pt-2">
              <Button type="submit" variant="danger" className="w-full gap-2 font-semibold">
                <Send className="h-4 w-4" />
                <span>Submit Confidential Report</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
