'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface PaymentFiltersProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  statusFilter: 'PROCESSING' | 'COMPLETED' | 'REJECTED' | '';
  onStatusFilterChange: (status: 'PROCESSING' | 'COMPLETED' | 'REJECTED' | '') => void;
  monthFilter: string;
  onMonthFilterChange: (month: string) => void;
  yearFilter: string;
  onYearFilterChange: (year: string) => void;
}

export function PaymentFilters({
  searchText,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  monthFilter,
  onMonthFilterChange,
  yearFilter,
  onYearFilterChange,
}: PaymentFiltersProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 3 + i); // dynamic years range (past 3 years to 1 year ahead)

  return (
    <div className="bg-white p-4 rounded-2xl border border-[#e2ebe2] flex flex-col xl:flex-row gap-4 items-center justify-between shadow-sm">
      {/* Search */}
      <div className="relative w-full xl:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7f6b]" />
        <input
          type="text"
          placeholder="Cédula, Ref o Código..."
          className="w-full pl-9 pr-4 py-2 border border-[#e2ebe2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a] transition-all bg-[#fcfdfc] text-[#1a2e1a]"
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchText && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7f6b] hover:text-[#1a2e1a] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Mes y Año selectors */}
      <div className="flex gap-3 w-full xl:w-auto flex-wrap">
        <select
          value={monthFilter}
          onChange={(e) => onMonthFilterChange(e.target.value)}
          className="flex-1 xl:flex-initial px-3 py-2 border border-[#e2ebe2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a] transition-all bg-[#fcfdfc] text-[#1a2e1a] font-semibold cursor-pointer min-w-[140px]"
        >
          <option value="">Todos los meses</option>
          <option value="1">Enero</option>
          <option value="2">Febrero</option>
          <option value="3">Marzo</option>
          <option value="4">Abril</option>
          <option value="5">Mayo</option>
          <option value="6">Junio</option>
          <option value="7">Julio</option>
          <option value="8">Agosto</option>
          <option value="9">Septiembre</option>
          <option value="10">Octubre</option>
          <option value="11">Noviembre</option>
          <option value="12">Diciembre</option>
        </select>

        <select
          value={yearFilter}
          onChange={(e) => onYearFilterChange(e.target.value)}
          className="flex-1 xl:flex-initial px-3 py-2 border border-[#e2ebe2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a] transition-all bg-[#fcfdfc] text-[#1a2e1a] font-semibold cursor-pointer min-w-[120px]"
        >
          <option value="">Todos los años</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filters */}
      <div className="flex gap-1.5 overflow-x-auto w-full xl:w-auto p-1 bg-[#f8faf8] border border-[#e2ebe2] rounded-xl">
        <button
          onClick={() => onStatusFilterChange('PROCESSING')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            statusFilter === 'PROCESSING'
              ? 'bg-white text-red-700 shadow-sm border border-red-100'
              : 'text-[#6b7f6b] hover:text-[#1a2e1a]'
          }`}
        >
          Pendientes
        </button>
        <button
          onClick={() => onStatusFilterChange('COMPLETED')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            statusFilter === 'COMPLETED'
              ? 'bg-white text-emerald-700 shadow-sm border border-emerald-100'
              : 'text-[#6b7f6b] hover:text-[#1a2e1a]'
          }`}
        >
          Aprobados
        </button>
        <button
          onClick={() => onStatusFilterChange('REJECTED')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            statusFilter === 'REJECTED'
              ? 'bg-white text-[#1a2e1a] shadow-sm border border-[#e2ebe2]'
              : 'text-[#6b7f6b] hover:text-[#1a2e1a]'
          }`}
        >
          Rechazados
        </button>
        <button
          onClick={() => onStatusFilterChange('')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            statusFilter === ''
              ? 'bg-white text-[#16a34a] shadow-sm border border-green-100'
              : 'text-[#6b7f6b] hover:text-[#1a2e1a]'
          }`}
        >
          Todos
        </button>
      </div>
    </div>
  );
}
