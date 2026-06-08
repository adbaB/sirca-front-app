'use client';

import React, { useState } from 'react';
import { Mail, Lock, Shield, User as UserIcon } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { Switch } from '@/components/ui/Switch';
import { useAdvisors } from '@/hooks/useAdvisors';
import type { User, Role } from '@/lib/types';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    email: string;
    password: string;
    roleId?: string;
    isActive?: boolean;
    advisorId?: string | null;
  }) => Promise<void>;
  roles: Role[];
  loading: boolean;
  error: string;
  user?: User | null;
}

/* ─── Inner form — state is initialized directly from props on mount ─── */
function UserFormInner({
  onClose,
  onSubmit,
  roles,
  loading,
  error,
  user,
}: Omit<UserFormModalProps, 'isOpen'>) {
  const isEditing = !!user;
  const { advisors } = useAdvisors();

  // State initialised once from props — no useEffect needed.
  // The parent resets this by changing the `key` on each open.
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState(user?.roleId ?? '');
  const [advisorId, setAdvisorId] = useState(user?.advisorId ?? '');
  const [isActive, setIsActive] = useState(user?.isActive ?? true);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!email.trim()) {
      setValidationError('El correo electrónico es obligatorio');
      return;
    }

    if (!isEditing && !password.trim()) {
      setValidationError('La contraseña es obligatoria');
      return;
    }

    if (!isEditing && password.length < 6) {
      setValidationError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const data: Record<string, unknown> = { email };
    if (!isEditing) data.password = password;
    if (roleId) data.roleId = roleId;
    data.advisorId = advisorId || null;
    if (isEditing) data.isActive = isActive;

    await onSubmit(
      data as {
        email: string;
        password: string;
        roleId?: string;
        isActive?: boolean;
        advisorId?: string | null;
      },
    );
  };

  const displayError = validationError || error;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        id="user-form-email"
        label="Correo Electrónico"
        type="email"
        placeholder="usuario@ejemplo.com"
        icon={<Mail className="h-4 w-4" />}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />

      {!isEditing && (
        <Input
          id="user-form-password"
          label="Contraseña"
          type="password"
          placeholder="Mínimo 6 caracteres"
          icon={<Lock className="h-4 w-4" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
      )}

      {/* Role Selector */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="user-form-role"
          className="text-sm font-semibold"
          style={{ color: '#374151' }}
        >
          Rol
        </label>
        <div className="relative">
          <div
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: '#9ca3af' }}
          >
            <Shield className="h-4 w-4" />
          </div>
          <select
            id="user-form-role"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            className="w-full appearance-none rounded-xl border bg-white text-sm py-3 pl-11 pr-4 transition-all duration-200 focus:outline-none"
            style={{ borderColor: '#e2ebe2', color: '#1a2e1a' }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#16a34a';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e2ebe2';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <option value="">Sin rol asignado</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name} {role.description ? `— ${role.description}` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advisor Selector */}
      <div className="flex flex-col gap-1.5 animate-fade-in">
        <label
          htmlFor="user-form-advisor"
          className="text-sm font-semibold"
          style={{ color: '#374151' }}
        >
          Asesor Vinculado
        </label>
        <div className="relative">
          <div
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: '#9ca3af' }}
          >
            <UserIcon className="h-4 w-4" />
          </div>
          <select
            id="user-form-advisor"
            value={advisorId}
            onChange={(e) => setAdvisorId(e.target.value)}
            className="w-full appearance-none rounded-xl border bg-white text-sm py-3 pl-11 pr-4 transition-all duration-200 focus:outline-none"
            style={{ borderColor: '#e2ebe2', color: '#1a2e1a' }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#16a34a';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e2ebe2';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <option value="">Sin asesor vinculado</option>
            {advisors.map((adv) => (
              <option key={adv.id} value={adv.id}>
                {adv.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Toggle (only for editing) */}
      {isEditing && (
        <Switch
          id="user-form-active"
          checked={isActive}
          onChange={setIsActive}
          label="Estado del usuario"
          description={
            isActive
              ? 'El usuario puede acceder al sistema'
              : 'El acceso del usuario está deshabilitado'
          }
        />
      )}

      {/* Error */}
      <ErrorBanner message={displayError} />

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
        </Button>
      </div>
    </form>
  );
}

/* ─── Outer shell — mounts a fresh UserFormInner on each open ─────────── */
export function UserFormModal({
  isOpen,
  onClose,
  onSubmit,
  roles,
  loading,
  error,
  user,
}: UserFormModalProps) {
  // Changing `key` causes React to unmount + remount UserFormInner,
  // resetting all its state without any useEffect.
  const formKey = isOpen ? (user?.id ?? 'new') : 'closed';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'Editar Usuario' : 'Crear Usuario'}
      maxWidth="520px"
    >
      <UserFormInner
        key={formKey}
        onClose={onClose}
        onSubmit={onSubmit}
        roles={roles}
        loading={loading}
        error={error}
        user={user}
      />
    </Modal>
  );
}
