"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Scale, CheckCircle2, RotateCcw, AlertOctagon, ExternalLink } from "lucide-react";
import { dataService } from "@/lib/services/dataService";
import { Dispute } from "@/types/database";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [resolutionNotes, setResolutionNotes] = useState<Record<string, string>>({});

  const loadDisputes = () => {
    setDisputes(dataService.getAdminDisputes());
  };

  useEffect(() => {
    loadDisputes();
  }, []);

  const handleResolve = (disputeId: string, status: "resolved_buyer" | "resolved_freelancer") => {
    const notes = resolutionNotes[disputeId] || "Administrative arbitration ruling issued.";
    dataService.resolveDispute(disputeId, status, notes);
    loadDisputes();
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <Scale className="h-6 w-6 text-rose-400" />
          <span>Dispute Resolution Arbitration</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Investigate disputed contracts. Ruling in favor of buyer triggers a full escrow refund; ruling in favor of freelancer releases milestone payout.
        </p>
      </div>

      <div className="space-y-4">
        {disputes.map((disp) => {
          const isOpened = disp.status === "opened" || disp.status === "under_review";

          return (
            <div
              key={disp.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      Dispute #{disp.id}
                    </span>
                    <Badge variant={isOpened ? "danger" : "success"} className="text-[10px]">
                      {disp.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">
                    Order Contract: {disp.order?.order_number}
                  </h3>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">Contract Value</div>
                  <div className="text-lg font-extrabold text-emerald-400">
                    {formatCurrency(disp.order?.agreed_price || 0)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-slate-400 block font-semibold">Raised By:</span>
                  <span className="font-bold text-white">{disp.raised_by_user?.full_name}</span>
                  <p className="text-slate-400 mt-1">"{disp.reason}"</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-slate-400 block font-semibold">Parties Involved:</span>
                  <div className="text-slate-300">
                    Buyer: <strong>{disp.order?.buyer?.full_name}</strong>
                  </div>
                  <div className="text-slate-300">
                    Freelancer: <strong>{disp.order?.freelancer?.full_name}</strong>
                  </div>
                </div>
              </div>

              {isOpened ? (
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <input
                    type="text"
                    placeholder="Enter official arbitration ruling justification..."
                    value={resolutionNotes[disp.id] || ""}
                    onChange={(e) =>
                      setResolutionNotes({ ...resolutionNotes, [disp.id]: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />

                  <div className="flex items-center justify-end gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResolve(disp.id, "resolved_buyer")}
                      className="text-xs text-rose-400 border-rose-900/60 hover:bg-rose-950/40"
                    >
                      <span>Rule for Buyer (Refund Escrow)</span>
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleResolve(disp.id, "resolved_freelancer")}
                      className="text-xs bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      <span>Rule for Freelancer (Release Payout)</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                  Resolution: <strong className="text-white">{disp.resolution_notes}</strong> (Resolved on {formatDate(disp.resolved_at || "")})
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
