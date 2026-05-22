import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SIRCA — Gestión de Roles',
  description: 'Administraroles y permisos del sistema SIRCA',
};

export default function RolesLayout({ children }: { children: React.ReactNode }) {
  return children;
}