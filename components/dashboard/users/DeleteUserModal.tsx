'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { User } from '@/lib/types';

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  user: User;
  loading: boolean;
}

export function DeleteUserModal({ isOpen, onClose, onConfirm, user, loading }: DeleteUserModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Eliminar Usuario" maxWidth="440px">
      <div className="flex flex-col items-center text-center gap-4 py-2">
        <div
          className="h-16 w-16 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: '#fef2f2' }}
        >
          <AlertTriangle className="h-8 w-8" style={{ color: '#dc2626' }} />
        </div>

        <div>
          <p className="text-base font-semibold mb-1" style={{ color: '#1a2e1a' }}>
            ¿Estás seguro?
          </p>
          <p className="text-sm" style={{ color: '#6b7f6b' }}>
            Esta acción eliminará permanentemente al usuario{' '}
            <span className="font-semibold" style={{ color: '#1a2e1a' }}>
              {user.email}
            </span>
            . Esta acción no se puede deshacer.
          </p>
        </div>

        <div className="flex gap-3 w-full pt-2">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={onConfirm}
            loading={loading}
          >
            Eliminar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
