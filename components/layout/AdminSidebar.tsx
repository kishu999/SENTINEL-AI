"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlert,
  Users,
  Briefcase,
  ShoppingBag,
  CreditCard,
  AlertTriangle,
  FolderTree,
  FileText,
  Sliders,
  Scale,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { label: "Overview", href: "/admin", icon: ShieldAlert },
    { label: "Users Management", href: "/admin/users", icon: Users },
    { label: "Task Moderation", href: "/admin/tasks", icon: Briefcase },
    { label: "Orders & Escrow", href: "/admin/orders", icon: ShoppingBag },
    { label: "Withdrawals", href: "/admin/withdrawals", icon: CreditCard },
    { label: "Dispute Center", href: "/admin/disputes", icon: Scale },
    { label: "Reports & Flags", href: "/admin/reports", icon: AlertTriangle },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Audit Logs", href: "/admin/audit", icon: FileText },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-950 p-4 space-y-6 min-h-screen text-slate-300">
      <div className="px-3 py-2 border-b border-slate-800">
        <div className="flex items-center gap-2 text-rose-400 font-bold text-sm tracking-wide">
          <ShieldAlert className="h-5 w-5" />
          <span>ADMIN CONSOLE</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">Trust, Safety & Governance</p>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-slate-800">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Student App</span>
        </Link>
      </div>
    </aside>
  );
}
