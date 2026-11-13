"use client";

import React, { useState, useEffect } from "react";
import { FileText, ShieldCheck, Terminal, Search } from "lucide-react";
import { dataService } from "@/lib/services/dataService";
import { AdminAuditLog } from "@/types/database";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLogs(dataService.getAdminAuditLogs());
  }, []);

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.target_type.toLowerCase().includes(search.toLowerCase()) ||
      l.admin?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-400" />
            <span>Immutable Administrative Audit Trail</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete, timestamped forensic log of administrative moderation actions, suspensions, dispute rulings, and policy overrides.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search action, target..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold tracking-wider bg-slate-950/60">
                <th className="py-3.5 pl-6">Timestamp</th>
                <th className="py-3.5">Action Event</th>
                <th className="py-3.5">Target Type & ID</th>
                <th className="py-3.5">Operator</th>
                <th className="py-3.5 pr-6">Origin IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 pl-6 text-slate-400">
                    {formatDate(log.created_at)}
                  </td>
                  <td className="py-3.5">
                    <span className="font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-300">
                    {log.target_type} ({log.target_id || "global"})
                  </td>
                  <td className="py-3.5 text-slate-200">
                    {log.admin?.full_name || "System Automated"}
                  </td>
                  <td className="py-3.5 pr-6 text-slate-400">
                    {log.ip_address || "127.0.0.1"}
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
