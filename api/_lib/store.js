import { put, list } from '@vercel/blob';

const MENU_PATH = 'data/menu.json';
const PREVIOUS_PATH = 'data/menu-previous.json';

export function isStoreConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function findBlob(pathname) {
  const { blobs } = await list({ prefix: pathname, limit: 10 });
  return blobs.find((blob) => blob.pathname === pathname) || null;
}

async function readJson(pathname) {
  const blob = await findBlob(pathname);
  if (!blob) return null;
  // El parámetro extra evita servir una copia cacheada tras sobrescribir el blob.
  const response = await fetch(`${blob.url}?v=${Date.now()}`, { cache: 'no-store' });
  if (!response.ok) return null;
  return response.json();
}

async function writeJson(pathname, data) {
  await put(pathname, JSON.stringify(data), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0
  });
}

export function readMenu() {
  return readJson(MENU_PATH);
}

export function readPreviousMenu() {
  return readJson(PREVIOUS_PATH);
}

export async function writeMenu(menu) {
  const current = await readMenu();
  if (current) await writeJson(PREVIOUS_PATH, current);
  await writeJson(MENU_PATH, menu);
}

export async function restorePreviousMenu() {
  const previous = await readPreviousMenu();
  if (!previous) return null;
  await writeMenu(previous);
  return previous;
}

export async function uploadImage(buffer, filename, contentType) {
  const blob = await put(`img/${filename}`, buffer, {
    access: 'public',
    contentType,
    addRandomSuffix: true
  });
  return blob.url;
}
