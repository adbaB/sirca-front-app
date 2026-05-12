'use client';

import { Calendar, Users } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { MONTHS, YEARS } from '@/lib/constants';
import type { Advisor, DashboardFilters } from '@/lib/types';

interface FilterBarProps {
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
  advisors: Advisor[];
  loading?: boolean;
}

export function FilterBar({ filters, onFiltersChange, advisors, loading }: FilterBarProps) {
  const updateFilter = (key: keyof DashboardFilters, value: string | number) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div
      className={`
        flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border bg-white
        transition-opacity duration-300
        ${loading ? 'opacity-60' : 'opacity-100'}
      `}
      style={{ borderColor: '#e2ebe2' }}
    >
      <div className="flex-1 min-w-[140px]">
        <Select
          id="filter-year"
          label="Año"
          icon={<Calendar className="h-4 w-4" />}
          options={YEARS.map((y) => ({ value: String(y), label: String(y) }))}
          value={String(filters.year)}
          onChange={(v) => updateFilter('year', Number(v))}
        />
      </div>

      <div className="flex-1 min-w-[160px]">
        <Select
          id="filter-month"
          label="Mes"
          icon={<Calendar className="h-4 w-4" />}
          options={MONTHS.map((m) => ({ value: String(m.value), label: m.label }))}
          value={String(filters.month)}
          onChange={(v) => updateFilter('month', Number(v))}
        />
      </div>

      <div className="flex-1 min-w-[200px]">
        <Select
          id="filter-advisor"
          label="Asesor"
          icon={<Users className="h-4 w-4" />}
          options={[
            { value: 'all', label: 'Todos los asesores' },
            ...advisors.map((a) => ({ value: a.id, label: a.name })),
          ]}
          value={filters.advisorUuid}
          onChange={(v) => updateFilter('advisorUuid', v)}
        />
      </div>
    </div>
  );
}
