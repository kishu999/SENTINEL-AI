import {
  Category,
  Profile,
  Task,
  Application,
  Order,
  Conversation,
  Message,
  Notification,
  Wallet,
  Transaction,
  Review,
  Report,
  Dispute,
  AdminAuditLog,
  WithdrawalRequest,
  OrderStatus,
  TaskStatus,
  ApplicationStatus,
} from "@/types/database";
import {
  INITIAL_CATEGORIES,
  INITIAL_PROFILES,
  INITIAL_TASKS,
  INITIAL_APPLICATIONS,
  INITIAL_ORDERS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_WALLETS,
  INITIAL_TRANSACTIONS,
  INITIAL_WITHDRAWALS,
  INITIAL_REVIEWS,
  INITIAL_REPORTS,
  INITIAL_DISPUTES,
  INITIAL_AUDIT_LOGS,
} from "./mockData";
import { isSupabaseConfigured, supabase } from "../supabase/client";

// Global in-memory / browser state cache key
const STORAGE_PREFIX = "skillconnect_state_v1_";

class DataStore {
  private categories: Category[] = [...INITIAL_CATEGORIES];
  private profiles: Profile[] = [...INITIAL_PROFILES];
  private tasks: Task[] = [...INITIAL_TASKS];
  private applications: Application[] = [...INITIAL_APPLICATIONS];
  private orders: Order[] = [...INITIAL_ORDERS];
  private conversations: Conversation[] = [...INITIAL_CONVERSATIONS];
  private messages: Message[] = [...INITIAL_MESSAGES];
  private notifications: Notification[] = [...INITIAL_NOTIFICATIONS];
  private wallets: Record<string, Wallet> = { ...INITIAL_WALLETS };
  private transactions: Transaction[] = [...INITIAL_TRANSACTIONS];
  private withdrawals: WithdrawalRequest[] = [...INITIAL_WITHDRAWALS];
  private reviews: Review[] = [...INITIAL_REVIEWS];
  private reports: Report[] = [...INITIAL_REPORTS];
  private disputes: Dispute[] = [...INITIAL_DISPUTES];
  private auditLogs: AdminAuditLog[] = [...INITIAL_AUDIT_LOGS];
  private savedTasks: Record<string, string[]> = { "user-alex": ["task-1"] };
  private currentUserId: string = "user-alex"; // Default student session

  constructor() {
    if (typeof window !== "undefined") {
      this.loadFromStorage();
    }
  }

  private loadFromStorage() {
    try {
      const savedTasks = localStorage.getItem(`${STORAGE_PREFIX}tasks`);
      if (savedTasks) this.tasks = JSON.parse(savedTasks);

      const savedApps = localStorage.getItem(`${STORAGE_PREFIX}apps`);
      if (savedApps) this.applications = JSON.parse(savedApps);

      const savedOrders = localStorage.getItem(`${STORAGE_PREFIX}orders`);
      if (savedOrders) this.orders = JSON.parse(savedOrders);

      const savedMsgs = localStorage.getItem(`${STORAGE_PREFIX}msgs`);
      if (savedMsgs) this.messages = JSON.parse(savedMsgs);

      const savedNotifs = localStorage.getItem(`${STORAGE_PREFIX}notifs`);
      if (savedNotifs) this.notifications = JSON.parse(savedNotifs);

      const savedWallets = localStorage.getItem(`${STORAGE_PREFIX}wallets`);
      if (savedWallets) this.wallets = JSON.parse(savedWallets);

      const savedTransactions = localStorage.getItem(`${STORAGE_PREFIX}txs`);
      if (savedTransactions) this.transactions = JSON.parse(savedTransactions);

      const savedCurrentUser = localStorage.getItem(`${STORAGE_PREFIX}current_user`);
      if (savedCurrentUser) this.currentUserId = savedCurrentUser;
    } catch (e) {
      console.error("Failed to load local storage state:", e);
    }
  }

  private persist() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(`${STORAGE_PREFIX}tasks`, JSON.stringify(this.tasks));
      localStorage.setItem(`${STORAGE_PREFIX}apps`, JSON.stringify(this.applications));
      localStorage.setItem(`${STORAGE_PREFIX}orders`, JSON.stringify(this.orders));
      localStorage.setItem(`${STORAGE_PREFIX}msgs`, JSON.stringify(this.messages));
      localStorage.setItem(`${STORAGE_PREFIX}notifs`, JSON.stringify(this.notifications));
      localStorage.setItem(`${STORAGE_PREFIX}wallets`, JSON.stringify(this.wallets));
      localStorage.setItem(`${STORAGE_PREFIX}txs`, JSON.stringify(this.transactions));
      localStorage.setItem(`${STORAGE_PREFIX}current_user`, this.currentUserId);
    } catch (e) {
      console.error("Failed to persist state:", e);
    }
  }

  // --- Auth & Session ---
  getCurrentUserId(): string {
    return this.currentUserId;
  }

  setCurrentUser(userId: string): Profile {
    this.currentUserId = userId;
    this.persist();
    const profile = this.getProfileById(userId);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("skillconnect:user_changed", { detail: profile }));
    }
    return profile || this.profiles[0];
  }

  getCurrentUser(): Profile {
    return this.getProfileById(this.currentUserId) || this.profiles[0];
  }

  // --- Categories ---
  getCategories(): Category[] {
    return this.categories.map((cat) => ({
      ...cat,
      task_count: this.tasks.filter((t) => t.category_id === cat.id && t.status === "open").length,
    }));
  }

  // --- Tasks ---
  getTasks(params?: {
    categorySlug?: string;
    query?: string;
    minBudget?: number;
    maxBudget?: number;
    skills?: string[];
    sortBy?: "newest" | "budget_desc" | "budget_asc";
    status?: TaskStatus;
  }): Task[] {
    let result = [...this.tasks];

    if (params?.status) {
      result = result.filter((t) => t.status === params.status);
    }

    if (params?.categorySlug) {
      const cat = this.categories.find((c) => c.slug === params.categorySlug);
      if (cat) {
        result = result.filter((t) => t.category_id === cat.id);
      }
    }

    if (params?.query && params.query.trim()) {
      const q = params.query.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.required_skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (params?.minBudget !== undefined) {
      result = result.filter((t) => t.budget >= (params.minBudget || 0));
    }

    if (params?.maxBudget !== undefined && params.maxBudget > 0) {
      result = result.filter((t) => t.budget <= (params.maxBudget || Infinity));
    }

    if (params?.skills && params.skills.length > 0) {
      result = result.filter((t) =>
        params.skills!.some((req) =>
          t.required_skills.map((s) => s.toLowerCase()).includes(req.toLowerCase())
        )
      );
    }

    if (params?.sortBy === "budget_desc") {
      result.sort((a, b) => b.budget - a.budget);
    } else if (params?.sortBy === "budget_asc") {
      result.sort((a, b) => a.budget - b.budget);
    } else {
      // Default newest
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result.map((t) => ({
      ...t,
      client: this.getProfileById(t.client_id),
      category: this.categories.find((c) => c.id === t.category_id),
    }));
  }

  getTaskById(id: string): Task | null {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return null;
    return {
      ...task,
      client: this.getProfileById(task.client_id),
      category: this.categories.find((c) => c.id === task.category_id),
    };
  }

  createTask(data: {
    title: string;
    description: string;
    category_id: string;
    budget: number;
    budget_type: "fixed" | "hourly";
    deadline: string;
    required_skills: string[];
    additional_instructions?: string;
  }): Task {
    const client = this.getCurrentUser();
    const newTask: Task = {
      id: `task-${Date.now()}`,
      client_id: client.id,
      client: client,
      title: data.title,
      description: data.description,
      category_id: data.category_id,
      category: this.categories.find((c) => c.id === data.category_id),
      budget: data.budget,
      budget_type: data.budget_type,
      deadline: data.deadline,
      required_skills: data.required_skills,
      status: "open",
      attachments: [],
      additional_instructions: data.additional_instructions,
      view_count: 1,
      application_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.tasks.unshift(newTask);
    this.persist();

    // Log admin audit
    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      admin_id: "user-admin",
      action: "TASK_CREATED",
      target_type: "task",
      target_id: newTask.id,
      details: { title: newTask.title, budget: newTask.budget },
      ip_address: "127.0.0.1",
      created_at: new Date().toISOString(),
    });

    return newTask;
  }

  updateTaskStatus(taskId: string, status: TaskStatus): boolean {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) return false;
    task.status = status;
    task.updated_at = new Date().toISOString();
    this.persist();
    return true;
  }

  // --- Applications ---
  getApplicationsForTask(taskId: string): Application[] {
    return this.applications
      .filter((a) => a.task_id === taskId)
      .map((a) => ({
        ...a,
        freelancer: this.getProfileById(a.freelancer_id),
        task: this.getTaskById(a.task_id) || undefined,
      }));
  }

  getUserApplications(userId: string): Application[] {
    return this.applications
      .filter((a) => a.freelancer_id === userId)
      .map((a) => ({
        ...a,
        freelancer: this.getProfileById(a.freelancer_id),
        task: this.getTaskById(a.task_id) || undefined,
      }));
  }

  submitApplication(data: {
    task_id: string;
    cover_letter: string;
    proposed_price: number;
    estimated_delivery_days: number;
  }): Application {
    const user = this.getCurrentUser();
    const existing = this.applications.find(
      (a) => a.task_id === data.task_id && a.freelancer_id === user.id
    );
    if (existing) {
      throw new Error("You have already submitted an application for this task.");
    }

    const task = this.getTaskById(data.task_id);
    if (!task) throw new Error("Task not found");
    if (task.client_id === user.id) {
      throw new Error("You cannot apply to your own task.");
    }

    const newApp: Application = {
      id: `app-${Date.now()}`,
      task_id: data.task_id,
      task: task,
      freelancer_id: user.id,
      freelancer: user,
      cover_letter: data.cover_letter,
      proposed_price: data.proposed_price,
      estimated_delivery_days: data.estimated_delivery_days,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.applications.unshift(newApp);

    // Increment task application count
    const t = this.tasks.find((item) => item.id === data.task_id);
    if (t) t.application_count = (t.application_count || 0) + 1;

    // Send notification to task client
    this.createNotification({
      user_id: task.client_id,
      type: "application_received",
      title: "New Proposal Received",
      message: `${user.full_name} submitted a proposal for '${task.title}'`,
      link: `/tasks/${task.id}`,
    });

    this.persist();
    return newApp;
  }

  acceptApplication(applicationId: string): Order {
    const app = this.applications.find((a) => a.id === applicationId);
    if (!app) throw new Error("Application not found");

    const task = this.tasks.find((t) => t.id === app.task_id);
    if (!task) throw new Error("Task not found");

    app.status = "accepted";
    task.status = "in_progress";

    // Reject other applications
    this.applications
      .filter((a) => a.task_id === task.id && a.id !== applicationId)
      .forEach((a) => {
        a.status = "rejected";
      });

    // Create Order
    const deadline = new Date(Date.now() + app.estimated_delivery_days * 86400000).toISOString();
    const orderNumber = `SC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const platformFee = Math.round(app.proposed_price * 0.05 * 100) / 100; // 5% fee

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      task_id: task.id,
      task: task,
      application_id: app.id,
      buyer_id: task.client_id,
      buyer: this.getProfileById(task.client_id),
      freelancer_id: app.freelancer_id,
      freelancer: this.getProfileById(app.freelancer_id),
      agreed_price: app.proposed_price,
      platform_fee: platformFee,
      deadline: deadline,
      status: "in_progress",
      deliverables: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.orders.unshift(newOrder);

    // Setup transaction for escrow
    this.transactions.unshift({
      id: `tx-${Date.now()}`,
      wallet_id: `wal-${task.client_id}`,
      user_id: task.client_id,
      order_id: newOrder.id,
      type: "payment",
      amount: app.proposed_price,
      fee: 0,
      net_amount: app.proposed_price,
      status: "completed",
      description: `Funded Order ${orderNumber}: ${task.title}`,
      created_at: new Date().toISOString(),
    });

    // Notify freelancer
    this.createNotification({
      user_id: app.freelancer_id,
      type: "order_started",
      title: "Proposal Accepted! Order Started",
      message: `Your proposal for '${task.title}' was accepted. You can now begin work.`,
      link: `/orders/${newOrder.id}`,
    });

    this.persist();
    return newOrder;
  }

  // --- Orders ---
  getOrders(userId: string, role?: "buyer" | "freelancer"): Order[] {
    let list = this.orders.filter(
      (o) => o.buyer_id === userId || o.freelancer_id === userId
    );

    if (role === "buyer") {
      list = list.filter((o) => o.buyer_id === userId);
    } else if (role === "freelancer") {
      list = list.filter((o) => o.freelancer_id === userId);
    }

    return list.map((o) => ({
      ...o,
      buyer: this.getProfileById(o.buyer_id),
      freelancer: this.getProfileById(o.freelancer_id),
      task: this.getTaskById(o.task_id) || undefined,
    }));
  }

  getOrderById(id: string): Order | null {
    const order = this.orders.find((o) => o.id === id);
    if (!order) return null;
    return {
      ...order,
      buyer: this.getProfileById(order.buyer_id),
      freelancer: this.getProfileById(order.freelancer_id),
      task: this.getTaskById(order.task_id) || undefined,
    };
  }

  submitDeliverable(orderId: string, data: { message: string; files: Array<{ name: string; url: string; size?: string }> }): Order {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) throw new Error("Order not found");

    const sender = this.getCurrentUser();
    const newDeliverable = {
      id: `del-${Date.now()}`,
      order_id: orderId,
      sender_id: sender.id,
      sender: sender,
      message: data.message,
      files: data.files,
      revision_number: (order.deliverables?.length || 0) + 1,
      created_at: new Date().toISOString(),
    };

    if (!order.deliverables) order.deliverables = [];
    order.deliverables.unshift(newDeliverable);
    order.status = "submitted";
    order.updated_at = new Date().toISOString();

    this.createNotification({
      user_id: order.buyer_id,
      type: "work_submitted",
      title: "Deliverable Submitted for Review",
      message: `${sender.full_name} submitted work for order ${order.order_number}.`,
      link: `/orders/${order.id}`,
    });

    this.persist();
    return order;
  }

  requestRevision(orderId: string, notes: string): Order {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) throw new Error("Order not found");

    order.status = "revision_requested";
    order.updated_at = new Date().toISOString();

    this.createNotification({
      user_id: order.freelancer_id,
      type: "revision_requested",
      title: "Revision Requested",
      message: `Buyer requested revisions for order ${order.order_number}: "${notes}"`,
      link: `/orders/${order.id}`,
    });

    this.persist();
    return order;
  }

  approveOrder(orderId: string): Order {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) throw new Error("Order not found");

    order.status = "completed";
    order.updated_at = new Date().toISOString();

    // Mark task as completed
    const task = this.tasks.find((t) => t.id === order.task_id);
    if (task) task.status = "completed";

    // Credit freelancer wallet
    const netEarning = order.agreed_price - order.platform_fee;
    const wallet = this.getWallet(order.freelancer_id);
    wallet.available_balance += netEarning;
    wallet.withdrawable_balance += netEarning;
    wallet.total_earnings += netEarning;

    // Log transaction
    this.transactions.unshift({
      id: `tx-${Date.now()}`,
      wallet_id: wallet.id,
      user_id: order.freelancer_id,
      order_id: order.id,
      type: "earning",
      amount: order.agreed_price,
      fee: order.platform_fee,
      net_amount: netEarning,
      status: "completed",
      description: `Payment released for order ${order.order_number}`,
      created_at: new Date().toISOString(),
    });

    // Increment completed projects
    const freelancer = this.profiles.find((p) => p.id === order.freelancer_id);
    if (freelancer) {
      freelancer.completed_projects = (freelancer.completed_projects || 0) + 1;
    }

    this.createNotification({
      user_id: order.freelancer_id,
      type: "order_completed",
      title: "Payment Released!",
      message: `Order ${order.order_number} was approved! $${netEarning.toFixed(2)} added to your wallet.`,
      link: `/wallet`,
    });

    this.persist();
    return order;
  }

  // --- Messaging ---
  getConversations(userId: string): Conversation[] {
    return this.conversations
      .filter((c) => c.participant_ids.includes(userId))
      .map((c) => ({
        ...c,
        participants: c.participant_ids.map((id) => this.getProfileById(id)!),
      }))
      .sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime());
  }

  getMessages(conversationId: string): Message[] {
    return this.messages
      .filter((m) => m.conversation_id === conversationId)
      .map((m) => ({
        ...m,
        sender: this.getProfileById(m.sender_id),
      }))
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  sendMessage(conversationId: string, content: string, attachments: Array<{ name: string; url: string; size?: string }> = []): Message {
    const sender = this.getCurrentUser();
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: sender.id,
      sender: sender,
      content: content,
      attachments: attachments,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    this.messages.push(newMsg);

    // Update conversation
    const conv = this.conversations.find((c) => c.id === conversationId);
    if (conv) {
      conv.last_message_at = newMsg.created_at;
      conv.last_message_snippet = content;
      conv.updated_at = newMsg.created_at;

      // Notify the other participant
      const otherParticipant = conv.participant_ids.find((id) => id !== sender.id);
      if (otherParticipant) {
        this.createNotification({
          user_id: otherParticipant,
          type: "new_message",
          title: `New Message from ${sender.full_name}`,
          message: content.length > 50 ? `${content.substring(0, 50)}...` : content,
          link: `/messages?id=${conversationId}`,
        });
      }
    }

    this.persist();

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("skillconnect:message", { detail: newMsg }));
    }

    return newMsg;
  }

  getOrCreateConversation(participantIds: string[], taskTitle?: string): Conversation {
    const existing = this.conversations.find(
      (c) =>
        c.participant_ids.length === participantIds.length &&
        participantIds.every((id) => c.participant_ids.includes(id))
    );

    if (existing) return existing;

    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      participant_ids: participantIds,
      participants: participantIds.map((id) => this.getProfileById(id)!),
      task_title: taskTitle,
      last_message_at: new Date().toISOString(),
      last_message_snippet: "Conversation started",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.conversations.unshift(newConv);
    this.persist();
    return newConv;
  }

  // --- Notifications ---
  getNotifications(userId: string): Notification[] {
    return this.notifications
      .filter((n) => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  markNotificationAsRead(id: string): void {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) notif.is_read = true;
    this.persist();
  }

  markAllNotificationsAsRead(userId: string): void {
    this.notifications.filter((n) => n.user_id === userId).forEach((n) => (n.is_read = true));
    this.persist();
  }

  createNotification(data: Omit<Notification, "id" | "is_read" | "created_at">): Notification {
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      ...data,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    this.notifications.unshift(newNotif);
    this.persist();

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("skillconnect:notification", { detail: newNotif }));
    }

    return newNotif;
  }

  // --- Wallet & Payments ---
  getWallet(userId: string): Wallet {
    if (!this.wallets[userId]) {
      this.wallets[userId] = {
        id: `wal-${userId}`,
        user_id: userId,
        total_earnings: 0,
        available_balance: 0,
        pending_balance: 0,
        withdrawable_balance: 0,
        currency: "USD",
        updated_at: new Date().toISOString(),
      };
      this.persist();
    }
    return this.wallets[userId];
  }

  getTransactions(userId: string): Transaction[] {
    return this.transactions
      .filter((t) => t.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  depositFunds(userId: string, amount: number): Transaction {
    if (amount <= 0) throw new Error("Invalid deposit amount");

    const wallet = this.getWallet(userId);
    wallet.available_balance += amount;
    wallet.updated_at = new Date().toISOString();

    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      wallet_id: wallet.id,
      user_id: userId,
      type: "deposit",
      amount: amount,
      fee: 0,
      net_amount: amount,
      status: "completed",
      reference_id: `STRIPE_SIM_${Math.floor(100000 + Math.random() * 900000)}`,
      description: `Deposit via Visa card ending in 4242 (Sandbox)`,
      created_at: new Date().toISOString(),
    };

    this.transactions.unshift(tx);
    this.persist();
    return tx;
  }

  requestWithdrawal(userId: string, amount: number, paymentMethod: string, details: Record<string, string>): WithdrawalRequest {
    const wallet = this.getWallet(userId);
    if (amount > wallet.withdrawable_balance) {
      throw new Error("Withdrawal amount exceeds available withdrawable balance.");
    }

    wallet.withdrawable_balance -= amount;
    wallet.available_balance -= amount;
    wallet.updated_at = new Date().toISOString();

    const wdr: WithdrawalRequest = {
      id: `wdr-${Date.now()}`,
      user_id: userId,
      user: this.getProfileById(userId),
      amount: amount,
      payment_method: paymentMethod,
      payment_details: details,
      status: "pending",
      notes: "Requested by student",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.withdrawals.unshift(wdr);

    this.transactions.unshift({
      id: `tx-${Date.now()}`,
      wallet_id: wallet.id,
      user_id: userId,
      type: "withdrawal",
      amount: amount,
      fee: 0,
      net_amount: amount,
      status: "pending",
      reference_id: `ACH_REQ_${Math.floor(100000 + Math.random() * 900000)}`,
      description: `Withdrawal request to ${paymentMethod}`,
      created_at: new Date().toISOString(),
    });

    this.persist();
    return wdr;
  }

  // --- Reviews ---
  getReviewsForUser(userId: string): Review[] {
    return this.reviews
      .filter((r) => r.reviewee_id === userId)
      .map((r) => ({
        ...r,
        reviewer: this.getProfileById(r.reviewer_id),
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  createReview(data: {
    order_id: string;
    reviewee_id: string;
    rating: number;
    feedback: string;
    role: "buyer" | "freelancer";
  }): Review {
    const reviewer = this.getCurrentUser();
    const existing = this.reviews.find(
      (r) => r.order_id === data.order_id && r.reviewer_id === reviewer.id
    );
    if (existing) throw new Error("You have already reviewed this order.");

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      order_id: data.order_id,
      reviewer_id: reviewer.id,
      reviewer: reviewer,
      reviewee_id: data.reviewee_id,
      reviewee: this.getProfileById(data.reviewee_id),
      rating: data.rating,
      feedback: data.feedback,
      role: data.role,
      created_at: new Date().toISOString(),
    };

    this.reviews.unshift(newRev);

    // Recalculate reviewee average rating
    const allUserReviews = this.reviews.filter((r) => r.reviewee_id === data.reviewee_id);
    const avg = allUserReviews.reduce((acc, curr) => acc + curr.rating, 0) / allUserReviews.length;
    const reviewee = this.profiles.find((p) => p.id === data.reviewee_id);
    if (reviewee) {
      reviewee.rating = Math.round(avg * 10) / 10;
      reviewee.review_count = allUserReviews.length;
    }

    this.persist();
    return newRev;
  }

  // --- Saved Tasks ---
  isTaskSaved(taskId: string, userId: string): boolean {
    return (this.savedTasks[userId] || []).includes(taskId);
  }

  toggleSaveTask(taskId: string, userId: string): boolean {
    if (!this.savedTasks[userId]) this.savedTasks[userId] = [];
    const list = this.savedTasks[userId];
    const idx = list.indexOf(taskId);
    let saved = false;
    if (idx > -1) {
      list.splice(idx, 1);
      saved = false;
    } else {
      list.push(taskId);
      saved = true;
    }
    this.persist();
    return saved;
  }

  getSavedTasks(userId: string): Task[] {
    const ids = this.savedTasks[userId] || [];
    return this.tasks
      .filter((t) => ids.includes(t.id))
      .map((t) => ({
        ...t,
        client: this.getProfileById(t.client_id),
        category: this.categories.find((c) => c.id === t.category_id),
      }));
  }

  // --- Profiles ---
  getProfileById(id: string): Profile | undefined {
    return this.profiles.find((p) => p.id === id);
  }

  getProfileByUsername(username: string): Profile | undefined {
    return this.profiles.find((p) => p.username.toLowerCase() === username.toLowerCase());
  }

  updateProfile(id: string, updates: Partial<Profile>): Profile {
    const profile = this.profiles.find((p) => p.id === id);
    if (!profile) throw new Error("Profile not found");

    Object.assign(profile, updates, { updated_at: new Date().toISOString() });
    this.persist();
    return profile;
  }

  registerUser(data: {
    full_name: string;
    email: string;
    username: string;
    college: string;
    university: string;
    course: string;
    year_of_study: number;
    bio?: string;
    skills?: string[];
  }): Profile {
    const exists = this.profiles.find(
      (p) => p.email.toLowerCase() === data.email.toLowerCase() || p.username.toLowerCase() === data.username.toLowerCase()
    );
    if (exists) throw new Error("Email or username is already registered.");

    const newProfile: Profile = {
      id: `user-${Date.now()}`,
      email: data.email,
      full_name: data.full_name,
      username: data.username,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.username)}`,
      college: data.college,
      university: data.university,
      course: data.course,
      year_of_study: data.year_of_study,
      bio: data.bio || `Student at ${data.university} studying ${data.course}. Ready to collaborate on SkillConnect!`,
      skills: data.skills || ["Research", "Problem Solving"],
      languages: ["English"],
      portfolio: [],
      is_public: true,
      rating: 5.0,
      review_count: 0,
      completed_projects: 0,
      role: "student",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.profiles.push(newProfile);
    this.setCurrentUser(newProfile.id);
    this.persist();
    return newProfile;
  }

  // --- Admin Moderation & Analytics ---
  getAdminStats() {
    const totalUsers = this.profiles.length;
    const totalTasks = this.tasks.length;
    const totalOrders = this.orders.length;
    const completedOrders = this.orders.filter((o) => o.status === "completed").length;
    const platformRevenue = this.orders
      .filter((o) => o.status === "completed")
      .reduce((acc, curr) => acc + curr.platform_fee, 0);

    return {
      totalUsers,
      totalTasks,
      totalOrders,
      completedOrders,
      platformRevenue,
      openDisputes: this.disputes.filter((d) => d.status === "opened").length,
      pendingReports: this.reports.filter((r) => r.status === "pending").length,
      pendingWithdrawals: this.withdrawals.filter((w) => w.status === "pending").length,
    };
  }

  getAdminUsers(): Profile[] {
    return [...this.profiles];
  }

  setUserSuspension(userId: string, isSuspended: boolean): boolean {
    const user = this.profiles.find((p) => p.id === userId);
    if (!user) return false;
    user.is_suspended = isSuspended;

    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      admin_id: "user-admin",
      action: isSuspended ? "USER_SUSPENDED" : "USER_RESTORED",
      target_type: "user",
      target_id: userId,
      details: { username: user.username },
      ip_address: "127.0.0.1",
      created_at: new Date().toISOString(),
    });

    this.persist();
    return true;
  }

  getAdminReports(): Report[] {
    return this.reports.map((r) => ({
      ...r,
      reporter: this.getProfileById(r.reporter_id),
      reported_user: r.reported_user_id ? this.getProfileById(r.reported_user_id) : undefined,
      task: r.task_id ? this.getTaskById(r.task_id) || undefined : undefined,
    }));
  }

  resolveReport(reportId: string, status: "resolved" | "dismissed", notes: string): boolean {
    const report = this.reports.find((r) => r.id === reportId);
    if (!report) return false;
    report.status = status;
    report.resolution_notes = notes;
    report.updated_at = new Date().toISOString();
    this.persist();
    return true;
  }

  getAdminDisputes(): Dispute[] {
    return this.disputes.map((d) => ({
      ...d,
      order: this.getOrderById(d.order_id) || undefined,
      raised_by_user: this.getProfileById(d.raised_by),
    }));
  }

  resolveDispute(disputeId: string, status: "resolved_buyer" | "resolved_freelancer", notes: string): boolean {
    const disp = this.disputes.find((d) => d.id === disputeId);
    if (!disp) return false;
    disp.status = status;
    disp.resolution_notes = notes;
    disp.resolved_at = new Date().toISOString();

    const order = this.orders.find((o) => o.id === disp.order_id);
    if (order) {
      if (status === "resolved_buyer") {
        order.status = "cancelled";
        // Refund buyer wallet
        const wallet = this.getWallet(order.buyer_id);
        wallet.available_balance += order.agreed_price;
        this.transactions.unshift({
          id: `tx-${Date.now()}`,
          wallet_id: wallet.id,
          user_id: order.buyer_id,
          order_id: order.id,
          type: "refund",
          amount: order.agreed_price,
          fee: 0,
          net_amount: order.agreed_price,
          status: "completed",
          description: `Dispute resolved in buyer favor: Order ${order.order_number}`,
          created_at: new Date().toISOString(),
        });
      } else {
        // Resolved in freelancer favor
        this.approveOrder(order.id);
      }
    }

    this.persist();
    return true;
  }

  getAdminAuditLogs(): AdminAuditLog[] {
    return this.auditLogs.map((log) => ({
      ...log,
      admin: this.getProfileById(log.admin_id),
    }));
  }
}

// Singleton export
export const dataService = new DataStore();
