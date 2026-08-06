import { requireAuth } from './_lib/auth.js';
import { isStoreConfigured, uploadImage } from './_lib/store.js';

const MAX_BYTES = 4 * 1024 * 1024;
const EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido.' });
  }

  if (!requireAuth(req, res)) return undefined;

  if (!isStoreConfigured()) {
    return res.status(503).json({
      error: 'El almacenamiento no está configurado. Conecta un store de Vercel Blob al proyecto.'
    });
  }

  const dataUrl = req.body?.dataUrl;
  if (typeof dataUrl !== 'string') return res.status(400).json({ error: 'No se ha recibido ninguna imagen.' });

  const match = /^data:([^;,]+);base64,(.+)$/s.exec(dataUrl);
  if (!match) return res.status(400).json({ error: 'El formato de la imagen no es válido.' });

  const contentType = match[1].toLowerCase();
  const extension = EXTENSIONS[contentType];
  if (!extension) return res.status(400).json({ error: 'Solo se admiten imágenes JPG, PNG o WebP.' });

  const buffer = Buffer.from(match[2], 'base64');
  if (!buffer.length) return res.status(400).json({ error: 'La imagen está vacía.' });
  if (buffer.length > MAX_BYTES) return res.status(413).json({ error: 'La imagen es demasiado grande.' });

  const name = slugify(req.body?.filename) || 'imagen';

  try {
    const url = await uploadImage(buffer, `${name}.${extension}`, contentType);
    return res.status(200).json({ url });
  } catch (error) {
    console.error('[api/upload]', error);
    return res.status(500).json({ error: 'No se ha podido guardar la imagen.' });
  }
}

function slugify(value) {
  return String(value || '')
    .replace(/\.[^.]+$/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}
