import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertOctagon } from "lucide-react";

export default function CommunityGuidelinesPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-3xl space-y-8">
      <div>
        <Badge variant="purple" className="mb-2">Community Standards</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          Community & Academic Guidelines
        </h1>
        <p className="text-xs text-slate-400">Rules of engagement for all university students on SkillConnect</p>
      </div>

      <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <div className="p-6 rounded-3xl bg-blue-50/50 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-800 space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <span>Core Community Principles</span>
          </h2>
          <ul className="space-y-2 text-xs">
            <li><strong>Collegiate Respect:</strong> Treat every student collaborator with empathy, timely communication, and professional respect.</li>
            <li><strong>Fair Pricing:</strong> Value student labor and intellectual contributions fairly without exploitative compensation.</li>
            <li><strong>Clear Scope:</strong> Detail project deliverables upfront to avoid unexpected scope creep.</li>
            <li><strong>Constructive Reviews:</strong> Provide honest, respectful feedback that helps peers grow their skills.</li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-rose-50/50 dark:bg-slate-800/50 border border-rose-100 dark:border-slate-800 space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-rose-600" />
            <span>Zero-Tolerance Violations</span>
          </h2>
          <ul className="space-y-2 text-xs">
            <li><strong>Contract Academic Cheating:</strong> Completing exams, quizzes, or graded individual assignments on behalf of another student is strictly forbidden.</li>
            <li><strong>Harassment or Discrimination:</strong> Any discrimination on the basis of race, gender, university, or background results in immediate expulsion.</li>
            <li><strong>Circumvention:</strong> Soliciting payment off-platform forfeits escrow protection and results in permanent suspension.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
