(function () {
  'use strict';

  var root = document.documentElement;
  var STORAGE_KEY = 'bv-lang';
  var TITLES = {
    en: 'Beauty & Vintage | Wholesale Natural Cosmetics',
    el: 'Beauty & Vintage | Φυσικά Καλλυντικά Χονδρικής'
  };

  /* ---------- Language ---------- */
  function getStoredLang() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function setLang(lang) {
    root.setAttribute('lang', lang);
    document.title = TITLES[lang];
    document.querySelectorAll('[data-set-lang]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.dataset.setLang === lang ? 'true' : 'false');
    });
    // <option> elements can't contain spans, so their text is swapped here
    document.querySelectorAll('option[data-en]').forEach(function (opt) {
      opt.textContent = opt.dataset[lang];
    });
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* storage unavailable */ }
  }

  // ?lang=el / ?lang=en in the URL wins, then the saved choice, then the browser language
  var urlLang = new URLSearchParams(window.location.search).get('lang');
  var initial = TITLES[urlLang] ? urlLang :
    getStoredLang() || ((navigator.language || '').toLowerCase().indexOf('el') === 0 ? 'el' : 'en');
  setLang(initial);

  document.querySelectorAll('[data-set-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () { setLang(btn.dataset.setLang); });
  });

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');

  function closeNav() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });

  /* ---------- Login dialog: B2B-only notice ---------- */
  var modal = document.getElementById('login-modal');
  var loginForm = document.getElementById('login-form');

  function showView(name) {
    modal.querySelectorAll('.modal__view').forEach(function (v) {
      v.hidden = v.dataset.view !== name;
    });
    modal.focus();
  }

  function openModal() {
    closeNav();
    loginForm.reset();
    showView('login');
    if (typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open', '');
  }

  function closeModal() {
    if (typeof modal.close === 'function') modal.close();
    else modal.removeAttribute('open');
  }

  document.querySelectorAll('[data-open-login]').forEach(function (btn) {
    btn.addEventListener('click', openModal);
  });
  modal.querySelectorAll('[data-close-modal]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });
  // Close when clicking the backdrop
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  // There are no customer accounts: nothing is sent anywhere, any login attempt shows the notice
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    loginForm.reset();
    showView('notice');
  });

  // Links to #login (e.g. from the retail shop) open the dialog directly
  function checkLoginHash() {
    if (window.location.hash === '#login') openModal();
  }
  window.addEventListener('hashchange', checkLoginHash);
  checkLoginHash();

  /* ---------- Wholesale inquiry form (mailto) ---------- */
  var form = document.getElementById('inquiry-form');
  var errorBox = form.querySelector('.form__error');
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;

    form.querySelectorAll('[required]').forEach(function (field) {
      var ok = field.value.trim() !== '' && (field.type !== 'email' || EMAIL_RE.test(field.value.trim()));
      field.classList.toggle('is-invalid', !ok);
      if (!ok) valid = false;
    });

    errorBox.hidden = valid;
    if (!valid) return;

    var f = form.elements;
    var type = f.type.options[f.type.selectedIndex].dataset.en;
    var lines = [
      'Name: ' + f.name.value.trim(),
      'Company: ' + f.company.value.trim(),
      'Business type: ' + type,
      'VAT number: ' + f.vat.value.trim(),
      'Email: ' + f.email.value.trim(),
      'Phone: ' + f.phone.value.trim(),
      'City / Country: ' + f.location.value.trim(),
      '',
      f.message.value.trim()
    ];
    var subject = 'Wholesale inquiry – ' + f.company.value.trim();

    window.location.href = 'mailto:info@beautyandvintage.com' +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(lines.join('\n'));
  });

  form.addEventListener('input', function (e) {
    e.target.classList.remove('is-invalid');
  });

  /* ---------- Reveal on scroll ---------- */
  var revealTargets = document.querySelectorAll('.section__head, .split__media, .split__text, .cat, .product, .card, .steps li, .form');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el) {
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
