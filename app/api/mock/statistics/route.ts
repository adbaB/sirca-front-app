import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Deterministic-ish seed from filters so different
 * filter combos produce different (but consistent) data.
 */
function seed(monthBilling: string, advisorUuid: string): number {
  const str = `${monthBilling}-${advisorUuid}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function vary(base: number, s: number, range: number): number {
  return Math.max(1, base + ((s % (range * 2 + 1)) - range));
}

function varyAmount(base: number, s: number, range: number): number {
  return Math.max(100, +(base + ((s % (range * 2 + 1)) - range)).toFixed(2));
}

const MONTH_SHORT = [
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const monthBilling = searchParams.get('month_billing') ?? '2026-05';
  const advisorUuid = searchParams.get('advisor_uuid') ?? 'all';

  const s = seed(monthBilling, advisorUuid);

  const totalPaymentsVerified = vary(45, s, 15);
  const totalPaymentsUnverified = vary(12, s >> 3, 6);
  const totalPaymentsPartial = vary(8, s >> 5, 4);
  const totalPaymentsPending = vary(15, s >> 7, 8);

  const totalAmountVerifiedUsd = varyAmount(12450, s >> 2, 4000);
  const totalAmountUnverifiedUsd = varyAmount(3200.5, s >> 4, 1500);
  const totalPendingUsd = varyAmount(5800, s >> 6, 2000);
  const totalToPayUsd = +(
    totalAmountVerifiedUsd +
    totalAmountUnverifiedUsd +
    totalPendingUsd
  ).toFixed(2);

  const bsRate = 45; // Simulated Bs/USD rate

  // Parse the target month to generate trend up to that month
  const [, monthStr] = monthBilling.split('-');
  const targetMonth = parseInt(monthStr || '5', 10);

  const monthlyTrend = [];
  for (let i = 0; i < targetMonth; i++) {
    const ms = seed(monthBilling, `${advisorUuid}-${i}`);
    monthlyTrend.push({
      month: MONTH_SHORT[i],
      verified: vary(40, ms, 12),
      pending: vary(16, ms >> 3, 8),
    });
  }

  const data = {
    summary: {
      totalPaymentsVerified,
      totalPaymentsUnverified,
      totalPaymentsPartial,
      totalPaymentsPending,
      totalAmountVerifiedUsd,
      totalAmountUnverifiedUsd,
      totalPendingUsd,
      totalToPayUsd,
    },
    breakdown: [
      {
        status: 'verified',
        count: totalPaymentsVerified,
        amountUsd: totalAmountVerifiedUsd,
        amountBs: +(totalAmountVerifiedUsd * bsRate).toFixed(2),
      },
      {
        status: 'unverified',
        count: totalPaymentsUnverified,
        amountUsd: totalAmountUnverifiedUsd,
        amountBs: +(totalAmountUnverifiedUsd * bsRate).toFixed(2),
      },
      {
        status: 'partial',
        count: totalPaymentsPartial,
        amountUsd: varyAmount(2100, s >> 8, 800),
        amountBs: +(varyAmount(2100, s >> 8, 800) * bsRate).toFixed(2),
      },
      {
        status: 'pending',
        count: totalPaymentsPending,
        amountUsd: totalPendingUsd,
        amountBs: +(totalPendingUsd * bsRate).toFixed(2),
      },
    ],
    monthlyTrend,
  };

  return NextResponse.json(data);
}
