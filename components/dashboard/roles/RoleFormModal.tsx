'use client';

import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorBanner } from '@/components/ui/ErrorBanner';

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description?: string }) => Promise<void>;
  loading: boolean;
  error: string;
}

function RoleFormInner({ onClose, onSubmit, loading, error }: Omit<RoleFormModalProps, 'isOpen'>) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim()) {
      setValidationError('El nombre del rol es obligatorio');
      return;
    }
    if (name.trim().length < 2) {
      setValidationError('El nombre debe tener al menos 2 caracteres');
      return;
    }

    await onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
    });
  };

  const displayError = validationError || error;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        id="role-form-name"
        label="Nombre del Rol"
        type="text"
        placeholder="ej: Administrador, Supervisor..."
        icon={<FileText className="h-4 w-4" />}
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="off"
      />

      {/* Description (textarea-like via Input + extra rows via CSS trick) */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="role-form-desc"
          className="text-sm font-semibold"
          style={{ color: '#374151' }}
        >
          Descripción{' '}
          <span className="font-normal" style={{ color: '#9ca3af' }}>
            (opcional)
          </span>
        </label>
        <textarea
          id="role-form-desc"
          rows={3}
          placeholder="Breve descripción del rol y sus responsabilidades..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-xl border text-sm px-4 py-3 resize-none transition-all duration-200 focus:outline-none"
          style={{ borderColor: '#e2ebe2', color: '#1a2e1a' }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#16a34a';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#e2ebe2';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Error */}
      <ErrorBanner message={displayError} />

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          Crear Rol
        </Button>
      </div>
    </form>
  );
}

export function RoleFormModal({ isOpen, onClose, onSubmit, loading, error }: RoleFormModalProps) {
  const formKey = isOpen ? 'new' : 'closed';
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Rol" maxWidth="480px">
      <RoleFormInner
        key={formKey}
        onClose={onClose}
        onSubmit={onSubmit}
        loading={loading}
        error={error}
      />
    </Modal>
  );
}
