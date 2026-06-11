'use client';

import React from 'react';
import { Layers, Edit2, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Can } from '@/components/ui/Can';
import type { Plan } from '@/lib/types';

interface PlanRowProps {
  plan: Plan;
  isLast: boolean;
  onEdit: (plan: Plan) => void;
  onDelete: (plan: Plan) => void;
  actionLoading: boolean;
}

export function PlanRow({
  plan,
  isLast,
  onEdit,
  onDelete,
  actionLoading,
}: PlanRowProps) {
  const getStatusColor = (status: string) => {
    return status === 'ACTIVE' ? '#16a34a' : '#dc2626';
  };

  const getStatusText = (status: string) => {
    return status === 'ACTIVE' ? 'Activo' : 'Inactivo';
  };

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 items-center transition-all duration-200 hover:bg-[#f8faf8] group"
      style={isLast ? {} : { borderBottom: '1px solid #f1f5f1' }}
    >
      {/* Plan Info */}
      <div className="col-span-4 flex items-center gap-3">
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
          style={{
            background:
              plan.status === 'ACTIVE'
                ? 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)'
                : 'linear-gradient(135deg, #9ca3af 0%, #d1d5db 100%)',
          }}
        >
          <Layers className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: '#1a2e1a' }}>
            {plan.name}
          </p>
        </div>
      </div>

      {/* Max Age */}
      <div className="col-span-2 hidden md:block">
        <p className="text-sm font-medium" style={{ color: '#1a2e1a' }}>
          {plan.maxAge} años
        </p>
      </div>

      {/* Base Fee */}
      <div className="col-span-2 hidden md:block">
        <p className="text-sm font-semibold" style={{ color: '#1a2e1a' }}>
          ${Number(plan.amount).toFixed(2)}
        </p>
      </div>

      {/* Percentage */}
      <div className="col-span-2 hidden md:block">
        <p className="text-sm font-semibold text-[#16a34a]">
          {Number(plan.percentage).toFixed(2)}%
        </p>
      </div>

      {/* Status */}
      <div className="col-span-1 hidden md:block">
        <Badge color={getStatusColor(plan.status)}>
          {getStatusText(plan.status)}
        </Badge>
      </div>

      {/* Actions */}
      <div className="col-span-1 flex items-center justify-end gap-1">
        <Can permission="update:plans">
          <button
            onClick={() => onEdit(plan)}
            disabled={actionLoading}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Editar plan"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </Can>
        <Can permission="delete:plans">
          <button
            onClick={() => onDelete(plan)}
            disabled={actionLoading}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Eliminar plan"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </Can>
      </div>
    </div>
  );
}
