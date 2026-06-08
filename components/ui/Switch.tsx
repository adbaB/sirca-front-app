'use client';

import type { ReactNode } from 'react';

interface SwitchProps {
  /** Valor actual del switch */
  checked: boolean;
  /** Callback cuando el usuario hace clic */
  onChange: (checked: boolean) => void;
  /** Etiqueta principal (bold) */
  label?: string;
  /** Descripción secundaria debajo del label */
  description?: string | ReactNode;
  /** ID accesible */
  id?: string;
  disabled?: boolean;
}

/**
 * Toggle switch reutilizable con diseño consistente al sistema SIRCA.
 *
 * @example
 * <Switch
 *   checked={isActive}
 *   onChange={setIsActive}
 *   label="Estado del usuario"
 *   description={isActive ? 'Activo' : 'Deshabilitado'}
 * />
 */
export function Switch({
  checked,
  onChange,
  label,
  description,
  id,
  disabled = false,
}: SwitchProps) {
  const switchId = id ?? 'switch';

  return (
    <div className="flex items-center justify-between py-2">
      {(label || description) && (
        <div className="flex flex-col gap-0.5 pr-4">
          {label && (
            <p
              id={`${switchId}-label`}
              className="text-sm font-semibold"
              style={{ color: '#374151' }}
            >
              {label}
            </p>
          )}
          {description && (
            <p className="text-xs" style={{ color: '#6b7f6b' }}>
              {description}
            </p>
          )}
        </div>
      )}

      <button
        type="button"
        id={switchId}
        role="switch"
        aria-checked={checked}
        aria-labelledby={label ? `${switchId}-label` : undefined}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className="relative shrink-0 h-7 w-12 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        style={{ backgroundColor: checked ? '#16a34a' : '#d1d5db' }}
      >
        {/* Thumb — inactive: 2px from left; active: 22px from left (48px track - 24px thumb - 2px gap) */}
        <span
          aria-hidden="true"
          className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-300"
          style={{ transform: checked ? 'translateX(1px)' : 'translateX(-22px)' }}
        />
      </button>
    </div>
  );
}
