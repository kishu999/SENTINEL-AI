"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, MapPin, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: "support",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-4xl">
      <div className="text-center max-w-xl mx-auto mb-12">
        <Badge variant="purple" className="mb-2">Get in Touch</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          Contact SkillConnect Support
        </h1>
        <p className="text-sm text-slate-500">
          Have a question about task escrow, verification, campus ambassadors, or academic compliance? We typically respond within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact info column */}
        <div className="md:col-span-5 space-y-6">
          <div className="rounded-3xl bg-slate-900 text-white p-6 space-y-6">
            <h3 className="font-bold text-lg">Contact Information</h3>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-800 text-blue-400">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">Direct Email</div>
                  <div>support@skillconnect.edu</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-800 text-purple-400">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">Trust & Moderation</div>
                  <div>trust@skillconnect.edu</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-800 text-emerald-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">Collegiate Network</div>
                  <div>Cambridge, MA & Berkeley, CA</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400">
              Support hours: Monday – Friday, 9:00 AM – 7:00 PM EST. Urgent dispute hotlines are staffed during finals periods.
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Message Dispatched!</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Thank you for reaching out, {formData.name}. Our student support team will reply to <strong>{formData.email}</strong> shortly.
              </p>
              <Button onClick={() => setSubmitted(false)} variant="outline" size="sm">
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  required
                  placeholder="Alex Rivera"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  label="University Email"
                  type="email"
                  required
                  placeholder="alex@stanford.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Inquiry Topic
                </label>
                <select
                  value={formData.inquiryType}
                  onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  <option value="support">General Support / Question</option>
                  <option value="partnership">Campus Club / University Partnership</option>
                  <option value="dispute">Order Dispute / Escrow Inquiry</option>
                  <option value="trust">Academic Integrity & Policy Report</option>
                </select>
              </div>

              <Input
                label="Subject"
                placeholder="Question regarding order SC-2026..."
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />

              <Textarea
                label="Message"
                required
                rows={4}
                placeholder="Describe your question or feedback in detail..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />

              <Button type="submit" className="w-full gap-2">
                <Send className="h-4 w-4" />
                <span>Submit Inquiry</span>
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
