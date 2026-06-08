'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '@/components/ui/Card';
import { STATUS_COLORS, STATUS_LABELS, formatUsd } from '@/lib/constants';
import type { PaymentBreakdown } from '@/lib/types';

interface PaymentStatusChartProps {
  breakdown: PaymentBreakdown[];
}

const COLORS_ORDER = ['verified', 'unverified', 'partial', 'pending'] as const;

interface TooltipPayloadItem {
  name: string;
  value: number;
  payload: {
    status: string;
    amountUsd: number;
    count: number;
  };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <div
      className="rounded-xl border bg-white px-4 py-3 shadow-lg"
      style={{ borderColor: '#e2ebe2' }}
    >
      <p className="text-sm font-semibold" style={{ color: '#1a2e1a' }}>
        {data.name}
      </p>
      <p className="text-xs mt-1" style={{ color: '#6b7f6b' }}>
        {data.payload.count} pagos · {formatUsd(data.payload.amountUsd)}
      </p>
    </div>
  );
}

function CustomLegend({ payload }: { payload?: Array<{ value: string; color: string }> }) {
  if (!payload) return null;
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-xs" style={{ color: '#6b7f6b' }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function PaymentStatusChart({ breakdown }: PaymentStatusChartProps) {
  const data = COLORS_ORDER.map((status) => {
    const item = breakdown.find((b) => b.status === status);
    return {
      name: STATUS_LABELS[status],
      value: item?.count ?? 0,
      status,
      amountUsd: item?.amountUsd ?? 0,
      count: item?.count ?? 0,
    };
  });

  return (
    <Card className="p-6 animate-[fadeIn_0.6s_ease-out]">
      <h3 className="text-sm font-bold mb-4" style={{ color: '#1a2e1a' }}>
        Distribución de Pagos
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={65}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry) => (
              <Cell
                key={entry.status}
                fill={STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
