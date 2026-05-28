'use client';

import { useState, type ComponentType, type SVGProps } from 'react';
import {
  ClipboardList,
  FileSpreadsheet,
  FileText,
  Calendar,
  Download,
  ShieldAlert,
  Users,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { Can } from '@/components/ui/Can';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { MONTHS, YEARS } from '@/lib/constants';

const currentDate = new Date();

interface ReportType {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  active: boolean;
  badge: string;
  badgeColor: string;
}

const REPORTS: ReportType[] = [
  {
    id: 'contracts-detail',
    title: 'Detalle de Contratos',
    shortDesc: 'Contratos, pagos y facturación.',
    longDesc: 'Consolida todos los contratos activos de un mes seleccionado. Muestra el titular principal, monto mensual a pagar, total facturado, montos pagados en USD ($) y bolívares (Bs), estado de la factura (PAGADA/PENDIENTE) y la fecha de conciliación.',
    icon: FileText,
    active: true,
    badge: 'Disponible',
    badgeColor: '#16a34a',
  },
  {
    id: 'advisors-relation',
    title: 'Relación de Asesores',
    shortDesc: 'Ventas y rendimiento por asesor.',
    longDesc: 'Muestra el listado de asesores de ventas, volumen de contratos procesados por cada uno de ellos en el período seleccionado, comisiones asignadas y métricas globales de desempeño comercial.',
    icon: Users,
    active: false,
    badge: 'Próximamente',
    badgeColor: '#3b82f6',
  },
  {
    id: 'payments-relation',
    title: 'Relación de Pagos',
    shortDesc: 'Historial y métodos de cobro.',
    longDesc: 'Listado detallado de todas las transacciones de pago validadas en el mes, desglosado por método de recaudación (Pago Móvil, Zelle, Transferencia Bancaria, Efectivo) para auditoría fiscal y contabilidad.',
    icon: FileSpreadsheet,
    active: false,
    badge: 'Próximamente',
    badgeColor: '#3b82f6',
  },
];

export function ReportsPanel() {
  const [selectedReportId, setSelectedReportId] = useState<string>('contracts-detail');
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
  const [downloading, setDownloading] = useState<'excel' | 'pdf' | null>(null);

  const selectedReport = REPORTS.find(r => r.id === selectedReportId) || REPORTS[0];

  const yearOptions = YEARS.map((y) => ({ value: String(y), label: String(y) }));
  const monthOptions = MONTHS.map((m) => ({ value: String(m.value), label: m.label }));

  const handleDownload = async (format: 'excel' | 'pdf') => {
    setDownloading(format);
    try {
      const monthStr = String(month).padStart(2, '0');
      const url = `/reports/contracts/${format}?year=${year}&month=${month}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Error al generar el reporte');
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `reporte-contratos-${year}-${monthStr}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Error downloading report:', err);
    } finally {
      setDownloading(null);
    }
  };

  const fallback = (
    <Card className="p-8 text-center">
      <div
        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ backgroundColor: '#fef2f2' }}
      >
        <ShieldAlert className="h-8 w-8" style={{ color: '#b91c1c' }} />
      </div>
      <h3 className="text-lg font-bold mb-1" style={{ color: '#1a2e1a' }}>
        Acceso Restringido
      </h3>
      <p className="text-sm" style={{ color: '#6b7f6b' }}>
        No tienes permisos para acceder al centro de reportes. Contacta a un administrador.
      </p>
    </Card>
  );

  return (
    <Can role="admin" fallback={fallback}>
      <div className="space-y-6">
        {/* ── Section Header ─────────────────────────────── */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl animate-fade-in"
            style={{ backgroundColor: '#dcfce7' }}
          >
            <ClipboardList className="h-5 w-5 animate-pulse" style={{ color: '#16a34a' }} />
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: '#1a2e1a' }}>
              Centro de Reportes
            </h2>
            <p className="text-xs" style={{ color: '#6b7f6b' }}>
              Gestiona y descarga los reportes consolidados del sistema SIRCA
            </p>
          </div>
        </div>

        {/* ── Main Two-Column Layout ─────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Left Column: Reports Sidebar */}
          <div className="w-full lg:w-80 shrink-0 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-wider px-1" style={{ color: '#9ca3af' }}>
              Seleccione un Reporte
            </p>
            <div className="flex flex-col gap-2">
              {REPORTS.map((report) => {
                const IconComponent = report.icon;
                const isSelected = report.id === selectedReportId;

                return (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReportId(report.id)}
                    className="
                      w-full text-left p-4 rounded-2xl border transition-all duration-300
                      hover:shadow-md active:scale-[0.98] group flex items-start gap-3.5 relative
                    "
                    style={{
                      backgroundColor: isSelected ? '#ffffff' : '#fcfdfc',
                      borderColor: isSelected ? '#16a34a' : '#e2ebe2',
                      boxShadow: isSelected ? '0 4px 20px -2px rgba(22, 163, 74, 0.12)' : 'none',
                    }}
                  >
                    {/* Active accent vertical line */}
                    {isSelected && (
                      <span
                        className="absolute left-0 top-4 bottom-4 w-1.5 rounded-r-full"
                        style={{ backgroundColor: '#16a34a' }}
                      />
                    )}

                    {/* Icon container */}
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300"
                      style={{
                        backgroundColor: isSelected ? '#dcfce7' : '#f1f5f1',
                      }}
                    >
                      <IconComponent
                        className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                        style={{ color: isSelected ? '#16a34a' : '#6b7f6b' }}
                      />
                    </div>

                    {/* Report Text Info */}
                    <div className="space-y-1 pr-16">
                      <h4
                        className="text-xs font-bold transition-colors duration-200"
                        style={{ color: isSelected ? '#16a34a' : '#1a2e1a' }}
                      >
                        {report.title}
                      </h4>
                      <p className="text-[11px] leading-tight" style={{ color: '#6b7f6b' }}>
                        {report.shortDesc}
                      </p>
                    </div>

                    {/* Badge absolute position top-right */}
                    <div className="absolute top-4 right-4">
                      <Badge color={report.badgeColor} className="text-[9px] py-0.5 px-1.5 font-bold">
                        {report.badge}
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Report Details Panel */}
          <div className="flex-1 w-full animate-fade-in">
            <Card className="overflow-hidden shadow-sm min-h-[380px]">
              
              {/* Header section with gradient */}
              <div
                className="px-6 py-6"
                style={{
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #f0fdf4 100%)',
                  borderBottom: '1px solid #e2ebe2',
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm"
                    style={{ backgroundColor: '#ffffff', border: '1px solid #e2ebe2' }}
                  >
                    {/* Render active icon dynamically */}
                    {(() => {
                      const ActiveIcon = selectedReport.icon;
                      return <ActiveIcon className="h-6 w-6" style={{ color: '#16a34a' }} />;
                    })()}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold flex items-center gap-2.5" style={{ color: '#1a2e1a' }}>
                      {selectedReport.title}
                      <Badge color={selectedReport.badgeColor} className="text-[10px]">
                        {selectedReport.badge}
                      </Badge>
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#6b7f6b' }}>
                      {selectedReport.longDesc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic content wrapper */}
              <div className="p-6">
                {selectedReport.active ? (
                  /* Active report view: Detalle de Contratos */
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider mb-3.5" style={{ color: '#6b7f6b' }}>
                        Filtros de Período
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Select
                          id="report-year"
                          label="Año de Facturación"
                          value={String(year)}
                          onChange={(v) => setYear(Number(v))}
                          options={yearOptions}
                          icon={<Calendar className="h-4 w-4" />}
                        />
                        <Select
                          id="report-month"
                          label="Mes de Facturación"
                          value={String(month)}
                          onChange={(v) => setMonth(Number(v))}
                          options={monthOptions}
                          icon={<Calendar className="h-4 w-4" />}
                        />
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid #e2ebe2' }} className="my-2" />

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#6b7f6b' }}>
                        Opciones de Exportación
                      </h4>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => handleDownload('excel')}
                          disabled={downloading !== null}
                          className="
                            flex-1 inline-flex items-center justify-center gap-2.5
                            rounded-xl px-5 py-3 text-sm font-semibold
                            transition-all duration-200
                            active:scale-[0.97]
                            disabled:opacity-50 disabled:cursor-not-allowed
                          "
                          style={{
                            backgroundColor: '#16a34a',
                            color: '#ffffff',
                            boxShadow: '0 4px 14px rgba(22,163,74,0.25)',
                          }}
                          onMouseEnter={(e) => {
                            if (!e.currentTarget.disabled) {
                              e.currentTarget.style.backgroundColor = '#15803d';
                              e.currentTarget.style.boxShadow = '0 6px 20px rgba(22,163,74,0.35)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#16a34a';
                            e.currentTarget.style.boxShadow = '0 4px 14px rgba(22,163,74,0.25)';
                          }}
                        >
                          {downloading === 'excel' ? (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                          ) : (
                            <FileSpreadsheet className="h-4 w-4" />
                          )}
                          {downloading === 'excel' ? 'Generando Excel…' : 'Exportar a Excel (.xlsx)'}
                        </button>

                        <button
                          onClick={() => handleDownload('pdf')}
                          disabled={downloading !== null}
                          className="
                            flex-1 inline-flex items-center justify-center gap-2.5
                            rounded-xl px-5 py-3 text-sm font-semibold
                            transition-all duration-200
                            active:scale-[0.97]
                            disabled:opacity-50 disabled:cursor-not-allowed
                          "
                          style={{
                            backgroundColor: '#f1f5f1',
                            color: '#1a2e1a',
                            border: '1px solid #e2ebe2',
                          }}
                          onMouseEnter={(e) => {
                            if (!e.currentTarget.disabled) {
                              e.currentTarget.style.backgroundColor = '#e2ebe2';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#f1f5f1';
                          }}
                        >
                          {downloading === 'pdf' ? (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                          {downloading === 'pdf' ? 'Generando PDF…' : 'Exportar a PDF (.pdf)'}
                        </button>
                      </div>
                    </div>

                    {/* Helpful Guideline */}
                    <div
                      className="rounded-xl p-4 text-xs leading-relaxed"
                      style={{ backgroundColor: '#fcfdfc', border: '1px solid #e2ebe2', color: '#6b7f6b' }}
                    >
                      💡 <strong>Consejo de uso:</strong> La generación de reportes puede tardar unos segundos dependiendo del volumen de contratos facturados en el período seleccionado. Se recomienda descargar el archivo Excel si requiere aplicar filtros manuales complejos.
                    </div>
                  </div>
                ) : (
                  /* Inactive / Coming Soon report view */
                  <div className="flex flex-col items-center justify-center py-10 px-4 text-center space-y-4">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-500 hover:rotate-12 animate-fade-in"
                      style={{ backgroundColor: '#eff6ff' }}
                    >
                      <Lock className="h-7 w-7" style={{ color: '#3b82f6' }} />
                    </div>

                    <div className="max-w-md space-y-2">
                      <h4 className="text-base font-bold animate-fade-in" style={{ color: '#1a2e1a' }}>
                        Módulo en Desarrollo
                      </h4>
                      <p className="text-sm leading-relaxed" style={{ color: '#6b7f6b' }}>
                        Este reporte estructurado y sus visualizaciones analíticas se encuentran en proceso de desarrollo técnico y estarán disponibles próximamente.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

        </div>
      </div>
    </Can>
  );
}

