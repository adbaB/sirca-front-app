/* ──────────────────────────────────────────────────────
   SIRCA Dashboard — TypeScript Interfaces
   ────────────────────────────────────────────────────── */

/** Advisor returned from /api/mock/advisors */
export interface Advisor {
  id: string;
  name: string;
}

export interface Portfolio {
  id: string;
  name: string;
  code: string;
  status: 'ACTIVE' | 'INACTIVE';
  percentage: number;
  createdAt?: string;
  updatedAt?: string;
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
  advisorId?: string | null;
  advisor?: Advisor | null;
}

/** Auth response — returned by POST /auth/login */
export interface AuthUser {
  id: string;
  email: string;
  isActive: boolean;
  role: { id: string; name: string } | null;
  permissions: string[];
  advisorId?: string | null;
}

/** Login response shape */
export interface LoginResponse {
  user: AuthUser;
}

/* ──────────────────────────────────────────────────────
   Contracts, Affiliates, Payments Types
   ────────────────────────────────────────────────────── */

export interface Plan {
  id: string;
  name: string;
  maxAge: number;
  amount: number;
  percentage: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
}

export interface Person {
  id: string;
  typeIdentityCard: 'V' | 'E' | 'P' | 'J' | 'G' | 'C' | 'PN';
  identityCard: string;
  name: string;
  birthDate?: Date;
  gender?: boolean;
  plan: Plan;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  contractPersons?: ContractPerson[];
}

export interface Contract {
  id: string;
  affiliationDate: Date;
  monthlyAmount: number;
  code: string;
  contractPersons?: ContractPerson[];
  invoices?: Invoice[];
  surpluses?: Surplus[] | null;
  advisor?: Advisor | null;
  advisorId?: string | null;
  portfolio?: Portfolio | null;
  portfolioId?: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface ContractPerson {
  id: string;
  contract: Contract;
  person: Person;
  role: 'TITULAR' | 'AFILIADO';
  isBillingOwner: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  paymentDate: string;
  amount: number;
  amountBs?: number | null;
  url?: string | null;
  paymentMethod: string;
  referenceNumber: string;
  status: 'PROCESSING' | 'COMPLETED' | 'REJECTED';
  metadata?: Record<string, unknown> | null;
  person?: Person | null;
  invoice?: Invoice | null;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  billingMonth: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  status: 'PENDING' | 'PARTIAL' | 'PAID' | 'CANCELLED';
  payments?: Payment[];
  contract?: Contract | null;
  createdAt: string;
  updatedAt: string;
}

export interface Surplus {
  id: string;
  amountBs: number | null;
  amountUsd: number | null;
  date: string;
  status: 'pending' | 'applied' | 'refunded' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  payment: Payment;
  invoice: Invoice | null;
}

export interface PaginationResponse<T> {
  data: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
