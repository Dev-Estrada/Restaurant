const MAX_CATEGORIES = 60;
const MAX_ITEMS_PER_CATEGORY = 200;
const MAX_SITE_FIELDS = 60;

const LIMIT = {
  id: 60,
  name: 140,
  price: 24,
  description: 500,
  image: 800,
  siteValue: 3000
};

class ValidationError extends Error {}

function text(value, max, field) {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') throw new ValidationError(`El campo "${field}" debe ser texto.`);
  return value.replace(/\s+/g, ' ').trim().slice(0, max);
}

function multilineText(value, max, field) {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') throw new ValidationError(`El campo "${field}" debe ser texto.`);
  return value.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ').trim().slice(0, max);
}

function slugify(value, fallback) {
  const slug = String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, LIMIT.id);
  return slug || fallback;
}

/** Solo se aceptan rutas locales y URLs http(s), nunca javascript: ni data:. */
function safeUrl(value, field) {
  const raw = text(value, LIMIT.image, field);
  if (!raw) return '';
  if (/^(\.\/|\/)[^\s]*$/.test(raw)) return raw;
  if (/^https?:\/\/[^\s]+$/i.test(raw)) return raw;
  if (/^(mailto:|tel:)[^\s]+$/i.test(raw)) return raw;
  throw new ValidationError(`La dirección de "${field}" no es válida.`);
}

function sanitizeItem(raw, categoryName) {
  if (!raw || typeof raw !== 'object') throw new ValidationError('Hay un plato con formato incorrecto.');
  const name = text(raw.name, LIMIT.name, 'nombre del plato');
  if (!name) throw new ValidationError(`Hay un plato sin nombre en "${categoryName}".`);

  const item = { name, price: text(raw.price, LIMIT.price, 'precio') };
  const description = text(raw.description, LIMIT.description, 'descripción');
  if (description) item.description = description;
  return item;
}

function sanitizeCategories(rawList, label) {
  if (!Array.isArray(rawList)) throw new ValidationError(`La sección "${label}" debe ser una lista.`);
  if (rawList.length > MAX_CATEGORIES) throw new ValidationError(`Demasiadas categorías en "${label}".`);

  const usedIds = new Set();
  return rawList.map((rawCategory, index) => {
    if (!rawCategory || typeof rawCategory !== 'object') {
      throw new ValidationError(`Hay una categoría con formato incorrecto en "${label}".`);
    }
    const name = text(rawCategory.name, LIMIT.name, 'nombre de la categoría');
    if (!name) throw new ValidationError(`Hay una categoría sin nombre en "${label}".`);

    let id = slugify(rawCategory.id || name, `categoria-${index + 1}`);
    while (usedIds.has(id)) id = `${id}-${index + 1}`;
    usedIds.add(id);

    const items = Array.isArray(rawCategory.items) ? rawCategory.items : [];
    if (items.length > MAX_ITEMS_PER_CATEGORY) {
      throw new ValidationError(`La categoría "${name}" tiene demasiados platos.`);
    }

    return {
      id,
      name,
      image: safeUrl(rawCategory.image, `imagen de ${name}`),
      items: items.map((item) => sanitizeItem(item, name))
    };
  });
}

function sanitizeSite(raw) {
  if (raw === undefined || raw === null) return {};
  if (typeof raw !== 'object' || Array.isArray(raw)) throw new ValidationError('La información del sitio no es válida.');

  const entries = Object.entries(raw).slice(0, MAX_SITE_FIELDS);
  const site = {};
  for (const [key, value] of entries) {
    if (!/^[a-zA-Z][a-zA-Z0-9_]{0,39}$/.test(key)) continue;
    if (/Url$/.test(key)) {
      site[key] = safeUrl(value, key);
    } else {
      site[key] = multilineText(value, LIMIT.siteValue, key);
    }
  }
  return site;
}

export function sanitizeMenu(raw) {
  if (!raw || typeof raw !== 'object') throw new ValidationError('No se ha recibido ninguna carta.');
  return {
    site: sanitizeSite(raw.site),
    food: sanitizeCategories(raw.food, 'Comida'),
    drinks: sanitizeCategories(raw.drinks, 'Bebidas'),
    updatedAt: new Date().toISOString()
  };
}

export { ValidationError };
