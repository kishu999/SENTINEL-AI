import React from "react";
import { StudentSidebar } from "@/components/layout/StudentSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50/50 dark:bg-slate-950">
      <StudentSidebar />
      <div className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}
