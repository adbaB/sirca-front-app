"use client";

import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Can } from "@/components/ui/Can";
import { Card } from "@/components/ui/Card";
import { MetadataVisor } from "@/components/ui/MetadataVisor";
import { Spinner } from "@/components/ui/Spinner";
import { useContract } from "@/hooks/useContract";
import type { Contract, ContractPerson, Plan } from "@/lib/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code,
  CreditCard,
  DollarSign,
  Edit2,
  ExternalLink,
  FileText,
  Plus,
  Star,
  Trash2,
  UserCheck,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BeneficiaryFormModal } from "./BeneficiaryFormModal";
import { ContractFormModal } from "./ContractFormModal";
import { DeleteBeneficiaryModal } from "./DeleteBeneficiaryModal";
import { EditBeneficiaryModal } from "./EditBeneficiaryModal";

export function ContractDetails({ contractId }: { contractId: string }) {
  const {
    contract,
    loading,
    error,
    updateContract,
    fetchContract,
    addBeneficiary,
    setContractTitular,
    setBillingOwner,
    removeAffiliate,
    updateAffiliate,
  } = useContract(contractId);
  const [showEditModal, setShowEditModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  // States for affiliates pagination
  const [affiliatesPage, setAffiliatesPage] = useState(1);
  const affiliatesLimit = 3;

  // States for managing beneficiaries
  const [showAddBeneficiaryModal, setShowAddBeneficiaryModal] = useState(false);
  const [deletingBeneficiary, setDeletingBeneficiary] =
    useState<ContractPerson | null>(null);
  const [editingBeneficiary, setEditingBeneficiary] =
    useState<ContractPerson | null>(null);
  const [beneficiaryActionLoading, setBeneficiaryActionLoading] =
    useState(false);
  const [beneficiaryActionError, setBeneficiaryActionError] = useState("");

  // States for accordion of invoices and payments metadata
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(
    null,
  );
  const [viewingMetadataPaymentId, setViewingMetadataPaymentId] = useState<
    string | null
  >(null);

  // Helper functions for formatting and translations
  const formatBillingMonth = (monthStr: string) => {
    if (!monthStr || !monthStr.includes("-")) return monthStr;
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    const formatted = format(date, "MMMM yyyy", { locale: es });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const formatDate = (dateStr: string | Date | undefined | null) => {
    if (!dateStr) return "N/A";
    return format(new Date(dateStr), "d MMM, yyyy", { locale: es });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(amount));
  };

  const formatCurrencyBs = (amount: number) => {
    return new Intl.NumberFormat("es-VE", {
      style: "currency",
      currency: "VES",
    }).format(Number(amount));
  };

  const translatePaymentMethod = (method: string) => {
    switch (method?.toLowerCase()) {
      case "transferencia":
        return "Transferencia Bancaria";
      case "pago_movil":
        return "Pago Móvil";
      case "zelle":
        return "Zelle";
      case "efectivo":
        return "Efectivo";
      default:
        return method || "Otro";
    }
  };

  const getInvoiceStatusProps = (status: string) => {
    switch (status) {
      case "PAID":
        return { color: "#16a34a", text: "Pagada" };
      case "PARTIAL":
        return { color: "#2563eb", text: "Pagada Parcialmente" };
      case "PENDING":
        return { color: "#ca8a04", text: "Pendiente" };
      case "CANCELLED":
        return { color: "#dc2626", text: "Cancelada" };
      default:
        return { color: "#6b7f6b", text: status };
    }
  };

  const getPaymentStatusProps = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return { color: "#16a34a", text: "Completado" };
      case "PROCESSING":
        return { color: "#ca8a04", text: "Procesando" };
      case "REJECTED":
        return { color: "#dc2626", text: "Rechazado" };
      default:
        return { color: "#6b7f6b", text: status };
    }
  };

  const getSurplusStatusProps = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { color: "#ca8a04", text: "Pendiente" };
      case "applied":
        return { color: "#16a34a", text: "Aplicado" };
      case "refunded":
        return { color: "#2563eb", text: "Reembolsado" };
      case "cancelled":
        return { color: "#dc2626", text: "Cancelado" };
      default:
        return { color: "#6b7f6b", text: status };
    }
  };

  if (loading) {
    return <Spinner className="py-24" />;
  }

  if (error || !contract) {
    return (
      <div
        className="flex items-center gap-3 rounded-xl px-5 py-4 text-sm"
        style={{
          backgroundColor: "#fef2f2",
          border: "1px solid #fecaca",
          color: "#b91c1c",
        }}
      >
        <svg
          className="h-5 w-5 shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <div>
          <p className="font-medium">{error || "Contrato no encontrado"}</p>
          <Link
            href="/dashboard/contratos"
            className="text-xs underline mt-1 inline-block opacity-80 hover:opacity-100"
          >
            Volver a contratos
          </Link>
        </div>
      </div>
    );
  }

  const handleUpdate = async (data: Partial<Contract>) => {
    setActionLoading(true);
    setActionError("");
    try {
      await updateContract(data);
      setShowEditModal(false);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Error actualizando contrato",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddBeneficiary = async (data: {
    name: string;
    typeIdentityCard: string;
    identityCard: string;
    planId: string;
    role: string;
    isBillingOwner: boolean;
    contractId: string;
  }) => {
    setBeneficiaryActionLoading(true);
    setBeneficiaryActionError("");
    try {
      await addBeneficiary(data);
      setShowAddBeneficiaryModal(false);
    } catch (err) {
      setBeneficiaryActionError(
        err instanceof Error ? err.message : "Error al agregar beneficiario",
      );
    } finally {
      setBeneficiaryActionLoading(false);
    }
  };

  const handleSetContractTitular = async (contractPersonId: string) => {
    setBeneficiaryActionLoading(true);
    setBeneficiaryActionError("");
    try {
      await setContractTitular(contractPersonId);
    } catch (err) {
      setBeneficiaryActionError(
        err instanceof Error
          ? err.message
          : "Error al cambiar el titular del contrato",
      );
    } finally {
      setBeneficiaryActionLoading(false);
    }
  };

  const handleSetBillingOwner = async (contractPersonId: string) => {
    setBeneficiaryActionLoading(true);
    setBeneficiaryActionError("");
    try {
      await setBillingOwner(contractPersonId);
    } catch (err) {
      setBeneficiaryActionError(
        err instanceof Error
          ? err.message
          : "Error al cambiar el titular de la factura",
      );
    } finally {
      setBeneficiaryActionLoading(false);
    }
  };

  const handleDeleteBeneficiary = async () => {
    if (!deletingBeneficiary) return;
    setBeneficiaryActionLoading(true);
    setBeneficiaryActionError("");
    try {
      await removeAffiliate(deletingBeneficiary.id);
      setDeletingBeneficiary(null);
    } catch (err) {
      setBeneficiaryActionError(
        err instanceof Error ? err.message : "Error al eliminar beneficiario",
      );
    } finally {
      setBeneficiaryActionLoading(false);
    }
  };

  const handleEditBeneficiary = async (data: {
    name: string;
    typeIdentityCard: string;
    identityCard: string;
    planId: string | null;
    role: string;
    isBillingOwner: boolean;
  }) => {
    if (!editingBeneficiary) return;
    setBeneficiaryActionLoading(true);
    setBeneficiaryActionError("");
    try {
      await updateAffiliate(editingBeneficiary.person.id, data);
      setEditingBeneficiary(null);
    } catch (err) {
      setBeneficiaryActionError(
        err instanceof Error ? err.message : "Error al actualizar afiliado",
      );
    } finally {
      setBeneficiaryActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "#16a34a";
      case "INACTIVE":
        return "#dc2626";
      default:
        return "#6b7f6b";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Activo";
      case "INACTIVE":
        return "Inactivo";
      default:
        return status;
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "unverified":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "partial":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  // Calculations for affiliates client-side pagination
  const totalAffiliates = contract.contractPersons?.length ?? 0;
  const totalAffiliatesPages =
    Math.ceil(totalAffiliates / affiliatesLimit) || 1;
  const paginatedAffiliates =
    contract.contractPersons?.slice(
      (affiliatesPage - 1) * affiliatesLimit,
      affiliatesPage * affiliatesLimit,
    ) ?? [];

  // Calculate total pending positive balance (saldo a favor)
  const pendingSurpluses =
    contract.surpluses?.filter((s) => s.status?.toLowerCase() === "pending") ||
    [];
  const totalSaldoFavorUsd = pendingSurpluses.reduce(
    (sum, s) => sum + Number(s.amountUsd || 0),
    0,
  );
  const totalSaldoFavorBs = pendingSurpluses.reduce(
    (sum, s) => sum + Number(s.amountBs || 0),
    0,
  );
  const hasSaldoFavor = totalSaldoFavorUsd > 0 || totalSaldoFavorBs > 0;

  return (
    <Can any={["read:contracts"]}>
      <div className="flex flex-col gap-6">
        {/* Breadcrumb */}
        <div
          className="flex items-center gap-2 text-sm font-medium"
          style={{ color: "#6b7f6b" }}
        >
          <Link
            href="/dashboard/contratos"
            className="hover:text-[#16a34a] flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Volver a contratos
          </Link>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#1a2e1a" }}>
              Contrato N° {contract.code}
            </h1>
            <div
              className="flex items-center gap-3 mt-2 text-sm"
              style={{ color: "#6b7f6b" }}
            >
              <Badge color={getStatusColor(contract.status)}>
                {getStatusText(contract.status)}
              </Badge>
              <span>
                Creado el{" "}
                {format(new Date(contract.createdAt), "d 'de' MMMM, yyyy", {
                  locale: es,
                })}
              </span>
            </div>
          </div>
          <Can permission="update:contracts">
            <Button
              onClick={() => {
                setActionError("");
                setShowEditModal(true);
              }}
              variant="secondary"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Modificar Contrato
            </Button>
          </Can>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5" hover>
            <div className="flex items-center gap-4">
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#dcfce7" }}
              >
                <FileText className="h-6 w-6" style={{ color: "#16a34a" }} />
              </div>
              <div>
                <p className="text-xs font-medium" style={{ color: "#6b7f6b" }}>
                  Código
                </p>
                <p
                  className="text-lg font-bold truncate"
                  style={{ color: "#1a2e1a" }}
                >
                  {contract.code}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5" hover>
            <div className="flex items-center gap-4">
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#dbeafe" }}
              >
                <DollarSign className="h-6 w-6" style={{ color: "#2563eb" }} />
              </div>
              <div>
                <p className="text-xs font-medium" style={{ color: "#6b7f6b" }}>
                  Monto Mensual
                </p>
                <p className="text-2xl font-bold" style={{ color: "#1a2e1a" }}>
                  ${contract.monthlyAmount || "0.00"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5" hover>
            <div className="flex items-center gap-4">
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#fef9c3" }}
              >
                <Calendar className="h-6 w-6" style={{ color: "#ca8a04" }} />
              </div>
              <div>
                <p className="text-xs font-medium" style={{ color: "#6b7f6b" }}>
                  Fecha de Afiliación
                </p>
                <p className="text-sm font-bold" style={{ color: "#1a2e1a" }}>
                  {contract.affiliationDate
                    ? format(
                        new Date(contract.affiliationDate),
                        "d MMM, yyyy",
                        { locale: es },
                      )
                    : "N/A"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Error Banner */}
        {actionError && (
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
            {actionError}
            <button
              onClick={() => setActionError("")}
              className="ml-auto text-xs underline"
            >
              Cerrar
            </button>
          </div>
        )}

        {beneficiaryActionError && (
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
            {beneficiaryActionError}
            <button
              onClick={() => setBeneficiaryActionError("")}
              className="ml-auto text-xs underline"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Affiliate Card */}
            <Card>
              <div
                className="px-6 py-4 flex items-center justify-between border-b"
                style={{ borderColor: "#e2ebe2" }}
              >
                <h3
                  className="text-sm font-bold uppercase tracking-wider flex items-center gap-2"
                  style={{ color: "#1a2e1a" }}
                >
                  <UserIcon className="h-4 w-4" style={{ color: "#16a34a" }} />
                  Afiliados del Contrato
                </h3>
                <Can permission="update:contracts">
                  <button
                    onClick={() => {
                      setBeneficiaryActionError("");
                      setShowAddBeneficiaryModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-semibold rounded-lg text-white transition-all duration-200 hover:scale-105"
                    style={{
                      background:
                        "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
                    }}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Agregar Beneficiario
                  </button>
                </Can>
              </div>

              {/* Table Column Headers */}
              <div
                className="hidden md:grid grid-cols-12 gap-4 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#f8faf8]"
                style={{ color: "#6b7f6b", borderBottom: "1px solid #e2ebe2" }}
              >
                <div className="col-span-4">Nombre / Cédula</div>
                <div className="col-span-2">Plan</div>
                <div className="col-span-2">Rol</div>
                <div className="col-span-2">Estado</div>
                <div className="col-span-2 text-right">Acciones</div>
              </div>

              {paginatedAffiliates.length > 0 ? (
                <div>
                  {paginatedAffiliates.map((cp, index) => {
                    const rowPlanName =
                      typeof cp.person.plan === "object"
                        ? (cp.person.plan as Plan)?.name
                        : (cp.person.plan as unknown as string) || "—";
                    return (
                      <div
                        key={cp.id}
                        className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 items-center transition-all duration-200 hover:bg-[#f8faf8] group"
                        style={
                          index === paginatedAffiliates.length - 1
                            ? {}
                            : { borderBottom: "1px solid #f1f5f1" }
                        }
                      >
                        <div className="col-span-4 flex items-center gap-3">
                          <div
                            className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
                            style={{
                              background:
                                cp.person.status === "ACTIVE"
                                  ? "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)"
                                  : "linear-gradient(135deg, #9ca3af 0%, #d1d5db 100%)",
                            }}
                          >
                            <UserIcon className="h-5 w-5 text-white" />
                          </div>
                          <div className="min-w-0">
                            <p
                              className="text-sm font-semibold truncate"
                              style={{ color: "#1a2e1a" }}
                            >
                              {cp.person.name}
                            </p>
                            <p
                              className="text-xs truncate"
                              style={{ color: "#6b7f6b" }}
                            >
                              {cp.person.typeIdentityCard} -{" "}
                              {cp.person.identityCard}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-2 hidden md:block">
                          <p
                            className="text-sm font-medium"
                            style={{ color: "#1a2e1a" }}
                          >
                            {rowPlanName}
                          </p>
                        </div>
                        <div className="col-span-2 hidden md:flex flex-col gap-1 items-start justify-center">
                          {cp.role === "TITULAR" && (
                            <Badge color="#16a34a">Titular Contrato</Badge>
                          )}
                          {cp.isBillingOwner && (
                            <Badge color="#2563eb">Titular Factura</Badge>
                          )}
                          {cp.role !== "TITULAR" && !cp.isBillingOwner && (
                            <Badge color="#6b7f6b">Beneficiario</Badge>
                          )}
                        </div>
                        <div className="col-span-2 hidden md:block">
                          <Badge
                            color={
                              cp.person.status === "ACTIVE"
                                ? "#16a34a"
                                : "#dc2626"
                            }
                          >
                            {cp.person.status === "ACTIVE"
                              ? "Activo"
                              : "Inactivo"}
                          </Badge>
                        </div>
                        <div className="col-span-2 flex items-center justify-end gap-1">
                          <Can permission="update:contracts">
                            <button
                              onClick={() => handleSetContractTitular(cp.id)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                cp.role === "TITULAR"
                                  ? "text-green-600 hover:text-gray-400 hover:bg-gray-50"
                                  : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                              }`}
                              title={
                                cp.role === "TITULAR"
                                  ? "Quitar Titular del Contrato"
                                  : "Hacer Titular del Contrato"
                              }
                              disabled={beneficiaryActionLoading}
                            >
                              <UserCheck
                                className={`h-4 w-4 ${cp.role === "TITULAR" ? "stroke-[2.5px]" : ""}`}
                              />
                            </button>
                            {!cp.isBillingOwner && (
                              <button
                                onClick={() => handleSetBillingOwner(cp.id)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                                title="Hacer Titular de la Factura"
                                disabled={beneficiaryActionLoading}
                              >
                                <Star className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setBeneficiaryActionError("");
                                setEditingBeneficiary(cp);
                              }}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Editar afiliado"
                              disabled={beneficiaryActionLoading}
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            {cp.role !== "TITULAR" && !cp.isBillingOwner && (
                              <button
                                onClick={() => setDeletingBeneficiary(cp)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Eliminar beneficiario"
                                disabled={beneficiaryActionLoading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </Can>
                        </div>
                      </div>
                    );
                  })}

                  {/* Pagination Footer */}
                  {totalAffiliates > affiliatesLimit && (
                    <div
                      className="px-6 py-3 flex items-center justify-between"
                      style={{ borderTop: "1px solid #e2ebe2" }}
                    >
                      <p className="text-xs" style={{ color: "#6b7f6b" }}>
                        Mostrando{" "}
                        <span
                          className="font-semibold"
                          style={{ color: "#1a2e1a" }}
                        >
                          {paginatedAffiliates.length}
                        </span>{" "}
                        de {totalAffiliates} afiliados
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setAffiliatesPage((p) => Math.max(1, p - 1))
                          }
                          disabled={affiliatesPage <= 1}
                          className="flex items-center justify-center h-9 w-9 rounded-lg border transition-all duration-200 disabled:opacity-50 hover:bg-[#f8faf8]"
                          style={{ borderColor: "#e2ebe2", color: "#1a2e1a" }}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            setAffiliatesPage((p) =>
                              Math.min(totalAffiliatesPages, p + 1),
                            )
                          }
                          disabled={affiliatesPage >= totalAffiliatesPages}
                          className="flex items-center justify-center h-9 w-9 rounded-lg border transition-all duration-200 disabled:opacity-50 hover:bg-[#f8faf8]"
                          style={{ borderColor: "#e2ebe2", color: "#1a2e1a" }}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p
                  className="px-6 py-4 text-sm italic"
                  style={{ color: "#6b7f6b" }}
                >
                  No hay información de afiliado disponible.
                </p>
              )}
            </Card>

            {/* Invoices / Payments Accordion */}
            <Card>
              <div
                className="px-6 py-4 border-b flex items-center justify-between"
                style={{ borderColor: "#e2ebe2" }}
              >
                <h3
                  className="text-sm font-bold uppercase tracking-wider flex items-center gap-2"
                  style={{ color: "#1a2e1a" }}
                >
                  <CreditCard
                    className="h-4 w-4"
                    style={{ color: "#16a34a" }}
                  />
                  Facturas y Control de Pagos
                </h3>
              </div>

              {!contract.invoices || contract.invoices.length === 0 ? (
                <div className="text-center py-12">
                  <div
                    className="mx-auto h-16 w-16 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: "#f1f5f1" }}
                  >
                    <CreditCard
                      className="h-8 w-8"
                      style={{ color: "#9ca3af" }}
                    />
                  </div>
                  <h3
                    className="text-base font-semibold mb-1"
                    style={{ color: "#1a2e1a" }}
                  >
                    Sin facturas registradas
                  </h3>
                  <p className="text-sm" style={{ color: "#6b7f6b" }}>
                    No hay facturas registradas para este contrato aún.
                  </p>
                </div>
              ) : (
                <Accordion allowMultiple={false}>
                  {[...contract.invoices]
                    .sort((a, b) =>
                      b.billingMonth.localeCompare(a.billingMonth),
                    )
                    .map((invoice) => {
                      const isExpanded = expandedInvoiceId === invoice.id;
                      const statusProps = getInvoiceStatusProps(invoice.status);
                      const pendingAmount = Math.max(
                        0,
                        Number(invoice.totalAmount) -
                          Number(invoice.paidAmount),
                      );

                      return (
                        <AccordionItem
                          key={invoice.id}
                          id={invoice.id}
                          isOpen={isExpanded}
                          onToggle={() => {
                            setExpandedInvoiceId(
                              isExpanded ? null : invoice.id,
                            );
                            setViewingMetadataPaymentId(null);
                          }}
                          icon={<FileText />}
                          title={
                            <div>
                              <p
                                className="text-sm font-bold"
                                style={{ color: "#1a2e1a" }}
                              >
                                Factura{" "}
                                {formatBillingMonth(invoice.billingMonth)}
                              </p>
                              <p
                                className="text-xs"
                                style={{ color: "#6b7f6b" }}
                              >
                                Vence el {formatDate(invoice.dueDate)}
                              </p>
                            </div>
                          }
                          rightElement={
                            <div className="flex items-center gap-3 md:gap-6">
                              <div className="text-left md:text-right">
                                <p
                                  className="text-sm font-semibold"
                                  style={{ color: "#1a2e1a" }}
                                >
                                  Total: {formatCurrency(invoice.totalAmount)}
                                </p>
                                <p
                                  className="text-xs font-semibold"
                                  style={{
                                    color:
                                      pendingAmount > 0 ? "#2563eb" : "#16a34a",
                                  }}
                                >
                                  {pendingAmount > 0
                                    ? `Pendiente: ${formatCurrency(pendingAmount)}`
                                    : "Totalmente Pagada"}
                                </p>
                              </div>

                              <Badge color={statusProps.color}>
                                {statusProps.text}
                              </Badge>
                            </div>
                          }
                        >
                          {/* Invoice Details Summary Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-[#e2ebe2] mb-6">
                            <div>
                              <span
                                className="text-xs font-medium"
                                style={{ color: "#6b7f6b" }}
                              >
                                Fecha de Emisión
                              </span>
                              <p
                                className="text-sm font-semibold"
                                style={{ color: "#1a2e1a" }}
                              >
                                {formatDate(invoice.issueDate)}
                              </p>
                            </div>
                            <div>
                              <span
                                className="text-xs font-medium"
                                style={{ color: "#6b7f6b" }}
                              >
                                Fecha de Vencimiento
                              </span>
                              <p
                                className="text-sm font-semibold"
                                style={{ color: "#1a2e1a" }}
                              >
                                {formatDate(invoice.dueDate)}
                              </p>
                            </div>
                            <div>
                              <span
                                className="text-xs font-medium"
                                style={{ color: "#6b7f6b" }}
                              >
                                Monto Pagado
                              </span>
                              <p className="text-sm font-bold text-[#16a34a]">
                                {formatCurrency(invoice.paidAmount)}
                              </p>
                            </div>
                          </div>

                          {/* Payments Section */}
                          <div>
                            <h4
                              className="text-xs font-bold uppercase tracking-wider mb-3"
                              style={{ color: "#6b7f6b" }}
                            >
                              Pagos de la Factura
                            </h4>

                            {!invoice.payments ||
                            invoice.payments.length === 0 ? (
                              <p
                                className="text-sm italic p-4 text-center bg-white rounded-xl border border-dashed border-[#e2ebe2]"
                                style={{ color: "#6b7f6b" }}
                              >
                                No se han registrado pagos para esta factura
                                aún.
                              </p>
                            ) : (
                              <div className="space-y-3">
                                {[...invoice.payments]
                                  .sort(
                                    (a, b) =>
                                      new Date(b.paymentDate).getTime() -
                                      new Date(a.paymentDate).getTime(),
                                  )
                                  .map((payment) => {
                                    const payStatusProps =
                                      getPaymentStatusProps(payment.status);
                                    const hasMetadata =
                                      payment.metadata &&
                                      Object.keys(payment.metadata).length > 0;
                                    const isViewingMetadata =
                                      viewingMetadataPaymentId === payment.id;

                                    return (
                                      <div
                                        key={payment.id}
                                        className="bg-white rounded-xl border border-[#e2ebe2] overflow-hidden transition-all duration-200 hover:shadow-sm"
                                      >
                                        <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                          <div className="flex items-center gap-3">
                                            <div
                                              className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                                              style={{
                                                backgroundColor:
                                                  payment.status === "COMPLETED"
                                                    ? "#e8f5e9"
                                                    : payment.status ===
                                                        "REJECTED"
                                                      ? "#ffebee"
                                                      : "#fff9c4",
                                              }}
                                            >
                                              {payment.status ===
                                              "COMPLETED" ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                              ) : payment.status ===
                                                "REJECTED" ? (
                                                <AlertCircle className="h-5 w-5 text-red-600" />
                                              ) : (
                                                <Clock className="h-5 w-5 text-yellow-600" />
                                              )}
                                            </div>
                                            <div>
                                              <p
                                                className="text-sm font-bold"
                                                style={{ color: "#1a2e1a" }}
                                              >
                                                {translatePaymentMethod(
                                                  payment.paymentMethod,
                                                )}{" "}
                                                — Ref:{" "}
                                                <span className="font-mono text-xs text-[#6b7f6b]">
                                                  {payment.referenceNumber ||
                                                    "N/A"}
                                                </span>
                                              </p>
                                              <p
                                                className="text-xs"
                                                style={{ color: "#6b7f6b" }}
                                              >
                                                Pagado el{" "}
                                                {formatDate(
                                                  payment.paymentDate,
                                                )}
                                              </p>
                                            </div>
                                          </div>

                                          <div className="flex flex-wrap items-center gap-4">
                                            <div className="text-right">
                                              <p className="text-sm font-bold text-[#1a2e1a]">
                                                {formatCurrency(payment.amount)}
                                              </p>
                                              {payment.amountBs ? (
                                                <p className="text-xs font-medium text-[#6b7f6b]">
                                                  {formatCurrencyBs(
                                                    payment.amountBs,
                                                  )}
                                                </p>
                                              ) : null}
                                            </div>

                                            <Badge color={payStatusProps.color}>
                                              {payStatusProps.text}
                                            </Badge>

                                            <div className="flex items-center gap-2">
                                              {payment.url && (
                                                <a
                                                  href={payment.url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-green-600 hover:bg-green-50 border border-gray-200 transition-colors"
                                                  title="Ver soporte de pago"
                                                >
                                                  <ExternalLink className="h-4 w-4" />
                                                </a>
                                              )}

                                              {hasMetadata && (
                                                <button
                                                  onClick={() =>
                                                    setViewingMetadataPaymentId(
                                                      isViewingMetadata
                                                        ? null
                                                        : payment.id,
                                                    )
                                                  }
                                                  className={`inline-flex items-center justify-center p-2 rounded-lg border transition-colors ${
                                                    isViewingMetadata
                                                      ? "text-[#16a34a] bg-green-50 border-[#16a34a]"
                                                      : "text-gray-500 hover:text-[#16a34a] hover:bg-green-50 border-gray-200"
                                                  }`}
                                                  title="Ver detalles adicionales (metadatos)"
                                                >
                                                  <Code className="h-4 w-4" />
                                                </button>
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        {/* Reusable Metadata Visor */}
                                        {isViewingMetadata &&
                                          payment.metadata && (
                                            <MetadataVisor
                                              metadata={payment.metadata}
                                            />
                                          )}
                                      </div>
                                    );
                                  })}
                              </div>
                            )}
                          </div>
                        </AccordionItem>
                      );
                    })}
                </Accordion>
              )}
            </Card>

            {/* Anticipos (Surpluses) Card */}
            {contract.surpluses && contract.surpluses.length > 0 && (
              <Card>
                <div
                  className="px-6 py-4 border-b flex items-center justify-between"
                  style={{ borderColor: "#e2ebe2" }}
                >
                  <h3
                    className="text-sm font-bold uppercase tracking-wider flex items-center gap-2"
                    style={{ color: "#1a2e1a" }}
                  >
                    <DollarSign
                      className="h-4 w-4"
                      style={{ color: "#16a34a" }}
                    />
                    Anticipos (Saldos a Favor)
                  </h3>
                </div>

                <div className="divide-y divide-[#f1f5f1]">
                  {[...contract.surpluses]
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime(),
                    )
                    .map((surplus) => {
                      const surplusStatusProps = getSurplusStatusProps(
                        surplus.status,
                      );
                      return (
                        <div
                          key={surplus.id}
                          className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 hover:bg-[#f8faf8]"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                              style={{
                                backgroundColor:
                                  surplus.status === "applied"
                                    ? "#e8f5e9"
                                    : surplus.status === "cancelled"
                                      ? "#ffebee"
                                      : surplus.status === "refunded"
                                        ? "#e3f2fd"
                                        : "#fff9c4",
                              }}
                            >
                              {surplus.status === "applied" ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              ) : surplus.status === "cancelled" ? (
                                <AlertCircle className="h-5 w-5 text-red-600" />
                              ) : (
                                <Clock className="h-5 w-5 text-amber-600" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p
                                  className="text-sm font-bold"
                                  style={{ color: "#1a2e1a" }}
                                >
                                  Anticipo recibido
                                </p>
                                <Badge color={surplusStatusProps.color}>
                                  {surplusStatusProps.text}
                                </Badge>
                              </div>
                              <p
                                className="text-xs mt-0.5"
                                style={{ color: "#6b7f6b" }}
                              >
                                Registrado el {formatDate(surplus.date)}
                              </p>
                              {surplus.payment ? (
                                <p
                                  className="text-xs mt-1 font-medium"
                                  style={{ color: "#6b7f6b" }}
                                >
                                  Origen:{" "}
                                  <span
                                    className="font-semibold"
                                    style={{ color: "#1a2e1a" }}
                                  >
                                    {translatePaymentMethod(
                                      surplus.payment.paymentMethod,
                                    )}
                                  </span>{" "}
                                  — Ref:{" "}
                                  <span className="font-mono text-xs text-[#1a2e1a] font-semibold">
                                    {surplus.payment.referenceNumber}
                                  </span>
                                </p>
                              ) : null}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 sm:text-right">
                            <div className="text-left sm:text-right">
                              {surplus.amountUsd !== null &&
                              surplus.amountUsd > 0 ? (
                                <p className="text-base font-bold text-[#16a34a]">
                                  {formatCurrency(surplus.amountUsd)}
                                </p>
                              ) : null}
                              {surplus.amountBs !== null &&
                              surplus.amountBs > 0 ? (
                                <p className="text-xs font-semibold text-[#6b7f6b]">
                                  {formatCurrencyBs(surplus.amountBs)}
                                </p>
                              ) : null}
                            </div>
                            {surplus.payment?.url && (
                              <a
                                href={surplus.payment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-green-600 hover:bg-green-50 border border-gray-200 transition-colors"
                                title="Ver comprobante de pago de origen"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            <Card className="p-6">
              <h3
                className="text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ color: "#6b7f6b" }}
              >
                Resumen del Contrato
              </h3>
              <div className="space-y-4">
                <div
                  className="flex justify-between items-center pb-4"
                  style={{ borderBottom: "1px solid #f1f5f1" }}
                >
                  <div
                    className="flex items-center gap-2 text-sm"
                    style={{ color: "#6b7f6b" }}
                  >
                    <Calendar className="h-4 w-4" />
                    Afiliación
                  </div>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "#1a2e1a" }}
                  >
                    {contract.affiliationDate
                      ? format(
                          new Date(contract.affiliationDate),
                          "d MMM yyyy",
                          { locale: es },
                        )
                      : "N/A"}
                  </span>
                </div>

                <div
                  className="flex justify-between items-center pb-4"
                  style={{ borderBottom: "1px solid #f1f5f1" }}
                >
                  <div
                    className="flex items-center gap-2 text-sm"
                    style={{ color: "#6b7f6b" }}
                  >
                    <CreditCard className="h-4 w-4" />
                    Monto mensual
                  </div>
                  <span
                    className="font-bold text-lg"
                    style={{ color: "#16a34a" }}
                  >
                    ${contract.monthlyAmount || "0.00"}
                  </span>
                </div>

                <div
                  className="flex justify-between items-center pb-4"
                  style={{ borderBottom: "1px solid #f1f5f1" }}
                >
                  <div
                    className="flex items-center gap-2 text-sm"
                    style={{ color: "#6b7f6b" }}
                  >
                    <DollarSign
                      className="h-4 w-4"
                      style={{ color: hasSaldoFavor ? "#16a34a" : "#6b7f6b" }}
                    />
                    Saldo a favor
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-bold ${hasSaldoFavor ? "text-base text-[#16a34a]" : "text-sm text-[#6b7f6b]"}`}
                    >
                      {totalSaldoFavorUsd > 0
                        ? formatCurrency(totalSaldoFavorUsd)
                        : "$0.00"}
                    </span>
                    {totalSaldoFavorBs > 0 && (
                      <p className="text-[10px] font-semibold text-[#6b7f6b] mt-0.5">
                        {formatCurrencyBs(totalSaldoFavorBs)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div
                    className="flex items-center gap-2 text-sm"
                    style={{ color: "#6b7f6b" }}
                  >
                    <FileText className="h-4 w-4" />
                    Estado
                  </div>
                  <Badge color={getStatusColor(contract.status)}>
                    {getStatusText(contract.status)}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Contract Modal */}
        {showEditModal && (
          <ContractFormModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            contract={contract}
            onSubmit={handleUpdate}
            loading={actionLoading}
            error={actionError}
          />
        )}

        {/* Add Beneficiary Modal */}
        {showAddBeneficiaryModal && (
          <BeneficiaryFormModal
            isOpen={showAddBeneficiaryModal}
            onClose={() => setShowAddBeneficiaryModal(false)}
            onSubmit={handleAddBeneficiary}
            loading={beneficiaryActionLoading}
            error={beneficiaryActionError}
            contractId={contractId}
          />
        )}

        {/* Delete Beneficiary Modal */}
        {deletingBeneficiary && (
          <DeleteBeneficiaryModal
            isOpen={!!deletingBeneficiary}
            onClose={() => setDeletingBeneficiary(null)}
            onConfirm={handleDeleteBeneficiary}
            beneficiaryName={deletingBeneficiary.person.name}
            loading={beneficiaryActionLoading}
          />
        )}

        {/* Edit Beneficiary Modal */}
        {editingBeneficiary && (
          <EditBeneficiaryModal
            isOpen={!!editingBeneficiary}
            onClose={() => setEditingBeneficiary(null)}
            onSubmit={handleEditBeneficiary}
            loading={beneficiaryActionLoading}
            error={beneficiaryActionError}
            contractPerson={editingBeneficiary}
          />
        )}
      </div>
    </Can>
  );
}
