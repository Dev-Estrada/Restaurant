import {
  buildLogoutCookie,
  buildSessionCookie,
  checkPassword,
  isAuthenticated,
  isPasswordConfigured
} from './_lib/auth.js';
import { isStoreConfigured } from './_lib/store.js';

/** Retraso fijo ante contraseña incorrecta para desincentivar la fuerza bruta. */
const FAILED_LOGIN_DELAY_MS = 700;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    return res.status(200).json({
      authenticated: isAuthenticated(req),
      passwordConfigured: isPasswordConfigured(),
      storeConfigured: isStoreConfigured()
    });
  }

  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', buildLogoutCookie(req));
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'POST') {
    if (!isPasswordConfigured()) {
      return res.status(503).json({
        error: 'Falta configurar la variable de entorno ADMIN_PASSWORD en Vercel.'
      });
    }

    if (!checkPassword(req.body?.password)) {
      await new Promise((resolve) => setTimeout(resolve, FAILED_LOGIN_DELAY_MS));
      return res.status(401).json({ error: 'Contraseña incorrecta.' });
    }

    res.setHeader('Set-Cookie', buildSessionCookie(req));
    return res.status(200).json({ ok: true, storeConfigured: isStoreConfigured() });
  }

  res.setHeader('Allow', 'GET, POST, DELETE');
  return res.status(405).json({ error: 'Método no permitido.' });
}
