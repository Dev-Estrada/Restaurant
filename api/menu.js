import { requireAuth } from './_lib/auth.js';
import { isStoreConfigured, readMenu, readPreviousMenu, restorePreviousMenu, writeMenu } from './_lib/store.js';
import { sanitizeMenu, ValidationError } from './_lib/sanitize.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') return await handleGet(req, res);
    if (req.method === 'PUT') return await handlePut(req, res);
    if (req.method === 'POST') return await handleUndo(req, res);

    res.setHeader('Allow', 'GET, PUT, POST');
    return res.status(405).json({ error: 'Método no permitido.' });
  } catch (error) {
    if (error instanceof ValidationError) return res.status(400).json({ error: error.message });
    console.error('[api/menu]', error);
    return res.status(500).json({ error: 'Error al acceder a la carta guardada.' });
  }
}

async function handleGet(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (!isStoreConfigured()) return res.status(204).end();

  const menu = await readMenu();
  if (!menu) return res.status(204).end();

  return res.status(200).json(menu);
}

async function handlePut(req, res) {
  if (!requireAuth(req, res)) return undefined;

  const menu = sanitizeMenu(req.body);
  if (!isStoreConfigured()) {
    return res.status(503).json({
      error: 'El almacenamiento no está configurado. Conecta un store de Vercel Blob al proyecto.'
    });
  }

  await writeMenu(menu);
  return res.status(200).json({ ok: true, menu });
}

async function handleUndo(req, res) {
  if (!requireAuth(req, res)) return undefined;
  if (req.body?.action !== 'undo') return res.status(400).json({ error: 'Acción no reconocida.' });

  const previous = await readPreviousMenu();
  if (!previous) return res.status(404).json({ error: 'No hay ninguna versión anterior guardada.' });

  const restored = await restorePreviousMenu();
  return res.status(200).json({ ok: true, menu: restored });
}
