'use client';

import React from 'react';
import { FileText } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { Contract } from '@/lib/types';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ContractRowProps {
  contract: Contract;
  isLast: boolean;
}

export function ContractRow({ contract, isLast }: ContractRowProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '#16a34a';
      case 'INACTIVE': return '#dc2626';
      default: return '#6b7f6b';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Activo';
      case 'INACTIVE': return 'Inactivo';
      default: return status;
    }
  };

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 items-center transition-all duration-200 hover:bg-[#f8faf8] group"
      style={isLast ? {} : { borderBottom: '1px solid #f1f5f1' }}
    >
      <div className="col-span-3 flex items-center gap-3">
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
          style={{
            background: contract.status === 'ACTIVE'
              ? 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)'
              : 'linear-gradient(135deg, #9ca3af 0%, #d1d5db 100%)',
          }}
        >
          <FileText className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: '#1a2e1a' }}>
            {contract.code}
          </p>
          <p className="text-xs truncate" style={{ color: '#6b7f6b' }}>
            {format(new Date(contract.affiliationDate), "d MMM, yyyy", { locale: es })}
          </p>
        </div>
      </div>
      <div className="col-span-4 hidden md:block">
        <p className="text-sm font-medium truncate" style={{ color: '#1a2e1a' }}>
          {contract.contractPersons && contract.contractPersons.find(p => p.isBillingOwner)?.person.name}
        </p>
        <p className="text-xs truncate" style={{ color: '#6b7f6b' }}>
          CI: {contract.contractPersons && `${contract.contractPersons.find(p => p.isBillingOwner)?.person.typeIdentityCard} - ${contract.contractPersons.find(p => p.isBillingOwner)?.person.identityCard}`}
        </p>
      </div>
      <div className="col-span-2 hidden md:block">
        <Badge color={getStatusColor(contract.status)}>
          {getStatusText(contract.status)}
        </Badge>
      </div>
      <div className="col-span-2 hidden md:block">
        <p className="text-sm font-medium truncate" style={{ color: '#1a2e1a' }}>
          ${contract.monthlyAmount}
        </p>
      </div>
      <div className="col-span-1 flex items-center justify-end">
        <Link
          href={`/dashboard/contratos/${contract.id}?from=contratos`}
          className="inline-flex items-center justify-center h-8 px-3 text-xs font-medium rounded-lg transition-colors hover:scale-105"
          style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}
        >
          Detalles
        </Link>
      </div>
    </div>
  );
}
