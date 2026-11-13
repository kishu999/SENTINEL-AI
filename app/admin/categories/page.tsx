"use client";

import React, { useState } from "react";
import { FolderTree, Plus, Check } from "lucide-react";
import { dataService } from "@/lib/services/dataService";
import { Category } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(dataService.getCategories());

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <FolderTree className="h-6 w-6 text-emerald-400" />
          <span>Category & Taxonomies Management</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage the 10 canonical collegiate micro-task categories and their active listing distributions.
        </p>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold tracking-wider bg-slate-950/60">
                <th className="py-3.5 pl-6">Order</th>
                <th className="py-3.5">Category Name</th>
                <th className="py-3.5">Slug</th>
                <th className="py-3.5">Live Open Tasks</th>
                <th className="py-3.5 pr-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {categories.map((cat, i) => (
                <tr key={cat.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 pl-6 font-mono text-slate-500">#{i + 1}</td>
                  <td className="py-4 font-bold text-white">{cat.name}</td>
                  <td className="py-4 font-mono text-slate-400">{cat.slug}</td>
                  <td className="py-4 font-bold text-blue-400">{cat.task_count || 0}</td>
                  <td className="py-4 pr-6 text-right">
                    <Badge variant="success" className="text-[10px]">Active</Badge>
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
