import { NextResponse } from 'next/server';

const ADVISORS = [
  { uuid: 'a1b2c3d4-e5f6-7890-abcd-111111111111', name: 'Carlos Mendoza' },
  { uuid: 'a1b2c3d4-e5f6-7890-abcd-222222222222', name: 'María González' },
  { uuid: 'a1b2c3d4-e5f6-7890-abcd-333333333333', name: 'José Rodríguez' },
  { uuid: 'a1b2c3d4-e5f6-7890-abcd-444444444444', name: 'Ana Martínez' },
  { uuid: 'a1b2c3d4-e5f6-7890-abcd-555555555555', name: 'Luis Hernández' },
];

export async function GET() {
  return NextResponse.json(ADVISORS);
}
