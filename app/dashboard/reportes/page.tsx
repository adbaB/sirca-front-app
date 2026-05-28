import { ReportsPanel } from '@/components/dashboard/reports/ReportsPanel';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reportes | SIRCA',
  description: 'Centro de reportes del sistema SIRCA',
};

export default function ReportsPage() {
  return (
    <div className="mx-auto max-w-400 w-full">
      <ReportsPanel />
    </div>
  );
}
