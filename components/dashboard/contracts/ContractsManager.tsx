"use client";

import { Can } from "@/components/ui/Can";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { useContracts } from "@/hooks/useContracts";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Search,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { ContractRow } from "./ContractRow";

type StatusFilter = "" | "ACTIVE" | "INACTIVE";

export function ContractsManager() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");

  const { contracts, meta, loading, error, fetchContracts } = useContracts(
    page,
    limit,
  );

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    // Pass status as the 9th argument (skipping advisorId, stage, month, year)
    fetchContracts(
      page,
      limit,
      debouncedSearch,
      null,
      undefined,
      null,
      null,
      statusFilter || undefined,
    );
  }, [page, limit, debouncedSearch, statusFilter, fetchContracts]);

  const handleStatusFilter = (status: StatusFilter) => {
    setStatusFilter(status);
    setPage(1);
  };

  const statusTabs: {
    value: StatusFilter;
    label: string;
    icon: React.ReactNode;
    color: string;
    bg: string;
  }[] = [
    {
      value: "",
      label: "Todos",
      icon: <FileText className="h-4 w-4" />,
      color: "#16a34a",
      bg: "#dcfce7",
    },
    {
      value: "ACTIVE",
      label: "Activos",
      icon: <CheckCircle2 className="h-4 w-4" />,
      color: "#2563eb",
      bg: "#dbeafe",
    },
    {
      value: "INACTIVE",
      label: "Inactivos",
      icon: <XCircle className="h-4 w-4" />,
      color: "#dc2626",
      bg: "#fef2f2",
    },
  ];

  return (
    <Can any={["read:contracts"]}>
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#1a2e1a" }}>
              Gestión de Contratos
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6b7f6b" }}>
              Administra los contratos, consulta detalles y pagos asociados
            </p>
          </div>
        </div>

        {/* Summary Card + Status Filter Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleStatusFilter(tab.value)}
                className="text-left transition-all duration-300 cursor-pointer rounded-2xl"
                style={{
                  outline: "none",
                  border: isActive
                    ? `2px solid ${tab.color}`
                    : "2px solid transparent",
                  boxShadow: isActive ? `0 0 0 3px ${tab.color}20` : undefined,
                }}
              >
                <Card className="p-5" hover>
                  <div className="flex items-center gap-4">
                    <div
                      className="h-12 w-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: tab.bg, color: tab.color }}
                    >
                      {tab.icon}
                    </div>
                    <div>
                      <p
                        className="text-2xl font-bold"
                        style={{ color: "#1a2e1a" }}
                      >
                        {isActive ? meta.totalItems : "—"}
                      </p>
                      <p
                        className="text-xs font-medium"
                        style={{ color: "#6b7f6b" }}
                      >
                        {tab.label}
                      </p>
                    </div>
                  </div>
                </Card>
              </button>
            );
          })}
        </div>

        {/* Filter Bar */}
        <Card className="p-4">
          <Input
            id="search-contracts"
            label=""
            type="text"
            placeholder="Buscar por número de contrato, nombre de afiliado, o cédula..."
            icon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Card>

        {/* Error Banner */}
        {error && (
          <div
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm animate-[shake_0.4s_ease-in-out]"
            style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
            }}
          >
            <svg
              className="h-4 w-4 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Contracts Table */}
        {loading ? (
          <Spinner className="py-24" />
        ) : contracts.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <div
                className="mx-auto h-16 w-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: "#f1f5f1" }}
              >
                <FileText className="h-8 w-8" style={{ color: "#9ca3af" }} />
              </div>
              <h3
                className="text-base font-semibold mb-1"
                style={{ color: "#1a2e1a" }}
              >
                {search
                  ? "No se encontraron contratos"
                  : "Sin contratos registrados"}
              </h3>
              <p className="text-sm" style={{ color: "#6b7f6b" }}>
                {search
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "Aún no hay información disponible"}
              </p>
            </div>
          </Card>
        ) : (
          <Card>
            {/* Table Header */}
            <div
              className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-wider"
              style={{ color: "#6b7f6b", borderBottom: "1px solid #e2ebe2" }}
            >
              <div className="col-span-3">N° Contrato</div>
              <div className="col-span-4">Afiliado</div>
              <div className="col-span-2">Estado</div>
              <div className="col-span-2">Monto</div>
              <div className="col-span-1 text-right">Acciones</div>
            </div>

            {/* Rows */}
            <div>
              {contracts.map((contract, index) => (
                <ContractRow
                  key={contract.id}
                  contract={contract}
                  isLast={index === contracts.length - 1}
                />
              ))}
            </div>

            {/* Pagination Footer */}
            <div
              className="px-6 py-3 flex items-center justify-between"
              style={{ borderTop: "1px solid #e2ebe2" }}
            >
              <p className="text-xs" style={{ color: "#6b7f6b" }}>
                Mostrando{" "}
                <span className="font-semibold" style={{ color: "#1a2e1a" }}>
                  {contracts.length}
                </span>{" "}
                de {meta.totalItems} contratos
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={meta.currentPage <= 1}
                  className="flex items-center justify-center h-9 w-9 rounded-lg border transition-all duration-200 disabled:opacity-50 hover:bg-[#f8faf8]"
                  style={{ borderColor: "#e2ebe2", color: "#1a2e1a" }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(meta.totalPages, p + 1))
                  }
                  disabled={meta.currentPage >= meta.totalPages}
                  className="flex items-center justify-center h-9 w-9 rounded-lg border transition-all duration-200 disabled:opacity-50 hover:bg-[#f8faf8]"
                  style={{ borderColor: "#e2ebe2", color: "#1a2e1a" }}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Can>
  );
}
