"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
  X,
  Sparkles,
  Bookmark,
  Check,
} from "lucide-react";
import { dataService } from "@/lib/services/dataService";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCat = searchParams.get("category") || "";
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [minBudget, setMinBudget] = useState<number | "">("");
  const [maxBudget, setMaxBudget] = useState<number | "">("");
  const [sortBy, setSortBy] = useState<"newest" | "budget_desc" | "budget_asc">("newest");
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const categories = dataService.getCategories();
  const currentUser = dataService.getCurrentUser();

  const allSkills = [
    "Figma",
    "UI/UX Design",
    "React",
    "Next.js",
    "Python",
    "PowerPoint",
    "Pitch Decks",
    "Video Editing",
    "Research & Learning Support",
    "Pandas",
    "Automation",
  ];

  const tasks = useMemo(() => {
    let list = dataService.getTasks({
      categorySlug: selectedCategory || undefined,
      query: query || undefined,
      minBudget: minBudget !== "" ? Number(minBudget) : undefined,
      maxBudget: maxBudget !== "" ? Number(maxBudget) : undefined,
      skills: selectedSkill ? [selectedSkill] : undefined,
      sortBy: sortBy,
      status: "open",
    });

    if (showSavedOnly) {
      list = list.filter((t) => dataService.isTaskSaved(t.id, currentUser.id));
    }

    return list;
  }, [selectedCategory, query, minBudget, maxBudget, selectedSkill, sortBy, showSavedOnly, currentUser.id]);

  const handleResetFilters = () => {
    setQuery("");
    setSelectedCategory("");
    setMinBudget("");
    setMaxBudget("");
    setSelectedSkill("");
    setShowSavedOnly(false);
    setSortBy("newest");
  };

  const hasActiveFilters = Boolean(
    selectedCategory || query || minBudget !== "" || maxBudget !== "" || selectedSkill || showSavedOnly
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      {/* Page Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore Campus Tasks
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Discover peer projects, freelance gigs, and collaboration opportunities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={showSavedOnly ? "primary" : "outline"}
            size="sm"
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className="gap-2"
          >
            <Bookmark className={`h-4 w-4 ${showSavedOnly ? "fill-white" : ""}`} />
            <span>Saved ({dataService.getSavedTasks(currentUser.id).length})</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden gap-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Filters Sidebar */}
        <aside
          className={`md:col-span-4 lg:col-span-3 space-y-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 ${
            mobileFilterOpen ? "block" : "hidden md:block"
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-blue-600" />
              <span>Filters</span>
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Keyword Search */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Keywords
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search skills, titles..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Category
            </label>
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory("")}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === ""
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold"
                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                <span>All Categories</span>
                <span>{dataService.getTasks().length}</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === cat.slug
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold"
                      : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="truncate pr-2">{cat.name}</span>
                  <span className="text-slate-400 shrink-0">{cat.task_count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Budget Range */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Budget Range ($)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Skills Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Popular Skills
            </label>
            <div className="flex flex-wrap gap-1.5">
              {allSkills.map((skill) => {
                const isSelected = selectedSkill === skill;
                return (
                  <button
                    key={skill}
                    onClick={() => setSelectedSkill(isSelected ? "" : skill)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                      isSelected
                        ? "bg-blue-600 text-white font-medium shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Tasks Results Container */}
        <div className="md:col-span-8 lg:col-span-9 space-y-4">
          {/* Header Controls: Count & Sort */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs">
            <div className="font-semibold text-slate-700 dark:text-slate-300">
              Showing <span className="text-blue-600 font-bold">{tasks.length}</span> {tasks.length === 1 ? "task" : "tasks"}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="budget_desc">Highest Budget</option>
                <option value="budget_asc">Lowest Budget</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 py-1">
              {selectedCategory && (
                <Badge variant="default" className="gap-1 py-1">
                  <span>Category: {categories.find((c) => c.slug === selectedCategory)?.name}</span>
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory("")} />
                </Badge>
              )}
              {selectedSkill && (
                <Badge variant="purple" className="gap-1 py-1">
                  <span>Skill: {selectedSkill}</span>
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedSkill("")} />
                </Badge>
              )}
              {query && (
                <Badge variant="secondary" className="gap-1 py-1">
                  <span>Search: "{query}"</span>
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setQuery("")} />
                </Badge>
              )}
              {(minBudget !== "" || maxBudget !== "") && (
                <Badge variant="outline" className="gap-1 py-1">
                  <span>
                    Price: ${minBudget || 0} - ${maxBudget || "∞"}
                  </span>
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      setMinBudget("");
                      setMaxBudget("");
                    }}
                  />
                </Badge>
              )}
              {showSavedOnly && (
                <Badge variant="warning" className="gap-1 py-1">
                  <span>Saved Only</span>
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setShowSavedOnly(false)} />
                </Badge>
              )}
            </div>
          )}

          {/* Tasks Grid */}
          {tasks.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Search}
              title="No Tasks Found"
              description="No open tasks match your current filter criteria. Try adjusting your search keywords, budget, or category."
              actionLabel="Clear All Filters"
              onAction={handleResetFilters}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="container p-12 text-center text-sm text-slate-500">Loading marketplace tasks...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
