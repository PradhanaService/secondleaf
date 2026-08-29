/**
 * admin.js — SecondLeaf Admin Dashboard
 *
 * All admin panel logic:
 *   - Sidebar navigation & mobile toggle
 *   - Dashboard summary cards, orders table, category distribution
 *   - Product CRUD (Create, Read, Update, Delete)
 *   - Key Figures management with live preview
 *   - Review CRUD
 *   - Gallery CRUD
 *   - Team CRUD
 *   - Settings management
 *   - Reusable modal system
 *   - Toast notifications
 *   - Confirm dialog
 *
 * Depends on data.js being loaded first (products, categories, reviews,
 * team, gallery, statistics, orders, siteSettings, companyInfo).
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================
     CACHED DOM REFERENCES
     ========================================================== */
  const sidebar        = document.getElementById('admin-sidebar');
  const sidebarToggle  = document.getElementById('sidebar-toggle');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const pageTitle      = document.getElementById('page-title');
  const navLinks       = document.querySelectorAll('.nav-item a[data-section]');
  const sections       = document.querySelectorAll('.admin-section');

  // Modal
  const modalOverlay = document.getElementById('admin-modal-overlay');
  const modalTitle   = document.getElementById('modal-title');
  const modalBody    = document.getElementById('modal-body');
  const modalClose   = document.getElementById('modal-close');
  const modalCancel  = document.getElementById('modal-cancel');
  const modalSave    = document.getElementById('modal-save');

  // Confirm
  const confirmOverlay = document.getElementById('confirm-overlay');
  const confirmMessage = document.getElementById('confirm-message');
  const confirmYes     = document.getElementById('confirm-yes');
  const confirmNo      = document.getElementById('confirm-no');

  // Toast
  const toastContainer = document.getElementById('toast-container');

  /* ==========================================================
     UTILITY: Currency formatter
     ========================================================== */
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);

  /* ==========================================================
     UTILITY: Star rating HTML
     ========================================================== */
  const starsHTML = (rating) => {
    const full = Math.round(rating);
    return '<span class="star-rating">' +
      '★'.repeat(full) + '☆'.repeat(5 - full) +
      '</span>';
  };

  /* ==========================================================
     UTILITY: Category name lookup
     ========================================================== */
  const categoryName = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.name : catId;
  };

  /* ==========================================================
     UTILITY: Truncate text
     ========================================================== */
  const truncate = (str, len = 60) =>
    str && str.length > len ? str.substring(0, len) + '…' : (str || '');

  /* ==========================================================
     UTILITY: Format date
     ========================================================== */
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  /* ==========================================================
     UTILITY: Escape HTML
     ========================================================== */
  const escHTML = (str) => {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  };


  /* ══════════════════════════════════════════════════════════════
     1. SIDEBAR NAVIGATION
     ══════════════════════════════════════════════════════════════ */
  const sectionTitles = {
    'dashboard':    'Dashboard',
    'products':     'Product Management',
    'key-figures':  'Key Figures',
    'reviews':      'Review Management',
    'gallery':      'Gallery Management',
    'team':         'Team Management',
    'settings':     'Settings'
  };

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      if (!section) return;

      // Update active nav
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Show target section, hide others
      sections.forEach(s => s.classList.remove('active'));
      const target = document.getElementById('section-' + section);
      if (target) target.classList.add('active');

      // Update page title
      pageTitle.textContent = sectionTitles[section] || 'Dashboard';

      // Re-render dashboard when navigating to it (data may have changed)
      if (section === 'dashboard') renderDashboard();

      // Close sidebar on mobile
      closeSidebar();
    });
  });


  /* ══════════════════════════════════════════════════════════════
     2. MOBILE SIDEBAR TOGGLE
     ══════════════════════════════════════════════════════════════ */
  function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
  }

  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });

  sidebarOverlay.addEventListener('click', closeSidebar);


  /* ══════════════════════════════════════════════════════════════
     3. TOAST NOTIFICATIONS
     ══════════════════════════════════════════════════════════════ */
  /**
   * Show a toast notification.
   * @param {string} message - The toast message
   * @param {'success'|'error'|'info'|'warning'} type - Toast type
   */
  function showAdminToast(message, type = 'success') {
    const icons = { success: '✓', error: '✗', info: 'i', warning: '!' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type] || '✓'}</span>
                       <span>${escHTML(message)}</span>`;
    toastContainer.appendChild(toast);

    // Auto-remove after 3.5s
    setTimeout(() => {
      toast.classList.add('toast-exit');
      toast.addEventListener('animationend', () => toast.remove());
    }, 3500);
  }


  /* ══════════════════════════════════════════════════════════════
     4. MODAL SYSTEM
     ══════════════════════════════════════════════════════════════ */
  let _modalSaveHandler = null;

  /**
   * Open the reusable modal.
   * @param {string} title - Modal title
   * @param {string} contentHTML - HTML to inject into modal body
   * @param {Function} onSave - Callback when Save is clicked
   */
  function openAdminModal(title, contentHTML, onSave) {
    modalTitle.textContent = title;
    modalBody.innerHTML = contentHTML;
    modalOverlay.classList.add('active');

    // Remove previous handler to prevent stacking
    if (_modalSaveHandler) {
      modalSave.removeEventListener('click', _modalSaveHandler);
    }
    _modalSaveHandler = onSave;
    modalSave.addEventListener('click', _modalSaveHandler);
  }

  function closeAdminModal() {
    modalOverlay.classList.remove('active');
    if (_modalSaveHandler) {
      modalSave.removeEventListener('click', _modalSaveHandler);
      _modalSaveHandler = null;
    }
    modalBody.innerHTML = '';
  }

  modalClose.addEventListener('click', closeAdminModal);
  modalCancel.addEventListener('click', closeAdminModal);

  // Close modal on overlay click (outside modal)
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeAdminModal();
  });


  /* ══════════════════════════════════════════════════════════════
     5. CONFIRM DIALOG
     ══════════════════════════════════════════════════════════════ */
  let _confirmYesHandler = null;

  /**
   * Show a confirm dialog.
   * @param {string} message - Confirmation message
   * @param {Function} onConfirm - Callback if user clicks Yes
   */
  function showConfirm(message, onConfirm) {
    confirmMessage.textContent = message;
    confirmOverlay.classList.add('active');

    // Remove previous handler
    if (_confirmYesHandler) {
      confirmYes.removeEventListener('click', _confirmYesHandler);
    }

    _confirmYesHandler = () => {
      closeConfirm();
      onConfirm();
    };
    confirmYes.addEventListener('click', _confirmYesHandler);
  }

  function closeConfirm() {
    confirmOverlay.classList.remove('active');
    if (_confirmYesHandler) {
      confirmYes.removeEventListener('click', _confirmYesHandler);
      _confirmYesHandler = null;
    }
  }

  confirmNo.addEventListener('click', closeConfirm);
  confirmOverlay.addEventListener('click', (e) => {
    if (e.target === confirmOverlay) closeConfirm();
  });


  /* ══════════════════════════════════════════════════════════════
     6. DASHBOARD
     ══════════════════════════════════════════════════════════════ */

  /** Render the dashboard: summary cards, orders table, category bars */
  function renderDashboard() {
    // --- Summary Cards ---
    document.getElementById('stat-products').textContent = products.length;
    document.getElementById('stat-clients').textContent  = statistics.clients.value + '+';
    document.getElementById('stat-reviews').textContent   = reviews.length;
    document.getElementById('stat-gallery').textContent   = gallery.length;
    document.getElementById('stat-orders').textContent    = orders.length;

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    document.getElementById('stat-revenue').textContent = formatCurrency(totalRevenue);

    // --- Orders Table ---
    const tbody = document.getElementById('orders-tbody');
    if (orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:32px;color:#9ca3af;">No orders yet</td></tr>`;
    } else {
      tbody.innerHTML = orders.map(o => `
        <tr>
          <td><strong>${escHTML(o.id)}</strong></td>
          <td>${escHTML(o.customer)}</td>
          <td>${formatDate(o.date)}</td>
          <td>${formatCurrency(o.total)}</td>
          <td><span class="status-badge status-${o.status.toLowerCase()}">${o.status}</span></td>
          <td>${o.items}</td>
        </tr>
      `).join('');
    }

    // --- Quick Stats: Product category distribution ---
    renderCategoryBars();
  }

  /** Render product category distribution as colored bars */
  function renderCategoryBars() {
    const container = document.getElementById('quick-stats');
    const catColors = {
      'organic':        '#556B2F',
      'seeds':          '#22c55e',
      'fertilizers':    '#f59e0b',
      'crop-nutrition': '#3b82f6',
      'bio-products':   '#8b5cf6',
      'equipment':      '#ec4899'
    };

    // Count per category (exclude 'all')
    const counts = {};
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(counts), 1);

    container.innerHTML = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, count]) => {
        const pct = Math.round((count / maxCount) * 100);
        const color = catColors[cat] || '#6b7280';
        return `
          <div class="category-bar">
            <span class="bar-label">${categoryName(cat)}</span>
            <div class="bar-track">
              <div class="bar-fill" style="width:${pct}%;background:${color};"></div>
            </div>
            <span class="bar-count">${count}</span>
          </div>`;
      }).join('');
  }


  /* ══════════════════════════════════════════════════════════════
     7. PRODUCT CRUD
     ══════════════════════════════════════════════════════════════ */

  /** Render the products table, optionally filtered by search term */
  function renderProductsTable(searchTerm = '') {
    const term = searchTerm.toLowerCase().trim();
    const filtered = term
      ? products.filter(p =>
          p.name.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          categoryName(p.category).toLowerCase().includes(term))
      : products;

    const tbody = document.getElementById('products-tbody');
    const emptyEl = document.getElementById('products-empty');
    const tableWrapper = document.getElementById('products-table').closest('.table-wrapper');

    if (filtered.length === 0) {
      tableWrapper.style.display = 'none';
      emptyEl.style.display = 'block';
      if (term && products.length > 0) {
        emptyEl.querySelector('.empty-text').textContent = 'No products match your search';
        emptyEl.querySelector('.empty-sub').textContent = 'Try a different keyword.';
      } else {
        emptyEl.querySelector('.empty-text').textContent = 'No products yet';
        emptyEl.querySelector('.empty-sub').textContent = 'Add your first product to get started.';
      }
    } else {
      tableWrapper.style.display = '';
      emptyEl.style.display = 'none';
      tbody.innerHTML = filtered.map(p => `
        <tr>
          <td><img class="table-thumbnail" src="${escHTML(p.image)}" alt="${escHTML(p.name)}"></td>
          <td><strong>${escHTML(p.name)}</strong></td>
          <td>${escHTML(categoryName(p.category))}</td>
          <td>${formatCurrency(p.price)}</td>
          <td>${p.stock}</td>
          <td>${p.moq}</td>
          <td>${starsHTML(p.rating)}</td>
          <td>
            <div class="table-actions">
              <button class="btn-icon btn-edit" title="Edit" data-edit-product="${p.id}">Edit</button>
              <button class="btn-icon btn-delete" title="Delete" data-delete-product="${p.id}">Delete</button>
            </div>
          </td>
        </tr>
      `).join('');
    }
  }

  /** Open add/edit product modal */
  function openProductModal(product = null) {
    const isEdit = !!product;
    const title = isEdit ? 'Edit Product' : 'Add Product';

    // Build category options (exclude 'all')
    const catOptions = categories
      .filter(c => c.id !== 'all')
      .map(c => `<option value="${c.id}" ${product && product.category === c.id ? 'selected' : ''}>${c.name}</option>`)
      .join('');

    const availabilityOptions = ['In Stock', 'Limited Stock', 'Out of Stock', 'Pre-Order']
      .map(a => `<option value="${a}" ${product && product.availability === a ? 'selected' : ''}>${a}</option>`)
      .join('');

    const formHTML = `
      <div class="form-row">
        <div class="form-group">
          <label for="prod-name">Product Name *</label>
          <input type="text" class="form-input" id="prod-name" value="${isEdit ? escHTML(product.name) : ''}" required>
        </div>
        <div class="form-group">
          <label for="prod-category">Category</label>
          <select class="form-select" id="prod-category">${catOptions}</select>
        </div>
      </div>
      <div class="form-group">
        <label for="prod-short-desc">Short Description</label>
        <input type="text" class="form-input" id="prod-short-desc" value="${isEdit ? escHTML(product.shortDescription) : ''}">
      </div>
      <div class="form-group">
        <label for="prod-full-desc">Full Description</label>
        <textarea class="form-textarea" id="prod-full-desc">${isEdit ? escHTML(product.fullDescription) : ''}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="prod-price">Price (₹) *</label>
          <input type="number" class="form-input" id="prod-price" value="${isEdit ? product.price : ''}" min="0" required>
        </div>
        <div class="form-group">
          <label for="prod-unit">Unit</label>
          <input type="text" class="form-input" id="prod-unit" value="${isEdit ? escHTML(product.unit) : ''}" placeholder="e.g. per 50kg bag">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="prod-stock">Stock</label>
          <input type="number" class="form-input" id="prod-stock" value="${isEdit ? product.stock : 0}" min="0">
        </div>
        <div class="form-group">
          <label for="prod-moq">MOQ</label>
          <input type="number" class="form-input" id="prod-moq" value="${isEdit ? product.moq : 1}" min="1">
        </div>
      </div>
      <div class="form-group">
        <label for="prod-usage">Usage</label>
        <textarea class="form-textarea" id="prod-usage">${isEdit ? escHTML(product.usage) : ''}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="prod-packaging">Packaging</label>
          <input type="text" class="form-input" id="prod-packaging" value="${isEdit ? escHTML(product.packaging) : ''}">
        </div>
        <div class="form-group">
          <label for="prod-availability">Availability</label>
          <select class="form-select" id="prod-availability">${availabilityOptions}</select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="prod-image">Image URL</label>
          <input type="text" class="form-input" id="prod-image" value="${isEdit ? escHTML(product.image) : ''}" placeholder="https://...">
        </div>
        <div class="form-group">
          <label for="prod-rating">Rating</label>
          <input type="number" class="form-input" id="prod-rating" value="${isEdit ? product.rating : 4.5}" min="0" max="5" step="0.1">
        </div>
      </div>
      <div class="form-check">
        <input type="checkbox" id="prod-featured" ${isEdit && product.featured ? 'checked' : ''}>
        <label for="prod-featured">Featured Product</label>
      </div>
    `;

    openAdminModal(title, formHTML, () => {
      const name  = document.getElementById('prod-name').value.trim();
      const price = parseFloat(document.getElementById('prod-price').value);

      if (!name) { showAdminToast('Product name is required.', 'error'); return; }
      if (isNaN(price) || price < 0) { showAdminToast('Valid price is required.', 'error'); return; }

      const data = {
        name,
        category:         document.getElementById('prod-category').value,
        shortDescription: document.getElementById('prod-short-desc').value.trim(),
        fullDescription:  document.getElementById('prod-full-desc').value.trim(),
        price,
        currency:   '₹',
        unit:       document.getElementById('prod-unit').value.trim(),
        stock:      parseInt(document.getElementById('prod-stock').value) || 0,
        moq:        parseInt(document.getElementById('prod-moq').value) || 1,
        usage:      document.getElementById('prod-usage').value.trim(),
        packaging:  document.getElementById('prod-packaging').value.trim(),
        availability: document.getElementById('prod-availability').value,
        image:      document.getElementById('prod-image').value.trim() || 'https://placehold.co/600x400/556B2F/FFFFFF?text=Product',
        rating:     parseFloat(document.getElementById('prod-rating').value) || 4.5,
        featured:   document.getElementById('prod-featured').checked
      };

      saveProduct(data, isEdit ? product.id : null);
    });
  }

  /** Save (add or update) a product */
  function saveProduct(data, existingId = null) {
    if (existingId !== null) {
      const idx = products.findIndex(p => p.id === existingId);
      if (idx !== -1) products[idx] = { ...products[idx], ...data };
      showAdminToast('Product updated successfully!');
    } else {
      data.id = Date.now();
      data.dateAdded = new Date().toISOString().split('T')[0];
      data.reviews = 0;
      products.push(data);
      showAdminToast('Product added successfully!');
    }
    closeAdminModal();
    renderProductsTable(document.getElementById('product-search').value);
  }

  /** Delete a product with confirmation */
  function deleteProduct(id) {
    showConfirm('Are you sure you want to delete this product?', () => {
      const idx = products.findIndex(p => p.id === id);
      if (idx !== -1) products.splice(idx, 1);
      renderProductsTable(document.getElementById('product-search').value);
      showAdminToast('Product deleted.', 'info');
    });
  }

  // Event delegation for product table actions
  document.getElementById('products-tbody').addEventListener('click', (e) => {
    const editBtn = e.target.closest('[data-edit-product]');
    const delBtn  = e.target.closest('[data-delete-product]');
    if (editBtn) {
      const id = parseInt(editBtn.dataset.editProduct) || editBtn.dataset.editProduct;
      const product = products.find(p => p.id == id);
      if (product) openProductModal(product);
    }
    if (delBtn) {
      const id = parseInt(delBtn.dataset.deleteProduct) || delBtn.dataset.deleteProduct;
      deleteProduct(id);
    }
  });

  // Search products
  document.getElementById('product-search').addEventListener('input', (e) => {
    renderProductsTable(e.target.value);
  });

  // Add product button
  document.getElementById('btn-add-product').addEventListener('click', () => openProductModal());


  /* ══════════════════════════════════════════════════════════════
     8. KEY FIGURES MANAGEMENT
     ══════════════════════════════════════════════════════════════ */

  /** Render editable key-figure cards and the live preview */
  function renderKeyFigures() {
    const container = document.getElementById('key-figures-cards');
    const keys = Object.keys(statistics); // clients, products, tonsDelivered, experience

    container.innerHTML = keys.map(key => {
      const stat = statistics[key];
      return `
        <div class="kf-card">
          <span class="kf-label">${escHTML(stat.label)}</span>
          <div class="kf-input-row">
            <input type="number" id="kf-${key}" value="${stat.value}" min="0">
            <span class="kf-suffix">${escHTML(stat.suffix) || '—'}</span>
          </div>
          <button class="btn btn-primary btn-sm" data-save-kf="${key}" style="margin-top:14px;">Save</button>
        </div>`;
    }).join('');

    renderKeyFiguresPreview();
  }

  /** Render the live preview of key figures */
  function renderKeyFiguresPreview() {
    const preview = document.getElementById('key-figures-preview');
    const keys = Object.keys(statistics);
    preview.innerHTML = `
      <div class="kf-preview-grid">
        ${keys.map(key => {
          const s = statistics[key];
          return `<div class="kf-preview-item">
            <div class="kf-preview-value">${s.value.toLocaleString('en-IN')}${s.suffix}</div>
            <div class="kf-preview-label">${escHTML(s.label)}</div>
          </div>`;
        }).join('')}
      </div>`;
  }

  // Event delegation for key-figure save buttons
  document.getElementById('key-figures-cards').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-save-kf]');
    if (!btn) return;
    const key = btn.dataset.saveKf;
    const input = document.getElementById('kf-' + key);
    const val = parseInt(input.value);
    if (isNaN(val) || val < 0) {
      showAdminToast('Please enter a valid number.', 'error');
      return;
    }
    statistics[key].value = val;
    renderKeyFiguresPreview();
    showAdminToast('Key figures updated!');
  });


  /* ══════════════════════════════════════════════════════════════
     9. REVIEW CRUD
     ══════════════════════════════════════════════════════════════ */

  /** Render the reviews table */
  function renderReviewsTable(searchTerm = '') {
    const term = searchTerm.toLowerCase().trim();
    const filtered = term
      ? reviews.filter(r =>
          r.name.toLowerCase().includes(term) ||
          r.company.toLowerCase().includes(term) ||
          r.location.toLowerCase().includes(term))
      : reviews;

    const tbody = document.getElementById('reviews-tbody');
    const emptyEl = document.getElementById('reviews-empty');
    const tableWrapper = document.getElementById('reviews-table').closest('.table-wrapper');

    if (filtered.length === 0) {
      tableWrapper.style.display = 'none';
      emptyEl.style.display = 'block';
      emptyEl.querySelector('.empty-text').textContent =
        (term && reviews.length > 0) ? 'No reviews match your search' : 'No reviews yet';
      emptyEl.querySelector('.empty-sub').textContent =
        (term && reviews.length > 0) ? 'Try a different keyword.' : 'Add your first review to get started.';
    } else {
      tableWrapper.style.display = '';
      emptyEl.style.display = 'none';
      tbody.innerHTML = filtered.map(r => `
        <tr>
          <td><img class="table-avatar" src="${escHTML(r.image)}" alt="${escHTML(r.name)}"></td>
          <td><strong>${escHTML(r.name)}</strong></td>
          <td>${escHTML(r.company)}</td>
          <td>${starsHTML(r.rating)}</td>
          <td class="table-text-truncate" title="${escHTML(r.review)}">${escHTML(truncate(r.review))}</td>
          <td>${escHTML(r.location)}</td>
          <td>
            <div class="table-actions">
              <button class="btn-icon btn-edit" title="Edit" data-edit-review="${r.id}">Edit</button>
              <button class="btn-icon btn-delete" title="Delete" data-delete-review="${r.id}">Delete</button>
            </div>
          </td>
        </tr>
      `).join('');
    }
  }

  /** Open add/edit review modal */
  function openReviewModal(review = null) {
    const isEdit = !!review;
    const title = isEdit ? 'Edit Review' : 'Add Review';

    const ratingOptions = [1, 2, 3, 4, 5].map(n =>
      `<option value="${n}" ${review && review.rating === n ? 'selected' : ''}>${'★'.repeat(n)} (${n})</option>`
    ).join('');

    const formHTML = `
      <div class="form-row">
        <div class="form-group">
          <label for="rev-name">Client Name *</label>
          <input type="text" class="form-input" id="rev-name" value="${isEdit ? escHTML(review.name) : ''}">
        </div>
        <div class="form-group">
          <label for="rev-company">Company</label>
          <input type="text" class="form-input" id="rev-company" value="${isEdit ? escHTML(review.company) : ''}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="rev-location">Location</label>
          <input type="text" class="form-input" id="rev-location" value="${isEdit ? escHTML(review.location) : ''}">
        </div>
        <div class="form-group">
          <label for="rev-rating">Rating</label>
          <select class="form-select" id="rev-rating">${ratingOptions}</select>
        </div>
      </div>
      <div class="form-group">
        <label for="rev-text">Review *</label>
        <textarea class="form-textarea" id="rev-text">${isEdit ? escHTML(review.review) : ''}</textarea>
      </div>
      <div class="form-group">
        <label for="rev-image">Image URL</label>
        <input type="text" class="form-input" id="rev-image" value="${isEdit ? escHTML(review.image) : ''}" placeholder="https://...">
      </div>
    `;

    openAdminModal(title, formHTML, () => {
      const name = document.getElementById('rev-name').value.trim();
      const text = document.getElementById('rev-text').value.trim();
      if (!name) { showAdminToast('Client name is required.', 'error'); return; }
      if (!text) { showAdminToast('Review text is required.', 'error'); return; }

      const data = {
        name,
        company:  document.getElementById('rev-company').value.trim(),
        location: document.getElementById('rev-location').value.trim(),
        rating:   parseInt(document.getElementById('rev-rating').value) || 5,
        review:   text,
        image:    document.getElementById('rev-image').value.trim() || 'https://placehold.co/100x100/556B2F/FFFFFF?text=User'
      };

      saveReview(data, isEdit ? review.id : null);
    });
  }

  /** Save (add or update) a review */
  function saveReview(data, existingId = null) {
    if (existingId !== null) {
      const idx = reviews.findIndex(r => r.id === existingId);
      if (idx !== -1) reviews[idx] = { ...reviews[idx], ...data };
      showAdminToast('Review updated successfully!');
    } else {
      data.id = Date.now();
      data.date = new Date().toISOString().split('T')[0];
      reviews.push(data);
      showAdminToast('Review added successfully!');
    }
    closeAdminModal();
    renderReviewsTable(document.getElementById('review-search').value);
  }

  /** Delete a review */
  function deleteReview(id) {
    showConfirm('Are you sure you want to delete this review?', () => {
      const idx = reviews.findIndex(r => r.id === id);
      if (idx !== -1) reviews.splice(idx, 1);
      renderReviewsTable(document.getElementById('review-search').value);
      showAdminToast('Review deleted.', 'info');
    });
  }

  // Event delegation for review table
  document.getElementById('reviews-tbody').addEventListener('click', (e) => {
    const editBtn = e.target.closest('[data-edit-review]');
    const delBtn  = e.target.closest('[data-delete-review]');
    if (editBtn) {
      const id = parseInt(editBtn.dataset.editReview) || editBtn.dataset.editReview;
      const review = reviews.find(r => r.id == id);
      if (review) openReviewModal(review);
    }
    if (delBtn) {
      const id = parseInt(delBtn.dataset.deleteReview) || delBtn.dataset.deleteReview;
      deleteReview(id);
    }
  });

  document.getElementById('review-search').addEventListener('input', (e) => {
    renderReviewsTable(e.target.value);
  });

  document.getElementById('btn-add-review').addEventListener('click', () => openReviewModal());


  /* ══════════════════════════════════════════════════════════════
     10. GALLERY CRUD
     ══════════════════════════════════════════════════════════════ */

  /** Render the gallery as a grid of image cards */
  function renderGalleryGrid() {
    const container = document.getElementById('gallery-grid');
    const emptyEl   = document.getElementById('gallery-empty');

    if (gallery.length === 0) {
      container.style.display = 'none';
      emptyEl.style.display = 'block';
    } else {
      container.style.display = '';
      emptyEl.style.display = 'none';
      container.innerHTML = gallery.map(item => `
        <div class="gallery-card">
          <img src="${escHTML(item.image)}" alt="${escHTML(item.title)}">
          <div class="gallery-card-actions">
            <button class="btn-icon btn-edit" title="Edit" data-edit-gallery="${item.id}">Edit</button>
            <button class="btn-icon btn-delete" title="Delete" data-delete-gallery="${item.id}">Delete</button>
          </div>
          <div class="gallery-card-info">
            <div class="gallery-title">${escHTML(item.title)}</div>
            <div class="gallery-category">${escHTML(item.category)}</div>
          </div>
        </div>
      `).join('');
    }
  }

  /** Open add/edit gallery modal */
  function openGalleryModal(item = null) {
    const isEdit = !!item;
    const title  = isEdit ? 'Edit Gallery Image' : 'Add Gallery Image';

    const formHTML = `
      <div class="form-group">
        <label for="gal-image">Image URL *</label>
        <input type="text" class="form-input" id="gal-image" value="${isEdit ? escHTML(item.image) : ''}" placeholder="https://...">
      </div>
      <div class="form-group">
        <label for="gal-title">Title *</label>
        <input type="text" class="form-input" id="gal-title" value="${isEdit ? escHTML(item.title) : ''}">
      </div>
      <div class="form-group">
        <label for="gal-category">Category</label>
        <input type="text" class="form-input" id="gal-category" value="${isEdit ? escHTML(item.category) : ''}" placeholder="e.g. facility, field, event, product">
      </div>
    `;

    openAdminModal(title, formHTML, () => {
      const imageUrl = document.getElementById('gal-image').value.trim();
      const titleVal = document.getElementById('gal-title').value.trim();
      if (!titleVal) { showAdminToast('Title is required.', 'error'); return; }
      if (!imageUrl) { showAdminToast('Image URL is required.', 'error'); return; }

      const data = {
        image:    imageUrl,
        title:    titleVal,
        category: document.getElementById('gal-category').value.trim() || 'uncategorized'
      };

      saveGalleryItem(data, isEdit ? item.id : null);
    });
  }

  /** Save (add or update) a gallery item */
  function saveGalleryItem(data, existingId = null) {
    if (existingId !== null) {
      const idx = gallery.findIndex(g => g.id === existingId);
      if (idx !== -1) gallery[idx] = { ...gallery[idx], ...data };
      showAdminToast('Gallery image updated!');
    } else {
      data.id = Date.now();
      gallery.push(data);
      showAdminToast('Gallery image added!');
    }
    closeAdminModal();
    renderGalleryGrid();
  }

  /** Delete a gallery item */
  function deleteGalleryItem(id) {
    showConfirm('Are you sure you want to delete this gallery image?', () => {
      const idx = gallery.findIndex(g => g.id === id);
      if (idx !== -1) gallery.splice(idx, 1);
      renderGalleryGrid();
      showAdminToast('Gallery image deleted.', 'info');
    });
  }

  // Event delegation for gallery grid
  document.getElementById('gallery-grid').addEventListener('click', (e) => {
    const editBtn = e.target.closest('[data-edit-gallery]');
    const delBtn  = e.target.closest('[data-delete-gallery]');
    if (editBtn) {
      const id = parseInt(editBtn.dataset.editGallery) || editBtn.dataset.editGallery;
      const item = gallery.find(g => g.id == id);
      if (item) openGalleryModal(item);
    }
    if (delBtn) {
      const id = parseInt(delBtn.dataset.deleteGallery) || delBtn.dataset.deleteGallery;
      deleteGalleryItem(id);
    }
  });

  document.getElementById('btn-add-gallery').addEventListener('click', () => openGalleryModal());


  /* ══════════════════════════════════════════════════════════════
     11. TEAM CRUD
     ══════════════════════════════════════════════════════════════ */

  /** Render team as a grid of member cards */
  function renderTeamGrid() {
    const container = document.getElementById('team-grid');
    const emptyEl   = document.getElementById('team-empty');

    if (team.length === 0) {
      container.style.display = 'none';
      emptyEl.style.display = 'block';
    } else {
      container.style.display = '';
      emptyEl.style.display = 'none';
      container.innerHTML = team.map(m => `
        <div class="team-card">
          <div class="team-card-header">
            <img src="${escHTML(m.image)}" alt="${escHTML(m.name)}">
            <div>
              <div class="team-card-name">${escHTML(m.name)}</div>
              ${m.role ? `<div class="team-card-role">${escHTML(m.role)}</div>` : ''}
            </div>
          </div>
          ${m.description ? `
          <div class="team-card-body">
            <p>${escHTML(truncate(m.description, 100))}</p>
          </div>` : ''}
          <div class="team-card-footer">
            ${m.linkedin
              ? `<a href="${escHTML(m.linkedin)}" target="_blank" class="team-card-linkedin">LinkedIn</a>`
              : '<span></span>'}
            <div class="team-card-actions">
              <button class="btn-icon btn-edit" title="Edit" data-edit-team="${m.id}">Edit</button>
              <button class="btn-icon btn-delete" title="Delete" data-delete-team="${m.id}">Delete</button>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  /** Open add/edit team member modal */
  function openTeamModal(member = null) {
    const isEdit = !!member;
    const title  = isEdit ? 'Edit Team Member' : 'Add Team Member';

    const formHTML = `
      <div class="form-row">
        <div class="form-group">
          <label for="tm-name">Name *</label>
          <input type="text" class="form-input" id="tm-name" value="${isEdit ? escHTML(member.name) : ''}">
        </div>
        <div class="form-group">
          <label for="tm-role">Position / Role *</label>
          <input type="text" class="form-input" id="tm-role" value="${isEdit ? escHTML(member.role) : ''}">
        </div>
      </div>
      <div class="form-group">
        <label for="tm-desc">Description</label>
        <textarea class="form-textarea" id="tm-desc">${isEdit ? escHTML(member.description) : ''}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="tm-image">Image URL</label>
          <input type="text" class="form-input" id="tm-image" value="${isEdit ? escHTML(member.image) : ''}" placeholder="https://...">
        </div>
        <div class="form-group">
          <label for="tm-linkedin">LinkedIn URL</label>
          <input type="text" class="form-input" id="tm-linkedin" value="${isEdit ? escHTML(member.linkedin) : ''}" placeholder="https://linkedin.com/in/...">
        </div>
      </div>
    `;

    openAdminModal(title, formHTML, () => {
      const name = document.getElementById('tm-name').value.trim();
      const role = document.getElementById('tm-role').value.trim();
      if (!name) { showAdminToast('Name is required.', 'error'); return; }
      if (!role) { showAdminToast('Position is required.', 'error'); return; }

      const data = {
        name,
        role,
        description: document.getElementById('tm-desc').value.trim(),
        image:       document.getElementById('tm-image').value.trim() || 'https://placehold.co/300x300/556B2F/FFFFFF?text=Team',
        linkedin:    document.getElementById('tm-linkedin').value.trim()
      };

      saveTeamMember(data, isEdit ? member.id : null);
    });
  }

  /** Save (add or update) a team member */
  function saveTeamMember(data, existingId = null) {
    if (existingId !== null) {
      const idx = team.findIndex(m => m.id === existingId);
      if (idx !== -1) team[idx] = { ...team[idx], ...data };
      showAdminToast('Team member updated!');
    } else {
      data.id = Date.now();
      team.push(data);
      showAdminToast('Team member added!');
    }
    closeAdminModal();
    renderTeamGrid();
  }

  /** Delete a team member */
  function deleteTeamMember(id) {
    showConfirm('Are you sure you want to remove this team member?', () => {
      const idx = team.findIndex(m => m.id === id);
      if (idx !== -1) team.splice(idx, 1);
      renderTeamGrid();
      showAdminToast('Team member removed.', 'info');
    });
  }

  // Event delegation for team grid
  document.getElementById('team-grid').addEventListener('click', (e) => {
    const editBtn = e.target.closest('[data-edit-team]');
    const delBtn  = e.target.closest('[data-delete-team]');
    if (editBtn) {
      const id = parseInt(editBtn.dataset.editTeam) || editBtn.dataset.editTeam;
      const member = team.find(m => m.id == id);
      if (member) openTeamModal(member);
    }
    if (delBtn) {
      const id = parseInt(delBtn.dataset.deleteTeam) || delBtn.dataset.deleteTeam;
      deleteTeamMember(id);
    }
  });

  document.getElementById('btn-add-team').addEventListener('click', () => openTeamModal());


  /* ══════════════════════════════════════════════════════════════
     12. SETTINGS
     ══════════════════════════════════════════════════════════════ */

  /** Populate settings form from siteSettings */
  function renderSettings() {
    document.getElementById('setting-company-name').value = siteSettings.companyName || '';
    document.getElementById('setting-logo').value         = siteSettings.logo || '';
    document.getElementById('setting-phone').value        = siteSettings.phone || '';
    document.getElementById('setting-email').value        = siteSettings.email || '';
    document.getElementById('setting-address').value      = siteSettings.address || '';
    document.getElementById('setting-facebook').value     = siteSettings.facebook || '';
    document.getElementById('setting-instagram').value    = siteSettings.instagram || '';
    document.getElementById('setting-linkedin').value     = siteSettings.linkedin || '';
    document.getElementById('setting-whatsapp').value     = siteSettings.whatsapp || '';
    document.getElementById('setting-primary-color').value   = siteSettings.primaryColor || '#556B2F';
    document.getElementById('setting-secondary-color').value = siteSettings.secondaryColor || '#3F5F2A';
    document.getElementById('setting-accent-color').value    = siteSettings.accentColor || '#E9DFC8';

    updateColorSwatches();
  }

  /** Update color preview swatches */
  function updateColorSwatches() {
    const primary   = document.getElementById('setting-primary-color').value;
    const secondary = document.getElementById('setting-secondary-color').value;
    const accent    = document.getElementById('setting-accent-color').value;

    document.getElementById('color-preview').innerHTML = `
      <div>
        <div class="color-swatch" style="background:${primary};"></div>
        <div class="color-swatch-label">Primary</div>
      </div>
      <div>
        <div class="color-swatch" style="background:${secondary};"></div>
        <div class="color-swatch-label">Secondary</div>
      </div>
      <div>
        <div class="color-swatch" style="background:${accent};"></div>
        <div class="color-swatch-label">Accent</div>
      </div>
    `;
  }

  /** Save settings to siteSettings object */
  function saveSettings() {
    siteSettings.companyName    = document.getElementById('setting-company-name').value.trim();
    siteSettings.logo           = document.getElementById('setting-logo').value.trim();
    siteSettings.phone          = document.getElementById('setting-phone').value.trim();
    siteSettings.email          = document.getElementById('setting-email').value.trim();
    siteSettings.address        = document.getElementById('setting-address').value.trim();
    siteSettings.facebook       = document.getElementById('setting-facebook').value.trim();
    siteSettings.instagram      = document.getElementById('setting-instagram').value.trim();
    siteSettings.linkedin       = document.getElementById('setting-linkedin').value.trim();
    siteSettings.whatsapp       = document.getElementById('setting-whatsapp').value.trim();
    siteSettings.primaryColor   = document.getElementById('setting-primary-color').value;
    siteSettings.secondaryColor = document.getElementById('setting-secondary-color').value;
    siteSettings.accentColor    = document.getElementById('setting-accent-color').value;

    showAdminToast('Settings saved successfully!');
  }

  document.getElementById('btn-save-settings').addEventListener('click', saveSettings);

  // Live-update swatches when color inputs change
  ['setting-primary-color', 'setting-secondary-color', 'setting-accent-color'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateColorSwatches);
  });


  /* ══════════════════════════════════════════════════════════════
  /* ══════════════════════════════════════════════════════════════
     13. LOGOUT & LOGIN GATEWAY
     ══════════════════════════════════════════════════════════════ */
  const loginForm     = document.getElementById('admin-login-form');
  const loginUsername = document.getElementById('login-username');
  const loginPassword = document.getElementById('login-password');
  const loginCard     = document.getElementById('login-card');

  // Handle Login Submission
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = loginUsername.value.trim();
      const password = loginPassword.value;

      if (username === 'Admin' && password === 'admin@123') {
        sessionStorage.setItem('admin_logged_in', 'true');
        document.body.classList.add('logged-in');
        showAdminToast('Welcome, Administrator!', 'success');
        loginForm.reset();
      } else {
        // Clear password
        loginPassword.value = '';
        showAdminToast('Invalid username or password.', 'error');
        
        // Shake the login card
        if (loginCard) {
          loginCard.classList.add('shake');
          setTimeout(() => loginCard.classList.remove('shake'), 400);
        }
      }
    });
  }

  // Handle Logout
  document.getElementById('logout-btn').addEventListener('click', (e) => {
    e.preventDefault();
    sessionStorage.setItem('admin_logged_in', 'false');
    document.body.classList.remove('logged-in');
    showAdminToast('Logged out successfully.', 'info');
  });

  // Check Login State on load
  function checkLoginState() {
    if (sessionStorage.getItem('admin_logged_in') === 'true') {
      document.body.classList.add('logged-in');
    } else {
      document.body.classList.remove('logged-in');
    }
  }


  /* ══════════════════════════════════════════════════════════════
     14. INITIALIZATION — Render all sections
     ══════════════════════════════════════════════════════════════ */
  checkLoginState();
  renderDashboard();
  renderProductsTable();
  renderKeyFigures();
  renderReviewsTable();
  renderGalleryGrid();
  renderTeamGrid();
  renderSettings();

  // Log ready
  console.log('SecondLeaf Admin Dashboard initialized.');
});
