"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, FileCheck2, Users, Calendar, ArrowRight, ExternalLink } from "lucide-react";
import { dataService } from "@/lib/services/dataService";
import { Task } from "@/types/database";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export default function MyTasksPage() {
  const currentUser = dataService.getCurrentUser();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const list = dataService.getTasks().filter((t) => t.client_id === currentUser.id);
    setTasks(list);
  }, [currentUser.id]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Posted Tasks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage your project listings, view proposals from student peers, and hire collaborators.
          </p>
        </div>

        <Link href="/tasks/post">
          <Button size="sm" className="gap-2 shadow-sm font-semibold">
            <PlusCircle className="h-4 w-4" />
            <span>Post New Task</span>
          </Button>
        </Link>
      </div>

      {tasks.length > 0 ? (
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className="hover:shadow-card-hover transition-all">
              <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <StatusBadge status={task.status} />
                    <span className="text-xs text-slate-400">
                      Posted on {formatDate(task.created_at)}
                    </span>
                  </div>

                  <Link href={`/tasks/${task.id}`} className="block group">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {task.title}
                    </h3>
                  </Link>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="font-bold text-emerald-600">
                      {formatCurrency(task.budget)} ({task.budget_type})
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-purple-600" />
                      <strong>{task.application_count || 0}</strong> applicants
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Due {formatDate(task.deadline)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Link href={`/tasks/${task.id}`} className="w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                      <span>View Proposals</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileCheck2}
          title="No Tasks Posted Yet"
          description="Need help designing a deck, building an app, or tutoring? Post a task to get proposals from skilled students."
          actionLabel="Post Your First Task"
          onAction={() => window.location.href = "/tasks/post"}
        />
      )}
    </div>
  );
}
