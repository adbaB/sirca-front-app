'use client';

import React, { useState, useEffect } from 'react';
import { Check, Search } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import type { Role, Permission } from '@/lib/types';

interface RolePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (permissionIds: string[]) => Promise<void>;
  role: Role | null;
  loading: boolean;
  error: string;
}

function PermissionsInner({
  onClose,
  onSubmit,
  role,
  loading,
  error,
}: Omit<RolePermissionsModalProps, 'isOpen'>) {
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [fetchingPerms, setFetchingPerms] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(
    new Set(role?.permissions?.map((p) => p.id) ?? []),
  );
  const [search, setSearch] = useState('');

  // Load all available permissions from backend
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setFetchingPerms(true);
        const data = await api.get<{ data: Permission[] }>('/permissions?limit=1000');
        if (!cancelled) setAllPermissions(data?.data || []);
      } catch {
        // silently fail — user will see empty list
      } finally {
        if (!cancelled) setFetchingPerms(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  console.log(allPermissions);
  const filtered = allPermissions.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description ?? '').toLowerCase().includes(search.toLowerCase()),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(Array.from(selected));
  };

  // Group permissions by prefix (e.g. "users:read" → "users")
  const groups = filtered.reduce<Record<string, Permission[]>>((acc, p) => {
    const group = p.name.includes(':') ? p.name.split(':')[0] : 'general';
    if (!acc[group]) acc[group] = [];
    acc[group].push(p);
    return acc;
  }, {});

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Info banner */}
      <div
        className="flex items-center gap-3 rounded-xl px-4 py-3"
        style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}
      >
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: '#dcfce7' }}
        >
          <Check className="h-4 w-4" style={{ color: '#16a34a' }} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold" style={{ color: '#1a2e1a' }}>
            Rol: <span style={{ color: '#16a34a' }}>{role?.name}</span>
          </p>
          <p className="text-xs" style={{ color: '#6b7f6b' }}>
            {selected.size}{' '}
            {selected.size === 1 ? 'permiso seleccionado' : 'permisos seleccionados'}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <div
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: '#9ca3af' }}
        >
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          placeholder="Buscar permiso..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border text-sm py-2.5 pl-10 pr-4 focus:outline-none transition-all duration-200"
          style={{ borderColor: '#e2ebe2', color: '#1a2e1a' }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#16a34a';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#e2ebe2';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Permissions list */}
      <div
        className="overflow-y-auto rounded-xl border flex flex-col gap-0"
        style={{ maxHeight: '320px', borderColor: '#e2ebe2' }}
      >
        {fetchingPerms ? (
          <Spinner className="py-10" />
        ) : filtered.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: '#9ca3af' }}>
            {search ? 'No se encontraron permisos' : 'No hay permisos disponibles'}
          </p>
        ) : (
          Object.entries(groups).map(([group, perms]) => (
            <div key={group}>
              {/* Group header */}
              <div
                className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest sticky top-0"
                style={{
                  backgroundColor: '#f8faf8',
                  color: '#9ca3af',
                  borderBottom: '1px solid #f1f5f1',
                }}
              >
                {group}
              </div>
              {perms.map((perm) => {
                const isChecked = selected.has(perm.id);
                return (
                  <label
                    key={perm.id}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-150 hover:bg-[#f0fdf4]"
                    style={{ borderBottom: '1px solid #f9fafb' }}
                  >
                    {/* Custom checkbox */}
                    <span
                      className="relative shrink-0 h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all duration-200"
                      style={{
                        backgroundColor: isChecked ? '#16a34a' : 'white',
                        borderColor: isChecked ? '#16a34a' : '#d1d5db',
                      }}
                    >
                      {isChecked && <Check className="h-3 w-3 text-white" />}
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggle(perm.id)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        aria-label={perm.name}
                      />
                    </span>
                    <div className="min-w-0">
                      <p
                        className="text-sm font-medium animate-fade-in"
                        style={{ color: '#1a2e1a' }}
                      >
                        {perm.description || perm.name}
                      </p>
                      {perm.description && (
                        <p className="text-[11px] font-mono mt-0.5" style={{ color: '#8c9e8c' }}>
                          Código técnico: {perm.name}
                        </p>
                      )}
                    </div>
                    {isChecked && (
                      <Badge color="#16a34a" className="ml-auto shrink-0">
                        activo
                      </Badge>
                    )}
                  </label>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Error */}
      <ErrorBanner message={error} />

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-1">
        <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          Guardar Permisos
        </Button>
      </div>
    </form>
  );
}

export function RolePermissionsModal({
  isOpen,
  onClose,
  onSubmit,
  role,
  loading,
  error,
}: RolePermissionsModalProps) {
  const modalKey = isOpen && role ? role.id : 'closed';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Asignar Permisos" maxWidth="540px">
      <PermissionsInner
        key={modalKey}
        onClose={onClose}
        onSubmit={onSubmit}
        role={role}
        loading={loading}
        error={error}
      />
    </Modal>
  );
}
