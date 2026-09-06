import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, generateToken } from '@/lib/auth';
import * as jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;
    
    if (!username || !password) {
      return NextResponse.json({ error: 'Usuario y contraseña requeridos' }, { status: 400 });
    }
    
    const isValid = await validateCredentials(username, password);
    
    if (!isValid) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }
    
    const token = generateToken({ username });
    
    const response = NextResponse.json({ success: true });
    response.headers.set('Set-Cookie', `admin-token=${token}; Path=/admin; HttpOnly; Max-Age=${60 * 60 * 24}`);
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(/admin-token=([^;]+)/);
  const token = match ? match[1] : undefined;
  
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'default-secret-key');
    return NextResponse.json({ authenticated: true, user: decoded });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

export async function DELETE(req: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.headers.set('Set-Cookie', `admin-token=; Path=/admin; HttpOnly; Max-Age=0`);
  return response;
}