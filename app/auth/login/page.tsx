"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { dataService } from "@/lib/services/dataService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      // Find matching profile by email
      const users = (dataService as any).profiles;
      const found = users.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase().trim()
      );

      if (found) {
        dataService.setCurrentUser(found.id);
        router.push(found.role === "admin" ? "/admin" : "/dashboard");
      } else {
        // Fallback default
        dataService.setCurrentUser("user-alex");
        router.push("/dashboard");
      }
      setIsLoading(false);
    }, 600);
  };

  const handleQuickLogin = (userId: string) => {
    dataService.setCurrentUser(userId);
    const user = dataService.getProfileById(userId);
    router.push(user?.role === "admin" ? "/admin" : "/dashboard");
  };

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md mb-2">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Log in to SkillConnect
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Access your student marketplace dashboard, orders, and wallet
          </p>
        </div>

        {/* Quick Demo Evaluation Switcher */}
        <div className="rounded-2xl bg-blue-50/70 dark:bg-slate-800/70 p-4 border border-blue-200/80 dark:border-slate-700 text-xs space-y-2.5">
          <div className="font-bold text-blue-900 dark:text-blue-300 flex items-center justify-between">
            <span>Instant Demo Logins (1-Click):</span>
            <Badge variant="purple" className="text-[10px] py-0">Review Mode</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin("user-alex")}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-left hover:border-blue-500 transition-colors"
            >
              <div className="font-bold text-slate-800 dark:text-slate-200">Alex (Buyer)</div>
              <div className="text-[10px] text-slate-400">Stanford • Posts Tasks</div>
            </button>
            <button
              onClick={() => handleQuickLogin("user-priya")}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-left hover:border-blue-500 transition-colors"
            >
              <div className="font-bold text-slate-800 dark:text-slate-200">Priya (Freelancer)</div>
              <div className="text-[10px] text-slate-400">UC Berkeley • UI/UX</div>
            </button>
            <button
              onClick={() => handleQuickLogin("user-marcus")}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-left hover:border-blue-500 transition-colors"
            >
              <div className="font-bold text-slate-800 dark:text-slate-200">Marcus (Seller)</div>
              <div className="text-[10px] text-slate-400">MIT • Pitch Decks</div>
            </button>
            <button
              onClick={() => handleQuickLogin("user-admin")}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-left hover:border-rose-500 transition-colors"
            >
              <div className="font-bold text-rose-600 dark:text-rose-400">Administrator</div>
              <div className="text-[10px] text-slate-400">Full Audit & Disputes</div>
            </button>
          </div>
        </div>

        {/* Regular Form */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-card">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            <Input
              label="University Email"
              type="email"
              required
              placeholder="alex@stanford.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-sm"
              />
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full mt-2 font-semibold">
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
            Don't have a student account?{" "}
            <Link href="/auth/register" className="font-bold text-blue-600 hover:underline">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
