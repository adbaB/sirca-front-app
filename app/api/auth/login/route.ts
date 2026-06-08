import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3000';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son obligatorios' }, { status: 400 });
    }

    // Authenticate against the NestJS backend
    const backendRes = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!backendRes.ok) {
      const errorData = await backendRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Credenciales incorrectas' },
        { status: backendRes.status },
      );
    }

    const loginData = await backendRes.json();

    // Extract the access_token cookie set by the backend
    const setCookieHeader = backendRes.headers.get('set-cookie');
    let backendToken: string | null = null;
    if (setCookieHeader) {
      const match = setCookieHeader.match(/access_token=([^;]+)/);
      if (match) backendToken = match[1];
    }

    // Sign a frontend session token containing user data
    const sessionPayload = {
      userId: loginData.user.id,
      email: loginData.user.email,
      role: loginData.user.role?.name ?? null,
      permissions: loginData.user.permissions ?? [],
      advisorId: loginData.user.advisorId ?? null,
    };

    const token = await signToken(sessionPayload);

    const response = NextResponse.json({
      success: true,
      user: loginData.user,
    });

    // Set the frontend session cookie
    response.cookies.set('sirca-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    // Forward the backend's access_token cookie (for proxied API calls)
    if (backendToken) {
      response.cookies.set('access_token', backendToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 8, // 8 hours (matches backend)
      });
    }

    return response;
  } catch {
    return NextResponse.json({ error: 'Error procesando la solicitud' }, { status: 500 });
  }
}
