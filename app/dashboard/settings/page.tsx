"use client";

import React, { useState } from "react";
import { Settings, Bell, Lock, Shield, Check, Save } from "lucide-react";
import { dataService } from "@/lib/services/dataService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const currentUser = dataService.getCurrentUser();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Account Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your notifications, security, and student profile preferences.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="h-4 w-4 text-blue-600" />
              <span>Notification Preferences</span>
            </h3>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between text-xs cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">New Proposal Notifications</div>
                  <div className="text-slate-400">Receive an alert when a student bids on your posted task</div>
                </div>
                <input
                  type="checkbox"
                  checked={orderAlerts}
                  onChange={(e) => setOrderAlerts(e.target.checked)}
                  className="h-4 w-4 rounded text-blue-600"
                />
              </label>

              <label className="flex items-center justify-between text-xs cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Email Digest & Activity</div>
                  <div className="text-slate-400">Receive email receipts for completed orders and payout confirmations</div>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifs}
                  onChange={(e) => setEmailNotifs(e.target.checked)}
                  className="h-4 w-4 rounded text-blue-600"
                />
              </label>
            </div>
          </div>

          <div className="space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-600" />
              <span>Collegiate Verification</span>
            </h3>
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800 text-xs space-y-1">
              <div className="font-bold text-emerald-800 dark:text-emerald-300">
                Verified Student ID Active
              </div>
              <div className="text-emerald-700/80 dark:text-emerald-400">
                Affiliated with {currentUser.university || currentUser.college}. Your badge appears on all proposals.
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {saved ? (
              <Badge variant="success" className="gap-1 text-xs py-1 px-3">
                <Check className="h-4 w-4" />
                <span>Preferences Saved</span>
              </Badge>
            ) : <span />}

            <Button type="submit" size="sm" className="gap-2 font-semibold">
              <Save className="h-4 w-4" />
              <span>Save Preferences</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
