/* ──────────────────────────────────────────────────────
   SIRCA Dashboard — Constants
   ────────────────────────────────────────────────────── */

/** Month names in Spanish (1-indexed by position) */
export const MONTHS = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
];

/** Short month labels for charts */
export const MONTH_SHORT_LABELS = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

/** Available years for filtering */
export const YEARS = [2024, 2025, 2026];

/** Payment status colors — optimized for light mode */
export const STATUS_COLORS = {
  verified: '#16a34a', // SIRCA green
  unverified: '#f97316', // SIRCA orange
  partial: '#d97706', // amber-600
  pending: '#dc2626', // red-600
} as const;

/** Payment status labels in Spanish */
export const STATUS_LABELS: Record<string, string> = {
  verified: 'Verificados',
  unverified: 'Sin Verificar',
  partial: 'Parciales',
  pending: 'Pendientes',
};

/** Format a number as USD currency — re-exported from @/lib/formatters */
export { formatCurrency as formatUsd, formatCurrencyBs as formatBs } from '@/lib/formatters';

/** Build the month_billing query param (YYYY-MM) from year and month */
export function buildMonthBilling(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}
