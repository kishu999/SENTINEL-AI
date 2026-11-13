export type UserRole = 'student' | 'moderator' | 'admin';
export type TaskBudgetType = 'fixed' | 'hourly';
export type TaskStatus = 'open' | 'in_progress' | 'completed' | 'cancelled' | 'closed';
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';
export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'in_progress'
  | 'submitted'
  | 'revision_requested'
  | 'completed'
  | 'cancelled'
  | 'disputed';
export type TransactionType =
  | 'deposit'
  | 'payment'
  | 'earning'
  | 'platform_fee'
  | 'refund'
  | 'withdrawal';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type WithdrawalStatus = 'pending' | 'approved' | 'rejected' | 'processed';
export type DisputeStatus =
  | 'opened'
  | 'under_review'
  | 'resolved_buyer'
  | 'resolved_freelancer'
  | 'cancelled';
export type ReportStatus = 'pending' | 'investigating' | 'resolved' | 'dismissed';

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  project_url?: string;
  tags?: string[];
}

export interface Profile {
  id: string;
  user_id?: string;
  email: string;
  full_name: string;
  username: string;
  avatar_url?: string;
  college: string;
  university?: string;
  course: string;
  year_of_study: number;
  bio?: string;
  skills: string[];
  languages: string[];
  portfolio?: PortfolioItem[];
  social_links?: Record<string, string>;
  is_public: boolean;
  rating: number;
  review_count: number;
  completed_projects: number;
  role?: UserRole;
  is_suspended?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  display_order: number;
  is_active: boolean;
  task_count?: number;
  created_at: string;
}

export interface TaskAttachment {
  name: string;
  url: string;
  size?: number;
  type?: string;
}

export interface Task {
  id: string;
  client_id: string;
  client?: Profile;
  title: string;
  description: string;
  category_id: string;
  category?: Category;
  budget: number;
  budget_type: TaskBudgetType;
  deadline: string;
  required_skills: string[];
  status: TaskStatus;
  attachments?: TaskAttachment[];
  additional_instructions?: string;
  view_count: number;
  application_count: number;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  task_id: string;
  task?: Task;
  freelancer_id: string;
  freelancer?: Profile;
  cover_letter: string;
  proposed_price: number;
  estimated_delivery_days: number;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
}

export interface OrderDeliverable {
  id: string;
  order_id: string;
  sender_id: string;
  sender?: Profile;
  message: string;
  files: Array<{ name: string; url: string; size?: string }>;
  revision_number: number;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  task_id: string;
  task?: Task;
  application_id?: string;
  buyer_id: string;
  buyer?: Profile;
  freelancer_id: string;
  freelancer?: Profile;
  agreed_price: number;
  platform_fee: number;
  deadline: string;
  status: OrderStatus;
  deliverables?: OrderDeliverable[];
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  task_id?: string;
  order_id?: string;
  task_title?: string;
  participant_ids: string[];
  participants?: Profile[];
  last_message_at: string;
  last_message_snippet?: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender?: Profile;
  content: string;
  attachments?: Array<{ name: string; url: string; size?: string }>;
  is_read: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  total_earnings: number;
  available_balance: number;
  pending_balance: number;
  withdrawable_balance: number;
  currency: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  wallet_id: string;
  user_id: string;
  order_id?: string;
  type: TransactionType;
  amount: number;
  fee: number;
  net_amount: number;
  status: TransactionStatus;
  reference_id?: string;
  description: string;
  created_at: string;
}

export interface WithdrawalRequest {
  id: string;
  user_id: string;
  user?: Profile;
  amount: number;
  payment_method: string;
  payment_details: Record<string, string>;
  status: WithdrawalStatus;
  notes?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  order_id: string;
  reviewer_id: string;
  reviewer?: Profile;
  reviewee_id: string;
  reviewee?: Profile;
  rating: number;
  feedback: string;
  role: 'buyer' | 'freelancer';
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  reporter?: Profile;
  reported_user_id?: string;
  reported_user?: Profile;
  task_id?: string;
  task?: Task;
  reason: string;
  details: string;
  status: ReportStatus;
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Dispute {
  id: string;
  order_id: string;
  order?: Order;
  raised_by: string;
  raised_by_user?: Profile;
  reason: string;
  evidence: Array<{ name: string; url: string }>;
  status: DisputeStatus;
  resolution_notes?: string;
  resolved_at?: string;
  created_at: string;
}

export interface AdminAuditLog {
  id: string;
  admin_id: string;
  admin?: Profile;
  action: string;
  target_type: string;
  target_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  created_at: string;
}
