import React from "react";
import Link from "next/link";
import { Sparkles, Shield, Heart, GraduationCap, Github, Twitter, Linkedin, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Skill<span className="text-blue-400">Connect</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              The premier student-to-student freelancing and collaborative micro-task marketplace. Turn your collegiate skills into opportunities, portfolios, and earnings.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-800 hover:text-white hover:bg-slate-700 transition-colors">
                <Github className="h-4 w-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-800 hover:text-white hover:bg-slate-700 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-800 hover:text-white hover:bg-slate-700 transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Marketplace Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Marketplace</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/explore" className="hover:text-blue-400 transition-colors">Explore All Tasks</Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-blue-400 transition-colors">Browse Categories</Link>
              </li>
              <li>
                <Link href="/tasks/post" className="hover:text-blue-400 transition-colors">Post a Task</Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-blue-400 transition-colors">How It Works</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-blue-400 transition-colors">Student Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Trust & Policies</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/community-guidelines" className="hover:text-blue-400 transition-colors">Community Guidelines</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-blue-400 transition-colors">Refund Policy</Link>
              </li>
              <li>
                <Link href="/report" className="hover:text-rose-400 text-rose-300 font-medium transition-colors">Report an Issue</Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Support & Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">About SkillConnect</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Support</Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-blue-400 transition-colors">Help Center & FAQ</Link>
              </li>
              <li>
                <Link href="/admin" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Admin Portal</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Academic Integrity Honor Code Notice */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="rounded-2xl bg-slate-800/80 p-4 sm:p-5 border border-slate-700/60 flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div className="text-xs leading-relaxed text-slate-300">
              <span className="font-bold text-white block mb-0.5">Academic Integrity & Collaboration Commitment</span>
              SkillConnect is designed to empower peer mentorship, technical assistance, design, and genuine learning support. We strictly prohibit contract cheating, impersonation, or completing assignments intended for independent student submission.
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <div>
              &copy; {new Date().getFullYear()} SkillConnect Marketplace Inc. All rights reserved.
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              <span>Verified Student Verification & Secure Transactions</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
