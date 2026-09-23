// ============================================================
// App Client-Side Module — VMOS & Sierra Grande Portal
// Handles: Search, Notifications, Dark Mode, Newsletter
// ============================================================

(function () {
  'use strict';

  // ─── UTILITY: Safe localStorage access ───────────────────────
  function storageGet(key, fallback) {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  }

  function storageSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }

  // ─── DARK MODE ───────────────────────────────────────────────
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
        // Dispatch custom event for any listeners
        window.dispatchEvent(new CustomEvent('theme-change', { detail: { isDark } }));
      });
      // Update icon based on current theme
      updateThemeIcon(toggleBtn);
    }

    // Also update icon on system preference change
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      const stored = storageGet('vmos-theme', null);
      if (!stored) {
        document.documentElement.classList.toggle('dark', e.matches);
        const btn = document.querySelector('[data-theme-toggle]');
        if (btn) updateThemeIcon(btn);
      }
    });
  }

  function updateThemeIcon(btn) {
    const isDark = document.documentElement.classList.contains('dark');
    const iconSpan = btn.querySelector('.theme-icon');
    if (iconSpan) {
      iconSpan.textContent = isDark ? 'light_mode' : 'wb_sunny';
    }
    btn.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  }

  // ─── SEARCH ──────────────────────────────────────────────────
  function initSearch() {
    const searchBtn = document.querySelector('[data-search-toggle]');
    const searchModal = document.getElementById('search-modal');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const searchClose = document.getElementById('search-close');

    if (!searchBtn || !searchModal) return;

    searchBtn.addEventListener('click', function () {
      searchModal.classList.remove('hidden');
      setTimeout(function () { searchInput.focus(); }, 50);
    });

    function closeSearch() {
      searchModal.classList.add('hidden');
      searchResults.innerHTML = '';
    }

    if (searchClose) searchClose.addEventListener('click', closeSearch);

    searchModal.addEventListener('click', function (e) {
      if (e.target === searchModal) closeSearch();
    });

    // Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !searchModal.classList.contains('hidden')) {
        closeSearch();
      }
    });

    // Real-time search with debounce
    let debounceTimer = null;
    searchInput.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        performSearch(searchInput.value.trim());
      }, 200);
    });

    function performSearch(query) {
      if (query.length < 2) {
        searchResults.innerHTML = '';
        searchResults.classList.add('hidden');
        return;
      }

      fetch('/api/search.json')
        .then(function (res) { return res.json(); })
        .then(function (data) {
          const q = query.toLowerCase();
          const results = data.articles.filter(function (a) {
            return a.title.toLowerCase().includes(q) ||
              (a.description && a.description.toLowerCase().includes(q)) ||
              (a.category && a.category.toLowerCase().includes(q)) ||
              (a.tags && a.tags.some(function (t) { return t.toLowerCase().includes(q); })) ||
              (a.section && a.section.toLowerCase().includes(q));
          });
          renderSearchResults(results, query);
        })
        .catch(function () {
          // Fallback: client-side filter from inline data
          const allArticles = window.__VMOS_ARTICLES__ || [];
          const q = query.toLowerCase();
          const results = allArticles.filter(function (a) {
            return a.title.toLowerCase().includes(q) ||
              (a.description && a.description.toLowerCase().includes(q)) ||
              (a.category && a.category.toLowerCase().includes(q));
          });
          renderSearchResults(results, query);
        });
    }

    function renderSearchResults(results, query) {
      if (results.length === 0) {
        searchResults.innerHTML =
          '<div class="p-4 text-center text-on-surface-variant text-sm">' +
          '<span class="material-symbols-outlined text-xl mb-1 block">search_off</span>' +
          'No se encontraron resultados para "' + escapeHtml(query) + '"</div>';
      } else {
        searchResults.innerHTML = results.slice(0, 8).map(function (a) {
          return '<a href="' + a.href + '" class="flex items-start gap-3 p-3 hover:bg-surface-container rounded transition-colors group">' +
            '<div class="w-10 h-10 rounded bg-surface-container-lowest flex items-center justify-center shrink-0">' +
              '<span class="material-symbols-outlined text-primary text-sm">article</span>' +
            '</div>' +
            '<div class="min-w-0">' +
              '<p class="font-sans text-sm font-semibold text-on-surface truncate">' + highlightMatch(escapeHtml(a.title), query) + '</p>' +
              '<p class="font-sans text-xs text-on-surface-variant mt-0.5">' + escapeHtml(a.category || a.section || '') + ' • ' + (a.readingMinutes ? a.readingMinutes + ' min' : '') + '</p>' +
            '</div>' +
          '</a>';
        }).join('');
      }
      searchResults.classList.remove('hidden');
    }

    function highlightMatch(text, query) {
      const regex = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      return text.replace(regex, '<mark class="bg-secondary/20 text-secondary font-semibold">$1</mark>');
    }

    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }
  }

  // ─── NOTIFICATIONS ───────────────────────────────────────────
  function initNotifications() {
    const notifBtn = document.querySelector('[data-notifications-toggle]');
    const notifDropdown = document.getElementById('notifications-dropdown');
    const notifBadge = document.querySelector('[data-notif-badge]');
    const notifCount = document.getElementById('notif-count');

    if (!notifBtn || !notifDropdown) return;

    // Load notifications from localStorage or use mock
    let notifications = storageGet('vmos-notifications', null);
    if (!notifications) {
      notifications = [
        { id: 1, title: 'Nuevo informe: Avance del Oleoducto VMOS', time: 'Hace 2 horas', type: 'report', read: false },
        { id: 2, title: 'Operaciones en Punta Colorada actualizadas', time: 'Hace 5 horas', type: 'alert', read: false },
        { id: 3, title: 'Licitación de monoboyas — Cierre proximo', time: 'Ayer', type: 'info', read: true },
        { id: 4, title: 'Mareas especiales en Playas Doradas', time: 'Hace 2 días', type: 'info', read: true },
      ];
      storageSet('vmos-notifications', notifications);
    }

    function renderNotifications() {
      const unread = notifications.filter(function (n) { return !n.read; }).length;
      if (notifBadge) {
        notifBadge.style.display = unread > 0 ? '' : 'none';
      }
      if (notifCount) {
        notifCount.textContent = unread;
      }
      notifDropdown.innerHTML = notifications.map(function (n) {
        const typeIcons = { report: 'article', alert: 'warning', info: 'info' };
        const typeColors = { report: 'bg-[#D97706] text-white', alert: 'bg-error text-white', info: 'bg-primary text-on-primary' };
        return '<a href="#notificacion-' + n.id + '" class="flex items-start gap-3 p-3 hover:bg-surface-container rounded transition-colors group' +
          (n.read ? ' opacity-60' : '') + '" onclick="event.preventDefault(); markAsRead(' + n.id + ');">' +
            '<div class="w-8 h-8 rounded-full ' + (typeColors[n.type] || typeColors.info) + ' flex items-center justify-center shrink-0">' +
              '<span class="material-symbols-outlined text-xs">' + (typeIcons[n.type] || 'info') + '</span>' +
            '</div>' +
            '<div class="min-w-0 flex-1">' +
              '<p class="font-sans text-sm font-semibold text-on-surface ' + (n.read ? '' : 'text-primary') + '">' + escapeHtml(n.title) + '</p>' +
              '<p class="font-sans text-xs text-on-surface-variant mt-0.5">' + escapeHtml(n.time) + '</p>' +
            '</div>' +
            (!n.read ? '<span class="w-2 h-2 bg-secondary rounded-full shrink-0 mt-1.5"></span>' : '') +
          '</a>';
      }).join('');

      // Add "Mark all as read" button
      const unreadCount = notifications.filter(function (n) { return !n.read; }).length;
      if (unreadCount > 0) {
        notifDropdown.innerHTML +=
          '<button onclick="markAllRead()" class="w-full text-center py-2 text-xs font-sans font-semibold text-secondary hover:text-primary transition-colors border-t border-outline-variant/40">' +
            'Marcar todos como leídos' +
          '</button>';
      }
    }

    window.markAsRead = function (id) {
      notifications = notifications.map(function (n) {
        return n.id === id ? Object.assign({}, n, { read: true }) : n;
      });
      storageSet('vmos-notifications', notifications);
      renderNotifications();
    };

    window.markAllRead = function () {
      notifications = notifications.map(function (n) { return Object.assign({}, n, { read: true }); });
      storageSet('vmos-notifications', notifications);
      renderNotifications();
    };

    renderNotifications();

    notifBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      notifDropdown.classList.toggle('hidden');
      // Close search if open
      var searchModal = document.getElementById('search-modal');
      if (searchModal && !searchModal.classList.contains('hidden')) {
        searchModal.classList.add('hidden');
      }
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!notifDropdown.contains(e.target) && !notifBtn.contains(e.target)) {
        notifDropdown.classList.add('hidden');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        notifDropdown.classList.add('hidden');
      }
    });
  }

  // ─── NEWSLETTER ──────────────────────────────────────────────
  function initNewsletter() {
    // Handle footer newsletter form
    var footerForm = document.querySelector('[data-newsletter-form]');
    var headerSubscribeBtn = document.querySelector('[data-newsletter-subscribe]');

    if (headerSubscribeBtn) {
      headerSubscribeBtn.addEventListener('click', function () {
        openNewsletterModal();
      });
    }

    // Modal-based newsletter (triggered from header)
    window.openNewsletterModal = function () {
      var modal = document.getElementById('newsletter-modal');
      if (modal) {
        modal.classList.remove('hidden');
        setTimeout(function () {
          var emailInput = modal.querySelector('#newsletter-email');
          if (emailInput) emailInput.focus();
        }, 50);
      }
    };

    window.closeNewsletterModal = function () {
      var modal = document.getElementById('newsletter-modal');
      if (modal) modal.classList.add('hidden');
    };

    var newsletterModal = document.getElementById('newsletter-modal');
    if (newsletterModal) {
      newsletterModal.addEventListener('click', function (e) {
        if (e.target === newsletterModal) closeNewsletterModal();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var modal = document.getElementById('newsletter-modal');
        if (modal && !modal.classList.contains('hidden')) closeNewsletterModal();
      }
    });

    if (footerForm) {
      footerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        handleNewsletterSubmit(footerForm);
      });
    }
  }

  function handleNewsletterSubmit(form) {
    var emailInput = form.querySelector('input[type="email"]');
    var submitBtn = form.querySelector('button[type="submit"]');
    var statusDiv = form.querySelector('[data-newsletter-status]');
    var email = emailInput ? emailInput.value.trim() : '';

    // Validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      showNewsletterStatus(statusDiv, 'error', 'Debe ingresar su correo electrónico');
      return;
    }
    if (!emailRegex.test(email)) {
      showNewsletterStatus(statusDiv, 'error', 'Ingrese un formato de correo válido');
      return;
    }

    // Set loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
      submitBtn.classList.add('opacity-70', 'cursor-not-allowed');
    }

    // Mock API call
    fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, source: 'portal' }),
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          showNewsletterStatus(statusDiv, 'success', '¡Suscripción confirmada! Recibirá el boletín semanal.');
          emailInput.value = '';
          // Store subscription
          var subs = storageGet('vmos-newsletter-subs', []);
          if (!subs.includes(email)) {
            subs.push(email);
            storageSet('vmos-newsletter-subs', subs);
          }
        } else {
          showNewsletterStatus(statusDiv, 'error', data.message || 'Error al suscribirse. Intente de nuevo.');
        }
        resetSubmitButton(submitBtn);
      })
      .catch(function () {
        showNewsletterStatus(statusDiv, 'error', 'Error de conexión. Intente de nuevo.');
        resetSubmitButton(submitBtn);
      });
  }

  function showNewsletterStatus(statusDiv, type, message) {
    if (!statusDiv) return;
    var icon = type === 'success' ? 'check_circle' : 'error';
    var color = type === 'success' ? 'text-emerald-600' : 'text-error';
    var bg = type === 'success' ? 'bg-emerald-50' : 'bg-red-50';
    statusDiv.innerHTML =
      '<span class="material-symbols-outlined text-sm ' + icon + ' ' + color + ' mr-1" style="font-size:16px">' + icon + '</span>' +
      '<span class="' + color + ' text-sm font-sans">' + escapeHtml(message) + '</span>';
    statusDiv.classList.add('flex', 'items-center', 'gap-2', 'mt-2', 'p-2', 'rounded', bg);
  }

  function resetSubmitButton(btn) {
    if (!btn) return;
    btn.disabled = false;
    btn.textContent = 'Suscribirse';
    btn.classList.remove('opacity-70', 'cursor-not-allowed');
    setTimeout(function () {
      var status = btn.closest('form');
      if (status) {
        var s = status.querySelector('[data-newsletter-status]');
        if (s) {
          s.innerHTML = '';
          s.classList.remove('flex', 'items-center', 'gap-2', 'mt-2', 'p-2', 'rounded', 'bg-emerald-50', 'bg-red-50');
        }
      }
    }, 5000);
  }

  // ─── CLEANUP DEAD LINKS ──────────────────────────────────────
  function cleanupDeadLinks() {
    // Replace all href="#" with javascript:void(0) or remove if useless
    var deadLinks = document.querySelectorAll('a[href="#"], a[href=""]');
    deadLinks.forEach(function (a) {
      if (!a.getAttribute('onclick') && !a.getAttribute('role')) {
        a.setAttribute('href', 'javascript:void(0)');
        a.setAttribute('aria-disabled', 'true');
        a.style.cursor = 'not-allowed';
      }
    });

    // Remove empty onclick handlers
    var emptyBtns = document.querySelectorAll('button[onclick=""], button:not([onclick])');
    emptyBtns.forEach(function (btn) {
      if (!btn.getAttribute('aria-label') && !btn.getAttribute('type')) {
        btn.setAttribute('type', 'button');
      }
    });
  }

  // ─── INIT ────────────────────────────────────────────────────
  function init() {
    initDarkMode();
    initSearch();
    initNotifications();
    initNewsletter();
    cleanupDeadLinks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose articles for fallback search
  window.__VMOS_ARTICLES__ = window.__VMOS_ARTICLES__ || [];
})();
