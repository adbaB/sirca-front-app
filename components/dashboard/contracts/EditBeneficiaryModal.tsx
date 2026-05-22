'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Shield, CreditCard } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { usePlans } from '@/hooks/usePlans';
import type { ContractPerson, Plan } from '@/lib/types';

interface EditBeneficiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    typeIdentityCard: string;
    identityCard: string;
    planId: string | null;
    role: string;
    isBillingOwner: boolean;
  }) => Promise<void>;
  loading: boolean;
  error: string;
  contractPerson: ContractPerson | null;
}

export function EditBeneficiaryModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
  error,
  contractPerson,
}: EditBeneficiaryModalProps) {
  const [name, setName] = useState('');
  const [typeIdentityCard, setTypeIdentityCard] = useState('V');
  const [identityCard, setIdentityCard] = useState('');
  const [planId, setPlanId] = useState('');
  const [role, setRole] = useState('AFILIADO');
  const [isBillingOwner, setIsBillingOwner] = useState(false);

  const { plans, loading: plansLoading } = usePlans();

  useEffect(() => {
    if (isOpen && contractPerson) {
      setName(contractPerson.person.name || '');
      setTypeIdentityCard(contractPerson.person.typeIdentityCard || 'V');
      setIdentityCard(contractPerson.person.identityCard || '');
      
      const currentPlanId = typeof contractPerson.person.plan === 'object'
        ? (contractPerson.person.plan as Plan)?.id || ''
        : (contractPerson.person.plan as unknown as string) || '';
      setPlanId(currentPlanId);
      
      setRole(contractPerson.role || 'AFILIADO');
      setIsBillingOwner(contractPerson.isBillingOwner || false);
    }
  }, [isOpen, contractPerson]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !identityCard) return;
    
    // Titulars don't have plans, so we send null
    await onSubmit({
      name,
      typeIdentityCard,
      identityCard,
      planId: role === 'TITULAR' ? null : planId,
      role,
      isBillingOwner,
    });
  };

  if (!contractPerson) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Afiliado" maxWidth="500px">
      {error && (
        <div className="mb-4 p-3 rounded-xl text-sm font-medium bg-red-50 text-red-600 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <div className="grid grid-cols-3 gap-3 items-center">
          <div className="flex flex-col gap-1.5 col-span-1">
            <label className="text-sm font-semibold" style={{ color: '#1a2e1a' }}>
              Tipo
            </label>
            <select
              value={typeIdentityCard}
              onChange={(e) => setTypeIdentityCard(e.target.value)}
              className="w-full h-11 px-3 bg-[#f1f5f1] border border-[#e2ebe2] rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#16a34a]/20 transition-all"
              style={{ color: '#1a2e1a' }}
              disabled={loading}
            >
              <option value="V">V</option>
              <option value="E">E</option>
              <option value="P">P</option>
              <option value="J">J</option>
              <option value="G">G</option>
              <option value="C">C</option>
              <option value="PN">PN</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 col-span-2">
            <label className="text-sm font-semibold" style={{ color: '#1a2e1a' }}>
              Cédula de Identidad
            </label>
            <Input
              label=""
              id="identityCard"
              type="text"
              required
              value={identityCard}
              onChange={(e) => setIdentityCard(e.target.value)}
              placeholder="12345678"
              icon={<Shield className="h-4 w-4" />}
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold" style={{ color: '#1a2e1a' }}>
            Nombre Completo
          </label>
          <Input
            label=""
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Juan Pérez"
            icon={<User className="h-4 w-4" />}
            disabled={loading}
          />
        </div>

        {role !== 'TITULAR' && (
          <div className="flex flex-col gap-1.5 animate-[fadeIn_0.2s_ease-out]">
            <label className="text-sm font-semibold" style={{ color: '#1a2e1a' }}>
              Plan
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#6b7f6b' }} />
              <select
                value={planId}
                onChange={(e) => setPlanId(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-[#f1f5f1] border border-[#e2ebe2] rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#16a34a]/20 transition-all"
                style={{ color: '#1a2e1a' }}
                disabled={loading || plansLoading}
                required={role !== 'TITULAR'}
              >
                {plansLoading ? (
                  <option value="">Cargando planes...</option>
                ) : plans.length === 0 ? (
                  <option value="">No hay planes disponibles</option>
                ) : (
                  <>
                    <option value="">Seleccione un plan...</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
          </div>
        )}

        {/* Role and Billing switches */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#f8faf8] p-3 rounded-xl border border-[#e2ebe2] mt-1">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={role === 'TITULAR'}
              onChange={(e) => setRole(e.target.checked ? 'TITULAR' : 'AFILIADO')}
              className="h-4.5 w-4.5 text-[#16a34a] border-[#e2ebe2] rounded focus:ring-[#16a34a]/20"
              style={{ accentColor: '#16a34a' }}
              disabled={loading}
            />
            <div>
              <span className="text-xs font-bold block" style={{ color: '#1a2e1a' }}>Titular del Contrato</span>
              <span className="text-[9px] block leading-tight" style={{ color: '#6b7f6b' }}>Promover como titular del contrato</span>
            </div>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isBillingOwner}
              onChange={(e) => setIsBillingOwner(e.target.checked)}
              className="h-4.5 w-4.5 text-[#16a34a] border-[#e2ebe2] rounded focus:ring-[#16a34a]/20"
              style={{ accentColor: '#16a34a' }}
              disabled={loading}
            />
            <div>
              <span className="text-xs font-bold block" style={{ color: '#1a2e1a' }}>Titular de Factura</span>
              <span className="text-[9px] block leading-tight" style={{ color: '#6b7f6b' }}>Responsable del cobro y facturas</span>
            </div>
          </label>
        </div>

        <div className="mt-4 pt-4 border-t flex justify-end gap-3" style={{ borderColor: '#e2ebe2' }}>
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading || plansLoading || (role !== 'TITULAR' && !planId)}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
