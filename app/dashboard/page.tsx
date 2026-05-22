'use client';

import { useState } from 'react';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { KpiGrid } from '@/components/dashboard/KpiGrid';
import { PaymentStatusChart } from '@/components/dashboard/PaymentStatusChart';
import { PartialPaymentChart } from '@/components/dashboard/PartialPaymentChart';
import { PaymentBreakdownTable } from '@/components/dashboard/PaymentBreakdownTable';
import { Spinner } from '@/components/ui/Spinner';
import { useAdvisors } from '@/hooks/useAdvisors';
import { useStatistics } from '@/hooks/useStatistics';
import type { DashboardFilters } from '@/lib/types';
import { Can } from '@/components/ui/Can';

const now = new Date();

export default function DashboardPage() {
  const [filters, setFilters] = useState<DashboardFilters>({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    advisorUuid: 'all',
  });

  const { advisors } = useAdvisors();
  const { data, loading } = useStatistics(filters);

  return (
    <div className="flex flex-col gap-6">
      <Can permission='read:statistics'>
      {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          advisors={advisors}
          loading={loading}
        />

        {loading || !data ? (
          <Spinner className="py-24" />
        ) : (
          <>
            {/* KPI Cards */}
            <KpiGrid summary={data.summary} />

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <PaymentStatusChart breakdown={data.breakdown} />
              <PartialPaymentChart
                totalCollected={data.summary.totalCollected}
                totalInvoiceAmount={data.summary.totalInvoiceAmount}
                totalPaymentsPartial={data.summary.totalPaymentsPartial}
              />
          </div>

            {/* Breakdown Table */}
          <PaymentBreakdownTable breakdown={data.breakdown} />
          </>
        )}
      </Can>
      
    </div>
  );
}
