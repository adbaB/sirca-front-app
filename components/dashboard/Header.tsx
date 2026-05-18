'use client';

import { useRouter, usePathname } from 'next/navigation';
import { LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  onMenuClick: () => void;
}

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': {
    title: 'Estadísticas de Pagos',
    subtitle: 'Resumen general de facturación y cobranzas',
  },
  '/dashboard/usuarios': {
    title: 'Gestión de Usuarios',
    subtitle: 'Administra usuarios, roles y permisos del sistema',
  },
  '/dashboard/roles': {
    title: 'Gestión de Roles',
    subtitle: 'Administra roles y permisos del sistema',
  },
};

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const pageInfo = PAGE_TITLES[pathname] ?? PAGE_TITLES['/dashboard'];

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    sessionStorage.removeItem('sirca-user');
    router.push('/login');
    router.refresh();
  };

  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white px-4 lg:px-8"
      style={{ borderBottom: '1px solid #e2ebe2' }}
    >
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl transition-colors"
          style={{ color: '#6b7f6b' }}
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h2 className="text-base lg:text-lg font-bold leading-tight" style={{ color: '#1a2e1a' }}>
            {pageInfo.title}
          </h2>
          <p className="text-[11px] hidden sm:block" style={{ color: '#6b7f6b' }}>
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      <Button variant="ghost" size="sm" onClick={handleLogout}>
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Cerrar Sesión</span>
      </Button>
    </header>
  );
}
