'use client';

import React, { useState } from 'react';
import { Search, Plus, Shield, ShieldCheck, Key } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { Spinner } from '@/components/ui/Spinner';
import { RoleRow } from './RoleRow';
import { RoleFormModal } from './RoleFormModal';
import { RolePermissionsModal } from './RolePermissionsModal';
import { useRolesCrud } from '@/hooks/useRolesCrud';
import type { Role } from '@/lib/types';
import { Can } from '@/components/ui/Can';

export function RolesManager() {
  const { roles, loading, createRole, assignPermissions } = useRolesCrud();

  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [permissionsRole, setPermissionsRole] = useState<Role | null>(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  // Filtered roles
  const filteredRoles = roles.filter((role) => {
    return (
      role.name.toLowerCase().includes(search.toLowerCase()) ||
      (role.description ?? '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalPermissions = roles.reduce((acc, r) => acc + (r.permissions?.length ?? 0), 0);

  const handleCreate = async (data: { name: string; description?: string }) => {
    setActionLoading(true);
    setActionError('');
    try {
      await createRole(data);
      setShowCreateModal(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Error creando rol');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignPermissions = async (permissionIds: string[]) => {
    if (!permissionsRole) return;
    setActionLoading(true);
    setActionError('');
    try {
      await assignPermissions(permissionsRole.id, permissionIds);
      setPermissionsRole(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Error asignando permisos');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Can any={['read:roles', 'create:roles', 'update:roles', 'delete:roles']}>
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1a2e1a' }}>
              Gestión de Roles
            </h1>
            <p className="text-sm mt-1" style={{ color: '#6b7f6b' }}>
              Crea roles y asigna permisos para controlar el acceso al sistema
            </p>
          </div>
          <Can permission="create:roles">
            <Button
              onClick={() => {
                setActionError('');
                setShowCreateModal(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Nuevo Rol
            </Button>
          </Can>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5" hover>
            <div className="flex items-center gap-4">
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#dcfce7' }}
              >
                <ShieldCheck className="h-6 w-6" style={{ color: '#16a34a' }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#1a2e1a' }}>
                  {roles.length}
                </p>
                <p className="text-xs font-medium" style={{ color: '#6b7f6b' }}>
                  Total Roles
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5" hover>
            <div className="flex items-center gap-4">
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#f5f3ff' }}
              >
                <Key className="h-6 w-6" style={{ color: '#7c3aed' }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#1a2e1a' }}>
                  {totalPermissions}
                </p>
                <p className="text-xs font-medium" style={{ color: '#6b7f6b' }}>
                  Permisos Asignados
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5" hover>
            <div className="flex items-center gap-4">
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#fef9c3' }}
              >
                <Shield className="h-6 w-6" style={{ color: '#ca8a04' }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#1a2e1a' }}>
                  {roles.filter((r) => (r.permissions?.length ?? 0) === 0).length}
                </p>
                <p className="text-xs font-medium" style={{ color: '#6b7f6b' }}>
                  Sin permisos
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filter Bar */}
        <Card className="p-4">
          <Input
            id="search-roles"
            label=""
            type="text"
            placeholder="Buscar por nombre o descripción..."
            icon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Card>

        {/* Error Banner */}
        <ErrorBanner message={actionError} onClose={() => setActionError('')} />

        {/* Roles Table */}
        {loading ? (
          <Spinner className="py-24" />
        ) : filteredRoles.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <div
                className="mx-auto h-16 w-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: '#f1f5f1' }}
              >
                <Shield className="h-8 w-8" style={{ color: '#9ca3af' }} />
              </div>
              <h3 className="text-base font-semibold mb-1" style={{ color: '#1a2e1a' }}>
                {search ? 'No se encontraron roles' : 'Sin roles registrados'}
              </h3>
              <p className="text-sm" style={{ color: '#6b7f6b' }}>
                {search ? 'Intenta ajustar la búsqueda' : 'Crea el primer rol para comenzar'}
              </p>
            </div>
          </Card>
        ) : (
          <Card>
            {/* Table Header */}
            <div
              className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-wider"
              style={{ color: '#6b7f6b', borderBottom: '1px solid #e2ebe2' }}
            >
              <div className="col-span-5">Rol</div>
              <div className="col-span-4">Permisos</div>
              <div className="col-span-2">ID</div>
              <div className="col-span-1 text-right">
                <Key className="h-3.5 w-3.5 inline" />
              </div>
            </div>

            {/* Rows */}
            <div>
              {filteredRoles.map((role, index) => (
                <RoleRow
                  key={role.id}
                  role={role}
                  isLast={index === filteredRoles.length - 1}
                  onAssignPermissions={(r) => {
                    setActionError('');
                    setPermissionsRole(r);
                  }}
                  actionLoading={actionLoading}
                />
              ))}
            </div>

            {/* Footer */}
            <div
              className="px-6 py-3 flex items-center justify-between"
              style={{ borderTop: '1px solid #e2ebe2' }}
            >
              <p className="text-xs" style={{ color: '#6b7f6b' }}>
                Mostrando{' '}
                <span className="font-semibold" style={{ color: '#1a2e1a' }}>
                  {filteredRoles.length}
                </span>{' '}
                de {roles.length} roles
              </p>
              <Badge color="#7c3aed">{totalPermissions} permisos totales</Badge>
            </div>
          </Card>
        )}

        {/* Create Modal */}
        <RoleFormModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
          loading={actionLoading}
          error={actionError}
        />

        {/* Permissions Modal */}
        <Can permission="update:roles">
          <RolePermissionsModal
            isOpen={!!permissionsRole}
            onClose={() => setPermissionsRole(null)}
            onSubmit={handleAssignPermissions}
            role={permissionsRole}
            loading={actionLoading}
            error={actionError}
          />
        </Can>
      </div>
    </Can>
  );
}
