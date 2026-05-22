import { Metadata } from 'next';
import { ContractsManager } from '@/components/dashboard/contracts/ContractsManager';

export const metadata: Metadata = {
  title: 'Contratos | SIRCA',
  description: 'Gestión de contratos del sistema SIRCA',
};

export default function ContractsPage() {
  return (
    <div className="mx-auto max-w-8xl">
      <ContractsManager />
    </div>
  );
}
