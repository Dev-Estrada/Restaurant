import crypto from 'node:crypto';

const COOKIE_NAME = 'pasaje_admin';
const SESSION_HOURS = 12;

/**
 * La clave de firma se deriva de ADMIN_PASSWORD: al cambiar la contraseña
 * caducan automáticamente todas las sesiones abiertas.
 */
function signingKey() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return crypto.createHash('sha256').update(`el-pasaje::${password}`).digest();
}

export function isPasswordConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function checkPassword(candidate) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || typeof candidate !== 'string') return false;
  const a = crypto.createHash('sha256').update(candidate).digest();
  const b = crypto.createHash('sha256').update(password).digest();
  return crypto.timingSafeEqual(a, b);
}

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const index = part.indexOf('=');
    if (index === -1) continue;
    out[part.slice(0, index).trim()] = decodeURIComponent(part.slice(index + 1).trim());
  }
  return out;
}

function isLocalHost(req) {
  const host = req.headers['x-forwarded-host'] || req.headers.host || '';
  return /^(localhost|127\.0\.0\.1|\[::1\])(:|$)/.test(host);
}

/**
 * Cookie de sesión sin Max-Age: el navegador la descarta al cerrarse. La firma
 * lleva además una caducidad propia como tope máximo.
 */
export function buildSessionCookie(req) {
  const expiresAt = String(Date.now() + SESSION_HOURS * 3600 * 1000);
  const signature = crypto.createHmac('sha256', signingKey()).update(expiresAt).digest('hex');
  return cookieString(`${expiresAt}.${signature}`, req, null);
}

export function buildLogoutCookie(req) {
  return cookieString('', req, 0);
}

function cookieString(value, req, maxAge) {
  const parts = [`${COOKIE_NAME}=${value}`, 'Path=/', 'HttpOnly', 'SameSite=Lax'];
  if (maxAge !== null) parts.push(`Max-Age=${maxAge}`);
  if (!isLocalHost(req)) parts.push('Secure');
  return parts.join('; ');
}

export function isAuthenticated(req) {
  const key = signingKey();
  if (!key) return false;

  const raw = parseCookies(req.headers.cookie)[COOKIE_NAME];
  if (!raw) return false;

  const [expiresAt, signature] = raw.split('.');
  if (!expiresAt || !signature) return false;

  const expected = crypto.createHmac('sha256', key).update(expiresAt).digest('hex');
  if (signature.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;

  return Number(expiresAt) > Date.now();
}

export function requireAuth(req, res) {
  if (isAuthenticated(req)) return true;
  res.status(401).json({ error: 'Sesión no válida o caducada. Vuelve a iniciar sesión.' });
  return false;
}
