import React from "react";
import { Badge } from "./badge";
import { TaskStatus, OrderStatus, ApplicationStatus } from "@/types/database";

export function StatusBadge({ status }: { status: TaskStatus | OrderStatus | ApplicationStatus | string }) {
  switch (status) {
    case "open":
      return <Badge variant="default">Open for Proposals</Badge>;
    case "in_progress":
      return <Badge variant="purple">In Progress</Badge>;
    case "submitted":
      return <Badge variant="warning">Under Review</Badge>;
    case "revision_requested":
      return <Badge variant="warning">Revision Requested</Badge>;
    case "completed":
      return <Badge variant="success">Completed</Badge>;
    case "accepted":
      return <Badge variant="success">Accepted</Badge>;
    case "pending":
      return <Badge variant="warning">Pending</Badge>;
    case "rejected":
      return <Badge variant="danger">Not Selected</Badge>;
    case "cancelled":
      return <Badge variant="danger">Cancelled</Badge>;
    case "disputed":
      return <Badge variant="danger">Dispute Opened</Badge>;
    case "closed":
      return <Badge variant="secondary">Closed</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}
