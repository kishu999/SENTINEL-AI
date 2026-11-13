"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  FileCheck2,
  Send,
  ShoppingBag,
  MessageSquare,
  Bell,
  User,
  Wallet,
  Settings,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface StudentSidebarProps {
  className?: string;
}

export function StudentSidebar({ className }: StudentSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Explore Tasks", href: "/explore", icon: Compass },
    { label: "My Posted Tasks", href: "/dashboard/tasks", icon: FileCheck2 },
    { label: "My Applications", href: "/dashboard/applications", icon: Send },
    { label: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { label: "Messages", href: "/messages", icon: MessageSquare },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "My Profile", href: "/profile/edit", icon: User },
    { label: "Wallet & Payouts", href: "/wallet", icon: Wallet },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className={cn("w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-6 hidden md:block", className)}>
      <div className="px-2">
        <Link href="/tasks/post">
          <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm" size="sm">
            <PlusCircle className="h-4 w-4" />
            <span>Post a Task</span>
          </Button>
        </Link>
      </div>

      <nav className="space-y-1">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Student Portal
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-blue-50 text-blue-700 font-semibold dark:bg-blue-950/60 dark:text-blue-300"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
