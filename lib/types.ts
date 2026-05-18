/* ──────────────────────────────────────────────────────
   SIRCA Dashboard — TypeScript Interfaces
   ────────────────────────────────────────────────────── */

/** Advisor returned from /api/mock/advisors */
export interface Advisor {
  id: string;
  name: string;
}

/** High-level KPI summary for a given period */
export interface StatisticsSummary {
  totalPaymentsVerified: number;
  totalPaymentsUnverified: number;
  totalPaymentsPartial: number;
  totalPaymentsPending: number;
  totalAmountVerifiedUsd: number;
  totalAmountUnverifiedUsd: number;
  totalPendingUsd: number;
  totalToPayUsd: number;
  /** SUM(total_amount) for ALL invoices in the billing month — grand billing total */
  totalInvoiceAmount: number;
  /** SUM(paid_amount) for PAID + PARTIAL invoices — everything collected so far */
  totalCollected: number;
}

/** Payment status breakdown row */
export interface PaymentBreakdown {
  status: 'verified' | 'unverified' | 'partial' | 'pending';
  count: number;
  amountUsd: number;
  amountBs: number;
}

/** Monthly trend data point */
export interface MonthlyTrend {
  month: string;
  verified: number;
  pending: number;
}

/** Full statistics API response */
export interface StatisticsResponse {
  summary: StatisticsSummary;
  breakdown: PaymentBreakdown[];
}

/** Filter state for dashboard */
export interface DashboardFilters {
  year: number;
  month: number;
  advisorUuid: string;
}

/* ──────────────────────────────────────────────────────
   RBAC / Auth Types
   ────────────────────────────────────────────────────── */

/** Permission entity from the backend */
export interface Permission {
  id: string;
  name: string;
  description: string | null;
}

/** Role entity from the backend (with nested permissions) */
export interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions?: Permission[];
}

/** User entity from the backend (password excluded) */
export interface User {
  id: string;
  email: string;
  isActive: boolean;
  roleId: string | null;
  role: Role | null;
}

/** Auth response — returned by POST /auth/login */
export interface AuthUser {
  id: string;
  email: string;
  isActive: boolean;
  role: { id: string; name: string } | null;
  permissions: string[];
}

/** Login response shape */
export interface LoginResponse {
  user: AuthUser;
}
