import React from "react";
import { Badge } from "@/components/ui/badge";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-3xl space-y-8">
      <div>
        <Badge variant="purple" className="mb-2">Draft Legal Document</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          Terms & Conditions
        </h1>
        <p className="text-xs text-slate-400">Last updated: November 2026 • Effective upon platform onboarding</p>
      </div>

      <div className="prose dark:prose-invert text-sm text-slate-600 dark:text-slate-300 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using SkillConnect, you agree to be bound by these Terms and Conditions and our Academic Integrity Policy. If you do not agree to all terms, do not create an account or post tasks.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Student Eligibility & Accounts</h2>
          <p>
            SkillConnect is intended for current college, university, and post-secondary students. Users must register with a genuine name, university affiliation, and valid email. You may use a single verified account as both a task poster (buyer) and freelance collaborator.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Strict Academic Integrity Standard</h2>
          <p>
            SkillConnect strictly bans ghostwriting, completing graded homework, writing theses/essays for graded credit, taking examinations, or any conduct violating collegiate honor codes. Any task or application found violating academic honesty will be terminated and reported.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Payment, Escrow & 5% Platform Fee</h2>
          <p>
            When a proposal is accepted, the buyer deposits the agreed funds into protected escrow. Funds are transferred to the freelancer's wallet upon buyer confirmation of acceptable deliverables. SkillConnect deducts a 5% platform maintenance fee from gross earnings.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Independent Contractor Status</h2>
          <p>
            Student freelancers operate as independent contractors. Neither SkillConnect nor task buyers enter into an employer-employee relationship with student earners.
          </p>
        </section>
      </div>
    </div>
  );
}
