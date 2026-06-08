'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al iniciar sesión');
        return;
      }

      // Store user info in sessionStorage for client-side access
      if (data.user) {
        sessionStorage.setItem('sirca-user', JSON.stringify(data.user));
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-[slideUp_0.5s_ease-out]">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.jpg"
          alt="SIRCA Planes de Salud"
          className="h-16 w-auto object-contain mb-2"
        />
        <p className="text-sm font-medium" style={{ color: '#6b7f6b' }}>
          Panel de Administración
        </p>
      </div>

      {/* Card */}
      <div
        className="rounded-2xl border bg-white shadow-lg shadow-black/[0.06] p-8"
        style={{ borderColor: '#e2ebe2' }}
      >
        <h2 className="text-xl font-bold mb-1" style={{ color: '#1a2e1a' }}>
          Iniciar Sesión
        </h2>
        <p className="text-sm mb-6" style={{ color: '#6b7f6b' }}>
          Ingresa tus credenciales para acceder al panel
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            id="login-email"
            label="Correo Electrónico"
            type="email"
            placeholder="tu@correo.com"
            icon={<Mail className="h-4 w-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Input
            id="login-password"
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="h-4 w-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {error && (
            <div
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm animate-[shake_0.4s_ease-in-out]"
              style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c' }}
            >
              <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} size="lg" className="w-full mt-1">
            Ingresar
          </Button>
        </form>
      </div>

      <p className="text-center text-xs mt-6" style={{ color: '#9ca3af' }}>
        SIRCA © {new Date().getFullYear()} — Salud y Bienestar
      </p>
    </div>
  );
}
