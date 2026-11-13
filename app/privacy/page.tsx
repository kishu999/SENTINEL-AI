import React from "react";
import { Badge } from "@/components/ui/badge";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-3xl space-y-8">
      <div>
        <Badge variant="purple" className="mb-2">Student Data Protection</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400">Last updated: November 2026</p>
      </div>

      <div className="text-sm text-slate-600 dark:text-slate-300 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Information We Collect</h2>
          <p>
            We collect personal information necessary to deliver marketplace services, including your name, email address, collegiate affiliation, major/course, year of study, username, profile biography, skills, and portfolio samples.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Financial Information & Data Security</h2>
          <p>
            Payment processing is conducted via industry-standard PCI-compliant providers (such as Stripe). SkillConnect never stores full credit card numbers or sensitive banking credentials on our database servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Public vs. Private Student Profiles</h2>
          <p>
            Students maintain complete control over their profile visibility. You may toggle your profile to private at any time, restricting public search engines from indexing your work and reviews.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. No Data Reselling</h2>
          <p>
            We never sell, rent, or trade student personal records or academic identities to third-party advertisers or recruitment brokers without explicit consent.
          </p>
        </section>
      </div>
    </div>
  );
}
