import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getUsers } from './googleSheets';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'default-secret-key';

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

let hashedPassword: string | null = null;

export async function getHashedPassword() {
  if (!hashedPassword) {
    hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  }
  return hashedPassword;
}

export async function validateCredentials(username: string, password: string) {
  // Check against Google Sheets first
  try {
    const users = await getUsers();
    const user = users.find((u: any) => {
      const nombre = u.get ? u.get('nombre') : u.nombre;
      const clave = u.get ? u.get('clave') : u.clave;
      const activo = u.get ? u.get('activo') : u.activo;
      return nombre === username && String(clave) === password && String(activo).toUpperCase() === 'TRUE';
    });
    if (user) return true;
  } catch (error) {
    console.error('Error fetching users from Google Sheets:', error);
  }

  // Fallback to ENV admin credentials
  if (username === ADMIN_USER) {
    const hashed = await getHashedPassword();
    return await bcrypt.compare(password, hashed!);
  }

  return false;
}

export function generateToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function hashPassword(password: string) {
  return jwt.sign({ password }, JWT_SECRET);
}