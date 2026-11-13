"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Briefcase, AlertTriangle, Trash2, CheckCircle2, ExternalLink } from "lucide-react";
import { dataService } from "@/lib/services/dataService";
import { Task } from "@/types/database";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = () => {
    setTasks(dataService.getTasks());
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleModerate = (taskId: string, newStatus: any) => {
    if (!confirm(`Are you sure you want to change task status to ${newStatus}?`)) return;
    dataService.updateTaskStatus(taskId, newStatus);
    loadTasks();
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-purple-400" />
          <span>Task Moderation Queue</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review posted campus tasks for academic integrity compliance, fair budgets, and permissible service categories.
        </p>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold tracking-wider bg-slate-950/60">
                <th className="py-3.5 pl-6">Task Title & Category</th>
                <th className="py-3.5">Client</th>
                <th className="py-3.5">Budget</th>
                <th className="py-3.5">Status</th>
                <th className="py-3.5 pr-6 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 pl-6 max-w-md">
                    <Link
                      href={`/tasks/${task.id}`}
                      className="font-bold text-white hover:text-blue-400 transition-colors line-clamp-1 text-sm block"
                    >
                      {task.title}
                    </Link>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {task.category?.name} • Posted {formatDate(task.created_at)}
                    </div>
                  </td>

                  <td className="py-4">
                    <div className="font-semibold text-slate-200">
                      {task.client?.full_name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {task.client?.university}
                    </div>
                  </td>

                  <td className="py-4 font-bold text-emerald-400">
                    {formatCurrency(task.budget)}
                  </td>

                  <td className="py-4">
                    <StatusBadge status={task.status} />
                  </td>

                  <td className="py-4 pr-6 text-right space-x-2">
                    {task.status === "open" && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleModerate(task.id, "closed")}
                        className="text-xs h-8"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        <span>Remove / Close</span>
                      </Button>
                    )}
                    <Link href={`/tasks/${task.id}`}>
                      <Button variant="outline" size="sm" className="text-xs h-8">
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />
                        <span>Inspect</span>
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
