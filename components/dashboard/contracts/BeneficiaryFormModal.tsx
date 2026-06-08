'use client';

import React, { useState, useEffect } from 'react';
import { User, Shield, CreditCard } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { usePlans } from '@/hooks/usePlans';
import { usePersons } from '@/hooks/usePersons';
import type { Person } from '@/lib/types';

interface BeneficiaryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    typeIdentityCard: string;
    identityCard: string;
    planId: string;
    role: string;
    isBillingOwner: boolean;
    contractId: string;
  }) => Promise<void>;
  loading: boolean;
  error: string;
  contractId: string;
}

export function BeneficiaryFormModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
  error,
  contractId,
}: BeneficiaryFormModalProps) {
  const [name, setName] = useState('');
  const [typeIdentityCard, setTypeIdentityCard] = useState('V');
  const [identityCard, setIdentityCard] = useState('');
  const [planId, setPlanId] = useState('');
  const [role, setRole] = useState('AFILIADO');
  const [isBillingOwner, setIsBillingOwner] = useState(false);

  const { plans, loading: plansLoading } = usePlans();
  const { findByIdentity } = usePersons();

  const [isChecking, setIsChecking] = useState(false);
  const [personExists, setPersonExists] = useState(false);
  const [foundPerson, setFoundPerson] = useState<Person | null>(null);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictContractCode, setConflictContractCode] = useState('');

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setName('');
        setTypeIdentityCard('V');
        setIdentityCard('');
        setPersonExists(false);
        setRole('AFILIADO');
        setIsBillingOwner(false);
        setFoundPerson(null);
        setShowConflictModal(false);
        setConflictContractCode('');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && plans.length > 0) {
      const timer = setTimeout(() => {
        setPlanId(plans[0].id);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, plans]);

  useEffect(() => {
    if (!identityCard || identityCard.length < 4) {
      const timer = setTimeout(() => {
        setPersonExists(false);
        setFoundPerson(null);
      }, 0);
      return () => clearTimeout(timer);
    }

    const checkTimer = setTimeout(() => {
      setIsChecking(true);
    }, 0);

    const delayDebounceFn = setTimeout(async () => {
      try {
        const person = await findByIdentity(typeIdentityCard, identityCard);
        if (person && person.name) {
          setName(person.name);
          setPersonExists(true);
          setFoundPerson(person);
        } else {
          setPersonExists(false);
          setFoundPerson(null);
        }
      } catch (err) {
        console.error('Error al verificar cédula:', err);
        setPersonExists(false);
        setFoundPerson(null);
      } finally {
        setIsChecking(false);
      }
    }, 500);

    return () => {
      clearTimeout(checkTimer);
      clearTimeout(delayDebounceFn);
      setIsChecking(false);
    };
  }, [identityCard, typeIdentityCard, findByIdentity]);

  const handleTypeIdentityCardChange = (val: string) => {
    setTypeIdentityCard(val);
    if (personExists) {
      setName('');
      setPersonExists(false);
      setFoundPerson(null);
    }
  };

  const handleIdentityCardChange = (val: string) => {
    setIdentityCard(val);
    if (personExists) {
      setName('');
      setPersonExists(false);
      setFoundPerson(null);
    }
  };

  const handleConfirmSubmit = async () => {
    setShowConflictModal(false);
    await onSubmit({
      name,
      typeIdentityCard,
      identityCard,
      planId,
      role,
      isBillingOwner,
      contractId,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !identityCard || !planId) return;

    // Verificar si ya existe conflicto en otro contrato
    const conflictJunction = foundPerson?.contractPersons?.find(
      (cp) => cp.contract?.id !== contractId && cp.role === 'AFILIADO'
    );

    if (conflictJunction && role === 'AFILIADO') {
      setConflictContractCode(conflictJunction.contract?.code || '');
      setShowConflictModal(true);
      return;
    }

    await handleConfirmSubmit();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Beneficiario" maxWidth="500px">
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
              onChange={(e) => handleTypeIdentityCardChange(e.target.value)}
              className="w-full h-11 px-3 bg-[#f1f5f1] border border-[#e2ebe2] rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#16a34a]/20 transition-all"
              style={{ color: '#1a2e1a' }}
              disabled={loading || isChecking}
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
              onChange={(e) => handleIdentityCardChange(e.target.value)}
              placeholder="12345678"
              icon={<Shield className="h-4 w-4" />}
              disabled={loading}
            />
          </div>
        </div>

        {(isChecking || personExists || (identityCard.length >= 4 && !personExists)) && (
          <div className="text-xs font-medium px-1 -mt-1">
            {isChecking && <span style={{ color: '#2563eb' }}>Verificando cédula...</span>}
            {!isChecking && personExists && (
              <span style={{ color: '#16a34a' }}>
                ✓ Persona encontrada en el sistema. Se asociará al contrato.
              </span>
            )}
            {!isChecking && !personExists && identityCard.length >= 4 && (
              <span style={{ color: '#6b7f6b' }} className="italic">
                La persona no está registrada. Se creará un nuevo registro.
              </span>
            )}
          </div>
        )}

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
            disabled={loading || isChecking || personExists}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold" style={{ color: '#1a2e1a' }}>
            Plan
          </label>
          <div className="relative">
            <CreditCard
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
              style={{ color: '#6b7f6b' }}
            />
            <select
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-[#f1f5f1] border border-[#e2ebe2] rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#16a34a]/20 transition-all"
              style={{ color: '#1a2e1a' }}
              disabled={loading || plansLoading}
            >
              {plansLoading ? (
                <option value="">Cargando planes...</option>
              ) : plans.length === 0 ? (
                <option value="">No hay planes disponibles</option>
              ) : (
                plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

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
              <span className="text-xs font-bold block" style={{ color: '#1a2e1a' }}>
                Titular del Contrato
              </span>
              <span className="text-[9px] block leading-tight" style={{ color: '#6b7f6b' }}>
                Promover como titular del contrato
              </span>
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
              <span className="text-xs font-bold block" style={{ color: '#1a2e1a' }}>
                Titular de Factura
              </span>
              <span className="text-[9px] block leading-tight" style={{ color: '#6b7f6b' }}>
                Responsable del cobro y facturas
              </span>
            </div>
          </label>
        </div>

        <div
          className="mt-4 pt-4 border-t flex justify-end gap-3"
          style={{ borderColor: '#e2ebe2' }}
        >
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading || plansLoading || !planId}>
            {loading ? 'Agregando...' : 'Agregar Beneficiario'}
          </Button>
        </div>
      </form>
    </Modal>

      <Modal
        isOpen={showConflictModal}
        onClose={() => setShowConflictModal(false)}
        title="Advertencia de Contrato"
        maxWidth="450px"
      >
        <div className="flex flex-col gap-4">
          <div
            className="p-3.5 rounded-xl text-sm leading-relaxed border"
            style={{
              backgroundColor: '#fffbeb',
              borderColor: '#fde68a',
              color: '#78350f',
            }}
          >
            <p className="font-bold mb-1.5 flex items-center gap-1.5">
              <span>⚠️</span> ¡Atención!
            </p>
            Esta persona ya se encuentra registrada como afiliado en el contrato{' '}
            <strong>N° {conflictContractCode}</strong>.
            <br />
            <span className="mt-1 block text-xs" style={{ color: '#92400e' }}>
              Si continúa, el afiliado será <strong>removido</strong> de su contrato anterior para ser
              asociado a este.
            </span>
          </div>

          <p className="text-sm font-medium" style={{ color: '#1a2e1a' }}>
            ¿Está seguro de que desea proceder con el traslado?
          </p>

          <div
            className="pt-2 border-t flex justify-end gap-3"
            style={{ borderColor: '#e2ebe2' }}
          >
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowConflictModal(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirmSubmit}
              disabled={loading}
              style={{ backgroundColor: '#d97706', borderColor: '#d97706', color: '#fff' }}
            >
              {loading ? 'Procesando...' : 'Confirmar y Trasladar'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
