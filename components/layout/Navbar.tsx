"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sparkles,
  Search,
  Bell,
  MessageSquare,
  PlusCircle,
  Menu,
  X,
  User,
  ShieldCheck,
  Wallet,
  LayoutDashboard,
  CheckCircle2,
  ChevronDown,
  LogOut,
  SlidersHorizontal,
} from "lucide-react";
import { dataService } from "@/lib/services/dataService";
import { Profile } from "@/types/database";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile>(dataService.getCurrentUser());
  const [unreadNotifs, setUnreadNotifs] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  useEffect(() => {
    const updateState = () => {
      const user = dataService.getCurrentUser();
      setCurrentUser(user);
      const notifs = dataService.getNotifications(user.id);
      setUnreadNotifs(notifs.filter((n) => !n.is_read).length);
    };

    updateState();

    const handleUserChanged = () => updateState();
    const handleNotif = () => updateState();

    window.addEventListener("skillconnect:user_changed", handleUserChanged);
    window.addEventListener("skillconnect:notification", handleNotif);

    return () => {
      window.removeEventListener("skillconnect:user_changed", handleUserChanged);
      window.removeEventListener("skillconnect:notification", handleNotif);
    };
  }, []);

  const handleSwitchUser = (userId: string) => {
    dataService.setCurrentUser(userId);
    setDemoMenuOpen(false);
    setUserDropdownOpen(false);
    router.refresh();
  };

  const navLinks = [
    { label: "Explore Tasks", href: "/explore" },
    { label: "Categories", href: "/categories" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
      {/* Top Banner: Quick Persona Switcher for Evaluation */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-slate-300">Demo Persona:</span>
          <span className="font-bold text-white">{currentUser.full_name}</span>
          <Badge variant="purple" className="text-[10px] py-0 px-2 h-4">
            {currentUser.role === "admin" ? "Admin" : `${currentUser.university || currentUser.college}`}
          </Badge>
        </div>

        <div className="relative">
          <button
            onClick={() => setDemoMenuOpen(!demoMenuOpen)}
            className="flex items-center gap-1.5 font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>Switch Test Persona</span>
            <ChevronDown className="h-3 w-3" />
          </button>

          {demoMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-800 p-2 shadow-2xl border border-slate-200 dark:border-slate-700 z-50 text-slate-800 dark:text-slate-100">
              <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                Select Active Account
              </div>
              <button
                onClick={() => handleSwitchUser("user-alex")}
                className="w-full text-left px-2 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Alex Rivera (Buyer)</div>
                  <div className="text-slate-500 text-[10px]">Stanford CS • Post tasks & hire</div>
                </div>
                {currentUser.id === "user-alex" && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
              </button>
              <button
                onClick={() => handleSwitchUser("user-priya")}
                className="w-full text-left px-2 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Priya Sharma (Freelancer)</div>
                  <div className="text-slate-500 text-[10px]">UC Berkeley • UI/UX & Designs</div>
                </div>
                {currentUser.id === "user-priya" && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
              </button>
              <button
                onClick={() => handleSwitchUser("user-marcus")}
                className="w-full text-left px-2 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Marcus Chen (Seller)</div>
                  <div className="text-slate-500 text-[10px]">MIT • Slides & Pitch Decks</div>
                </div>
                {currentUser.id === "user-marcus" && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
              </button>
              <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
              <button
                onClick={() => handleSwitchUser("user-admin")}
                className="w-full text-left px-2 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between text-xs text-rose-600 dark:text-rose-400 font-semibold"
              >
                <div>
                  <div>SkillConnect Admin</div>
                  <div className="text-slate-500 text-[10px]">Audit, Disputes, Moderation</div>
                </div>
                {currentUser.id === "user-admin" && <CheckCircle2 className="h-4 w-4 text-rose-600" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 text-white shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                Skill<span className="text-blue-600">Connect</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-600 dark:text-slate-400 -mt-1">
                Student Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  pathname === link.href ? "text-blue-600 font-semibold" : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Section */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/tasks/post">
            <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm">
              <PlusCircle className="h-4 w-4" />
              <span>Post a Task</span>
            </Button>
          </Link>

          <Link href="/notifications" className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors">
            <Bell className="h-5 w-5" />
            {unreadNotifs > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white animate-pulse">
                {unreadNotifs}
              </span>
            )}
          </Link>

          <Link href="/messages" className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors">
            <MessageSquare className="h-5 w-5" />
          </Link>

          <Link href="/wallet" className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors">
            <Wallet className="h-5 w-5" />
          </Link>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800"
            >
              <img
                src={currentUser.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                alt={currentUser.full_name}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-500/20"
              />
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white dark:bg-slate-800 p-2 shadow-2xl border border-slate-100 dark:border-slate-700 z-50">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 mb-1">
                  <div className="font-bold text-sm text-slate-900 dark:text-white">{currentUser.full_name}</div>
                  <div className="text-xs text-slate-500 truncate">@{currentUser.username}</div>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4 text-blue-600" />
                  <span>Student Dashboard</span>
                </Link>

                <Link
                  href={`/profile/${currentUser.username}`}
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <User className="h-4 w-4 text-purple-600" />
                  <span>My Public Profile</span>
                </Link>

                <Link
                  href="/wallet"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <Wallet className="h-4 w-4 text-emerald-600" />
                  <span>Wallet & Earnings</span>
                </Link>

                {currentUser.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Admin Portal</span>
                  </Link>
                )}

                <div className="my-1 border-t border-slate-100 dark:border-slate-700" />

                <Link
                  href="/auth/login"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log In / Switch</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center gap-2">
          <Link href="/tasks/post">
            <Button size="sm" className="h-8 px-2.5 text-xs">Post</Button>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium py-2 px-3 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-start gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </Link>
            <Link href="/messages" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-start gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Messages</span>
              </Button>
            </Link>
            <Link href="/wallet" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Wallet className="h-4 w-4" />
                <span>Wallet</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
