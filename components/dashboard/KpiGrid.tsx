import { CheckCircle, AlertCircle, Clock, XCircle, DollarSign, Banknote } from 'lucide-react';
import { KpiCard } from './KpiCard';
import { formatUsd, STATUS_COLORS } from '@/lib/constants';
import type { StatisticsSummary } from '@/lib/types';

interface KpiGridProps {
  summary: StatisticsSummary;
}

export function KpiGrid({ summary }: KpiGridProps) {
  const cards = [
    {
      title: 'Pagos Verificados',
      value: String(summary.totalPaymentsVerified),
      icon: <CheckCircle className="h-5 w-5" />,
      color: STATUS_COLORS.verified,
      subtitle: 'Realizados y verificados',
    },
    {
      title: 'Sin Verificar',
      value: String(summary.totalPaymentsUnverified),
      icon: <AlertCircle className="h-5 w-5" />,
      color: STATUS_COLORS.unverified,
      subtitle: 'Realizados pero sin verificar',
    },
    {
      title: 'Pagos Parciales',
      value: String(summary.totalPaymentsPartial),
      icon: <Clock className="h-5 w-5" />,
      color: STATUS_COLORS.partial,
      subtitle: 'Pagos parciales realizados',
    },
    {
      title: 'Pagos Pendientes',
      value: String(summary.totalPaymentsPending),
      icon: <XCircle className="h-5 w-5" />,
      color: STATUS_COLORS.pending,
      subtitle: 'Sin realizar pago',
    },
    {
      title: 'Total Verificado',
      value: formatUsd(summary.totalAmountVerifiedUsd),
      icon: <DollarSign className="h-5 w-5" />,
      color: STATUS_COLORS.verified,
      subtitle: 'Monto confirmado en USD',
    },
    {
      title: 'Total Sin Verificar',
      value: formatUsd(summary.totalAmountUnverifiedUsd),
      icon: <Banknote className="h-5 w-5" />,
      color: STATUS_COLORS.unverified,
      subtitle: 'Monto pendiente de verificación',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <KpiCard key={card.title} {...card} />
      ))}
    </div>
  );
}
