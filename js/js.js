/**
 * Sidrería El Pasaje - Interactividad
 *
 * Los datos se piden a /api/menu (lo que se guarda desde el panel /admin) y,
 * mientras llegan o si fallan, se usa la copia incluida en menu-data.js.
 */

(function () {
  'use strict';

  const DOM = {
    header: document.getElementById('site-header'),
    navToggle: document.getElementById('nav-toggle'),
    navMobileWrap: document.getElementById('nav-mobile-wrap'),
    navMobileBackdrop: document.getElementById('nav-mobile-backdrop'),
    navMobile: document.getElementById('nav-mobile'),
    menuComidaGrid: document.getElementById('menu-comida-grid'),
    menuBebidasGrid: document.getElementById('menu-bebidas-grid'),
    menuTabs: document.querySelectorAll('.menu-tab'),
    menuPanelComida: document.getElementById('menu-comida'),
    menuPanelBebidas: document.getElementById('menu-bebidas'),
    drawer: document.getElementById('menu-drawer'),
    drawerBackdrop: document.getElementById('drawer-backdrop'),
    drawerClose: document.getElementById('drawer-close'),
    drawerTitle: document.getElementById('drawer-title'),
    drawerList: document.getElementById('drawer-list')
  };

  var LOCAL_MENU = window.RESTAURANT_MENU || { site: {}, food: [], drinks: [] };
  var MENU = LOCAL_MENU;

  // --- Carga de datos ---
  function fetchRemoteMenu() {
    if (!window.fetch) return Promise.resolve(null);
    return fetch('/api/menu', { cache: 'no-store' })
      .then(function (res) { return res.status === 200 ? res.json() : null; })
      .catch(function () { return null; });
  }

  function mergeMenu(remote) {
    return {
      // Los textos locales actúan de valor por defecto para campos aún no guardados.
      site: Object.assign({}, LOCAL_MENU.site, remote.site || {}),
      food: Array.isArray(remote.food) ? remote.food : LOCAL_MENU.food,
      drinks: Array.isArray(remote.drinks) ? remote.drinks : LOCAL_MENU.drinks
    };
  }

  // --- Renderizar carta desde datos ---
  function renderMenuGrid(container, categories, type, instant) {
    if (!container || !Array.isArray(categories)) return;
    var t = type || 'food';
    var revealClass = instant ? 'reveal is-visible' : 'reveal';
    container.innerHTML = categories.map(function (cat) {
      var count = (cat.items || []).length;
      var label = t === 'drinks' ? (count === 1 ? 'opción' : 'opciones') : (count === 1 ? 'plato' : 'platos');
      return (
        '<article class="menu-card ' + revealClass + '" data-category-id="' + escapeHtml(cat.id) + '" data-category-type="' + t + '" tabindex="0" role="button">' +
          '<div class="menu-card-image">' +
            '<img src="' + escapeHtml(cat.image) + '" alt="' + escapeHtml(cat.name) + '" loading="lazy">' +
            '<div class="menu-card-overlay">' +
              '<h3 class="menu-card-title">' + escapeHtml(cat.name) + '</h3>' +
            '</div>' +
          '</div>' +
          '<div class="menu-card-body">' +
            '<span class="menu-card-count">' + count + ' ' + label + '</span>' +
          '</div>' +
        '</article>'
      );
    }).join('');
  }

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /** Los textos editables admiten saltos de línea y **negrita**. */
  function richText(value) {
    return escapeHtml(value)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  function isSafeUrl(value) {
    return /^(https?:\/\/|mailto:|tel:|\/|\.\/|#)/i.test(value);
  }

  // --- Textos e información de contacto ---
  function applySite(site) {
    if (!site) return;

    document.querySelectorAll('[data-site]').forEach(function (el) {
      var value = site[el.getAttribute('data-site')];
      if (typeof value === 'string' && value.trim()) el.innerHTML = richText(value);
    });

    document.querySelectorAll('[data-site-href]').forEach(function (el) {
      var value = site[el.getAttribute('data-site-href')];
      if (value && isSafeUrl(value)) el.setAttribute('href', value);
    });

    document.querySelectorAll('[data-site-tel]').forEach(function (el) {
      var value = site[el.getAttribute('data-site-tel')];
      if (value) el.setAttribute('href', 'tel:' + value.replace(/[^\d+]/g, ''));
    });

    document.querySelectorAll('[data-site-mailto]').forEach(function (el) {
      var value = site[el.getAttribute('data-site-mailto')];
      if (value) el.setAttribute('href', 'mailto:' + value.trim());
    });
  }

  function renderMenu(instant) {
    renderMenuGrid(DOM.menuComidaGrid, MENU.food, 'food', instant);
    renderMenuGrid(DOM.menuBebidasGrid, MENU.drinks, 'drinks', instant);
    bindMenuCards();
  }

  function bindMenuCards() {
    var cards = document.querySelectorAll('.menu-card[data-category-id]');
    cards.forEach(function (card) {
      card.addEventListener('click', openDrawerFromCard);
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDrawerFromCard.call(card);
        }
      });
    });
  }

  function openDrawerFromCard() {
    var id = this.getAttribute('data-category-id');
    var type = this.getAttribute('data-category-type');
    var list = type === 'drinks' ? MENU.drinks : MENU.food;
    var cat = (list || []).find(function (c) { return c.id === id; });
    if (cat) openDrawer(cat.name, cat.items || []);
  }

  function openDrawer(categoryName, items) {
    DOM.drawerTitle.textContent = categoryName;
    DOM.drawerList.innerHTML = items.map(function (item) {
      const desc = item.description ? '<p class="drawer-item-desc">' + escapeHtml(item.description) + '</p>' : '';
      return (
        '<li class="drawer-item">' +
          '<div class="drawer-item-header">' +
            '<span class="drawer-item-name">' + escapeHtml(item.name) + '</span>' +
            '<span class="drawer-item-price">' + escapeHtml(item.price) + '€</span>' +
          '</div>' +
          desc +
        '</li>'
      );
    }).join('');
    DOM.drawer.setAttribute('aria-hidden', 'false');
    DOM.drawer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    DOM.drawerClose.focus();
  }

  function closeDrawer() {
    DOM.drawer.classList.remove('is-open');
    DOM.drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  DOM.drawerBackdrop.addEventListener('click', closeDrawer);
  DOM.drawerClose.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && DOM.drawer.classList.contains('is-open')) closeDrawer();
  });

  // --- Tabs Comida / Bebidas ---
  function setActiveTab(tab) {
    DOM.menuTabs.forEach(function (t) {
      t.classList.toggle('is-active', t === tab);
      t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
    });
    const isComida = tab.getAttribute('data-tab') === 'comida';
    DOM.menuPanelComida.classList.toggle('is-visible', isComida);
    DOM.menuPanelBebidas.classList.toggle('is-visible', !isComida);
  }

  DOM.menuTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      setActiveTab(tab);
    });
  });

  // --- Menú móvil ---
  function closeMobileMenu() {
    DOM.navToggle.classList.remove('is-open');
    if (DOM.navMobileWrap) DOM.navMobileWrap.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function toggleMobileMenu() {
    DOM.navToggle.classList.toggle('is-open');
    if (DOM.navMobileWrap) DOM.navMobileWrap.classList.toggle('is-open');
    document.body.style.overflow = DOM.navMobileWrap && DOM.navMobileWrap.classList.contains('is-open') ? 'hidden' : '';
  }

  DOM.navToggle.addEventListener('click', toggleMobileMenu);
  if (DOM.navMobileBackdrop) DOM.navMobileBackdrop.addEventListener('click', closeMobileMenu);

  document.querySelectorAll('.nav-mobile-link').forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  // --- Scroll: header y smooth ---
  function onScroll() {
    if (window.scrollY > 60) {
      DOM.header.classList.add('is-scrolled');
    } else {
      DOM.header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const top = target.getBoundingClientRect().top + window.pageYOffset;
        const headerOffset = 72;
        window.scrollTo({ top: top - headerOffset, behavior: 'smooth' });
      }
    });
  });

  // --- Scroll reveal ---
  var revealObserver = null;

  function observeReveals() {
    const els = document.querySelectorAll('.reveal:not(.is-visible)');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px -40px 0px', threshold: 0.1 }
      );
    }

    els.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // --- Inicio ---
  function init() {
    applySite(MENU.site);
    renderMenu(false);
    observeReveals();

    fetchRemoteMenu().then(function (remote) {
      if (!remote) return;
      MENU = mergeMenu(remote);
      applySite(MENU.site);
      // Sin animación: el contenido ya estaba pintado con la copia local.
      renderMenu(true);
      observeReveals();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
