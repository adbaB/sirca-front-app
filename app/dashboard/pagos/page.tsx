import { PaymentsManager } from '@/components/dashboard/payments/PaymentsManager';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pagos | SIRCA',
  description: 'Gestión y verificación de pagos del sistema SIRCA',
};

export default function PaymentsPage() {
  return (
    <div className="mx-auto max-w-400 w-full">
      <PaymentsManager />
    </div>
  );
}
