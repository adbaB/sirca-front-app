/* ──────────────────────────────────────────────────────
   SIRCA — Shared Formatters & Status Helpers

   Extracted from ContractDetails.tsx for project-wide
   reuse. Provides formatting, translation, and status
   badge helpers used across the dashboard.
   ────────────────────────────────────────────────────── */

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// ── Date Formatters ──────────────────────────────────

/** Format a date string/Date to "d MMM, yyyy" in Spanish locale. Returns "N/A" for falsy values. */
export function formatDate(dateStr: string | Date | undefined | null): string {
  if (!dateStr) return 'N/A';
  return format(new Date(dateStr), 'd MMM, yyyy', { locale: es });
}

/** Format a "YYYY-MM" billing month string to "Enero 2025" style. */
export function formatBillingMonth(monthStr: string): string {
  if (!monthStr || !monthStr.includes('-')) return monthStr;
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  const formatted = format(date, 'MMMM yyyy', { locale: es });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

// ── Currency Formatters ──────────────────────────────

/** Format a number as USD currency: $1,234.56 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(amount));
}

/** Format a number as VES/Bolivares currency */
export function formatCurrencyBs(amount: number): string {
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'VES',
  }).format(Number(amount));
}

// ── Translation Helpers ──────────────────────────────

/** Translate payment method enum to Spanish label */
export function translatePaymentMethod(method: string): string {
  switch (method?.toLowerCase()) {
    case 'transferencia':
      return 'Transferencia Bancaria';
    case 'pago_movil':
      return 'Pago Móvil';
    case 'zelle':
      return 'Zelle';
    case 'efectivo':
      return 'Efectivo';
    default:
      return method || 'Otro';
  }
}

// ── Status Badge Helpers ─────────────────────────────

export interface StatusProps {
  color: string;
  text: string;
}

/** Get badge color and label for invoice status */
export function getInvoiceStatusProps(status: string): StatusProps {
  switch (status) {
    case 'PAID':
      return { color: '#16a34a', text: 'Pagada' };
    case 'PARTIAL':
      return { color: '#2563eb', text: 'Pagada Parcialmente' };
    case 'PENDING':
      return { color: '#ca8a04', text: 'Pendiente' };
    case 'CANCELLED':
      return { color: '#dc2626', text: 'Cancelada' };
    default:
      return { color: '#6b7f6b', text: status };
  }
}

/** Get badge color and label for payment status */
export function getPaymentStatusProps(status: string): StatusProps {
  switch (status) {
    case 'COMPLETED':
      return { color: '#16a34a', text: 'Completado' };
    case 'PROCESSING':
      return { color: '#ca8a04', text: 'Procesando' };
    case 'REJECTED':
      return { color: '#dc2626', text: 'Rechazado' };
    default:
      return { color: '#6b7f6b', text: status };
  }
}

/** Get badge color and label for surplus status */
export function getSurplusStatusProps(status: string): StatusProps {
  switch (status?.toLowerCase()) {
    case 'pending':
      return { color: '#ca8a04', text: 'Pendiente' };
    case 'applied':
      return { color: '#16a34a', text: 'Aplicado' };
    case 'refunded':
      return { color: '#2563eb', text: 'Reembolsado' };
    case 'cancelled':
      return { color: '#dc2626', text: 'Cancelado' };
    default:
      return { color: '#6b7f6b', text: status };
  }
}

/** Get color for contract status */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'ACTIVE':
      return '#16a34a';
    case 'INACTIVE':
      return '#dc2626';
    default:
      return '#6b7f6b';
  }
}

/** Get label for contract status */
export function getStatusText(status: string): string {
  switch (status) {
    case 'ACTIVE':
      return 'Activo';
    case 'INACTIVE':
      return 'Inactivo';
    default:
      return status;
  }
}
