import { PlansManager } from '@/components/dashboard/plans/PlansManager';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gestión de Planes | SIRCA',
  description: 'Administra los planes de salud del sistema',
};

export default function PlansPage() {
  return (
    <div className="mx-auto max-w-8xl">
      <PlansManager />
    </div>
  );
}
