/**
 * Panel de gestión de la carta - Sidrería El Pasaje
 *
 * Edita el objeto completo del menú en memoria y lo envía entero a /api/menu
 * al pulsar "Guardar cambios".
 */
(function () {
  'use strict';

  var MAX_IMAGE_SIDE = 1400;
  var IMAGE_QUALITY = 0.82;
  var TAB_SESSION_KEY = 'pasaje_admin_tab';

  var SITE_GROUPS = [
    {
      title: 'Portada',
      fields: [
        { key: 'heroTagline', label: 'Frase principal' },
        { key: 'heroDesc', label: 'Frase secundaria' },
        { key: 'heroCta', label: 'Texto del botón' }
      ]
    },
    {
      title: 'Sobre nosotros',
      fields: [
        { key: 'aboutText1', label: 'Primer párrafo', multiline: true },
        { key: 'aboutText2', label: 'Segundo párrafo', multiline: true }
      ]
    },
    {
      title: 'Carta',
      fields: [
        { key: 'menuIntro', label: 'Texto bajo el título de la carta' },
        { key: 'allergensNote', label: 'Aviso sobre alérgenos', multiline: true, hint: 'Los 14 iconos de alérgenos son fijos por normativa; aquí solo se cambia el texto que los acompaña.' }
      ]
    },
    {
      title: 'Ubicación y horario',
      fields: [
        { key: 'addressLines', label: 'Dirección', multiline: true, hint: 'Cada línea se muestra en un renglón distinto.' },
        { key: 'mapsUrl', label: 'Enlace de Google Maps' },
        { key: 'hoursLines', label: 'Horario', multiline: true, hint: 'Una línea por tramo. Ejemplo: **Sábados:** 12:00 – 17:00' },
        { key: 'hoursNote', label: 'Nota bajo el horario' }
      ]
    },
    {
      title: 'Contacto y redes',
      fields: [
        { key: 'phone', label: 'Teléfono' },
        { key: 'email', label: 'Correo electrónico' },
        { key: 'facebookUrl', label: 'Enlace de Facebook' },
        { key: 'instagramUrl', label: 'Enlace de Instagram' },
        { key: 'footerAbout', label: 'Texto del pie de página', multiline: true }
      ]
    }
  ];

  var el = {};
  var state = {
    menu: null,
    tab: 'food',
    dirty: false,
    saving: false
  };
  var openCategories = new Set();
  var pendingImageCategory = null;

  // ---------------------------------------------------------------- utilidades

  function $(id) { return document.getElementById(id); }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function toast(message, kind) {
    var node = document.createElement('div');
    node.className = 'toast' + (kind ? ' is-' + kind : '');
    node.textContent = message;
    el.toastStack.appendChild(node);
    setTimeout(function () { node.remove(); }, kind === 'error' ? 6000 : 3500);
  }

  function request(path, options) {
    var config = Object.assign({ headers: {}, credentials: 'same-origin' }, options || {});
    if (config.body && typeof config.body !== 'string') {
      config.headers['Content-Type'] = 'application/json';
      config.body = JSON.stringify(config.body);
    }
    return fetch(path, config).then(function (response) {
      if (response.status === 204) return null;
      return response.json().catch(function () { return {}; }).then(function (data) {
        if (!response.ok) {
          var error = new Error(data.error || 'Ha ocurrido un error inesperado.');
          error.status = response.status;
          throw error;
        }
        return data;
      });
    });
  }

  /**
   * Marca de sesión propia de la pestaña: sessionStorage se borra al cerrarla,
   * así que al volver a abrir /admin siempre hay que introducir la contraseña.
   */
  function markTabSession() {
    try { sessionStorage.setItem(TAB_SESSION_KEY, '1'); } catch (error) { /* almacenamiento no disponible */ }
  }

  function clearTabSession() {
    try { sessionStorage.removeItem(TAB_SESSION_KEY); } catch (error) { /* almacenamiento no disponible */ }
  }

  function hasTabSession() {
    // Si el navegador bloquea sessionStorage se confía en la cookie para no dejar a nadie fuera.
    try { return sessionStorage.getItem(TAB_SESSION_KEY) === '1'; } catch (error) { return true; }
  }

  function handleAuthError(error) {
    if (error.status === 401) {
      showLogin('Tu sesión ha caducado. Vuelve a entrar.');
      return true;
    }
    return false;
  }

  // ---------------------------------------------------------------- estado

  function setDirty(value) {
    state.dirty = value;
    el.saveBtn.disabled = !value || state.saving;
    el.saveStatus.textContent = value ? 'Hay cambios sin guardar' : 'Todo guardado';
    el.saveStatus.classList.toggle('is-dirty', value);
  }

  function currentCategories() {
    return state.menu[state.tab];
  }

  function updateLastSaved() {
    if (!state.menu || !state.menu.updatedAt) {
      el.lastSaved.textContent = '';
      return;
    }
    var date = new Date(state.menu.updatedAt);
    if (isNaN(date.getTime())) return;
    el.lastSaved.textContent = 'Última actualización: ' + date.toLocaleString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  // ---------------------------------------------------------------- render

  function itemLabel(count) {
    if (state.tab === 'drinks') return count === 1 ? '1 opción' : count + ' opciones';
    return count === 1 ? '1 plato' : count + ' platos';
  }

  function renderItem(item, catIndex, itemIndex, total) {
    return (
      '<div class="item">' +
        '<input type="text" class="input" placeholder="Nombre" value="' + escapeHtml(item.name) + '"' +
          ' data-field="item-name" data-cat="' + catIndex + '" data-item="' + itemIndex + '" aria-label="Nombre">' +
        '<input type="text" class="input" placeholder="0.00" value="' + escapeHtml(item.price) + '"' +
          ' data-field="item-price" data-cat="' + catIndex + '" data-item="' + itemIndex + '" aria-label="Precio" inputmode="decimal">' +
        '<input type="text" class="input item-desc" placeholder="Descripción (opcional)" value="' + escapeHtml(item.description) + '"' +
          ' data-field="item-description" data-cat="' + catIndex + '" data-item="' + itemIndex + '" aria-label="Descripción">' +
        '<div class="item-tools">' +
          iconButton('item-up', 'fa-chevron-up', 'Subir', itemIndex === 0, catIndex, itemIndex) +
          iconButton('item-down', 'fa-chevron-down', 'Bajar', itemIndex === total - 1, catIndex, itemIndex) +
          iconButton('item-delete', 'fa-trash-can', 'Eliminar', false, catIndex, itemIndex, true) +
        '</div>' +
      '</div>'
    );
  }

  function iconButton(action, icon, label, disabled, catIndex, itemIndex, danger) {
    return (
      '<button type="button" class="icon-btn' + (danger ? ' is-danger' : '') + '"' +
        ' data-action="' + action + '" data-cat="' + catIndex + '"' +
        (itemIndex === undefined ? '' : ' data-item="' + itemIndex + '"') +
        (disabled ? ' disabled' : '') +
        ' title="' + label + '" aria-label="' + label + '">' +
        '<i class="fas ' + icon + '"></i>' +
      '</button>'
    );
  }

  function renderCategory(category, index, total) {
    var isOpen = openCategories.has(category);
    var items = category.items || [];
    var thumb = category.image
      ? '<img class="category-thumb" src="' + escapeHtml(category.image) + '" alt="">'
      : '<div class="category-thumb is-empty"></div>';

    return (
      '<article class="category' + (isOpen ? ' is-open' : '') + '">' +
        '<div class="category-head">' +
          thumb +
          '<button type="button" class="category-summary" data-action="toggle" data-cat="' + index + '">' +
            '<span class="category-name">' + escapeHtml(category.name || 'Sin nombre') + '</span>' +
            '<span class="category-count">' + itemLabel(items.length) + '</span>' +
          '</button>' +
          '<div class="category-tools">' +
            iconButton('cat-up', 'fa-chevron-up', 'Subir categoría', index === 0, index) +
            iconButton('cat-down', 'fa-chevron-down', 'Bajar categoría', index === total - 1, index) +
            iconButton('cat-delete', 'fa-trash-can', 'Eliminar categoría', false, index, undefined, true) +
            '<button type="button" class="icon-btn" data-action="toggle" data-cat="' + index + '" aria-label="Desplegar">' +
              '<i class="fas fa-chevron-down category-chevron"></i>' +
            '</button>' +
          '</div>' +
        '</div>' +
        '<div class="category-body">' +
          '<div class="category-meta">' +
            '<label class="field">' +
              '<span class="field-label">Nombre de la categoría</span>' +
              '<input type="text" class="input" value="' + escapeHtml(category.name) + '" data-field="cat-name" data-cat="' + index + '">' +
            '</label>' +
            '<div class="field">' +
              '<span class="field-label">Foto de la categoría</span>' +
              '<div class="image-actions">' +
                '<button type="button" class="btn btn-ghost btn-sm" data-action="cat-image" data-cat="' + index + '">' +
                  '<i class="fas fa-image"></i><span>Subir foto</span>' +
                '</button>' +
              '</div>' +
              '<input type="text" class="input" value="' + escapeHtml(category.image) + '" placeholder="o pega aquí la dirección de una imagen" data-field="cat-image" data-cat="' + index + '">' +
            '</div>' +
          '</div>' +
          '<div class="items-head">' +
            '<p class="items-title">' + (state.tab === 'drinks' ? 'Bebidas' : 'Platos') + '</p>' +
            '<button type="button" class="btn btn-ghost btn-sm" data-action="add-item" data-cat="' + index + '">' +
              '<i class="fas fa-plus"></i><span>Añadir</span>' +
            '</button>' +
          '</div>' +
          '<div class="item-list">' +
            (items.length
              ? items.map(function (item, i) { return renderItem(item, index, i, items.length); }).join('')
              : '<p class="empty-state">Todavía no hay nada en esta categoría.</p>') +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function renderCategories() {
    var categories = currentCategories();
    var isDrinks = state.tab === 'drinks';

    el.categoriesTitle.textContent = isDrinks ? 'Bebidas' : 'Comida';
    el.categoriesDesc.textContent = isDrinks
      ? 'Cada categoría es una de las tarjetas que se ven en la pestaña Bebidas de la web.'
      : 'Cada categoría es una de las tarjetas que se ven en la pestaña Comida de la web.';

    el.categoryList.innerHTML = categories.length
      ? categories.map(function (category, index) { return renderCategory(category, index, categories.length); }).join('')
      : '<p class="empty-state">No hay ninguna categoría todavía. Crea la primera con el botón de arriba.</p>';
  }

  function renderSite() {
    var site = state.menu.site || {};
    el.siteFields.innerHTML = SITE_GROUPS.map(function (group) {
      return (
        '<section class="site-group">' +
          '<h3 class="site-group-title">' + escapeHtml(group.title) + '</h3>' +
          group.fields.map(function (field) {
            var value = escapeHtml(site[field.key] || '');
            var control = field.multiline
              ? '<textarea class="textarea" data-site-field="' + field.key + '" rows="3">' + value + '</textarea>'
              : '<input type="text" class="input" data-site-field="' + field.key + '" value="' + value + '">';
            var hint = field.hint ? '<p class="field-hint">' + escapeHtml(field.hint) + '</p>' : '';
            return '<label class="field"><span class="field-label">' + escapeHtml(field.label) + '</span>' + control + hint + '</label>';
          }).join('') +
        '</section>'
      );
    }).join('');
  }

  function render() {
    var isSite = state.tab === 'site';
    el.panelCategories.hidden = isSite;
    el.panelSite.hidden = !isSite;
    if (isSite) renderSite();
    else renderCategories();
  }

  // ---------------------------------------------------------------- acciones

  function moveInArray(list, from, to) {
    if (to < 0 || to >= list.length) return;
    var moved = list.splice(from, 1)[0];
    list.splice(to, 0, moved);
  }

  function handleAction(action, catIndex, itemIndex, target) {
    var categories = currentCategories();
    var category = categories[catIndex];
    if (!category) return;

    if (action === 'toggle') {
      if (openCategories.has(category)) openCategories.delete(category);
      else openCategories.add(category);
      target.closest('.category').classList.toggle('is-open');
      return;
    }

    if (action === 'cat-up' || action === 'cat-down') {
      moveInArray(categories, catIndex, catIndex + (action === 'cat-up' ? -1 : 1));
      setDirty(true);
      renderCategories();
      return;
    }

    if (action === 'cat-delete') {
      if (!confirm('¿Eliminar la categoría "' + (category.name || 'sin nombre') + '" y todo su contenido?')) return;
      categories.splice(catIndex, 1);
      openCategories.delete(category);
      setDirty(true);
      renderCategories();
      return;
    }

    if (action === 'cat-image') {
      pendingImageCategory = category;
      el.fileInput.value = '';
      el.fileInput.click();
      return;
    }

    if (action === 'add-item') {
      category.items.push({ name: '', price: '', description: '' });
      openCategories.add(category);
      setDirty(true);
      renderCategories();
      focusLastItem(catIndex);
      return;
    }

    if (action === 'item-up' || action === 'item-down') {
      moveInArray(category.items, itemIndex, itemIndex + (action === 'item-up' ? -1 : 1));
      setDirty(true);
      renderCategories();
      return;
    }

    if (action === 'item-delete') {
      var item = category.items[itemIndex];
      if (item.name && !confirm('¿Eliminar "' + item.name + '"?')) return;
      category.items.splice(itemIndex, 1);
      setDirty(true);
      renderCategories();
    }
  }

  function focusLastItem(catIndex) {
    var inputs = el.categoryList.querySelectorAll('[data-field="item-name"][data-cat="' + catIndex + '"]');
    var last = inputs[inputs.length - 1];
    if (last) {
      last.focus();
      last.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }

  function addCategory() {
    var categories = currentCategories();
    var category = { id: '', name: 'Nueva categoría', image: '', items: [] };
    categories.push(category);
    openCategories.add(category);
    setDirty(true);
    renderCategories();

    var input = el.categoryList.querySelector('[data-field="cat-name"][data-cat="' + (categories.length - 1) + '"]');
    if (input) {
      input.focus();
      input.select();
      input.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }

  // ---------------------------------------------------------------- imágenes

  function compressImage(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var image = new Image();
      image.onload = function () {
        URL.revokeObjectURL(url);
        var scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(image.width, image.height));
        var canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * scale) || 1;
        canvas.height = Math.round(image.height * scale) || 1;
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', IMAGE_QUALITY));
      };
      image.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error('No se ha podido leer la imagen. Prueba con un archivo JPG o PNG.'));
      };
      image.src = url;
    });
  }

  function onFileSelected(event) {
    var file = event.target.files && event.target.files[0];
    var category = pendingImageCategory;
    pendingImageCategory = null;
    if (!file || !category) return;

    toast('Subiendo la imagen…');
    compressImage(file)
      .then(function (dataUrl) {
        return request('/api/upload', { method: 'POST', body: { filename: category.name || 'categoria', dataUrl: dataUrl } });
      })
      .then(function (data) {
        category.image = data.url;
        setDirty(true);
        renderCategories();
        toast('Imagen subida. Recuerda guardar los cambios.', 'success');
      })
      .catch(function (error) {
        if (!handleAuthError(error)) toast(error.message, 'error');
      });
  }

  // ---------------------------------------------------------------- guardar

  function save() {
    if (state.saving) return;
    state.saving = true;
    el.saveBtn.disabled = true;
    el.saveStatus.textContent = 'Guardando…';

    request('/api/menu', { method: 'PUT', body: state.menu })
      .then(function (data) {
        syncServerIds(data.menu);
        state.menu.updatedAt = data.menu.updatedAt;
        updateLastSaved();
        setDirty(false);
        toast('Cambios publicados en la web.', 'success');
      })
      .catch(function (error) {
        setDirty(true);
        if (!handleAuthError(error)) toast(error.message, 'error');
      })
      .then(function () {
        state.saving = false;
        el.saveBtn.disabled = !state.dirty;
      });
  }

  /** El servidor genera los identificadores de categoría; se copian sin recrear los objetos locales. */
  function syncServerIds(saved) {
    ['food', 'drinks'].forEach(function (key) {
      (saved[key] || []).forEach(function (category, index) {
        if (state.menu[key][index]) state.menu[key][index].id = category.id;
      });
    });
  }

  function undo() {
    if (!confirm('Se recuperará la versión anterior a tu último guardado. ¿Continuar?')) return;

    request('/api/menu', { method: 'POST', body: { action: 'undo' } })
      .then(function (data) {
        applyMenu(data.menu);
        setDirty(false);
        render();
        toast('Se ha restaurado la versión anterior.', 'success');
      })
      .catch(function (error) {
        if (!handleAuthError(error)) toast(error.message, 'error');
      });
  }

  // ---------------------------------------------------------------- carga

  function normalizeMenu(raw) {
    var source = raw || {};
    return {
      site: Object.assign({}, source.site || {}),
      food: normalizeCategories(source.food),
      drinks: normalizeCategories(source.drinks),
      updatedAt: source.updatedAt || ''
    };
  }

  function normalizeCategories(list) {
    return (Array.isArray(list) ? list : []).map(function (category) {
      return {
        id: category.id || '',
        name: category.name || '',
        image: category.image || '',
        items: (Array.isArray(category.items) ? category.items : []).map(function (item) {
          return { name: item.name || '', price: item.price || '', description: item.description || '' };
        })
      };
    });
  }

  function applyMenu(raw) {
    state.menu = normalizeMenu(raw);
    openCategories = new Set();
    updateLastSaved();
  }

  function loadMenu() {
    return request('/api/menu').then(function (data) {
      if (data) {
        applyMenu(data);
        el.seedNotice.hidden = true;
      } else {
        applyMenu(window.RESTAURANT_MENU);
        el.seedNotice.hidden = false;
        el.seedNotice.innerHTML = '<strong>Primer uso.</strong> Se ha cargado la carta que hay ahora mismo en la web. ' +
          'Pulsa <strong>Guardar cambios</strong> una vez para empezar a gestionarla desde aquí.';
        setDirty(true);
      }
      render();
    });
  }

  // ---------------------------------------------------------------- sesión

  function showLogin(message) {
    clearTabSession();
    state.dirty = false;
    el.app.hidden = true;
    el.loginScreen.hidden = false;
    el.loginError.hidden = !message;
    if (message) el.loginError.textContent = message;
    el.loginPassword.value = '';
    el.loginPassword.focus();
  }

  function showApp(status) {
    markTabSession();
    el.loginScreen.hidden = true;
    el.app.hidden = false;

    if (!status.storeConfigured) {
      el.setupNotice.hidden = false;
      el.setupNotice.innerHTML = '<strong>Falta configurar el almacenamiento.</strong> ' +
        'Conecta un store de Vercel Blob al proyecto para poder guardar los cambios.';
    } else {
      el.setupNotice.hidden = true;
    }

    loadMenu().catch(function (error) {
      if (!handleAuthError(error)) toast(error.message, 'error');
    });
  }

  function login(event) {
    event.preventDefault();
    el.loginSubmit.disabled = true;
    el.loginError.hidden = true;

    request('/api/session', { method: 'POST', body: { password: el.loginPassword.value } })
      .then(function (data) {
        showApp({ storeConfigured: data.storeConfigured });
      })
      .catch(function (error) {
        el.loginError.textContent = error.message;
        el.loginError.hidden = false;
      })
      .then(function () {
        el.loginSubmit.disabled = false;
      });
  }

  function logout() {
    if (state.dirty && !confirm('Tienes cambios sin guardar. ¿Salir de todas formas?')) return;
    request('/api/session', { method: 'DELETE' })
      .catch(function () { /* la sesión se cierra igualmente en el navegador */ })
      .then(function () {
        state.dirty = false;
        showLogin('');
      });
  }

  // ---------------------------------------------------------------- eventos

  function onListClick(event) {
    var button = event.target.closest('[data-action]');
    if (!button) return;
    event.preventDefault();
    handleAction(
      button.getAttribute('data-action'),
      Number(button.getAttribute('data-cat')),
      button.hasAttribute('data-item') ? Number(button.getAttribute('data-item')) : undefined,
      button
    );
  }

  function onListInput(event) {
    var input = event.target.closest('[data-field]');
    if (!input) return;

    var field = input.getAttribute('data-field');
    var category = currentCategories()[Number(input.getAttribute('data-cat'))];
    if (!category) return;

    if (field === 'cat-name') {
      category.name = input.value;
      var heading = input.closest('.category').querySelector('.category-name');
      if (heading) heading.textContent = input.value || 'Sin nombre';
    } else if (field === 'cat-image') {
      category.image = input.value.trim();
    } else {
      var item = category.items[Number(input.getAttribute('data-item'))];
      if (!item) return;
      if (field === 'item-name') item.name = input.value;
      else if (field === 'item-price') item.price = input.value;
      else if (field === 'item-description') item.description = input.value;
    }

    setDirty(true);
  }

  function onSiteInput(event) {
    var input = event.target.closest('[data-site-field]');
    if (!input) return;
    state.menu.site[input.getAttribute('data-site-field')] = input.value;
    setDirty(true);
  }

  function switchTab(tab) {
    state.tab = tab;
    Array.prototype.forEach.call(el.tabs.children, function (button) {
      button.classList.toggle('is-active', button.getAttribute('data-tab') === tab);
    });
    render();
  }

  function init() {
    el = {
      loginScreen: $('login-screen'),
      loginForm: $('login-form'),
      loginPassword: $('login-password'),
      loginError: $('login-error'),
      loginSubmit: $('login-submit'),
      app: $('admin-app'),
      tabs: $('admin-tabs'),
      setupNotice: $('setup-notice'),
      seedNotice: $('seed-notice'),
      panelCategories: $('panel-categories'),
      panelSite: $('panel-site'),
      categoriesTitle: $('categories-title'),
      categoriesDesc: $('categories-desc'),
      categoryList: $('category-list'),
      siteFields: $('site-fields'),
      addCategory: $('add-category'),
      saveBtn: $('save-btn'),
      saveStatus: $('save-status'),
      undoBtn: $('undo-btn'),
      logoutBtn: $('logout-btn'),
      lastSaved: $('last-saved'),
      toastStack: $('toast-stack')
    };

    el.fileInput = document.createElement('input');
    el.fileInput.type = 'file';
    el.fileInput.accept = 'image/jpeg,image/png,image/webp';
    el.fileInput.hidden = true;
    document.body.appendChild(el.fileInput);

    el.loginForm.addEventListener('submit', login);
    el.logoutBtn.addEventListener('click', logout);
    el.undoBtn.addEventListener('click', undo);
    el.saveBtn.addEventListener('click', save);
    el.addCategory.addEventListener('click', addCategory);
    el.categoryList.addEventListener('click', onListClick);
    el.categoryList.addEventListener('input', onListInput);
    el.siteFields.addEventListener('input', onSiteInput);
    el.fileInput.addEventListener('change', onFileSelected);

    el.tabs.addEventListener('click', function (event) {
      var button = event.target.closest('[data-tab]');
      if (button) switchTab(button.getAttribute('data-tab'));
    });

    window.addEventListener('beforeunload', function (event) {
      if (!state.dirty) return;
      event.preventDefault();
      event.returnValue = '';
    });

    request('/api/session')
      .then(function (status) {
        if (status.authenticated && hasTabSession()) {
          showApp(status);
          return undefined;
        }
        if (status.authenticated) {
          // Cookie viva pero pestaña nueva: se cierra la sesión antes de pedir la contraseña.
          return request('/api/session', { method: 'DELETE' })
            .catch(function () { /* la sesión se descarta igualmente en el navegador */ })
            .then(function () { showLogin(''); });
        }
        showLogin(status.passwordConfigured ? '' : 'Falta configurar la contraseña (ADMIN_PASSWORD) en Vercel.');
        return undefined;
      })
      .catch(function () {
        showLogin('No se ha podido conectar con el servidor.');
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
