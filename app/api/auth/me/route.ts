import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

/**
 * GET /api/auth/me
 * Lee la cookie httpOnly "sirca-session", verifica el token y devuelve
 * los datos de sesión (userId, email, role, permissions).
 * Devuelve 401 si no hay sesión válida.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('sirca-session');

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const payload = await verifyToken(sessionCookie.value);

    if (!payload) {
      return NextResponse.json({ error: 'Sesión inválida o expirada' }, { status: 401 });
    }

    return NextResponse.json({
      userId: payload.userId,
      email: payload.email,
      role: payload.role ?? null,
      permissions: Array.isArray(payload.permissions) ? payload.permissions : [],
    });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
