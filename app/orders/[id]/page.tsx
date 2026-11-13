"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  Calendar,
  DollarSign,
  Upload,
  AlertTriangle,
  RotateCcw,
  MessageSquare,
  ShieldCheck,
  FileText,
  Star,
  Sparkles,
  ExternalLink,
  ArrowLeft,
  XCircle,
} from "lucide-react";
import { dataService } from "@/lib/services/dataService";
import { Order, OrderDeliverable } from "@/types/database";
import { formatCurrency, formatDate, formatRelativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RatingStars } from "@/components/ui/rating-stars";

export default function OrderWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const currentUser = dataService.getCurrentUser();

  // Modals state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [deliverableMessage, setDeliverableMessage] = useState("");
  const [fileName, setFileName] = useState("");

  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState("");

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewFeedback, setReviewFeedback] = useState("");

  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");

  const loadOrder = () => {
    const ord = dataService.getOrderById(orderId);
    if (ord) setOrder({ ...ord });
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Order Not Found</h2>
        <Link href="/dashboard/orders">
          <Button className="mt-4" size="sm">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const isBuyer = currentUser.id === order.buyer_id;
  const isFreelancer = currentUser.id === order.freelancer_id;

  // Submit Deliverable
  const handleSubmitDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliverableMessage.trim()) return;

    dataService.submitDeliverable(order.id, {
      message: deliverableMessage.trim(),
      files: [
        {
          name: fileName.trim() || "final_project_deliverable.zip",
          url: "#",
          size: "2.8 MB",
        },
      ],
    });

    setIsSubmitModalOpen(false);
    setDeliverableMessage("");
    setFileName("");
    loadOrder();
  };

  // Request Revision
  const handleRequestRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionNotes.trim()) return;

    dataService.requestRevision(order.id, revisionNotes.trim());
    setIsRevisionModalOpen(false);
    setRevisionNotes("");
    loadOrder();
  };

  // Approve Order
  const handleApproveOrder = () => {
    if (!confirm("Approve this deliverable and release funds from escrow to the freelancer?")) return;
    dataService.approveOrder(order.id);
    loadOrder();
    setIsReviewModalOpen(true);
  };

  // Submit Review
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewFeedback.trim()) return;

    dataService.createReview({
      order_id: order.id,
      reviewee_id: isBuyer ? order.freelancer_id : order.buyer_id,
      rating: reviewRating,
      feedback: reviewFeedback.trim(),
      role: isBuyer ? "buyer" : "freelancer",
    });

    setIsReviewModalOpen(false);
    loadOrder();
  };

  // File Dispute
  const handleFileDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeReason.trim()) return;

    const newDispute = {
      id: `disp-${Date.now()}`,
      order_id: order.id,
      order: order,
      raised_by: currentUser.id,
      raised_by_user: currentUser,
      reason: disputeReason.trim(),
      evidence: [{ name: "workspace_log.txt", url: "#" }],
      status: "opened" as const,
      created_at: new Date().toISOString(),
    };

    (dataService as any).disputes.unshift(newDispute);
    order.status = "disputed";
    (dataService as any).persist();
    setIsDisputeModalOpen(false);
    setDisputeReason("");
    loadOrder();
  };

  const handleOpenChat = () => {
    const counterpartId = isBuyer ? order.freelancer_id : order.buyer_id;
    const counterpartName = isBuyer ? order.freelancer?.full_name : order.buyer?.full_name;
    const conv = dataService.getOrCreateConversation([currentUser.id, counterpartId], order.task?.title);
    router.push(`/messages?id=${conv.id}`);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-5xl space-y-8">
      {/* Top Breadcrumb */}
      <div>
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to My Orders</span>
        </Link>
      </div>

      {/* Order Status Banner */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-slate-400">
                {order.order_number}
              </span>
              <StatusBadge status={order.status} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              {order.task?.title}
            </h1>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400">Total Agreed Price</div>
            <div className="text-2xl font-extrabold text-emerald-600">
              {formatCurrency(order.agreed_price)}
            </div>
          </div>
        </div>

        {/* Milestone Steps Timeline */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="space-y-1">
            <div className="h-2 rounded-full bg-emerald-500" />
            <span className="font-bold text-slate-900 dark:text-white">1. Order Funded</span>
          </div>
          <div className="space-y-1">
            <div className={`h-2 rounded-full ${order.status !== "pending" ? "bg-emerald-500" : "bg-slate-200"}`} />
            <span className="font-bold text-slate-900 dark:text-white">2. In Progress</span>
          </div>
          <div className="space-y-1">
            <div className={`h-2 rounded-full ${order.status === "submitted" || order.status === "completed" ? "bg-emerald-500" : "bg-slate-200"}`} />
            <span className="font-bold text-slate-900 dark:text-white">3. Submitted</span>
          </div>
          <div className="space-y-1">
            <div className={`h-2 rounded-full ${order.status === "completed" ? "bg-emerald-500" : "bg-slate-200"}`} />
            <span className="font-bold text-slate-900 dark:text-white">4. Completed</span>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" size="sm" onClick={handleOpenChat} className="gap-2">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            <span>Chat With {isBuyer ? order.freelancer?.full_name : order.buyer?.full_name}</span>
          </Button>

          <div className="flex flex-wrap items-center gap-2">
            {/* Freelancer submit deliverable action */}
            {isFreelancer && (order.status === "in_progress" || order.status === "revision_requested") && (
              <Button size="sm" onClick={() => setIsSubmitModalOpen(true)} className="gap-2 bg-blue-600">
                <Upload className="h-4 w-4" />
                <span>Upload Deliverable</span>
              </Button>
            )}

            {/* Buyer review actions */}
            {isBuyer && order.status === "submitted" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRevisionModalOpen(true)}
                  className="gap-2 text-amber-600 border-amber-200"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Request Revision</span>
                </Button>

                <Button
                  size="sm"
                  onClick={handleApproveOrder}
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700 font-bold"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Approve & Release Funds</span>
                </Button>
              </>
            )}

            {/* Completed state review CTA */}
            {order.status === "completed" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsReviewModalOpen(true)}
                className="gap-2 text-amber-600 font-semibold"
              >
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>Leave Review</span>
              </Button>
            )}

            {/* Dispute Button */}
            {order.status !== "completed" && order.status !== "cancelled" && order.status !== "disputed" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDisputeModalOpen(true)}
                className="text-xs text-slate-400 hover:text-rose-600"
              >
                <span>Report / Dispute</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Deliverables Feed + Order Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Deliverables Feed (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" />
              <span>Deliverables & Revisions History</span>
            </h2>

            {order.deliverables && order.deliverables.length > 0 ? (
              <div className="space-y-4">
                {order.deliverables.map((del) => (
                  <div
                    key={del.id}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Badge variant="purple" className="text-[10px]">
                          Revision #{del.revision_number}
                        </Badge>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {del.sender?.full_name}
                        </span>
                      </div>
                      <span className="text-slate-400">{formatRelativeTime(del.created_at)}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      "{del.message}"
                    </p>

                    {del.files && del.files.length > 0 && (
                      <div className="space-y-2 pt-1">
                        {del.files.map((file, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-blue-600" />
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {file.name}
                              </span>
                              <span className="text-slate-400">({file.size || "1.2 MB"})</span>
                            </div>
                            <Button size="sm" variant="ghost" className="h-7 text-xs text-blue-600">
                              Download File
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-xs text-slate-500">
                {isFreelancer ? (
                  <div className="space-y-3">
                    <p>No deliverables uploaded yet. When you are ready, submit your files for client review.</p>
                    <Button size="sm" onClick={() => setIsSubmitModalOpen(true)}>
                      Submit First Deliverable
                    </Button>
                  </div>
                ) : (
                  "The freelancer is actively preparing your deliverable. You will be notified once files are uploaded."
                )}
              </div>
            )}
          </div>
        </div>

        {/* Order Details Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4 text-xs">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">
                Contract Summary
              </h3>

              <div className="space-y-2.5 pt-2">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Buyer (Client)</span>
                  <span className="font-bold text-slate-900 dark:text-white">{order.buyer?.full_name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Student Freelancer</span>
                  <span className="font-bold text-slate-900 dark:text-white">{order.freelancer?.full_name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Agreed Deadline</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatDate(order.deadline)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Gross Price</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(order.agreed_price)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Platform Fee (5%)</span>
                  <span className="text-slate-500">-{formatCurrency(order.platform_fee)}</span>
                </div>
                <div className="flex justify-between py-1 font-bold text-emerald-600 text-sm">
                  <span>Freelancer Payout</span>
                  <span>{formatCurrency(order.agreed_price - order.platform_fee)}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 leading-relaxed">
                Escrow Guarantee: Funds are held securely until buyer approval or dispute resolution by the administration.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upload Deliverable Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit Order Deliverable"
        description="Upload completed work files and leave an explanation for the buyer."
      >
        <form onSubmit={handleSubmitDeliverable} className="space-y-4 mt-2">
          <Input
            label="Deliverable File Name / Asset Label"
            placeholder="e.g. food_rescue_figma_screens_v1.zip"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />

          <Textarea
            label="Handover Notes / Summary *"
            required
            rows={4}
            placeholder="Explain what has been completed, any instructions on how to use files, and next steps..."
            value={deliverableMessage}
            onChange={(e) => setDeliverableMessage(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsSubmitModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Submit Deliverable
            </Button>
          </div>
        </form>
      </Modal>

      {/* Request Revision Modal */}
      <Modal
        isOpen={isRevisionModalOpen}
        onClose={() => setIsRevisionModalOpen(false)}
        title="Request Revisions"
        description="Explain what adjustments or additions are required before final approval."
      >
        <form onSubmit={handleRequestRevision} className="space-y-4 mt-2">
          <Textarea
            label="Revision Details *"
            required
            rows={4}
            placeholder="Detail specifically what changes are needed..."
            value={revisionNotes}
            onChange={(e) => setRevisionNotes(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsRevisionModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="bg-amber-600 hover:bg-amber-700">
              Send Revision Request
            </Button>
          </div>
        </form>
      </Modal>

      {/* Star Review Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Leave Verified Student Review"
        description="Rate your collaborator and help build their official campus reputation."
      >
        <form onSubmit={handleSubmitReview} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`h-7 w-7 ${
                      star <= reviewRating
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300 dark:text-slate-700"
                    }`}
                  />
                </button>
              ))}
              <span className="text-sm font-bold ml-2 text-slate-900 dark:text-white">
                {reviewRating} of 5 Stars
              </span>
            </div>
          </div>

          <Textarea
            label="Feedback & Testimonial *"
            required
            rows={4}
            placeholder="Share what it was like collaborating with this student..."
            value={reviewFeedback}
            onChange={(e) => setReviewFeedback(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsReviewModalOpen(false)}>
              Skip
            </Button>
            <Button type="submit" size="sm">
              Post Review
            </Button>
          </div>
        </form>
      </Modal>

      {/* Dispute Modal */}
      <Modal
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        title="File an Order Dispute"
        description="If you are unable to reach agreement, request administrative arbitration."
      >
        <form onSubmit={handleFileDispute} className="space-y-4 mt-2">
          <Textarea
            label="Dispute Reason & Evidence Summary *"
            required
            rows={4}
            placeholder="Explain why the order cannot proceed and what resolution you are requesting..."
            value={disputeReason}
            onChange={(e) => setDisputeReason(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsDisputeModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" size="sm">
              File Official Dispute
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
