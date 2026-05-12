import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const validUsername = process.env.DASHBOARD_USERNAME;
    const validPassword = process.env.DASHBOARD_PASSWORD;

    if (!validUsername || !validPassword) {
      return NextResponse.json(
        { error: 'Credenciales del servidor no configuradas' },
        { status: 500 },
      );
    }

    if (username !== validUsername || password !== validPassword) {
      return NextResponse.json(
        { error: 'Usuario o contraseña incorrectos' },
        { status: 401 },
      );
    }

    // Sign a 24h token
    const token = await signToken({ username });

    const response = NextResponse.json({ success: true });

    response.cookies.set('sirca-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Error procesando la solicitud' },
      { status: 400 },
    );
  }
}
