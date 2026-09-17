(function () {
  'use strict';

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile navigation ---------- */
  var header = document.getElementById('header');
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');

  function closeMenu() {
    header.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  function toggleMenu() {
    var isOpen = header.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  }

  if (menuBtn && header) {
    menuBtn.addEventListener('click', toggleMenu);
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  function updateHeaderShadow() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 12);
  }
  updateHeaderShadow();
  window.addEventListener('scroll', updateHeaderShadow, { passive: true });

  /* ---------- Active nav link on scroll ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute('href');
      return id && id.charAt(0) === '#' ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = '#' + entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === id);
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach(function (section) { observer.observe(section); });
  }

  /* ---------- Scroll-reveal animations ---------- */
  var revealTargets = document.querySelectorAll(
    '.section-head, .section-head-row, .product-tile, .why-card, .industry-row li, ' +
    '.tl-item, .journey-copy, .about-copy, .contact-info, .contact-form, .hero-copy'
  );
  if ('IntersectionObserver' in window && revealTargets.length) {
    revealTargets.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (Math.min(i % 6, 5) * 70) + 'ms';
    });
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Product "View Product" prefill ---------- */
  var messageField = document.getElementById('f-message');
  document.querySelectorAll('.view-product').forEach(function (link) {
    link.addEventListener('click', function () {
      var product = link.getAttribute('data-product');
      if (product && messageField && !messageField.value) {
        messageField.value = 'I would like to enquire about: ' + product + '\n\n';
      }
    });
  });

  /* ---------- Disabled social placeholders ---------- */
  document.querySelectorAll('.social-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (link.getAttribute('href') === '#') {
        e.preventDefault();
      }
    });
  });

  /* ---------- Contact form validation ---------- */
  var form = document.getElementById('enquiry-form');
  var statusEl = document.getElementById('form-status');
  var defaultStatusText = statusEl ? statusEl.textContent : '';

  var validators = {
    name: function (value) {
      return value.trim().length >= 2 ? '' : 'Please enter your name.';
    },
    email: function (value) {
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(value.trim()) ? '' : 'Please enter a valid email address.';
    },
    phone: function (value) {
      if (!value.trim()) return '';
      var re = /^[0-9+\-\s()]{7,15}$/;
      return re.test(value.trim()) ? '' : 'Please enter a valid phone number.';
    },
    message: function (value) {
      return value.trim().length >= 10 ? '' : 'Please tell us a bit more (at least 10 characters).';
    }
  };

  function showError(fieldName, message) {
    var errorEl = document.getElementById('err-' + fieldName);
    var inputEl = document.getElementById('f-' + fieldName);
    if (errorEl) errorEl.textContent = message;
    if (inputEl) inputEl.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  if (form) {
    Object.keys(validators).forEach(function (fieldName) {
      var inputEl = document.getElementById('f-' + fieldName);
      if (!inputEl) return;
      inputEl.addEventListener('blur', function () {
        showError(fieldName, validators[fieldName](inputEl.value));
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var data = new FormData(form);
      var values = {
        name: data.get('name') || '',
        company: data.get('company') || '',
        email: data.get('email') || '',
        phone: data.get('phone') || '',
        message: data.get('message') || ''
      };

      var firstInvalid = null;
      var hasError = false;
      Object.keys(validators).forEach(function (fieldName) {
        var message = validators[fieldName](values[fieldName]);
        showError(fieldName, message);
        if (message) {
          hasError = true;
          if (!firstInvalid) firstInvalid = document.getElementById('f-' + fieldName);
        }
      });

      if (hasError) {
        if (statusEl) {
          statusEl.textContent = 'Please fix the highlighted fields before sending.';
          statusEl.classList.remove('success');
        }
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var subject = encodeURIComponent(
        'Enquiry from ' + values.name + (values.company ? ' (' + values.company + ')' : '')
      );
      var body = encodeURIComponent(
        'Name: ' + values.name + '\n' +
        'Company: ' + values.company + '\n' +
        'Email: ' + values.email + '\n' +
        'Phone: ' + values.phone + '\n\n' +
        'Message:\n' + values.message
      );

      window.location.href = 'mailto:info@sreesupremesolder.in?subject=' + subject + '&body=' + body;

      if (statusEl) {
        statusEl.textContent = 'Thank you! Your email client should now open with your enquiry ready to send.';
        statusEl.classList.add('success');
      }
    });
  }
})();
