"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useContracts } from "@/hooks/useContracts";
import { usePermissions } from "@/hooks/usePermissions";
import type { Contract } from "@/lib/types";
import {
  AlertCircle,
  DollarSign,
  FileText,
  Search,
  TrendingDown,
  TrendingUp
} from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { ContractCardRow, PipelineStage } from "./ContractCardRow";
import { ContractRowSkeleton } from "./ContractRowSkeleton";

function getDefaultPeriod() {
  const today = new Date();
  // If today's day of the month is 25 or later, shift default view to the next calendar month
  if (today.getDate() >= 25) {
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    return {
      month: (nextMonth.getMonth() + 1).toString(),
      year: nextMonth.getFullYear().toString(),
    };
  }
  return {
    month: (today.getMonth() + 1).toString(),
    year: today.getFullYear().toString(),
  };
}

export function AdvisorConsole() {
  const { advisorId, loading: authLoading } = usePermissions();
  const [activeStage, setActiveStage] = useState<PipelineStage>("pending");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Local state for Month and Year period selectors (defaulting to shifted next month if past the 25th)
  const defaultPeriod = getDefaultPeriod();
  const [selectedMonth, setSelectedMonth] = useState<string>(defaultPeriod.month);
  const [selectedYear, setSelectedYear] = useState<string>(defaultPeriod.year);

  const handleMonthChange = (val: string) => {
    setSelectedMonth(val);
    setCurrentPage(1);
  };

  const handleYearChange = (val: string) => {
    setSelectedYear(val);
    setCurrentPage(1);
  };

  // Hook handles active page and metadata from backend
  const {
    contracts,
    meta,
    loading: contractsLoading,
    error,
    fetchContracts,
  } = useContracts(currentPage, itemsPerPage, advisorId);

  // States for commercial totals and stage counts precalculated in backend
  const [pipelineStats, setPipelineStats] = useState<{
    stats: {
      totalPipeline: number;
      totalCollected: number;
      totalPending: number;
    };
    counts: {
      pending: number;
      rejected: number;
      partial: number;
      paid: number;
    };
  } | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch KPI aggregates and alert events dynamically
  React.useEffect(() => {
    let active = true;
    async function loadStats() {
      try {
        setStatsLoading(true);
        const advisorParam = advisorId
          ? `advisorId=${encodeURIComponent(advisorId)}`
          : "";
        const monthParam = `month=${selectedMonth}`;
        const yearParam = `year=${selectedYear}`;

        const params: string[] = [];
        if (advisorParam) params.push(advisorParam);
        if (monthParam) params.push(monthParam);
        if (yearParam) params.push(yearParam);

        const queryStr = params.length > 0 ? `?${params.join("&")}` : "";
        const res = await fetch(`/contracts/pipeline-stats${queryStr}`);
        if (!res.ok)
          throw new Error("Error cargando estadísticas del pipeline");
        const data = await res.json();
        if (active) {
          setPipelineStats(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setStatsLoading(false);
      }
    }
    loadStats();
    return () => {
      active = false;
    };
  }, [advisorId, selectedMonth, selectedYear]);

  // Reactive effect to load data when page, search query or active stage tab changes
  React.useEffect(() => {
    fetchContracts(
      currentPage,
      itemsPerPage,
      search,
      advisorId,
      activeStage,
      selectedMonth,
      selectedYear,
    );
  }, [
    currentPage,
    itemsPerPage,
    search,
    advisorId,
    activeStage,
    selectedMonth,
    selectedYear,
    fetchContracts,
  ]);

  // Aggregate states
  const stats = useMemo(
    () =>
      pipelineStats?.stats ?? {
        totalPipeline: 0,
        totalCollected: 0,
        totalPending: 0,
      },
    [pipelineStats],
  );
  const counts = useMemo(
    () =>
      pipelineStats?.counts ?? { pending: 0, rejected: 0, partial: 0, paid: 0 },
    [pipelineStats],
  );

  const totalPages = meta.totalPages || 1;
  const totalItems = meta.totalItems || 0;

  const pageNumbers = useMemo(() => {
    const list: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      list.push(i);
    }
    return list;
  }, [currentPage, totalPages]);

  const getStageHeaderStyles = (stage: PipelineStage) => {
    switch (stage) {
      case "pending":
        return {
          color: "#d97706",
          bg: "#fffbeb",
          border: "rgba(217, 119, 6, 0.2)",
          label: "Pendientes de Pago",
        };
      case "rejected":
        return {
          color: "#dc2626",
          bg: "#fef2f2",
          border: "rgba(220, 38, 38, 0.2)",
          label: "Pagos Rechazados",
        };
      case "partial":
        return {
          color: "#2563eb",
          bg: "#eff6ff",
          border: "rgba(37, 99, 237, 0.2)",
          label: "Pagos Parciales",
        };
      case "paid":
        return {
          color: "#16a34a",
          bg: "#f0fdf4",
          border: "rgba(22, 163, 74, 0.2)",
          label: "Pagos Completados",
        };
    }
  };

  const getInvoiceMetrics = useCallback((contract: Contract) => {
    let total = 0;
    let paid = 0;

    const targetBillingMonth = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`;

    // Grab the target month invoice specifically
    const activeInvoices =
      contract.invoices?.filter((i) => i.status !== "CANCELLED") || [];
    const targetInvoice = activeInvoices.find(
      (i) => i.billingMonth === targetBillingMonth,
    );

    if (targetInvoice) {
      total = Number(targetInvoice.totalAmount);
      paid = Number(targetInvoice.paidAmount);
    } else {
      total = Number(contract.monthlyAmount);
      paid = 0;
    }

    const pct = total > 0 ? Math.round((paid / total) * 100) : 0;
    return { paid, total, pct };
  }, [selectedMonth, selectedYear]);

  const getContractStageForMonth = useCallback((contract: Contract): PipelineStage => {
    const targetBillingMonth = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`;
    const activeInvoices =
      contract.invoices?.filter((i) => i.status !== "CANCELLED") || [];
    const targetInvoice = activeInvoices.find(
      (i) => i.billingMonth === targetBillingMonth,
    );

    if (!targetInvoice) {
      return "pending";
    }

    const hasRejection = targetInvoice.payments?.some(
      (p) => p.status === "REJECTED",
    );
    if (
      hasRejection &&
      (targetInvoice.status === "PENDING" || targetInvoice.status === "PARTIAL")
    ) {
      return "rejected";
    } else if (targetInvoice.status === "PARTIAL") {
      return "partial";
    } else if (targetInvoice.status === "PAID") {
      return "paid";
    } else {
      return "pending";
    }
  }, [selectedMonth, selectedYear]);

  const isLoading = authLoading || contractsLoading || statsLoading;

  const [showSkeleton, setShowSkeleton] = useState(false);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      // Show skeleton only if loading takes more than 500ms (0.5 seconds)
      timer = setTimeout(() => {
        setShowSkeleton(true);
      }, 500);
    } else {
      setShowSkeleton(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading]);

  const processedContracts = useMemo(() => {
    return contracts.map((contract) => {
      const metrics = getInvoiceMetrics(contract);
      const currentStage = getContractStageForMonth(contract);
      const stageStyles = getStageHeaderStyles(currentStage);

      return {
        contract,
        metrics,
        currentStage,
        stageStyles,
      };
    });
  }, [contracts, selectedMonth, selectedYear, getContractStageForMonth, getInvoiceMetrics]);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold" style={{ color: "#1a2e1a" }}>
              Seguimiento Comercial
            </h1>
            <Badge color="#16a34a">Consola Asesores</Badge>
          </div>
          <p className="text-sm mt-1" style={{ color: "#6b7f6b" }}>
            Monitorea el estatus de tus afiliados y visualiza recaudaciones en
            tiempo real de manera eficiente.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Mes Selector */}
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              className="appearance-none inline-flex items-center gap-2 pl-4 pr-10 py-2.5 rounded-xl text-sm font-semibold border bg-white transition-all duration-300 shadow-sm cursor-pointer focus:outline-none focus:border-[#16a34a] focus:ring-4 focus:ring-[#16a34a]/10"
              style={{
                borderColor: "#e2ebe2",
                color: "#1a2e1a",
              }}
            >
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
            <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Año Selector */}
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => handleYearChange(e.target.value)}
              className="appearance-none inline-flex items-center gap-2 pl-4 pr-10 py-2.5 rounded-xl text-sm font-semibold border bg-white transition-all duration-300 shadow-sm cursor-pointer focus:outline-none focus:border-[#16a34a] focus:ring-4 focus:ring-[#16a34a]/10"
              style={{
                borderColor: "#e2ebe2",
                color: "#1a2e1a",
              }}
            >
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
            </select>
            <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 flex items-center justify-between" hover>
          <div className="flex items-center gap-4">
            <div
              className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#dcfce7" }}
            >
              <TrendingUp className="h-6 w-6" style={{ color: "#16a34a" }} />
            </div>
            <div>
              {statsLoading ? (
                <div className="h-8 w-28 bg-gray-200 rounded animate-pulse mt-0.5" />
              ) : (
                <p className="text-2xl font-bold" style={{ color: "#1a2e1a" }}>
                  $
                  {stats.totalPipeline.toLocaleString("es-ES", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              )}
              <p className="text-xs font-semibold" style={{ color: "#6b7f6b" }}>
                Cartera Mensual Activa
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between" hover>
          <div className="flex items-center gap-4">
            <div
              className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#eff6ff" }}
            >
              <DollarSign className="h-6 w-6" style={{ color: "#2563eb" }} />
            </div>
            <div>
              {statsLoading ? (
                <div className="h-8 w-28 bg-gray-200 rounded animate-pulse mt-0.5" />
              ) : (
                <p className="text-2xl font-bold" style={{ color: "#1a2e1a" }}>
                  $
                  {stats.totalCollected.toLocaleString("es-ES", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              )}
              <p className="text-xs font-semibold" style={{ color: "#6b7f6b" }}>
                Total Recaudado
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between" hover>
          <div className="flex items-center gap-4">
            <div
              className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#fffbeb" }}
            >
              <TrendingDown className="h-6 w-6" style={{ color: "#d97706" }} />
            </div>
            <div>
              {statsLoading ? (
                <div className="h-8 w-28 bg-gray-200 rounded animate-pulse mt-0.5" />
              ) : (
                <p className="text-2xl font-bold" style={{ color: "#1a2e1a" }}>
                  $
                  {stats.totalPending.toLocaleString("es-ES", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              )}
              <p className="text-xs font-semibold" style={{ color: "#6b7f6b" }}>
                Total Pendiente
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Interactive Pipeline Selector */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#f8faf8] p-2 rounded-2xl border"
        style={{ borderColor: "#e2ebe2" }}
      >
        {(["pending", "rejected", "partial", "paid"] as PipelineStage[]).map(
          (stage) => {
            const count = counts[stage] ?? 0;
            const styles = getStageHeaderStyles(stage);
            const isActive = activeStage === stage;

            return (
              <button
                key={stage}
                onClick={() => {
                  setActiveStage(stage);
                  setCurrentPage(1);
                }}
                className="flex flex-col items-center py-3.5 px-4 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                style={{
                  backgroundColor: isActive ? styles.bg : "transparent",
                  border: isActive
                    ? `1px solid ${styles.border}`
                    : "1px solid transparent",
                  color: styles.color,
                }}
              >
                {statsLoading ? (
                  <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
                ) : (
                  <span className="text-2xl font-black">{count}</span>
                )}
                <span
                  className="text-xs font-bold mt-1"
                  style={{ color: isActive ? styles.color : "#6b7f6b" }}
                >
                  {styles.label}
                </span>
              </button>
            );
          },
        )}
      </div>

      {/* Filter Bar */}
      <Card className="p-4 flex items-center gap-4">
        <div className="flex-1">
          <Input
            id="advisor-console-search"
            label=""
            placeholder="Buscar por N° contrato, nombre o cédula del titular..."
            icon={<Search className="h-4.5 w-4.5" />}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </Card>

      {/* Main Board */}
      {showSkeleton ? (
        <div className="flex flex-col gap-3">
          <ContractRowSkeleton index={0} />
          <ContractRowSkeleton index={1} />
          <ContractRowSkeleton index={2} />
        </div>
      ) : error ? (
        <div
          className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm"
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
          }}
        >
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      ) : contracts.length === 0 ? (
        isLoading ? (
          <div className="h-[250px]" />
        ) : (
          <Card className="p-16 text-center animate-fade-in">
            <div
              className="h-16 w-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: "#f1f5f1" }}
            >
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3
              className="text-base font-bold mb-1"
              style={{ color: "#1a2e1a" }}
            >
              Sin contratos en esta etapa
            </h3>
            <p
              className="text-sm max-w-[280px] mx-auto"
              style={{ color: "#6b7f6b" }}
            >
              {search
                ? "Intenta modificar tus filtros de búsqueda"
                : "No se registraron afiliados en esta clasificación actualmente."}
            </p>
          </Card>
        )
      ) : (
        <div
          className={`flex flex-col gap-3 transition-opacity duration-300 ${isLoading ? "opacity-40 pointer-events-none" : ""}`}
        >
          {processedContracts.map(
            ({ contract, metrics, currentStage, stageStyles }, index) => (
              <ContractCardRow
                key={contract.id}
                contract={contract}
                index={index}
                metrics={metrics}
                currentStage={currentStage}
                stageStyles={stageStyles}
              />
            ),
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div
              className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border mt-4 animate-fade-in"
              style={{ borderColor: "#e2ebe2" }}
            >
              <p className="text-xs font-semibold" style={{ color: "#6b7f6b" }}>
                Mostrando{" "}
                {Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)} a{" "}
                {Math.min(totalItems, currentPage * itemsPerPage)} de{" "}
                {totalItems} contratos
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold border transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none hover:bg-gray-50 cursor-pointer"
                  style={{ borderColor: "#e2ebe2", color: "#1a2e1a" }}
                >
                  Anterior
                </button>
                <div className="flex items-center gap-1.5">
                  {pageNumbers.map((page) => {
                    const isPageActive = currentPage === page;
                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className="h-8 w-8 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center cursor-pointer"
                        style={{
                          backgroundColor: isPageActive
                            ? "#16a34a"
                            : "transparent",
                          color: isPageActive ? "white" : "#6b7f6b",
                          border: isPageActive
                            ? "1px solid #16a34a"
                            : "1px solid transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (!isPageActive) {
                            e.currentTarget.style.backgroundColor = "#f1f5f1";
                            e.currentTarget.style.color = "#1a2e1a";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isPageActive) {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                            e.currentTarget.style.color = "#6b7f6b";
                          }
                        }}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold border transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none hover:bg-gray-50 cursor-pointer"
                  style={{ borderColor: "#e2ebe2", color: "#1a2e1a" }}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
