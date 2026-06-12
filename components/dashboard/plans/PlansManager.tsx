'use client';

import React, { useState } from 'react';
import { Search, Plus, Layers, Percent, Activity, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import { PlanRow } from './PlanRow';
import { PlanFormModal } from './PlanFormModal';
import { usePlans } from '@/hooks/usePlans';
import type { Plan } from '@/lib/types';
import { Can } from '@/components/ui/Can';

export function PlansManager() {
  const { plans, loading, error, createPlan, updatePlan, deletePlan } = usePlans();

  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<Plan | null>(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  // Filtered plans
  const filteredPlans = plans.filter((p) => {
    return p.name.toLowerCase().includes(search.toLowerCase());
  });

  const activePlans = plans.filter((p) => p.status === 'ACTIVE');
  const avgCommission =
    activePlans.length > 0
      ? (
          activePlans.reduce((acc, p) => acc + Number(p.commissionAmount), 0) / activePlans.length
        ).toFixed(2)
      : '0.00';

  const handleCreate = async (data: {
    name: string;
    maxAge: number;
    amount: number;
    commissionAmount: number;
    status: 'ACTIVE' | 'INACTIVE';
  }) => {
    setActionLoading(true);
    setActionError('');
    try {
      await createPlan(data);
      setShowCreateModal(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Error creando plan');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (data: {
    name: string;
    maxAge: number;
    amount: number;
    commissionAmount: number;
    status: 'ACTIVE' | 'INACTIVE';
  }) => {
    if (!editingPlan) return;
    setActionLoading(true);
    setActionError('');
    try {
      await updatePlan(editingPlan.id, data);
      setEditingPlan(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Error actualizando plan');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingPlan) return;
    setActionLoading(true);
    setActionError('');
    try {
      await deletePlan(deletingPlan.id);
      setDeletingPlan(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Error eliminando plan');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Can any={['read:plans']}>
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1a2e1a' }}>
              Gestión de Planes
            </h1>
            <p className="text-sm mt-1" style={{ color: '#6b7f6b' }}>
              Administra los planes de salud, tarifas base y comisiones de recargo
            </p>
          </div>
          <Can permission="create:plans">
            <Button
              onClick={() => {
                setActionError('');
                setShowCreateModal(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Nuevo Plan
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
                <Layers className="h-6 w-6" style={{ color: '#16a34a' }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#1a2e1a' }}>
                  {plans.length}
                </p>
                <p className="text-xs font-medium" style={{ color: '#6b7f6b' }}>
                  Total Planes
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
                <Activity className="h-6 w-6" style={{ color: '#2563eb' }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#1a2e1a' }}>
                  {activePlans.length}
                </p>
                <p className="text-xs font-medium" style={{ color: '#6b7f6b' }}>
                  Planes Activos
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
                <DollarSign className="h-6 w-6" style={{ color: '#ca8a04' }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#1a2e1a' }}>
                  ${avgCommission}
                </p>
                <p className="text-xs font-medium" style={{ color: '#6b7f6b' }}>
                  Comisión Promedio
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filter Bar */}
        <Card className="p-4">
          <Input
            id="search-plans"
            label=""
            type="text"
            placeholder="Buscar por nombre del plan..."
            icon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Card>

        {/* Error Banner */}
        <ErrorBanner message={actionError || error || ''} onClose={() => setActionError('')} />

        {/* Plans Table */}
        {loading ? (
          <Spinner className="py-24" />
        ) : filteredPlans.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <div
                className="mx-auto h-16 w-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: '#f1f5f1' }}
              >
                <Layers className="h-8 w-8" style={{ color: '#9ca3af' }} />
              </div>
              <h3 className="text-base font-semibold mb-1" style={{ color: '#1a2e1a' }}>
                {search ? 'No se encontraron planes' : 'Sin planes registrados'}
              </h3>
              <p className="text-sm" style={{ color: '#6b7f6b' }}>
                {search
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Registra el primer plan para comenzar'}
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
              <div className="col-span-4">Plan</div>
              <div className="col-span-2">Edad Máxima</div>
              <div className="col-span-2">Monto Base</div>
              <div className="col-span-2">Comisión</div>
              <div className="col-span-1">Estado</div>
              <div className="col-span-1 text-right">Acciones</div>
            </div>

            {/* Rows */}
            <div>
              {filteredPlans.map((plan, index) => (
                <PlanRow
                  key={plan.id}
                  plan={plan}
                  isLast={index === filteredPlans.length - 1}
                  onEdit={(p) => {
                    setActionError('');
                    setEditingPlan(p);
                  }}
                  onDelete={(p) => {
                    setActionError('');
                    setDeletingPlan(p);
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
                  {filteredPlans.length}
                </span>{' '}
                de {plans.length} planes
              </p>
              <Badge color="#16a34a">{activePlans.length} activos</Badge>
            </div>
          </Card>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <PlanFormModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreate}
            loading={actionLoading}
            error={actionError}
          />
        )}

        {/* Edit Modal */}
        {editingPlan && (
          <PlanFormModal
            isOpen={!!editingPlan}
            onClose={() => setEditingPlan(null)}
            onSubmit={handleUpdate}
            plan={editingPlan}
            loading={actionLoading}
            error={actionError}
          />
        )}

        {/* Delete Confirmation Modal */}
        {deletingPlan && (
          <Modal
            isOpen={!!deletingPlan}
            onClose={() => setDeletingPlan(null)}
            title="Eliminar Plan"
          >
            <div className="flex flex-col gap-4">
              <p className="text-sm text-[#6b7f6b]">
                ¿Estás seguro de que deseas eliminar el plan{' '}
                <strong className="text-[#1a2e1a]">{deletingPlan.name}</strong>? Esta acción
                ocultará el plan del sistema y podría afectar a los usuarios vinculados.
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => setDeletingPlan(null)}
                  variant="secondary"
                  disabled={actionLoading}
                >
                  Cancelar
                </Button>
                <Button onClick={handleDelete} variant="danger" disabled={actionLoading}>
                  {actionLoading ? 'Eliminando...' : 'Confirmar Eliminación'}
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </Can>
  );
}
