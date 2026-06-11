import { PortfoliosManager } from '@/components/dashboard/portfolios/PortfoliosManager';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gestión de Carteras | SIRCA',
  description: 'Administra las carteras de contratos del sistema',
};

export default function PortfoliosPage() {
  return (
    <div className="mx-auto max-w-8xl">
      <PortfoliosManager />
    </div>
  );
}
