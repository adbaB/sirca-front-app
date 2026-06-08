'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Contract } from '@/lib/types';

export function useContract(id: string) {
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContract = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get<Contract>(`/contracts/${id}`);
      setContract(data || null);
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
        const data = await api.get<Contract>(`/contracts/${id}`);
        if (!cancelled) {
          setContract(data || null);
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

    return () => {
      cancelled = true;
    };
  }, [id]);

  const updateContract = async (payload: Partial<Contract>) => {
    await api.patch(`/contracts/${id}`, payload);
    await fetchContract();
  };

  const addBeneficiary = async (data: {
    name: string;
    typeIdentityCard: string;
    identityCard: string;
    planId: string;
    role: string;
    isBillingOwner: boolean;
  }) => {
    await api.post(`/contracts/${id}/beneficiaries`, { ...data, contractId: id });
    await fetchContract();
  };

  const setContractTitular = async (contractPersonId: string) => {
    await api.patch(`/contracts/${id}/set-titular`, { contractPersonId });
    await fetchContract();
  };

  const setBillingOwner = async (contractPersonId: string) => {
    await api.patch(`/contracts/${id}/set-billing-owner`, { contractPersonId });
    await fetchContract();
  };

  const removeAffiliate = async (contractPersonId: string) => {
    await api.delete(`/contracts/${id}/beneficiaries/${contractPersonId}`);
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
    },
  ) => {
    await api.patch(`/persons/${personId}`, { ...data, contractId: id });
    await fetchContract();
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
