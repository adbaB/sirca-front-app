'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import type { MonthlyTrend } from '@/lib/types';

interface MonthlyTrendChartProps {
  data: MonthlyTrend[];
}

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl border bg-white px-4 py-3 shadow-lg"
      style={{ borderColor: '#e2ebe2' }}
    >
      <p className="text-xs font-bold mb-2" style={{ color: '#1a2e1a' }}>
        {label}
      </p>
      {payload.map((item) => (
        <div key={item.name} className="flex items-center gap-2 text-xs">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
          <span style={{ color: '#6b7f6b' }}>{item.name}:</span>
          <span className="font-semibold" style={{ color: '#1a2e1a' }}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  return (
    <Card className="p-6 animate-[fadeIn_0.7s_ease-out]">
      <h3 className="text-sm font-bold mb-4" style={{ color: '#1a2e1a' }}>
        Tendencia Mensual
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id="gradVerified" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16a34a" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradPending" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2ebe2" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: 16 }}
            formatter={(value: string) => (
              <span style={{ color: '#6b7f6b', fontSize: '12px' }}>{value}</span>
            )}
          />
          <Area
            type="monotone"
            dataKey="verified"
            name="Verificados"
            stroke="#16a34a"
            strokeWidth={2.5}
            fill="url(#gradVerified)"
          />
          <Area
            type="monotone"
            dataKey="pending"
            name="Pendientes"
            stroke="#f97316"
            strokeWidth={2.5}
            fill="url(#gradPending)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
