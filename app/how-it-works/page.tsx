import React from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  CheckCircle2,
  ShieldAlert,
  GraduationCap,
  Sparkles,
  ArrowRight,
  DollarSign,
  AlertOctagon,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-5xl">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="purple" className="mb-2">Platform Mechanics</Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          How SkillConnect Works
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          SkillConnect unites college students who have projects with peers who possess verified skills. Transparent, student-priced, and academically ethical.
        </p>
      </div>

      {/* Dual Journey: For Buyers & For Freelancers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Buyer Journey */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h2 className="font-extrabold text-xl text-slate-900 dark:text-white">For Task Posters (Buyers)</h2>
              <p className="text-xs text-slate-500">Need help designing, coding, or synthesizing research?</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex gap-4 items-start">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xs font-bold">1</span>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Post Your Task in 2 Minutes</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Provide a clear summary, select a budget (fixed or hourly), attach reference files, and set your deadline.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xs font-bold">2</span>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Compare Student Proposals</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Review applicant cover letters, verified student ratings, and previous portfolio projects to select the best match.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xs font-bold">3</span>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Collaborate in Realtime</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Chat directly with your hired peer, share revisions, and review final deliverables in the order workspace.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xs font-bold">4</span>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Approve & Release Payment</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Funds held in escrow are released to the freelancer only once you approve the work. Leave a verified star review!
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/tasks/post">
              <Button className="w-full">Post a Task Now</Button>
            </Link>
          </div>
        </div>

        {/* Freelancer Journey */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h2 className="font-extrabold text-xl text-slate-900 dark:text-white">For Freelancers (Earners)</h2>
              <p className="text-xs text-slate-500">Want to monetize your coding, design, or writing skills?</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex gap-4 items-start">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600 text-xs font-bold">1</span>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Browse Live Campus Requests</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Filter by category, minimum budget, and deadline to find tasks that fit your semester schedule.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600 text-xs font-bold">2</span>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Submit a Competitive Proposal</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Explain your approach, set your proposed price and delivery timeline. Highlight relevant coursework or past work.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600 text-xs font-bold">3</span>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Deliver High-Quality Work</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Upload files directly to the order workspace. Manage revisions smoothly through the integrated messaging feed.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600 text-xs font-bold">4</span>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Get Paid Directly (95% Net)</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Receive fast payouts with only a 5% platform fee. Build verified ratings and auto-generate portfolio items.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/explore">
              <Button variant="outline" className="w-full">Explore Open Tasks</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Academic Integrity Honor Code Breakdown */}
      <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-10 border border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Academic Integrity & Permissible Services Policy</h2>
            <p className="text-xs text-slate-400">Protecting student futures and institutional honesty</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-8">
          SkillConnect strictly enforces zero tolerance for academic cheating, ghostwriting graded exams, or contract completion of homework meant for individual evaluation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Permissible */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-3">
              <CheckCircle2 className="h-4 w-4" />
              <span>PERMITTED SERVICES</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>• Tutoring, concept explanation, and coding mentorship</li>
              <li>• Pitch deck, presentation, and slide visual design</li>
              <li>• Mobile app & web UI/UX mockups and prototyping in Figma</li>
              <li>• Public data scraping, spreadsheet cleaning & modeling</li>
              <li>• Proofreading for grammar, syntax, and clarity</li>
              <li>• Club branding, event posters, and promotional video reels</li>
            </ul>
          </div>

          {/* Prohibited */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-rose-500/30">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-3">
              <AlertOctagon className="h-4 w-4" />
              <span>STRICTLY PROHIBITED</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>• Writing essays, theses, or assignments for another student's grade</li>
              <li>• Taking quizzes, midterms, or exams on someone else's behalf</li>
              <li>• Solving homework sets that require independent submission</li>
              <li>• Impersonation or submitting fraudulent academic credentials</li>
              <li>• Soliciting off-platform payments to circumvent escrow</li>
              <li>• Violation results in immediate account termination</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
