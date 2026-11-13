"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, Search, Mail, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function HelpCenterPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Can I use the same account to post tasks and apply as a freelancer?",
      a: "Yes! SkillConnect accounts are unified. Every student can post project requirements when they need help, and submit proposals on other tasks where they have relevant skills.",
    },
    {
      q: "How does payment escrow work on SkillConnect?",
      a: "When you accept a freelancer's proposal, your payment is placed into secure escrow. The freelancer sees that the task is funded and starts work. The funds are only transferred to the freelancer's wallet after you review and approve the submitted deliverables.",
    },
    {
      q: "What types of tutoring and academic support are allowed?",
      a: "Peer tutoring, coding assistance, explanation of conceptual proofs, debugging help, literature survey guidance, and proofreading for grammar and style are 100% permitted. Ghostwriting essays, completing exams, or doing graded assignments for another student to turn in as their own work is strictly banned.",
    },
    {
      q: "What is SkillConnect's platform fee?",
      a: "SkillConnect charges an industry-low 5% platform fee on completed earnings to maintain secure servers and verification. Unlike traditional platforms that extract 20%, we keep 95% of money directly with student earners.",
    },
    {
      q: "How do withdrawals work?",
      a: "Once earnings reach your available balance, you can request a withdrawal via direct bank deposit (ACH), PayPal, or supported regional payout rails. Payouts are processed within 1-2 business days.",
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-4xl space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="purple">Support & Knowledge Base</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-500">
          Everything you need to know about student freelancing, escrow safety, and platform rules.
        </p>
      </div>

      <div className="space-y-4 max-w-2xl mx-auto">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-slate-900 dark:text-white hover:text-blue-600 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180 text-blue-600" : "text-slate-400"}`} />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-3xl bg-slate-50 dark:bg-slate-800 p-8 border border-slate-200 dark:border-slate-700 text-center max-w-2xl mx-auto space-y-4">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Still have questions?</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Our collegiate support specialists are happy to assist with any account or payment questions.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/contact">
            <Button size="sm" className="gap-2">
              <Mail className="h-4 w-4" />
              <span>Contact Support</span>
            </Button>
          </Link>
          <Link href="/report">
            <Button variant="outline" size="sm" className="gap-2 text-rose-600">
              <ShieldAlert className="h-4 w-4" />
              <span>Report an Issue</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
