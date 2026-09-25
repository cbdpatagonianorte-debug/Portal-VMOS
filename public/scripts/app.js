// ============================================================
// Interactivos del Portal Faro Energético / VMOS
// Buscar, Notificaciones, Modo Oscuro, Suscripción
// ============================================================

(function () {
  'use strict';

  function storageGet(key, fallback) {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? JSON.parse(val) : fallback;
    } catch { return fallback; }
  }
  function storageSet(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }

  // ─── MODO OSCURO / CLARO ───────────────────────────────
  function initDarkMode() {
    const html = document.documentElement;
    const stored = storageGet('vmos-theme', null);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (stored === 'dark' || (!stored && prefersDark)) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    const toggleBtn = document.querySelector('[data-theme-toggle]');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        const isDark = html.classList.toggle('dark');
        storageSet('vmos-theme', isDark ? 'dark' : 'light');
        window.dispatchEvent(new CustomEvent('theme-change', { detail: { isDark } }));
        updateIcon(toggleBtn, isDark);
      });
      updateIcon(toggleBtn, html.classList.contains('dark'));
    }
  }

  function updateIcon(btn, isDark) {
    const icon = btn.querySelector('.theme-icon');
    if (icon) icon.textContent = isDark ? 'light_mode' : 'wb_sunny';
    btn.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  }

  // ─── BUSCADOR ──────────────────────────────────────────
  function initSearch() {
    const searchBtn = document.querySelector('[data-search-toggle]');
    const modal = document.getElementById('search-modal');
    const input = document.getElementById('search-input');
    const results = document.getElementById('search-results');
    const closeBtn = document.getElementById('search-close');

    if (!searchBtn || !modal) return;

    searchBtn.addEventListener('click', function () {
      modal.classList.remove('hidden');
      setTimeout(function () { if (input) input.focus(); }, 50);
    });

    function close() { modal.classList.add('hidden'); if (results) results.innerHTML = ''; }
    if (closeBtn) closeBtn.addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) close();
    });

    let timer;
    if (input) {
      input.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(function () { doSearch(input.value.trim()); }, 200);
      });
    }

    function doSearch(query) {
      if (query.length < 2) { if (results) { results.innerHTML = ''; results.classList.add('hidden'); } return; }
      const q = query.toLowerCase();
      const all = window.__VMOS_ARTICLES__ || [];
      const filtered = all.filter(function (a) {
        return (a.title || '').toLowerCase().includes(q) ||
          (a.description || '').toLowerCase().includes(q) ||
          (a.category || '').toLowerCase().includes(q) ||
          (a.section || '').toLowerCase().includes(q) ||
          (a.tags || []).some(function (t) { return (t || '').toLowerCase().includes(q); });
      });
      renderResults(filtered, query);
    }

    function renderResults(items, query) {
      if (!results) return;
      if (items.length === 0) {
        results.innerHTML = '<div class="p-4 text-center text-gray-500 text-sm"><span class="material-symbols-outlined text-xl mb-1 block">search_off</span>No se encontraron resultados</div>';
      } else {
        results.innerHTML = items.slice(0, 8).map(function (a) {
          return '<a href="' + (a.href || '#') + '" class="flex items-start gap-3 p-3 hover:bg-surface-container rounded transition-colors">' +
            '<span class="material-symbols-outlined text-primary text-lg">article</span>' +
            '<div><p class="font-sans text-sm font-semibold">' + a.title + '</p>' +
            '<p class="text-xs text-gray-500">' + (a.category || '') + '</p></div></a>';
        }).join('');
      }
      results.classList.remove('hidden');
    }
  }

  // ─── NOTIFICACIONES ────────────────────────────────────
  function initNotifications() {
    const btn = document.querySelector('[data-notifications-toggle]');
    const dropdown = document.getElementById('notifications-dropdown');
    if (!btn || !dropdown) return;

    let notifs = storageGet('vmos-notifications', [
      { id: 1, title: 'Nuevo informe: Avance del Oleoducto VMOS', time: 'Hace 2 horas', read: false },
      { id: 2, title: 'Operaciones en Punta Colorada actualizadas', time: 'Hace 5 horas', read: false },
      { id: 3, title: 'Licitación de monoboyas — Cierre próximo', time: 'Ayer', read: true },
      { id: 4, title: 'Mareas especiales en Playas Doradas', time: 'Hace 2 días', read: true },
    ]);

    function render() {
      const unread = notifs.filter(function (n) { return !n.read; }).length;
      const badge = document.querySelector('[data-notif-badge]');
      if (badge) badge.style.display = unread > 0 ? '' : 'none';

      dropdown.innerHTML = notifs.map(function (n) {
        return '<a href="#notificacion-' + n.id + '" class="flex items-start gap-3 p-3 hover:bg-surface-container rounded transition-colors' + (n.read ? ' opacity-50' : '') + '">' +
          '<div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shrink-0">' +
            '<span class="material-symbols-outlined text-sm">notifications</span></div>' +
          '<div class="flex-1"><p class="font-sans text-sm font-semibold text-gray-800">' + n.title + '</p>' +
          '<p class="text-xs text-gray-400">' + n.time + '</p></div>' +
          (!n.read ? '<span class="w-2 h-2 bg-secondary rounded-full shrink-0 mt-1.5"></span>' : '') +
        '</a>';
      }).join('');
      dropdown.innerHTML += '<button onclick="window.markAllNotifsRead()" class="w-full text-center py-2 text-xs font-sans text-secondary border-t border-gray-200">Marcar todos como leídos</button>';
    }

    window.markAllNotifsRead = function () {
      notifs = notifs.map(function (n) { return Object.assign({}, n, { read: true }); });
      storageSet('vmos-notifications', notifs);
      render();
    };

    render();
    btn.addEventListener('click', function (e) { e.stopPropagation(); dropdown.classList.toggle('hidden'); });
    document.addEventListener('click', function (e) { if (!dropdown.contains(e.target) && !btn.contains(e.target)) dropdown.classList.add('hidden'); });
  }

  // ─── SUSCRIPCIÓN ───────────────────────────────────────
  function initNewsletter() {
    window.openNewsletterModal = function () {
      var m = document.getElementById('newsletter-modal');
      if (m) { m.classList.remove('hidden'); setTimeout(function () { var i = m.querySelector('input'); if (i) i.focus(); }, 50); }
    };
    window.closeNewsletterModal = function () { var m = document.getElementById('newsletter-modal'); if (m) m.classList.add('hidden'); };

    // Formulario en footer
    var footerForm = document.querySelector('[data-newsletter-form]');
    if (footerForm) {
      footerForm.addEventListener('submit', function (e) {
        e.preventDefault(); var i = footerForm.querySelector('input[type="email"]'); handleSubscribe(i, footerForm);
      });
    }

    // Botón en header que abre modal
    var headerBtn = document.querySelector('[data-newsletter-subscribe]');
    if (headerBtn) headerBtn.addEventListener('click', function () { openNewsletterModal(); });
  }

  function handleSubscribe(emailInput, form) {
    var email = emailInput.value.trim();
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) { alert('Por favor ingrese su correo electrónico'); return; }
    if (!re.test(email)) { alert('Ingrese un formato de correo válido'); return; }
    var btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.textContent = 'Enviando...'; btn.disabled = true; }
    setTimeout(function () { alert('¡Suscripción confirmada! Recibirá el boletín semanal.'); emailInput.value = ''; if (btn) { btn.textContent = 'Suscribirse'; btn.disabled = false; } }, 800);
  }

  // ─── LIMPIEZA DE ENLACES MUERTOS ───────────────────────
  function cleanupDeadLinks() {
    document.querySelectorAll('a[href="#"]').forEach(function (a) {
      if (!a.getAttribute('onclick')) { a.setAttribute('href', 'javascript:void(0)'); }
    });
  }

  // ─── INIT ──────────────────────────────────────────────
  function init() {
    initDarkMode();
    initSearch();
    initNotifications();
    initNewsletter();
    cleanupDeadLinks();
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
