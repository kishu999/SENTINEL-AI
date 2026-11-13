"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Code2,
  Palette,
  Video,
  PenTool,
  BookOpenCheck,
  Presentation,
  TableProperties,
  TrendingUp,
  GraduationCap,
  Layout,
  Search,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { dataService } from "@/lib/services/dataService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
  const categories = dataService.getCategories();

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Code2":
        return <Code2 className="h-7 w-7 text-blue-600" />;
      case "Palette":
        return <Palette className="h-7 w-7 text-purple-600" />;
      case "Video":
        return <Video className="h-7 w-7 text-rose-600" />;
      case "PenTool":
        return <PenTool className="h-7 w-7 text-amber-600" />;
      case "BookOpenCheck":
        return <BookOpenCheck className="h-7 w-7 text-emerald-600" />;
      case "Presentation":
        return <Presentation className="h-7 w-7 text-indigo-600" />;
      case "TableProperties":
        return <TableProperties className="h-7 w-7 text-cyan-600" />;
      case "TrendingUp":
        return <TrendingUp className="h-7 w-7 text-orange-600" />;
      case "GraduationCap":
        return <GraduationCap className="h-7 w-7 text-blue-500" />;
      case "Layout":
      default:
        return <Layout className="h-7 w-7 text-violet-600" />;
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <Badge variant="purple" className="mb-2">Official Directory</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          Explore Student Skill Categories
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
          Find specialized talent across 10 distinct collegiate disciplines, from technical software development to presentation design.
        </p>

        {/* Search Input */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories (e.g. video, tutoring)..."
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-10 pr-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => (
          <Link
            key={cat.id}
            href={`/explore?category=${cat.slug}`}
            className="group"
          >
            <Card className="h-full hover:shadow-card-hover hover:border-blue-300 dark:hover:border-blue-800 transition-all">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 group-hover:scale-105 transition-transform">
                      {getCategoryIcon(cat.icon)}
                    </div>
                    <Badge variant="default" className="text-xs">
                      {cat.task_count} {cat.task_count === 1 ? "task" : "tasks"}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span>Browse Category</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
