'use client';

import React, { useState } from 'react';
import { Pencil, Trash2, ChevronDown, UserCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { User, Role } from '@/lib/types';

interface UserRowProps {
  user: User;
  roles: Role[];
  isLast: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onAssignRole: (userId: string, roleId: string) => Promise<void>;
  actionLoading: boolean;
}

export function UserRow({ user, roles, isLast, onEdit, onDelete, onAssignRole, actionLoading }: UserRowProps) {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 items-center transition-all duration-200 hover:bg-[#f8faf8] group"
      style={isLast ? {} : { borderBottom: '1px solid #f1f5f1' }}
    >
      {/* User Info */}
      <div className="col-span-3 flex items-center gap-3">
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
          style={{
            background: user.isActive
              ? 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)'
              : 'linear-gradient(135deg, #9ca3af 0%, #d1d5db 100%)',
          }}
        >
          <UserCircle className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: '#1a2e1a' }}>
            {user.email}
          </p>
          <p className="text-xs truncate md:hidden" style={{ color: '#6b7f6b' }}>
            {user.role?.name ?? 'Sin rol'} {user.advisor ? `(${user.advisor.name})` : ''}
          </p>
        </div>
      </div>

      {/* Role */}
      <div className="col-span-2 hidden md:block relative">
        <button
          onClick={() => setShowRoleDropdown(!showRoleDropdown)}
          disabled={actionLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:shadow-sm disabled:opacity-50"
          style={{
            backgroundColor: user.role ? '#f0fdf4' : '#f9fafb',
            color: user.role ? '#16a34a' : '#9ca3af',
            border: `1px solid ${user.role ? '#bbf7d0' : '#e5e7eb'}`,
          }}
        >
          {user.role?.name ?? 'Sin rol'}
          <ChevronDown className="h-3 w-3" />
        </button>

        {/* Role Dropdown */}
        {showRoleDropdown && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowRoleDropdown(false)} />
            <div
              className="absolute top-full left-0 mt-1 z-20 bg-white rounded-xl shadow-lg border min-w-[180px] py-1 animate-[fadeIn_0.15s_ease-out]"
              style={{ borderColor: '#e2ebe2' }}
            >
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={async () => {
                     await onAssignRole(user.id, role.id);
                     setShowRoleDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm transition-colors duration-150 hover:bg-[#f0fdf4]"
                  style={{
                    color: user.roleId === role.id ? '#16a34a' : '#1a2e1a',
                    fontWeight: user.roleId === role.id ? 600 : 400,
                  }}
                >
                  {role.name}
                  {role.description && (
                    <span className="block text-[11px]" style={{ color: '#9ca3af' }}>
                      {role.description}
                    </span>
                  )}
                </button>
              ))}
              {roles.length === 0 && (
                <p className="px-4 py-2 text-xs" style={{ color: '#9ca3af' }}>
                  No hay roles disponibles
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Advisor */}
      <div className="col-span-2 hidden md:block">
        <p className="text-xs font-semibold" style={{ color: '#374151' }}>
          {user.advisor?.name ?? <span className="italic" style={{ color: '#9ca3af' }}>Sin asesor</span>}
        </p>
      </div>

      {/* Status */}
      <div className="col-span-2 hidden md:block">
        <Badge color={user.isActive ? '#16a34a' : '#dc2626'}>
          {user.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      </div>

      {/* ID */}
      <div className="col-span-1 hidden md:block">
        <p
          className="text-xs font-mono truncate"
          style={{ color: '#9ca3af' }}
          title={user.id}
        >
          {user.id.slice(0, 8)}...
        </p>
      </div>

      {/* Actions */}
      <div className="col-span-2 flex items-center justify-end gap-1">
        <button
          onClick={onEdit}
          className="p-2 rounded-lg transition-all duration-200 hover:bg-[#dbeafe] hover:scale-105"
          style={{ color: '#6b7f6b' }}
          title="Editar"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-lg transition-all duration-200 hover:bg-[#fef2f2] hover:scale-105"
          style={{ color: '#6b7f6b' }}
          title="Eliminar"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
