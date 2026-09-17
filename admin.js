(function () {
  'use strict';
  var key = 'sreeSupremeSiteData';
  var defaults = {
    heroTitle: 'Quality Soldering Solutions <span>Since 1986</span>',
    heroLead: 'Reliable soldering materials from Madurai, for a stronger connected world.',
    email: 'info@sreesupremesolder.in', phone: '+91 99444 82330', address: '6, Nehru Nagar, Nethaji Road, Bypass Road, Madurai – 625003, Tamil Nadu, India',
    products: [
      { title: 'Solder Wires', description: 'High performance solder wires for superior wetting and stronger joints.' },
      { title: 'Solder Sticks', description: 'Consistent quality solder sticks for industrial and electronic applications.' },
      { title: 'Liquid Flux', description: 'Excellent flux activity for better wetting and reliable connections.' },
      { title: 'Solder Paint', description: 'Reliable solder paint solutions for electronics manufacturing and PCB assembly.' },
      { title: 'Lead-Free Solutions', description: 'A greener tomorrow. Same reliability.' }
    ]
  };
  function load() { try { return JSON.parse(localStorage.getItem(key)) || defaults; } catch (e) { return defaults; } }
  function save(data) { localStorage.setItem(key, JSON.stringify(data)); document.getElementById('save-status').textContent = 'Updates saved just now'; }
  function fill(data) {
    document.getElementById('hero-title-input').value = data.heroTitle;
    document.getElementById('hero-lead-input').value = data.heroLead;
    document.getElementById('email-input').value = data.email; document.getElementById('phone-input').value = data.phone; document.getElementById('address-input').value = data.address;
    document.getElementById('product-fields').innerHTML = data.products.map(function (p, i) { return '<div class="product-admin-row"><div class="admin-kicker">0' + (i + 1) + '</div><div><label for="product-title-' + i + '">Product name</label><input id="product-title-' + i + '" data-product-field="title" data-index="' + i + '" value="' + p.title.replace(/"/g, '&quot;') + '" required><label for="product-description-' + i + '">Description</label><textarea id="product-description-' + i + '" data-product-field="description" data-index="' + i + '" rows="2" required>' + p.description + '</textarea></div></div>'; }).join('');
  }
  fill(load());
  document.getElementById('admin-form').addEventListener('input', function () { document.getElementById('save-status').textContent = 'Unsaved changes'; document.getElementById('save-status').style.color = '#a96b00'; document.getElementById('save-status').style.background = '#fff5dc'; });
  document.getElementById('admin-form').addEventListener('submit', function (e) { e.preventDefault(); var data = load(); data.heroTitle = document.getElementById('hero-title-input').value; data.heroLead = document.getElementById('hero-lead-input').value; data.email = document.getElementById('email-input').value; data.phone = document.getElementById('phone-input').value; data.address = document.getElementById('address-input').value; data.products = data.products.map(function (p, i) { return { title: document.querySelector('[data-product-field="title"][data-index="' + i + '"]').value, description: document.querySelector('[data-product-field="description"][data-index="' + i + '"]').value }; }); save(data); });
  document.getElementById('reset-btn').addEventListener('click', function () { localStorage.removeItem(key); fill(defaults); document.getElementById('save-status').textContent = 'Defaults restored'; });
}());
