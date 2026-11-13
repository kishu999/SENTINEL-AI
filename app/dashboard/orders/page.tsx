"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Calendar, DollarSign, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { dataService } from "@/lib/services/dataService";
import { Order } from "@/types/database";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export default function MyOrdersPage() {
  const currentUser = dataService.getCurrentUser();
  const [roleFilter, setRoleFilter] = useState<"all" | "buyer" | "freelancer">("all");
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(dataService.getOrders(currentUser.id));
  }, [currentUser.id]);

  const filteredOrders = orders.filter((o) => {
    if (roleFilter === "buyer") return o.buyer_id === currentUser.id;
    if (roleFilter === "freelancer") return o.freelancer_id === currentUser.id;
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Order Workspace & Contracts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor active work, exchange deliverables, request revisions, and release escrow payments.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
          <button
            onClick={() => setRoleFilter("all")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              roleFilter === "all" ? "bg-white dark:bg-slate-900 shadow-sm text-blue-600 font-bold" : "text-slate-600 dark:text-slate-400"
            }`}
          >
            All ({orders.length})
          </button>
          <button
            onClick={() => setRoleFilter("buyer")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              roleFilter === "buyer" ? "bg-white dark:bg-slate-900 shadow-sm text-blue-600 font-bold" : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Hired ({orders.filter((o) => o.buyer_id === currentUser.id).length})
          </button>
          <button
            onClick={() => setRoleFilter("freelancer")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              roleFilter === "freelancer" ? "bg-white dark:bg-slate-900 shadow-sm text-blue-600 font-bold" : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Earning ({orders.filter((o) => o.freelancer_id === currentUser.id).length})
          </button>
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isBuyer = order.buyer_id === currentUser.id;
            const counterpart = isBuyer ? order.freelancer : order.buyer;

            return (
              <Card key={order.id} className="hover:shadow-card-hover transition-all">
                <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        {order.order_number}
                      </span>
                      <StatusBadge status={order.status} />
                      <span className="text-[11px] text-slate-400">
                        Created {formatDate(order.created_at)}
                      </span>
                    </div>

                    <Link href={`/orders/${order.id}`} className="block group">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {order.task?.title || "Order Title"}
                      </h3>
                    </Link>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="font-bold text-emerald-600">
                        {formatCurrency(order.agreed_price)}
                      </span>
                      <span>
                        {isBuyer ? "Freelancer:" : "Client:"} <strong>{counterpart?.full_name}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Deadline: {formatDate(order.deadline)}
                      </span>
                      {order.deliverables && order.deliverables.length > 0 && (
                        <span className="text-blue-600 font-semibold">
                          {order.deliverables.length} {order.deliverables.length === 1 ? "deliverable" : "deliverables"} uploaded
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Link href={`/orders/${order.id}`} className="w-full sm:w-auto">
                      <Button size="sm" className="w-full gap-2 text-xs font-semibold">
                        <span>Open Workspace</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={ShoppingBag}
          title="No Orders in this View"
          description="You don't have any orders matching your selected role filter."
          actionLabel="View All Orders"
          onAction={() => setRoleFilter("all")}
        />
      )}
    </div>
  );
}
