'use client';

import React from 'react';
import { Code } from 'lucide-react';

interface MetadataVisorProps {
  metadata: Record<string, unknown>;
  title?: string;
  className?: string;
  customTranslations?: Record<string, string>;
}

const defaultTranslations: Record<string, string> = {
  referencia: 'Referencia Detectada',
  monto: 'Monto Detectado',
  moneda: 'Moneda Detectada',
  fecha: 'Fecha de Captura',
  banco: 'Banco',
  banco_emisor: 'Banco Emisor',
  banco_receptor: 'Banco Receptor',
  banco_destino: 'Banco Destino',
  concepto: 'Concepto',
  telefono: 'Teléfono Pago Móvil',
  cedula: 'Cédula/RIF',
  rif: 'RIF',
  nombre: 'Nombre/Razón Social',
  email: 'Correo Electrónico',
  comentario: 'Comentario',
};

export function MetadataVisor({
  metadata,
  title = 'Metadatos OCR del Comprobante',
  className = '',
  customTranslations = {},
}: MetadataVisorProps) {
  if (!metadata || Object.keys(metadata).length === 0) return null;

  const translations = { ...defaultTranslations, ...customTranslations };

  return (
    <div
      className={`px-4 pb-4 pt-2 bg-[#f9faf9] border-t border-[#f1f5f1] animate-[slideDown_0.2s_ease-out] ${className}`}
    >
      <div className="bg-white p-3 rounded-lg border border-[#e2ebe2]">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#f1f5f1]">
          <Code className="h-4 w-4 text-[#16a34a]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#1a2e1a]">{title}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(metadata).map(([key, val]) => {
            const label =
              translations[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

            return (
              <div key={key} className="bg-[#fcfdfc] p-2 rounded border border-[#f1f5f1]">
                <span className="text-[10px] uppercase font-bold text-[#6b7f6b] block leading-normal">
                  {label}
                </span>
                <span className="text-xs font-semibold text-[#1a2e1a] break-all">
                  {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
