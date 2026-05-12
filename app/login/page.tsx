import type { Metadata } from 'next';
import { LoginForm } from '@/components/login/LoginForm';

export const metadata: Metadata = {
  title: 'SIRCA — Iniciar Sesión',
  description: 'Accede al panel de estadísticas de pagos de SIRCA',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #fff7ed 50%, #f0fdf4 100%)' }}
    >
      {/* Decorative circles */}
      <div className="absolute top-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, #16a34a22, transparent 70%)' }}
      />
      <div className="absolute bottom-[-10%] right-[-5%] h-[400px] w-[400px] rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, #f9731622, transparent 70%)' }}
      />

      <LoginForm />
    </div>
  );
}
