"use client";

import React, { useState, useEffect } from "react";
import { Users, Shield, UserX, UserCheck, Search, GraduationCap } from "lucide-react";
import { dataService } from "@/lib/services/dataService";
import { Profile } from "@/types/database";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const loadUsers = () => {
    setUsers([...dataService.getAdminUsers()]);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleSuspend = (userId: string, currentStatus: boolean) => {
    const action = currentStatus ? "restore" : "suspend";
    if (!confirm(`Are you sure you want to ${action} this student account?`)) return;

    dataService.setUserSuspension(userId, !currentStatus);
    loadUsers();
  };

  const filteredUsers = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.university?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-400" />
            <span>Student User Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Audit student identities, enforce academic integrity sanctions, or suspend fraudulent accounts.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or campus..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold tracking-wider bg-slate-950/60">
                <th className="py-3.5 pl-6">Student</th>
                <th className="py-3.5">Campus & Course</th>
                <th className="py-3.5">Rating & Orders</th>
                <th className="py-3.5">Status</th>
                <th className="py-3.5 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 pl-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60"}
                        alt={user.full_name}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{user.full_name}</span>
                          {user.role === "admin" && (
                            <Badge variant="danger" className="text-[9px] py-0 px-1">Admin</Badge>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          @{user.username} • {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="font-semibold text-slate-200">
                      {user.university || user.college}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {user.course} (Yr {user.year_of_study})
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="font-bold text-amber-400">
                      ★ {user.rating ? Number(user.rating).toFixed(1) : "5.0"}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {user.completed_projects || 0} completed
                    </div>
                  </td>
                  <td className="py-4">
                    {user.is_suspended ? (
                      <Badge variant="danger" className="text-[10px]">Suspended</Badge>
                    ) : (
                      <Badge variant="success" className="text-[10px]">Active & Verified</Badge>
                    )}
                  </td>
                  <td className="py-4 pr-6 text-right">
                    {user.role !== "admin" && (
                      <Button
                        variant={user.is_suspended ? "primary" : "danger"}
                        size="sm"
                        onClick={() => handleToggleSuspend(user.id, Boolean(user.is_suspended))}
                        className="text-xs h-8"
                      >
                        {user.is_suspended ? (
                          <>
                            <UserCheck className="h-3.5 w-3.5 mr-1" />
                            <span>Restore</span>
                          </>
                        ) : (
                          <>
                            <UserX className="h-3.5 w-3.5 mr-1" />
                            <span>Suspend</span>
                          </>
                        )}
                      </Button>
                    )}
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
