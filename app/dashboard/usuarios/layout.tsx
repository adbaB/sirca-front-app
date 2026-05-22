import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SIRCA — Gestión de Usuarios',
  description: 'Administra usuarios, roles y permisos del sistema SIRCA',
};

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
