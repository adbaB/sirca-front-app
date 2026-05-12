'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { formatUsd } from '@/lib/constants';

interface PartialPaymentChartProps {
  totalCollected: number;
  totalInvoiceAmount: number;
  totalPaymentsPartial: number;
}

interface TooltipPayloadItem {
  name: string;
  value: number;
  payload: { label: string; value: number; color: string };
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      className="rounded-xl border bg-white px-4 py-3 shadow-lg"
      style={{ borderColor: '#e2ebe2' }}
    >
      <p className="text-xs font-bold mb-1" style={{ color: '#1a2e1a' }}>
        {d.label}
      </p>
      <p
        className="text-sm font-semibold font-[family-name:var(--font-geist-mono)]"
        style={{ color: d.color }}
      >
        {formatUsd(d.value)}
      </p>
    </div>
  );
}

export function PartialPaymentChart({
  totalCollected,
  totalInvoiceAmount,
  totalPaymentsPartial,
}: PartialPaymentChartProps) {
  const remaining = Math.max(0, totalInvoiceAmount - totalCollected);
  const progressPercent =
    totalInvoiceAmount > 0
      ? Math.min(100, (totalCollected / totalInvoiceAmount) * 100)
      : 0;

  const chartData = [
    {
      label: 'Cobrado',
      value: totalCollected,
      color: '#16a34a',
    },
    {
      label: 'Total facturado',
      value: totalInvoiceAmount,
      color: '#f97316',
    },
    {
      label: 'Saldo pendiente',
      value: remaining,
      color: '#dc2626',
    },
  ];

  return (
    <Card className="p-6 animate-[fadeIn_0.6s_ease-out]">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold" style={{ color: '#1a2e1a' }}>
            Cobrado vs Total Facturado
          </h3>
          <p className="text-xs mt-0.5" style={{ color: '#6b7f6b' }}>
            {totalPaymentsPartial} factura{totalPaymentsPartial !== 1 ? 's' : ''} con pago parcial
          </p>
        </div>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-lg font-[family-name:var(--font-geist-mono)]"
          style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}
        >
          {progressPercent.toFixed(1)}% cobrado
        </span>
      </div>

      {/* Bar chart */}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={chartData}
          margin={{ top: 4, right: 8, left: -10, bottom: 0 }}
          barCategoryGap="35%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2ebe2" vertical={false} />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f1' }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {chartData.map((entry) => (
              <Cell key={entry.label} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Progress bar */}
      <div className="mt-5 pt-4" style={{ borderTop: '1px solid #e2ebe2' }}>
        <div className="flex justify-between mb-1.5">
          <span className="text-xs" style={{ color: '#6b7f6b' }}>
            Cobrado:{' '}
            <strong className="font-[family-name:var(--font-geist-mono)] text-[#16a34a]">
              {formatUsd(totalCollected)}
            </strong>
          </span>
          <span className="text-xs" style={{ color: '#6b7f6b' }}>
            Total facturado:{' '}
            <strong className="font-[family-name:var(--font-geist-mono)] text-[#f97316]">
              {formatUsd(totalInvoiceAmount)}
            </strong>
          </span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: '#e2ebe2' }}>
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #16a34a, #f97316)',
            }}
          />
        </div>
        <p className="text-xs mt-1.5 text-right" style={{ color: '#dc2626' }}>
          Saldo pendiente:{' '}
          <span className="font-semibold font-[family-name:var(--font-geist-mono)]">
            {formatUsd(remaining)}
          </span>
        </p>
      </div>
    </Card>
  );
}
