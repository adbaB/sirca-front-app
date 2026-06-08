'use client';

import { Badge } from '@/components/ui/Badge';
import { usePermissions } from '@/hooks/usePermissions';
import type { Role } from '@/lib/types';
import { Key, Shield } from 'lucide-react';

interface RoleRowProps {
  role: Role;
  isLast: boolean;
  onAssignPermissions: (role: Role) => void;
  actionLoading: boolean;
}

export function RoleRow({ role, isLast, onAssignPermissions, actionLoading }: RoleRowProps) {
  const permCount = role.permissions?.length ?? 0;
  const { can } = usePermissions();
  const canUpdateRoles = can('update:roles');
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 items-center transition-all duration-200 hover:bg-[#f8faf8] group"
      style={isLast ? {} : { borderBottom: '1px solid #f1f5f1' }}
    >
      {/* Role Info */}
      <div className="col-span-5 flex items-center gap-3">
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)' }}
        >
          <Shield className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: '#1a2e1a' }}>
            {role.name}
          </p>
          {role.description && (
            <p className="text-xs truncate" style={{ color: '#6b7f6b' }}>
              {role.description}
            </p>
          )}
        </div>
      </div>

      {/* Permissions */}
      <div className="col-span-4 hidden md:flex items-center gap-2 flex-wrap">
        {permCount > 0 ? (
          <>
            <Badge color="#7c3aed">
              {permCount} {permCount === 1 ? 'permiso' : 'permisos'}
            </Badge>
          </>
        ) : (
          <span className="text-xs" style={{ color: '#9ca3af' }}>
            Sin permisos asignados
          </span>
        )}
      </div>

      {/* ID */}
      <div className="col-span-2 hidden md:block">
        <p className="text-xs font-mono truncate" style={{ color: '#9ca3af' }} title={role.id}>
          {role.id.slice(0, 8)}...
        </p>
      </div>

      {/* Actions */}
      <div className="col-span-1 flex items-center justify-end">
        <button
          onClick={() => {
            if (canUpdateRoles) onAssignPermissions(role);
          }}
          disabled={actionLoading || !canUpdateRoles}
          className="p-2 rounded-lg transition-all duration-200 hover:bg-[#f5f3ff] hover:scale-105 disabled:opacity-50"
          style={{ color: '#7c3aed' }}
          title="Asignar permisos"
        >
          <Key className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
