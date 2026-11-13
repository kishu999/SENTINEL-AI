"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { dataService } from "@/lib/services/dataService";
import { ShieldAlert, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const user = dataService.getCurrentUser();
    if (user.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    setChecked(true);
  }, []);

  if (!checked) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
          <Lock className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Access Restricted</h1>
        <p className="text-sm text-slate-500 max-w-md">
          This portal is protected by role-based authorization. Your current account does not have administrative privileges.
        </p>
        <div className="pt-2">
          <Button
            onClick={() => {
              dataService.setCurrentUser("user-admin");
              window.location.reload();
            }}
            variant="danger"
            size="sm"
          >
            Switch to Admin Persona
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}
