'use client';

import React, { useState } from 'react';
import { Search, Plus, Briefcase, Percent, Activity } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import { PortfolioRow } from './PortfolioRow';
import { PortfolioFormModal } from './PortfolioFormModal';
import { usePortfolios } from '@/hooks/usePortfolios';
import type { Portfolio } from '@/lib/types';
import { Can } from '@/components/ui/Can';

export function PortfoliosManager() {
  const {
    portfolios,
    loading,
    error,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
  } = usePortfolios();

  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);
  const [deletingPortfolio, setDeletingPortfolio] = useState<Portfolio | null>(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  // Filtered portfolios
  const filteredPortfolios = portfolios.filter((p) => {
    return (
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase())
    );
  });

  const activePortfolios = portfolios.filter((p) => p.status === 'ACTIVE');
  const avgPercentage = activePortfolios.length > 0
    ? (activePortfolios.reduce((acc, p) => acc + Number(p.percentage), 0) / activePortfolios.length).toFixed(2)
    : '0.00';

  const handleCreate = async (data: {
    name: string;
    code: string;
    percentage: number;
    status: 'ACTIVE' | 'INACTIVE';
  }) => {
    setActionLoading(true);
    setActionError('');
    try {
      await createPortfolio(data);
      setShowCreateModal(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Error creando cartera');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (data: {
    name: string;
    code: string;
    percentage: number;
    status: 'ACTIVE' | 'INACTIVE';
  }) => {
    if (!editingPortfolio) return;
    setActionLoading(true);
    setActionError('');
    try {
      await updatePortfolio(editingPortfolio.id, data);
      setEditingPortfolio(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Error actualizando cartera');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingPortfolio) return;
    setActionLoading(true);
    setActionError('');
    try {
      await deletePortfolio(deletingPortfolio.id);
      setDeletingPortfolio(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Error eliminando cartera');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Can any={['read:portfolios']}>
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1a2e1a' }}>
              Gestión de Carteras
            </h1>
            <p className="text-sm mt-1" style={{ color: '#6b7f6b' }}>
              Administra las carteras, siglas, estados y comisiones asignadas
            </p>
          </div>
          <Can permission="create:portfolios">
            <Button
              onClick={() => {
                setActionError('');
                setShowCreateModal(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Nueva Cartera
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
                <Briefcase className="h-6 w-6" style={{ color: '#16a34a' }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#1a2e1a' }}>
                  {portfolios.length}
                </p>
                <p className="text-xs font-medium" style={{ color: '#6b7f6b' }}>
                  Total Carteras
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
                  {activePortfolios.length}
                </p>
                <p className="text-xs font-medium" style={{ color: '#6b7f6b' }}>
                  Carteras Activas
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
                <Percent className="h-6 w-6" style={{ color: '#ca8a04' }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#1a2e1a' }}>
                  {avgPercentage}%
                </p>
                <p className="text-xs font-medium" style={{ color: '#6b7f6b' }}>
                  Porcentaje Promedio
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filter Bar */}
        <Card className="p-4">
          <Input
            id="search-portfolios"
            label=""
            type="text"
            placeholder="Buscar por siglas o nombre de la cartera..."
            icon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Card>

        {/* Error Banner */}
        <ErrorBanner message={actionError || error || ''} onClose={() => setActionError('')} />

        {/* Portfolios Table */}
        {loading ? (
          <Spinner className="py-24" />
        ) : filteredPortfolios.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <div
                className="mx-auto h-16 w-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: '#f1f5f1' }}
              >
                <Briefcase className="h-8 w-8" style={{ color: '#9ca3af' }} />
              </div>
              <h3 className="text-base font-semibold mb-1" style={{ color: '#1a2e1a' }}>
                {search ? 'No se encontraron carteras' : 'Sin carteras registradas'}
              </h3>
              <p className="text-sm" style={{ color: '#6b7f6b' }}>
                {search ? 'Intenta ajustar los filtros de búsqueda' : 'Registra la primera cartera para comenzar'}
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
              <div className="col-span-5">Cartera</div>
              <div className="col-span-3">Porcentaje</div>
              <div className="col-span-2">Estado</div>
              <div className="col-span-2 text-right">Acciones</div>
            </div>

            {/* Rows */}
            <div>
              {filteredPortfolios.map((portfolio, index) => (
                <PortfolioRow
                  key={portfolio.id}
                  portfolio={portfolio}
                  isLast={index === filteredPortfolios.length - 1}
                  onEdit={(p) => {
                    setActionError('');
                    setEditingPortfolio(p);
                  }}
                  onDelete={(p) => {
                    setActionError('');
                    setDeletingPortfolio(p);
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
                  {filteredPortfolios.length}
                </span>{' '}
                de {portfolios.length} carteras
              </p>
              <Badge color="#16a34a">{activePortfolios.length} activas</Badge>
            </div>
          </Card>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <PortfolioFormModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreate}
            loading={actionLoading}
            error={actionError}
          />
        )}

        {/* Edit Modal */}
        {editingPortfolio && (
          <PortfolioFormModal
            isOpen={!!editingPortfolio}
            onClose={() => setEditingPortfolio(null)}
            onSubmit={handleUpdate}
            portfolio={editingPortfolio}
            loading={actionLoading}
            error={actionError}
          />
        )}

        {/* Delete Confirmation Modal */}
        {deletingPortfolio && (
          <Modal
            isOpen={!!deletingPortfolio}
            onClose={() => setDeletingPortfolio(null)}
            title="Eliminar Cartera"
          >
            <div className="flex flex-col gap-4">
              <p className="text-sm text-[#6b7f6b]">
                ¿Estás seguro de que deseas eliminar la cartera{' '}
                <strong className="text-[#1a2e1a]">
                  {deletingPortfolio.name} ({deletingPortfolio.code})
                </strong>
                ? Esta acción es irreversible y podría afectar a los contratos vinculados.
              </p>
              <div className="flex justify-end gap-3">
                <Button onClick={() => setDeletingPortfolio(null)} variant="secondary" disabled={actionLoading}>
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
