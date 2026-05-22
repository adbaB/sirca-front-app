'use client';

import type { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';

interface CanProps {
  /** Permiso requerido, ej: "users:write" */
  permission?: string;
  /** Requiere AL MENOS UNO de estos permisos */
  any?: string[];
  /** Requiere TODOS estos permisos */
  all?: string[];
  /** Requiere este rol exacto (case-insensitive) */
  role?: string;
  /** Contenido a mostrar si el usuario cumple la condición */
  children: ReactNode;
  /** Contenido alternativo si NO cumple (opcional) */
  fallback?: ReactNode;
}

/**
 * Componente declarativo para control de visibilidad basado en permisos.
 *
 * @example
 * // Mostrar sólo si tiene un permiso
 * <Can permission="users:write">
 *   <button>Crear usuario</button>
 * </Can>
 *
 * @example
 * // Con fallback
 * <Can permission="reports:read" fallback={<p>Sin acceso</p>}>
 *   <ReportTable />
 * </Can>
 *
 * @example
 * // Por rol
 * <Can role="admin">
 *   <AdminPanel />
 * </Can>
 *
 * @example
 * // Al menos uno de varios permisos
 * <Can any={["users:read", "users:write"]}>
 *   <UsersSection />
 * </Can>
 */
export function Can({
  permission,
  any,
  all,
  role,
  children,
  fallback = null,
}: CanProps) {
  const { can, canAny, canAll, hasRole, loading } = usePermissions();

  // Mientras carga, no muestra nada para evitar parpadeos
  if (loading) return null;

  let allowed = false;

  if (permission) {
    allowed = can(permission);
  } else if (any) {
    allowed = canAny(any);
  } else if (all) {
    allowed = canAll(all);
  } else if (role) {
    allowed = hasRole(role);
  }

  return allowed ? <>{children}</> : <>{fallback}</>;
}
