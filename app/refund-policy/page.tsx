import React from "react";
import { Badge } from "@/components/ui/badge";

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-3xl space-y-8">
      <div>
        <Badge variant="purple" className="mb-2">Financial Protection</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          Refund & Cancellation Policy
        </h1>
        <p className="text-xs text-slate-400">Clear guidelines on escrow releases, order cancellations, and dispute refunds</p>
      </div>

      <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Mutual Cancellation Prior to Delivery</h2>
          <p>
            If both the buyer and student freelancer agree to cancel an order before work has commenced or before deliverables are submitted, 100% of the held escrow is immediately refunded to the buyer's SkillConnect wallet balance.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Missed Deadlines & Unresponsive Collaborators</h2>
          <p>
            If a freelancer fails to deliver by the agreed deadline and remains unresponsive for more than 48 hours, the buyer may file a cancellation request which automatically refunds the escrow balance in full.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Quality Disputes & Revisions</h2>
          <p>
            Buyers are entitled to request reasonable revisions aligned with the original task brief. If the work fundamentally fails to meet agreed requirements, either party may open a dispute in the Order Workspace for human administrative arbitration.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Final Completed Orders</h2>
          <p>
            Once a buyer explicitly approves a deliverable and payment is released from escrow to the freelancer's withdrawable wallet, refunds cannot be automatically reversed.
          </p>
        </section>
      </div>
    </div>
  );
}
