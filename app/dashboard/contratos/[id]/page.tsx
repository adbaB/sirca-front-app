import { Metadata } from 'next';
import { ContractDetails } from '@/components/dashboard/contracts/ContractDetails';

export const metadata: Metadata = {
  title: 'Detalles de Contrato | SIRCA',
  description: 'Detalles del contrato en el sistema SIRCA',
};

export default async function ContractDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-7xl">
      <ContractDetails contractId={id} />
    </div>
  );
}
