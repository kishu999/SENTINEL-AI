"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  };

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[75vh]">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-card text-center space-y-5">
        {sent ? (
          <div className="space-y-4">
            <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recovery Link Sent</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              We have dispatched password recovery instructions to <strong>{email}</strong>. Please check your inbox and spam folder.
            </p>
            <Link href="/auth/reset-password?token=demo-token">
              <Button size="sm" className="mt-2 w-full">Proceed to Reset Password</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Forgot Password?</h1>
              <p className="text-xs text-slate-500">
                Enter your university email address and we will send you a secure reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <Input
                label="University Email"
                type="email"
                required
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Button type="submit" className="w-full">
                Send Reset Link
              </Button>
            </form>
          </>
        )}

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
