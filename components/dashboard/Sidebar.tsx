'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
];

function SidebarContent({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  return (
    <aside className="flex h-full w-60 flex-col bg-white" style={{ borderRight: '1px solid #e2ebe2' }}>
      {/* Logo + close button (mobile) */}
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #e2ebe2' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.jpg" alt="SIRCA Planes de Salud" className="h-10 w-auto object-contain" />
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg transition-colors"
            style={{ color: '#6b7f6b' }}
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#9ca3af' }}>
          Menú
        </p>
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={onClose}
                  className="relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200"
                  style={isActive ? { backgroundColor: '#dcfce7', color: '#16a34a' } : { color: '#6b7f6b' }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#f1f5f1';
                      (e.currentTarget as HTMLAnchorElement).style.color = '#1a2e1a';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
                      (e.currentTarget as HTMLAnchorElement).style.color = '#6b7f6b';
                    }
                  }}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full" style={{ backgroundColor: '#16a34a' }} />
                  )}
                  <Icon className="h-[18px] w-[18px]" />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-5 py-4" style={{ borderTop: '1px solid #e2ebe2' }}>
        <p className="text-[10px]" style={{ color: '#d1d5db' }}>
          SIRCA Planes de Salud © {new Date().getFullYear()}
        </p>
      </div>
    </aside>
  );
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop: fixed sidebar ───────────────────────── */}
      <div className="hidden lg:block fixed left-0 top-0 z-40 h-screen">
        <SidebarContent pathname={pathname} />
      </div>

      {/* ── Mobile: overlay drawer ────────────────────────── */}
      {/* Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer panel */}
      <div
        className={`lg:hidden fixed left-0 top-0 z-50 h-full transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent pathname={pathname} onClose={onClose} />
      </div>
    </>
  );
}
