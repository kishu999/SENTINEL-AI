"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  DollarSign,
  Clock,
  Users,
  ShieldCheck,
  Send,
  MessageSquare,
  Bookmark,
  Share2,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowLeft,
  XCircle,
} from "lucide-react";
import { dataService } from "@/lib/services/dataService";
import { Task, Application } from "@/types/database";
import { formatCurrency, formatDate, formatRelativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { RatingStars } from "@/components/ui/rating-stars";

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [proposedPrice, setProposedPrice] = useState<number | "">(100);
  const [deliveryDays, setDeliveryDays] = useState<number>(3);
  const [applyError, setApplyError] = useState("");
  const [applySuccess, setApplySuccess] = useState(false);

  const currentUser = dataService.getCurrentUser();

  const loadData = () => {
    const t = dataService.getTaskById(taskId);
    if (t) {
      setTask(t);
      setProposedPrice(t.budget);
      setApplications(dataService.getApplicationsForTask(taskId));
    }
  };

  useEffect(() => {
    loadData();
  }, [taskId]);

  if (!task) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Task Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The task may have been closed or removed.</p>
        <Link href="/explore">
          <Button className="mt-4" size="sm">Back to Marketplace</Button>
        </Link>
      </div>
    );
  }

  const isOwner = currentUser.id === task.client_id;
  const existingApp = applications.find((a) => a.freelancer_id === currentUser.id);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setApplyError("");

    if (!coverLetter.trim() || coverLetter.trim().length < 20) {
      setApplyError("Please write a proposal of at least 20 characters explaining your approach.");
      return;
    }
    if (!proposedPrice || Number(proposedPrice) <= 0) {
      setApplyError("Please enter a valid proposed price.");
      return;
    }

    try {
      dataService.submitApplication({
        task_id: task.id,
        cover_letter: coverLetter.trim(),
        proposed_price: Number(proposedPrice),
        estimated_delivery_days: Number(deliveryDays),
      });

      setApplySuccess(true);
      setTimeout(() => {
        setIsApplyModalOpen(false);
        setApplySuccess(false);
        loadData();
      }, 1200);
    } catch (err: any) {
      setApplyError(err.message || "Failed to submit proposal.");
    }
  };

  const handleAcceptProposal = (appId: string) => {
    try {
      const order = dataService.acceptApplication(appId);
      router.push(`/orders/${order.id}`);
    } catch (err: any) {
      alert(err.message || "Could not accept application");
    }
  };

  const handleContactStudent = (studentId: string, studentName: string) => {
    const conv = dataService.getOrCreateConversation([currentUser.id, studentId], task.title);
    router.push(`/messages?id=${conv.id}`);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-5xl">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Explore Tasks</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Details (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Badge variant="purple" className="text-xs">
                {task.category?.name || "Task Listing"}
              </Badge>
              <StatusBadge status={task.status} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {task.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>Posted {formatRelativeTime(task.created_at)}</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-blue-600" />
                <span>Deadline: {formatDate(task.deadline)}</span>
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-purple-600" />
                <span>{applications.length} applications</span>
              </span>
            </div>

            {/* Scope / Description */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">
                Project Description & Scope
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {task.description}
              </p>
            </div>

            {/* Additional Instructions */}
            {task.additional_instructions && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  Special Instructions
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {task.additional_instructions}
                </p>
              </div>
            )}

            {/* Required Skills */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {task.required_skills.map((skill, i) => (
                  <Badge key={i} variant="default" className="text-xs py-1 px-3">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Attachments */}
            {task.attachments && task.attachments.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">
                  Reference Files
                </h3>
                <div className="space-y-2">
                  {task.attachments.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-slate-800 dark:text-slate-200">{file.name}</span>
                      </div>
                      <span className="text-slate-400">Attachment</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* If Task Owner: Proposals Management Section */}
          {isOwner && (
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Submitted Proposals ({applications.length})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Compare student applicants and accept the best proposal to hire.
                  </p>
                </div>
              </div>

              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={app.freelancer?.avatar_url || "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100"}
                            alt={app.freelancer?.full_name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div>
                            <Link
                              href={`/profile/${app.freelancer?.username}`}
                              className="font-bold text-sm text-slate-900 dark:text-white hover:text-blue-600 transition-colors"
                            >
                              {app.freelancer?.full_name}
                            </Link>
                            <div className="text-xs text-slate-500">
                              {app.freelancer?.university} • {app.freelancer?.course}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
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

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        "{app.cover_letter}"
                      </p>

                      {app.status === "pending" && task.status === "open" && (
                        <div className="flex items-center justify-end gap-2 pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleContactStudent(app.freelancer_id, app.freelancer?.full_name || "Applicant")}
                            className="gap-1.5 text-xs"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>Message</span>
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => handleAcceptProposal(app.id)}
                            className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Accept & Hire</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                  No student proposals have been submitted yet. Eligible students will apply shortly!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Card (4 cols): Budget & Action CTAs */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  Project Budget
                </span>
                <span className="text-xs text-slate-500 capitalize">{task.budget_type}</span>
              </div>

              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {formatCurrency(task.budget)}
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-300 leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  <span>Escrow Protection</span>
                </div>
                Payment is placed in escrow once you hire, and only released when deliverables are approved.
              </div>

              {/* Action Button */}
              {isOwner ? (
                <div className="space-y-2">
                  <Badge variant="secondary" className="w-full justify-center py-2 text-xs">
                    You posted this task
                  </Badge>
                  <Link href="/dashboard/tasks">
                    <Button variant="outline" size="sm" className="w-full">
                      Manage in Dashboard
                    </Button>
                  </Link>
                </div>
              ) : existingApp ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Application Submitted</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Status: <strong className="capitalize">{existingApp.status}</strong>
                  </p>
                </div>
              ) : task.status === "open" ? (
                <Button
                  size="lg"
                  className="w-full gap-2 font-bold shadow-md"
                  onClick={() => setIsApplyModalOpen(true)}
                >
                  <Send className="h-4 w-4" />
                  <span>Apply for this Task</span>
                </Button>
              ) : (
                <Badge variant="secondary" className="w-full justify-center py-2 text-xs">
                  This task is currently {task.status.replace("_", " ")}
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Client Profile Card */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400">
                Posted By Student
              </h3>

              <div className="flex items-center gap-3">
                <img
                  src={task.client?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                  alt={task.client?.full_name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-blue-500/20"
                />
                <div>
                  <Link
                    href={`/profile/${task.client?.username}`}
                    className="font-bold text-sm text-slate-900 dark:text-white hover:text-blue-600 transition-colors"
                  >
                    {task.client?.full_name}
                  </Link>
                  <div className="text-xs text-slate-500">{task.client?.university}</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 dark:border-slate-800 text-slate-500">
                <span>Rating</span>
                <RatingStars rating={task.client?.rating || 5.0} size="sm" />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Completed Projects</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {task.client?.completed_projects || 0}
                </span>
              </div>

              {!isOwner && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleContactStudent(task.client_id, task.client?.full_name || "Client")}
                  className="w-full gap-2 mt-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Message {task.client?.full_name?.split(" ")[0]}</span>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Apply / Proposal Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Submit Project Proposal"
        description={`Applying for: ${task.title}`}
      >
        {applySuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Proposal Dispatched!</h3>
            <p className="text-xs text-slate-500">
              The task owner has received your offer and will review your profile.
            </p>
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-4 mt-2">
            {applyError && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium">
                {applyError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Proposed Price ($ USD)"
                type="number"
                required
                min="5"
                value={proposedPrice}
                onChange={(e) => setProposedPrice(e.target.value === "" ? "" : Number(e.target.value))}
              />

              <Input
                label="Delivery Days"
                type="number"
                required
                min="1"
                max="60"
                value={deliveryDays}
                onChange={(e) => setDeliveryDays(Number(e.target.value))}
              />
            </div>

            <Textarea
              label="Cover Letter & Approach"
              required
              rows={4}
              placeholder="Explain how you will accomplish this project, mention your relevant skills, and ask any clarifying questions..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-500 leading-relaxed">
              Upon client acceptance, 95% of the proposed price will be credited to your withdrawable wallet after deliverable approval (5% platform fee).
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsApplyModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="gap-2">
                <Send className="h-4 w-4" />
                <span>Submit Proposal</span>
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
