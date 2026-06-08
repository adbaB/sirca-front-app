'use client';

import React, { useState } from 'react';
import { Search, Plus, Shield, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { Spinner } from '@/components/ui/Spinner';
import { UserRow } from './UserRow';
import { UserFormModal } from './UserFormModal';
import { DeleteUserModal } from './DeleteUserModal';
import { useUsers } from '@/hooks/useUsers';
import { useRolesCrud } from '@/hooks/useRolesCrud';
import type { User } from '@/lib/types';
import { Can } from '@/components/ui/Can';

export function UsersManager() {
  const { users, loading, createUser, updateUser, deleteUser, assignRole } = useUsers();
  const { roles } = useRolesCrud();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // Action feedback
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  // Filtered users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role?.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && user.isActive) ||
      (filterStatus === 'inactive' && !user.isActive);
    return matchesSearch && matchesStatus;
  });

  const activeCount = users.filter((u) => u.isActive).length;
  const inactiveCount = users.filter((u) => !u.isActive).length;

  const handleCreate = async (data: {
    email: string;
    password?: string;
    roleId?: string;
    advisorId?: string | null;
  }) => {
    setActionLoading(true);
    setActionError('');
    try {
      if (!data.password) {
        throw new Error('La contraseña es obligatoria');
      }
      await createUser({
        email: data.email,
        password: data.password,
        roleId: data.roleId,
        advisorId: data.advisorId,
      });
      setShowCreateModal(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Error creando usuario');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (
    id: string,
    data: { email?: string; isActive?: boolean; roleId?: string | null; advisorId?: string | null },
  ) => {
    setActionLoading(true);
    setActionError('');
    try {
      await updateUser(id, data);
      setEditingUser(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Error actualizando usuario');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(true);
    setActionError('');
    try {
      await deleteUser(id);
      setDeletingUser(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Error eliminando usuario');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignRole = async (userId: string, roleId: string) => {
    setActionLoading(true);
    setActionError('');
    try {
      await assignRole(userId, roleId);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Error asignando rol');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Can any={['read:users', 'create:users', 'update:users', 'delete:users']}>
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1a2e1a' }}>
              Gestión de Usuarios
            </h1>
            <p className="text-sm mt-1" style={{ color: '#6b7f6b' }}>
              Administra usuarios, asigna roles y controla el acceso al sistema
            </p>
          </div>
          <Can permission="create:users">
            <Button
              onClick={() => {
                setActionError('');
                setShowCreateModal(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Nuevo Usuario
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
                  {users.length}
                </p>
                <p className="text-xs font-medium" style={{ color: '#6b7f6b' }}>
                  Total Usuarios
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5" hover>
            <div className="flex items-center gap-4">
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#dbeafe' }}
              >
                <Shield className="h-6 w-6" style={{ color: '#2563eb' }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#1a2e1a' }}>
                  {activeCount}
                </p>
                <p className="text-xs font-medium" style={{ color: '#6b7f6b' }}>
                  Activos
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5" hover>
            <div className="flex items-center gap-4">
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#fef2f2' }}
              >
                <Shield className="h-6 w-6" style={{ color: '#dc2626' }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#1a2e1a' }}>
                  {inactiveCount}
                </p>
                <p className="text-xs font-medium" style={{ color: '#6b7f6b' }}>
                  Inactivos
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filter Bar */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                id="search-users"
                label=""
                type="text"
                placeholder="Buscar por email o rol..."
                icon={<Search className="h-4 w-4" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 items-end">
              {(['all', 'active', 'inactive'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                  style={
                    filterStatus === status
                      ? {
                          backgroundColor: '#dcfce7',
                          color: '#16a34a',
                          border: '1px solid #bbf7d0',
                        }
                      : {
                          backgroundColor: '#f1f5f1',
                          color: '#6b7f6b',
                          border: '1px solid #e2ebe2',
                        }
                  }
                >
                  {status === 'all' ? 'Todos' : status === 'active' ? 'Activos' : 'Inactivos'}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Error Banner */}
        <ErrorBanner message={actionError} onClose={() => setActionError('')} />

        {/* Users Table */}
        {loading ? (
          <Spinner className="py-24" />
        ) : filteredUsers.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <div
                className="mx-auto h-16 w-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: '#f1f5f1' }}
              >
                <Shield className="h-8 w-8" style={{ color: '#9ca3af' }} />
              </div>
              <h3 className="text-base font-semibold mb-1" style={{ color: '#1a2e1a' }}>
                {search || filterStatus !== 'all'
                  ? 'No se encontraron usuarios'
                  : 'Sin usuarios registrados'}
              </h3>
              <p className="text-sm" style={{ color: '#6b7f6b' }}>
                {search || filterStatus !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Crea el primer usuario para comenzar'}
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
              <div className="col-span-3">Usuario</div>
              <div className="col-span-2">Rol</div>
              <div className="col-span-2">Asesor</div>
              <div className="col-span-2">Estado</div>
              <div className="col-span-1">ID</div>
              <div className="col-span-2 text-right">Acciones</div>
            </div>

            {/* Rows */}
            <div>
              {filteredUsers.map((user, index) => (
                <UserRow
                  key={user.id}
                  user={user}
                  roles={roles}
                  isLast={index === filteredUsers.length - 1}
                  onEdit={() => {
                    setActionError('');
                    setEditingUser(user);
                  }}
                  onDelete={() => {
                    setActionError('');
                    setDeletingUser(user);
                  }}
                  onAssignRole={handleAssignRole}
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
                  {filteredUsers.length}
                </span>{' '}
                de {users.length} usuarios
              </p>
              <div className="flex gap-2">
                <Badge color="#16a34a">{activeCount} activos</Badge>
                <Badge color="#dc2626">{inactiveCount} inactivos</Badge>
              </div>
            </div>
          </Card>
        )}

        {/* Create Modal */}
        <UserFormModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
          roles={roles}
          loading={actionLoading}
          error={actionError}
        />

        {/* Edit Modal */}
        {editingUser && (
          <Can permission="update:users">
            <UserFormModal
              isOpen={true}
              onClose={() => setEditingUser(null)}
              onSubmit={(data) => handleUpdate(editingUser.id, data)}
              roles={roles}
              loading={actionLoading}
              error={actionError}
              user={editingUser}
            />
          </Can>
        )}

        {/* Delete Confirmation */}
        {deletingUser && (
          <Can permission="delete:users">
            <DeleteUserModal
              isOpen={true}
              onClose={() => setDeletingUser(null)}
              onConfirm={() => handleDelete(deletingUser.id)}
              user={deletingUser}
              loading={actionLoading}
            />
          </Can>
        )}
      </div>
    </Can>
  );
}
