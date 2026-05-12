import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatUsd, formatBs, STATUS_COLORS, STATUS_LABELS } from '@/lib/constants';
import type { PaymentBreakdown } from '@/lib/types';

interface PaymentBreakdownTableProps {
  breakdown: PaymentBreakdown[];
}

export function PaymentBreakdownTable({ breakdown }: PaymentBreakdownTableProps) {
  return (
    <Card className="p-6 animate-[fadeIn_0.8s_ease-out]">
      <h3 className="text-sm font-bold mb-5" style={{ color: '#1a2e1a' }}>
        Desglose de Pagos
      </h3>

      <div className="overflow-x-auto -mx-2 px-2">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '2px solid #e2ebe2' }}>
              <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider" style={{ color: '#6b7f6b' }}>
                Estado
              </th>
              <th className="text-center py-3 px-4 text-xs font-bold uppercase tracking-wider" style={{ color: '#6b7f6b' }}>
                Cantidad
              </th>
              <th className="text-right py-3 px-4 text-xs font-bold uppercase tracking-wider" style={{ color: '#6b7f6b' }}>
                Monto USD
              </th>
              <th className="text-right py-3 px-4 text-xs font-bold uppercase tracking-wider" style={{ color: '#6b7f6b' }}>
                Monto Bs
              </th>
            </tr>
          </thead>
          <tbody>
            {breakdown.map((row) => (
              <tr
                key={row.status}
                className="transition-colors hover:bg-[#f8faf8]"
                style={{ borderBottom: '1px solid #f1f5f1' }}
              >
                <td className="py-3.5 px-4">
                  <Badge color={STATUS_COLORS[row.status]}>
                    {STATUS_LABELS[row.status]}
                  </Badge>
                </td>
                <td
                  className="py-3.5 px-4 text-center font-[family-name:var(--font-geist-mono)] font-medium"
                  style={{ color: '#374151' }}
                >
                  {row.count}
                </td>
                <td
                  className="py-3.5 px-4 text-right font-[family-name:var(--font-geist-mono)] font-semibold"
                  style={{ color: '#1a2e1a' }}
                >
                  {formatUsd(row.amountUsd)}
                </td>
                <td
                  className="py-3.5 px-4 text-right font-[family-name:var(--font-geist-mono)]"
                  style={{ color: '#6b7f6b' }}
                >
                  {formatBs(row.amountBs)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
