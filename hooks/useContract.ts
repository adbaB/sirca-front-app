'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Contract } from '@/lib/types';

export function useContract(id: string) {
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContract = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/contracts/${id}`);
      if (!res.ok) throw new Error('Error cargando detalles del contrato');
      const data = await res.json();
      setContract(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/contracts/${id}`);
        if (!res.ok) throw new Error('Error cargando detalles del contrato');
        const data = await res.json() as Contract;
        if (!cancelled) {
          setContract(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error desconocido');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (id) {
      load();
    }
    
    return () => { cancelled = true; };
  }, [id]);

  const updateContract = async (payload: Partial<Contract>) => {
    const res = await fetch(`/contracts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Error actualizando contrato');
    }
    await fetchContract();
    return res.json();
  };

  const addBeneficiary = async (data: {
    name: string;
    typeIdentityCard: string;
    identityCard: string;
    planId: string;
    role: string;
    isBillingOwner: boolean;
  }) => {
    const res = await fetch(`/contracts/${id}/beneficiaries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, contractId: id }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Error al agregar beneficiario');
    }
    await fetchContract();
    return res.json();
  };

  const setContractTitular = async (contractPersonId: string) => {
    const res = await fetch(`/contracts/${id}/set-titular`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contractPersonId }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Error al cambiar el titular del contrato');
    }
    await fetchContract();
  };

  const setBillingOwner = async (contractPersonId: string) => {
    const res = await fetch(`/contracts/${id}/set-billing-owner`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contractPersonId }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Error al cambiar el titular de la factura');
    }
    await fetchContract();
  };

  const removeAffiliate = async (contractPersonId: string) => {
    const res = await fetch(`/contracts/${id}/beneficiaries/${contractPersonId}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Error al eliminar afiliado del contrato');
    }
    await fetchContract();
  };

  const updateAffiliate = async (
    personId: string,
    data: {
      name: string;
      typeIdentityCard: string;
      identityCard: string;
      planId?: string | null;
      role?: string;
      isBillingOwner?: boolean;
    }
  ) => {
    const res = await fetch(`/persons/${personId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, contractId: id }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Error al actualizar afiliado');
    }
    await fetchContract();
    return res.json();
  };

  return {
    contract,
    loading,
    error,
    fetchContract,
    updateContract,
    addBeneficiary,
    setContractTitular,
    setBillingOwner,
    removeAffiliate,
    updateAffiliate,
  };
}
