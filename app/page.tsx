"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Zap,
  Star,
  Users,
  CheckCircle2,
  TrendingUp,
  Award,
  Layers,
  Code2,
  Palette,
  Video,
  PenTool,
  BookOpenCheck,
  Presentation,
  TableProperties,
  Layout,
} from "lucide-react";
import { dataService } from "@/lib/services/dataService";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/ui/rating-stars";
import { formatCurrency } from "@/lib/utils";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const categories = dataService.getCategories();
  const tasks = dataService.getTasks({ status: "open" }).slice(0, 4);
  const featuredStudents = [
    dataService.getProfileById("user-priya")!,
    dataService.getProfileById("user-alex")!,
    dataService.getProfileById("user-marcus")!,
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/explore");
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Code2":
        return <Code2 className="h-6 w-6 text-blue-600" />;
      case "Palette":
        return <Palette className="h-6 w-6 text-purple-600" />;
      case "Video":
        return <Video className="h-6 w-6 text-rose-600" />;
      case "PenTool":
        return <PenTool className="h-6 w-6 text-amber-600" />;
      case "BookOpenCheck":
        return <BookOpenCheck className="h-6 w-6 text-emerald-600" />;
      case "Presentation":
        return <Presentation className="h-6 w-6 text-indigo-600" />;
      case "TableProperties":
        return <TableProperties className="h-6 w-6 text-cyan-600" />;
      case "TrendingUp":
        return <TrendingUp className="h-6 w-6 text-orange-600" />;
      case "GraduationCap":
        return <GraduationCap className="h-6 w-6 text-blue-500" />;
      case "Layout":
      default:
        return <Layout className="h-6 w-6 text-violet-600" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* =========================================================================
          SECTION 2: HERO SECTION
      ========================================================================== */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-slate-900/50 dark:via-slate-900 dark:to-slate-900 bg-grid-pattern">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & Search */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>The Verified Student Micro-Task Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                Turn Your Skills Into <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Opportunities.</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Discover peer projects, collaborate with talented university students, build a verified portfolio, and earn while you learn.
              </p>

              {/* Prominent Search Bar */}
              <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto lg:mx-0 pt-2">
                <div className="relative flex items-center shadow-lg rounded-2xl bg-white dark:bg-slate-800 p-1.5 border border-slate-200 dark:border-slate-700">
                  <div className="pl-3.5 text-slate-400">
                    <Search className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks (e.g. Figma mockups, Python script, Pitch deck)..."
                    className="w-full bg-transparent px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                  />
                  <Button type="submit" size="md" className="rounded-xl px-5 font-semibold">
                    Search
                  </Button>
                </div>
              </form>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href="/explore">
                  <Button size="lg" className="rounded-xl gap-2 font-semibold shadow-md">
                    <Briefcase className="h-5 w-5" />
                    <span>Find Work</span>
                  </Button>
                </Link>
                <Link href="/tasks/post">
                  <Button variant="outline" size="lg" className="rounded-xl gap-2 font-semibold">
                    <span>Post a Task</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Verified .edu Emails</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                  <span>Academic Integrity Protected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span>Secure Escrow Protection</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Collaboration Hero Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-slate-100 dark:border-slate-700">
                {/* Active Match Card Preview */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      <img
                        className="h-10 w-10 rounded-full border-2 border-white dark:border-slate-800 object-cover"
                        src={featuredStudents[1].avatar_url}
                        alt="Buyer"
                      />
                      <img
                        className="h-10 w-10 rounded-full border-2 border-white dark:border-slate-800 object-cover"
                        src={featuredStudents[0].avatar_url}
                        alt="Freelancer"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Active Student Collaboration</div>
                      <div className="text-[11px] text-slate-500">Stanford & UC Berkeley</div>
                    </div>
                  </div>
                  <Badge variant="success" className="text-[10px]">In Progress</Badge>
                </div>

                <div className="my-5 space-y-3">
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    "Campus Food Rescue Mobile App UI Mockups"
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Agreed Payout: <strong className="text-slate-900 dark:text-white">$120.00</strong></span>
                    <span>Deadline: <strong>4 days</strong></span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-3/4 rounded-full" />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Wireframes approved</span>
                    <span>75% completed</span>
                  </div>
                </div>

                {/* Simulated Chat Snippet */}
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 p-3.5 space-y-2 border border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-blue-600">Priya:</span>
                    <span className="text-slate-600 dark:text-slate-300">Just uploaded the 6 Figma responsive mobile screens to the order workspace!</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Alex:</span>
                    <span className="text-slate-600 dark:text-slate-300">They look phenomenal! Releasing payment now.</span>
                  </div>
                </div>

                {/* Floating Metric Pill */}
                <div className="absolute -bottom-5 -left-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 shadow-xl flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Peer Payout</div>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white">$114.00 Earned</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: POPULAR CATEGORIES
      ========================================================================== */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Campus Niches</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Explore Popular Categories
              </h2>
            </div>
            <Link href="/categories" className="mt-3 md:mt-0 text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">
              <span>View all 10 categories</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/explore?category=${cat.slug}`}
                className="group flex flex-col p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500/50 hover:shadow-card-hover transition-all duration-200"
              >
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 w-fit mb-3 group-hover:scale-110 transition-transform">
                  {getCategoryIcon(cat.icon)}
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <span className="text-xs text-slate-500 mt-1">
                  {cat.task_count} open {cat.task_count === 1 ? "task" : "tasks"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: FEATURED TASKS (Live Database Query)
      ========================================================================== */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Live Marketplace</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Featured Campus Tasks
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Authentic requests posted by verified students looking for collaborators.
              </p>
            </div>
            <Link href="/explore" className="mt-3 md:mt-0 text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">
              <span>Explore all tasks</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: HOW IT WORKS
      ========================================================================== */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-4xl">
          <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Step-by-Step</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            How SkillConnect Works
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base mb-16 max-w-2xl mx-auto">
            A safe, transparent, and structured way to hire peer talent or earn money using your collegiate knowledge.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Step 1 */}
            <div className="relative p-6 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white font-extrabold text-lg mb-5 shadow-sm">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Discover or Post
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Post a specific project requirement with budget and deadline, or browse open tasks matching your skills.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white font-extrabold text-lg mb-5 shadow-sm">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Connect & Agree
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Review verified student profiles, portfolios, and proposed prices. Accept the best proposal to fund the protected escrow.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-white font-extrabold text-lg mb-5 shadow-sm">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Collaborate & Earn
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Exchange deliverables, request revisions, and release payment upon final satisfaction with verified peer feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: FEATURED STUDENTS
      ========================================================================== */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Peer Talent</div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
              Meet Top Student Creators
            </h2>
            <p className="text-sm text-slate-500">
              Highly rated students available for design, coding, tutoring, and presentation work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredStudents.map((student) => (
              <div
                key={student.id}
                className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between hover:shadow-card-hover transition-all"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={student.avatar_url}
                      alt={student.full_name}
                      className="h-14 w-14 rounded-2xl object-cover ring-2 ring-blue-500/20"
                    />
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">
                        {student.full_name}
                      </h3>
                      <p className="text-xs text-blue-600 font-medium">
                        {student.university || student.college}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{student.course}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                    {student.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {student.skills.slice(0, 3).map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <RatingStars rating={student.rating} size="sm" />
                    <span className="text-xs text-slate-400">({student.review_count})</span>
                  </div>

                  <Link href={`/profile/${student.username}`}>
                    <Button variant="outline" size="sm" className="rounded-xl text-xs">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: WHY SKILLCONNECT
      ========================================================================== */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Platform Values</div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
              Engineered Specifically For Students
            </h2>
            <p className="text-sm text-slate-500">
              Unlike generic freelance giants, SkillConnect is tailored to collegiate workflows and budgets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-blue-50/50 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-800">
              <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">Peer-to-Peer Empathy</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Students understand college deadlines, academic formatting, and semester crunches. Work with peers who get your context.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-purple-50/50 dark:bg-slate-800/50 border border-purple-100 dark:border-slate-800">
              <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-4">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">Resume & Portfolio Proof</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Every completed order builds a public, verified portfolio item and review history you can present to internship recruiters.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-slate-800/50 border border-emerald-100 dark:border-slate-800">
              <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">Student-Friendly 5% Fee</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Traditional platforms take 20% of freelancer earnings. SkillConnect keeps fees at an ultra-low 5% to support student finances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: VERIFIED STATISTICS
      ========================================================================== */}
      <section className="py-14 bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-400">100%</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Verified Student IDs</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">5.0%</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Low Platform Fee</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-purple-400">&lt; 48h</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Average Turnaround</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">0%</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Cheating Tolerance</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: TESTIMONIALS (Dev-mode preview)
      ========================================================================== */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="text-center mb-12">
            <Badge variant="purple" className="mb-2">Development Preview</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              What Students Are Saying
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic mb-4">
                "I needed a high-impact pitch deck for our startup competition in 72 hours. Marcus redesigned our slides into venture-grade visuals. We ended up taking 1st place!"
              </p>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Sarah L.</div>
              <div className="text-[11px] text-slate-400">Stanford University • Student Founder</div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic mb-4">
                "SkillConnect allowed me to pay for my textbook costs purely by doing Figma mockups for campus clubs during weekends. It directly helped me land my summer UI internship!"
              </p>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Priya Sharma</div>
              <div className="text-[11px] text-slate-400">UC Berkeley • UI/UX Designer</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10: FINAL CTA
      ========================================================================== */}
      <section className="py-20 bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-700 text-white text-center relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Your Next Opportunity Starts Here.
          </h2>
          <p className="text-blue-100 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Join thousands of university students collaborating, designing, coding, and building their futures on SkillConnect.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 shadow-lg">
                Join SkillConnect Free
              </Button>
            </Link>
            <Link href="/explore">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 font-bold px-8">
                Explore Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
