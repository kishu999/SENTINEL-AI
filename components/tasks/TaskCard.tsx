"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  DollarSign,
  Bookmark,
  ExternalLink,
  Users,
  CheckCircle,
} from "lucide-react";
import { Task } from "@/types/database";
import { formatCurrency, formatRelativeTime, formatDate } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { StatusBadge } from "../ui/status-badge";
import { dataService } from "@/lib/services/dataService";

interface TaskCardProps {
  task: Task;
  onBookmarkChange?: () => void;
}

export function TaskCard({ task, onBookmarkChange }: TaskCardProps) {
  const currentUser = dataService.getCurrentUser();
  const [isSaved, setIsSaved] = useState(() => dataService.isTaskSaved(task.id, currentUser.id));

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const saved = dataService.toggleSaveTask(task.id, currentUser.id);
    setIsSaved(saved);
    if (onBookmarkChange) onBookmarkChange();
  };

  return (
    <Card className="group relative hover:shadow-card-hover hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-200">
      <CardContent className="p-5 sm:p-6">
        {/* Top Header: Client info & bookmark */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <Link
            href={`/profile/${task.client?.username || "student"}`}
            className="flex items-center gap-2.5 group/client"
          >
            <img
              src={task.client?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80"}
              alt={task.client?.full_name}
              className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
            />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover/client:text-blue-600 transition-colors">
                {task.client?.full_name}
              </span>
              <span className="text-[11px] text-slate-400">
                {task.client?.university || task.client?.college}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <StatusBadge status={task.status} />
            <button
              onClick={handleToggleSave}
              className={`p-1.5 rounded-lg border transition-colors ${
                isSaved
                  ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950 dark:border-blue-800"
                  : "border-slate-200 text-slate-400 hover:text-slate-600 dark:border-slate-800 dark:hover:text-slate-200"
              }`}
              title={isSaved ? "Saved task" : "Save task"}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? "fill-blue-600" : ""}`} />
            </button>
          </div>
        </div>

        {/* Task Title & Description */}
        <Link href={`/tasks/${task.id}`} className="block group-hover:text-blue-600 transition-colors">
          <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white line-clamp-1 mb-2">
            {task.title}
          </h3>
        </Link>
        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
          {task.description}
        </p>

        {/* Required Skills */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {task.required_skills.slice(0, 4).map((skill, i) => (
            <span
              key={i}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {skill}
            </span>
          ))}
          {task.required_skills.length > 4 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] text-slate-400">
              +{task.required_skills.length - 4} more
            </span>
          )}
        </div>

        {/* Card Footer: Budget, Deadline, Proposals */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500">
          <div className="flex items-center gap-1 font-bold text-sm text-slate-900 dark:text-white">
            <span className="text-emerald-600">{formatCurrency(task.budget)}</span>
            <span className="text-xs font-normal text-slate-400">({task.budget_type})</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-slate-400" />
              <span>{task.application_count || 0} applied</span>
            </span>

            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Due {formatDate(task.deadline)}</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
