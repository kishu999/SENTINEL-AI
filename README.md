# 🎓 SkillConnect — The Complete Student Freelancing Marketplace
> **Your Skills. Your Earnings. Your Future.**

SkillConnect is a full-stack, student-to-student freelancing and collaborative micro-task platform engineered with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL, Auth, Storage, Realtime)**. It connects college students who need technical, creative, or research project assistance with skilled student peers seeking to monetize their knowledge, gain professional experience, and build verified portfolios.

---

## 🌟 Key Platform Features

### 1. 🏛️ Public Marketplace & Discovery
- **High-Converting Landing Experience**: Hero with prominent search, live collaboration preview card, verified database statistics, and trust indicators.
- **10 Canonical Student Categories**:
  1. *Programming & Development* (Next.js, Python, Automation, Bug Fixing)
  2. *Graphic Design* (Club Flyers, Logos, Vector Art, Brand Kits)
  3. *Video Editing* (Reels, TikTok, YouTube, Color Grading)
  4. *Content Writing* (Technical Writing, Newsletters, Blog Posts)
  5. *Research & Learning Support* (Literature Reviews, Dataset Sourcing, Synthesis)
  6. *Presentation Design* (Pitch Decks, Keynote, PowerPoint, Infographics)
  7. *Data Entry & Analytics* (Spreadsheet Modeling, Python Pandas, Dashboards)
  8. *Digital Marketing* (Campus SEO, Social Media Campaigns)
  9. *Tutoring & Mentorship* (1-on-1 Concept Review, Code Debugging)
  10. *UI/UX Design* (Figma Mobile Mockups, Prototypes, Design Systems)
- **Advanced Task Marketplace (`/explore`)**: Keyword search, category filtering, budget range slider, required skills tags, sorting (newest/budget), and task bookmarking.

### 2. 🛡️ Strict Academic Integrity Policy
- **Honor Code Commitment**: Zero tolerance for academic dishonesty, ghostwriting graded essays, completing examinations, or solving homework sets meant for independent submission.
- **Permitted Services**: Tutoring, mentorship, presentation design, mobile mockups, open data scraping, and technical guidance.
- Mandatory affirmation required prior to publishing tasks.

### 3. 📝 Task Creation & Proposal Lifecycle
- **Post a Task (`/tasks/post`)**: Budget, timeline, deliverables scope, required skill tags, and attachment support.
- **Proposals & Bidding (`/tasks/[id]`)**: Freelancers submit proposed price, turnaround days, and tailored cover letter.
- **Owner Hiring Control**: Task owners compare applicant profiles, ratings, and proposals. Accepting a proposal funds the escrow, sets the order to `in_progress`, and rejects competing bids.

### 4. 📦 Complete Order Workspace (`/orders/[id]`)
- **Interactive Contract Timeline**: Track milestones (`Order Funded` ➔ `In Progress` ➔ `Submitted` ➔ `Completed`).
- **Deliverables & Revision Cycles**: Freelancers upload zipped assets and handover notes; buyers can request structured revisions.
- **Escrow Approval & Payout**: Buyer approval automatically deducts the low 5% platform fee and credits the student freelancer's wallet.
- **Dispute Resolution Filing**: Either party can file an official dispute for human administrative arbitration.
- **Verified Star Reviews**: 5-star ratings and written testimonials calculate public student reputation upon completion.

### 5. 💬 Real-Time Messaging & Notifications
- **1-on-1 Chat (`/messages`)**: Threaded real-time chat between buyers and freelancers with unread badges and search.
- **Notification Hub (`/notifications`)**: Instant alerts for incoming proposals, deliverable submissions, escrow payouts, and order reviews.

### 6. 💳 Student Wallet & Transparent 5% Fee (`/wallet`)
- **Balance Overview**: Real-time breakdown of Available Balance, Pending Escrow Holdings, Lifetime Earnings, and Withdrawable Funds.
- **Deposit Simulation (Sandbox Mode)**: Instant top-up using test credit cards.
- **Withdrawal Processing**: Direct ACH bank transfers and PayPal payout requests.
- **Immutable Transaction Ledger**: Cryptographic ledger recording every deposit, payment, fee, earning, and withdrawal.

### 7. 👑 Executive Admin & Governance Console (`/admin`)
- **Role-Based Authorization**: Protected by server-side verification (`role === 'admin'`).
- **User Management (`/admin/users`)**: Audit student records, suspend bad actors, and restore accounts.
- **Task Moderation (`/admin/tasks`)**: Flag, inspect, and remove non-compliant listings.
- **Dispute Arbitration (`/admin/disputes`)**: Review contract evidence and rule in favor of Buyer (refund escrow) or Freelancer (release payout).
- **Integrity Reports Queue (`/admin/reports`)**: Investigate confidential student reports.
- **Forensic Audit Stream (`/admin/audit`)**: Audit trail tracking administrative actions.

---

## ⚡ Instant Persona Switcher (For Evaluation & QA)
To test different perspectives without manually logging in and out, click the **"Switch Test Persona"** dropdown in the top bar:
- **Alex Rivera (Buyer)**: Stanford CS student — Posts tasks, compares proposals, reviews deliverables, and approves payouts.
- **Priya Sharma (Freelancer)**: UC Berkeley UI/UX designer — Applies to design tasks, uploads deliverables, and withdraws earnings.
- **Marcus Chen (Seller)**: MIT Finance student — Pitch deck and financial modeling freelancer.
- **SkillConnect Operations (Admin)**: Root access to Dispute Center, User Suspensions, and Forensic Audit Logs.

---

## 🗄️ Database Architecture & Migrations

SkillConnect includes a normalized PostgreSQL schema located at:
`supabase/migrations/20261113_initial_schema.sql`
and rich seed data at:
`supabase/seed.sql`.

### Relational Entities:
1. `profiles` — Student identities, university affiliation, course, year, bio, skills, portfolio, rating.
2. `user_roles` — Privilege separation (`student`, `moderator`, `admin`).
3. `categories` — 10 canonical student disciplines.
4. `tasks` — Marketplace listings, budgets, deadlines, and skill requirements.
5. `task_attachments` — Permitted project reference files.
6. `applications` — Proposals, proposed prices, and turnaround times.
7. `saved_tasks` — User bookmarks.
8. `orders` — Active contract lifecycle records.
9. `order_deliverables` — Versioned submission records with revision notes.
10. `conversations` & `messages` — Real-time chat messages.
11. `notifications` — Event-driven student alerts.
12. `wallets` & `transactions` — Financial ledgers and balances.
13. `withdrawal_requests` — Banking and payout records.
14. `reviews` — Verified order reviews.
15. `reports` & `disputes` — Community safety and arbitration records.
16. `admin_audit_logs` — Forensic event tracking.

Row Level Security (RLS) policies are defined for each table to enforce user privacy and prevent unauthorized access.

---

## 🛠️ Tech Stack & Dependencies

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14.2.15 (App Router, Server & Client Components) |
| **Language** | TypeScript 5 (Strict Mode) |
| **Styling** | Tailwind CSS with Custom Brand Palette & CSS Variables |
| **Icons** | Lucide React |
| **Database** | PostgreSQL via Supabase |
| **Authentication** | Supabase Auth (Unified Buyer + Freelancer Account) |
| **Payments** | Stripe Sandbox Architecture + Immutable Ledger |
| **Persistence** | Resilient Hybrid Layer (Supabase + High-Fidelity Local Cache) |

---

