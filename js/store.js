/**
 * store.js — SecondLeaf E-Commerce Store Logic
 * 
 * Depends on data.js globals: products, categories, cart, wishlist,
 * addToCart, removeFromCart, updateCartQuantity, getCartTotal, getCartCount,
 * toggleWishlist, isInWishlist, companyInfo
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     STATE
     ============================================================ */
  const PRODUCTS_PER_PAGE = 8;

  let currentCategory = 'all';
  let currentSearch = '';
  let currentSort = 'popular';
  let currentPage = 1;
  let selectedPriceRanges = [];
  let inStockOnly = false;

  /* ============================================================
     DOM REFERENCES
     ============================================================ */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const productGrid = $('#productGrid');
  const shimmerGrid = $('#shimmerGrid');
  const emptyState = $('#emptyState');
  const resultsCount = $('#resultsCount');
  const sortSelect = $('#sortSelect');
  const searchInput = $('#searchInput');
  const searchBtn = $('#searchBtn');
  const categoryPills = $('#categoryPills');
  const sidebarCategories = $('#sidebarCategories');
  const paginationEl = $('#pagination');
  const clearFiltersBtn = $('#clearFiltersBtn');

  // Navbar
  const navbar = $('#navbar');
  const hamburgerBtn = $('#hamburgerBtn');
  const navLinks = $('#navLinks');
  const mobileMenuOverlay = $('#mobileMenuOverlay');

  // Cart
  const cartToggleBtn = $('#cartToggleBtn');
  const cartBadge = $('#cartBadge');
  const cartOverlay = $('#cartOverlay');
  const cartDrawer = $('#cartDrawer');
  const cartCloseBtn = $('#cartCloseBtn');
  const cartDrawerBody = $('#cartDrawerBody');
  const cartDrawerCount = $('#cartDrawerCount');
  const cartSubtotal = $('#cartSubtotal');
  const cartDrawerFooter = $('#cartDrawerFooter');
  const cartEmpty = $('#cartEmpty');
  const checkoutBtn = $('#checkoutBtn');

  // Modal
  const productModal = $('#productModal');
  const productModalOverlay = $('#productModalOverlay');
  const productModalContent = $('#productModalContent');
  const modalCloseBtn = $('#modalCloseBtn');

  // Newsletter
  const newsletterForm = $('#newsletterForm');



  // Toast
  const toastContainer = $('#toastContainer');


  /* ============================================================
     INITIALIZATION
     ============================================================ */
  renderCategoryPills();
  renderSidebarCategories();
  showShimmerThenRender();
  updateCartBadge();
  initScrollEffects();
  initEventListeners();
  initScrollReveal();


  /* ============================================================
     SHIMMER LOADING EFFECT
     ============================================================ */
  function showShimmerThenRender() {
    shimmerGrid.style.display = 'grid';
    productGrid.style.display = 'none';
    emptyState.style.display = 'none';

    setTimeout(() => {
      shimmerGrid.style.display = 'none';
      renderProducts();
    }, 600);
  }


  /* ============================================================
     CATEGORY PILLS (Hero)
     ============================================================ */
  function renderCategoryPills() {
    categoryPills.innerHTML = categories.map(cat => `
      <button class="category-pill${cat.id === currentCategory ? ' active' : ''}"
              data-category="${cat.id}" role="tab"
              aria-selected="${cat.id === currentCategory}">
        ${cat.name}
      </button>
    `).join('');

    categoryPills.querySelectorAll('.category-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        currentCategory = pill.dataset.category;
        currentPage = 1;
        syncCategoryUI();
        renderProducts();
      });
    });
  }


  /* ============================================================
     SIDEBAR CATEGORIES
     ============================================================ */
  function renderSidebarCategories() {
    sidebarCategories.innerHTML = categories.map(cat => {
      const count = cat.id === 'all'
        ? products.length
        : products.filter(p => p.category === cat.id).length;
      return `
        <li>
          <button class="sidebar-category-btn${cat.id === currentCategory ? ' active' : ''}"
                  data-category="${cat.id}" role="radio"
                  aria-checked="${cat.id === currentCategory}">
            ${cat.name}
            <span class="cat-count">${count}</span>
          </button>
        </li>
      `;
    }).join('');

    sidebarCategories.querySelectorAll('.sidebar-category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentCategory = btn.dataset.category;
        currentPage = 1;
        syncCategoryUI();
        renderProducts();
      });
    });
  }


  /* ============================================================
     SYNC CATEGORY UI (pills + sidebar)
     ============================================================ */
  function syncCategoryUI() {
    // Pills
    categoryPills.querySelectorAll('.category-pill').forEach(pill => {
      const isActive = pill.dataset.category === currentCategory;
      pill.classList.toggle('active', isActive);
      pill.setAttribute('aria-selected', isActive);
    });

    // Sidebar
    sidebarCategories.querySelectorAll('.sidebar-category-btn').forEach(btn => {
      const isActive = btn.dataset.category === currentCategory;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-checked', isActive);
    });
  }


  /* ============================================================
     GET FILTERED & SORTED PRODUCTS
     ============================================================ */
  function getFilteredProducts() {
    let filtered = [...products];

    // Category
    if (currentCategory !== 'all') {
      filtered = filtered.filter(p => p.category === currentCategory);
    }

    // Search
    if (currentSearch.trim()) {
      const q = currentSearch.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.fullDescription.toLowerCase().includes(q)
      );
    }

    // Price ranges
    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter(p => {
        return selectedPriceRanges.some(range => {
          const [min, max] = range.split('-').map(Number);
          return p.price >= min && p.price <= max;
        });
      });
    }

    // Availability
    if (inStockOnly) {
      filtered = filtered.filter(p => p.availability === 'In Stock');
    }

    // Sort
    switch (currentSort) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        break;
      case 'popular':
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'availability':
        filtered.sort((a, b) => b.stock - a.stock);
        break;
    }

    return filtered;
  }


  /* ============================================================
     RENDER PRODUCT GRID
     ============================================================ */
  function renderProducts() {
    const filtered = getFilteredProducts();
    const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);

    // Clamp page
    if (currentPage > totalPages) currentPage = totalPages || 1;

    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const pageProducts = filtered.slice(start, start + PRODUCTS_PER_PAGE);

    // Results count
    resultsCount.textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`;

    // Empty state
    if (pageProducts.length === 0) {
      productGrid.style.display = 'none';
      emptyState.style.display = 'block';
      paginationEl.style.display = 'none';
      return;
    }

    emptyState.style.display = 'none';
    productGrid.style.display = 'grid';

    productGrid.innerHTML = pageProducts.map(p => createProductCard(p)).join('');

    // Attach card event listeners
    attachCardListeners();

    // Pagination
    renderPagination(totalPages);
  }


  /* ============================================================
     PRODUCT CARD HTML
     ============================================================ */
  function createProductCard(product) {
    const isWished = isInWishlist(product.id);
    const isLimited = product.availability === 'Limited Stock';
    const starsHtml = renderStars(product.rating);
    const categoryObj = categories.find(c => c.id === product.category);
    const categoryName = categoryObj ? categoryObj.name : product.category;

    return `
      <article class="product-card reveal" data-product-id="${product.id}">
        <div class="product-card__image-wrap">
          <img class="product-card__image" src="${product.image}" alt="${product.name}" loading="lazy">
          <button class="product-card__wishlist ${isWished ? 'active' : ''}"
                  data-product-id="${product.id}" aria-label="Toggle wishlist">
            ${isWished ? '❤️' : '🤍'}
          </button>
          <span class="product-card__badge">${categoryName}</span>
        </div>
        <div class="product-card__body">
          <h3 class="product-card__name">${product.name}</h3>
          <p class="product-card__desc">${product.shortDescription}</p>
          <div class="product-card__price-row">
            <span class="product-card__price">${product.currency}${product.price.toLocaleString('en-IN')}</span>
            <span class="product-card__unit">${product.unit}</span>
          </div>
          <div class="product-card__stock">
            <span class="stock-dot ${isLimited ? 'stock-dot--limited' : 'stock-dot--in'}"></span>
            <span class="${isLimited ? 'stock-text--limited' : 'stock-text--in'}">${product.availability}</span>
          </div>
          <p class="product-card__moq">MOQ: ${product.moq} units</p>
          <div class="product-card__rating">
            <span class="rating-stars">${starsHtml}</span>
            <span class="rating-value">${product.rating}</span>
            <span class="rating-count">(${product.reviews})</span>
          </div>
          <div class="product-card__actions">
            <button class="btn btn--primary btn--sm add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
            <button class="btn btn--outline btn--sm view-details-btn" data-product-id="${product.id}">View Details</button>
          </div>
        </div>
      </article>
    `;
  }


  /* ============================================================
     STAR RATING HELPER
     ============================================================ */
  function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars += '★';
      } else if (i - 0.5 <= rating) {
        stars += '★'; // half-star shown as full for simplicity
      } else {
        stars += '☆';
      }
    }
    return stars;
  }


  /* ============================================================
     ATTACH PRODUCT CARD LISTENERS
     ============================================================ */
  function attachCardListeners() {
    // Add to cart
    productGrid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pid = parseInt(btn.dataset.productId);
        const product = products.find(p => p.id === pid);
        addToCart(pid, product.moq);
        updateCartBadge();
        showToast(`"${product.name}" added to cart!`, 'success');
        openCartDrawer();
      });
    });

    // View details
    productGrid.querySelectorAll('.view-details-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pid = parseInt(btn.dataset.productId);
        openProductModal(pid);
      });
    });

    // Wishlist
    productGrid.querySelectorAll('.product-card__wishlist').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pid = parseInt(btn.dataset.productId);
        const added = toggleWishlist(pid);
        btn.classList.toggle('active', added);
        btn.innerHTML = added ? '❤️' : '🤍';
        showToast(added ? 'Added to Wishlist!' : 'Removed from Wishlist', added ? 'success' : 'info');
      });
    });

    // Trigger scroll reveal for new cards
    triggerReveal();
  }


  /* ============================================================
     PAGINATION
     ============================================================ */
  function renderPagination(totalPages) {
    if (totalPages <= 1) {
      paginationEl.style.display = 'none';
      return;
    }

    paginationEl.style.display = 'flex';
    let html = '';

    // Prev
    html += `<button class="pagination__btn" data-page="prev" ${currentPage === 1 ? 'disabled' : ''}>‹ Prev</button>`;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="pagination__btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }

    // Next
    html += `<button class="pagination__btn" data-page="next" ${currentPage === totalPages ? 'disabled' : ''}>Next ›</button>`;

    paginationEl.innerHTML = html;

    paginationEl.querySelectorAll('.pagination__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        if (page === 'prev') {
          currentPage = Math.max(1, currentPage - 1);
        } else if (page === 'next') {
          currentPage = Math.min(totalPages, currentPage + 1);
        } else {
          currentPage = parseInt(page);
        }
        renderProducts();
        // Scroll to top of product grid
        $('#storeMain').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }


  /* ============================================================
     CART DRAWER
     ============================================================ */
  function openCartDrawer() {
    cartOverlay.classList.add('active');
    cartDrawer.classList.add('active');
    document.body.classList.add('cart-open');
    renderCartDrawer();
  }

  function closeCartDrawer() {
    cartOverlay.classList.remove('active');
    cartDrawer.classList.remove('active');
    document.body.classList.remove('cart-open');
  }

  function renderCartDrawer() {
    const count = getCartCount();
    cartDrawerCount.textContent = `(${count})`;

    if (cart.length === 0) {
      cartDrawerBody.style.display = 'none';
      cartDrawerFooter.style.display = 'none';
      cartEmpty.classList.add('show');
      return;
    }

    cartEmpty.classList.remove('show');
    cartDrawerBody.style.display = 'block';
    cartDrawerFooter.style.display = 'block';

    cartDrawerBody.innerHTML = cart.map(item => `
      <div class="cart-item" data-product-id="${item.productId}">
        <img class="cart-item__image" src="${item.image}" alt="${item.name}">
        <div class="cart-item__info">
          <p class="cart-item__name">${item.name}</p>
          <p class="cart-item__price">₹${item.price.toLocaleString('en-IN')} ${item.unit}</p>
          <div class="cart-item__controls">
            <button class="qty-btn cart-qty-minus" data-product-id="${item.productId}">−</button>
            <span class="cart-item__qty">${item.quantity}</span>
            <button class="qty-btn cart-qty-plus" data-product-id="${item.productId}">+</button>
            <button class="cart-item__remove" data-product-id="${item.productId}">Remove</button>
          </div>
        </div>
        <span class="cart-item__total">₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
      </div>
    `).join('');

    // Subtotal
    cartSubtotal.textContent = `₹${getCartTotal().toLocaleString('en-IN')}`;

    // Quantity controls
    cartDrawerBody.querySelectorAll('.cart-qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const pid = parseInt(btn.dataset.productId);
        const item = cart.find(i => i.productId === pid);
        if (item && item.quantity > 1) {
          updateCartQuantity(pid, item.quantity - 1);
        }
        renderCartDrawer();
        updateCartBadge();
      });
    });

    cartDrawerBody.querySelectorAll('.cart-qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const pid = parseInt(btn.dataset.productId);
        const item = cart.find(i => i.productId === pid);
        if (item) {
          updateCartQuantity(pid, item.quantity + 1);
        }
        renderCartDrawer();
        updateCartBadge();
      });
    });

    cartDrawerBody.querySelectorAll('.cart-item__remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const pid = parseInt(btn.dataset.productId);
        const product = products.find(p => p.id === pid);
        removeFromCart(pid);
        renderCartDrawer();
        updateCartBadge();
        showToast(`"${product ? product.name : 'Item'}" removed from cart`, 'info');
      });
    });
  }


  /* ============================================================
     UPDATE CART BADGE
     ============================================================ */
  function updateCartBadge() {
    const count = getCartCount();
    cartBadge.textContent = count;
    // Bounce animation
    cartBadge.classList.remove('bounce');
    void cartBadge.offsetWidth; // trigger reflow
    cartBadge.classList.add('bounce');
  }


  /* ============================================================
     PRODUCT DETAIL MODAL
     ============================================================ */
  let modalQty = 1;
  let modalProductId = null;

  function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    modalProductId = productId;
    modalQty = product.moq;

    const categoryObj = categories.find(c => c.id === product.category);
    const categoryName = categoryObj ? categoryObj.name : product.category;
    const isLimited = product.availability === 'Limited Stock';
    const isWished = isInWishlist(product.id);

    // Related products (same category, exclude self, max 4)
    const related = products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);

    productModalContent.innerHTML = `
      <div class="modal-product">
        <div class="modal-product__image-wrap">
          <img class="modal-product__image" src="${product.image}" alt="${product.name}">
        </div>
        <div class="modal-product__info">
          <span class="modal-product__category">${categoryName}</span>
          <h2 class="modal-product__name">${product.name}</h2>
          <p class="modal-product__desc">${product.fullDescription}</p>

          <div class="modal-product__price-row">
            <span class="modal-product__price">${product.currency}${product.price.toLocaleString('en-IN')}</span>
            <span class="modal-product__unit">${product.unit}</span>
          </div>

          <div class="modal-info-grid">
            <div class="modal-info-item">
              <div class="modal-info-label">Rating</div>
              <div class="modal-info-value">${renderStars(product.rating)} ${product.rating} (${product.reviews} reviews)</div>
            </div>
            <div class="modal-info-item">
              <div class="modal-info-label">Availability</div>
              <div class="modal-info-value" style="color:${isLimited ? 'var(--clr-warning)' : 'var(--clr-success)'}">
                ${product.availability} (${product.stock} units)
              </div>
            </div>
            <div class="modal-info-item">
              <div class="modal-info-label">Min. Order</div>
              <div class="modal-info-value">${product.moq} units</div>
            </div>
            <div class="modal-info-item">
              <div class="modal-info-label">Packaging</div>
              <div class="modal-info-value">${product.packaging}</div>
            </div>
          </div>

          <div class="modal-detail-section">
            <h4>Usage Instructions</h4>
            <p>${product.usage}</p>
          </div>

          <div class="modal-qty-selector">
            <span class="modal-qty-label">Quantity:</span>
            <div class="modal-qty-controls">
              <button class="modal-qty-btn" id="modalQtyMinus">−</button>
              <span class="modal-qty-value" id="modalQtyValue">${modalQty}</span>
              <button class="modal-qty-btn" id="modalQtyPlus">+</button>
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn btn--primary" id="modalAddToCart">Add to Cart</button>
          </div>

          <button class="modal-wishlist-btn ${isWished ? 'active' : ''}" id="modalWishlistBtn">
            ${isWished ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
          </button>
        </div>
      </div>

      ${related.length > 0 ? `
        <div class="modal-related">
          <h3 class="modal-related__title">Related Products</h3>
          <div class="modal-related__grid">
            ${related.map(rp => `
              <div class="related-card" data-product-id="${rp.id}">
                <img class="related-card__img" src="${rp.image}" alt="${rp.name}" loading="lazy">
                <div class="related-card__info">
                  <p class="related-card__name">${rp.name}</p>
                  <p class="related-card__price">${rp.currency}${rp.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;

    // Show modal
    productModalOverlay.classList.add('active');
    productModal.classList.add('active');
    document.body.classList.add('modal-open');

    // Qty controls
    const qtyMinus = $('#modalQtyMinus');
    const qtyPlus = $('#modalQtyPlus');
    const qtyValue = $('#modalQtyValue');

    qtyMinus.addEventListener('click', () => {
      if (modalQty > product.moq) {
        modalQty--;
        qtyValue.textContent = modalQty;
      }
    });
    qtyPlus.addEventListener('click', () => {
      modalQty++;
      qtyValue.textContent = modalQty;
    });

    // Add to cart from modal
    $('#modalAddToCart').addEventListener('click', () => {
      addToCart(product.id, modalQty);
      updateCartBadge();
      showToast(`"${product.name}" added to cart!`, 'success');
      closeProductModal();
      openCartDrawer();
    });

    // Wishlist from modal
    const wishBtn = $('#modalWishlistBtn');
    wishBtn.addEventListener('click', () => {
      const added = toggleWishlist(product.id);
      wishBtn.classList.toggle('active', added);
      wishBtn.innerHTML = added ? '❤️ In Wishlist' : '🤍 Add to Wishlist';
      showToast(added ? 'Added to Wishlist!' : 'Removed from Wishlist', added ? 'success' : 'info');
      // Also update the product card heart if visible
      renderProducts();
    });

    // Related product click
    productModalContent.querySelectorAll('.related-card').forEach(card => {
      card.addEventListener('click', () => {
        const rpid = parseInt(card.dataset.productId);
        openProductModal(rpid);
      });
    });
  }

  function closeProductModal() {
    productModalOverlay.classList.remove('active');
    productModal.classList.remove('active');
    document.body.classList.remove('modal-open');
    modalProductId = null;
  }


  /* ============================================================
     TOAST NOTIFICATIONS
     ============================================================ */
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;

    const icons = {
      success: '✓',
      error: '✗',
      info: 'ℹ',
      warning: '⚠'
    };

    toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span> ${message}`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3200);
  }


  /* ============================================================
     EVENT LISTENERS
     ============================================================ */
  function initEventListeners() {
    // Search
    searchBtn.addEventListener('click', () => {
      currentSearch = searchInput.value;
      currentPage = 1;
      renderProducts();
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        currentSearch = searchInput.value;
        currentPage = 1;
        renderProducts();
      }
    });

    // Live search debounce
    let searchTimeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        currentSearch = searchInput.value;
        currentPage = 1;
        renderProducts();
      }, 350);
    });

    // Sort
    sortSelect.addEventListener('change', () => {
      currentSort = sortSelect.value;
      currentPage = 1;
      renderProducts();
    });

    // Price range checkboxes
    $$('input[name="priceRange"]').forEach(cb => {
      cb.addEventListener('change', () => {
        selectedPriceRanges = Array.from($$('input[name="priceRange"]:checked')).map(c => c.value);
        currentPage = 1;
        renderProducts();
      });
    });

    // Availability
    $('#inStockOnly').addEventListener('change', (e) => {
      inStockOnly = e.target.checked;
      currentPage = 1;
      renderProducts();
    });

    // Clear filters
    clearFiltersBtn.addEventListener('click', () => {
      currentCategory = 'all';
      currentSearch = '';
      currentSort = 'popular';
      currentPage = 1;
      selectedPriceRanges = [];
      inStockOnly = false;

      searchInput.value = '';
      sortSelect.value = 'popular';
      $$('input[name="priceRange"]').forEach(cb => cb.checked = false);
      $('#inStockOnly').checked = false;

      syncCategoryUI();
      renderProducts();
    });

    // Cart drawer
    cartToggleBtn.addEventListener('click', openCartDrawer);
    cartCloseBtn.addEventListener('click', closeCartDrawer);
    cartOverlay.addEventListener('click', closeCartDrawer);

    // Checkout
    checkoutBtn.addEventListener('click', () => {
      showToast('Checkout coming soon!', 'info');
    });

    // Product modal
    modalCloseBtn.addEventListener('click', closeProductModal);
    productModalOverlay.addEventListener('click', closeProductModal);

    // ESC key to close modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (productModal.classList.contains('active')) closeProductModal();
        else if (cartDrawer.classList.contains('active')) closeCartDrawer();
        else if (navLinks.classList.contains('active')) closeMobileMenu();
      }
    });

    // Mobile hamburger
    hamburgerBtn.addEventListener('click', toggleMobileMenu);
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);

    // Newsletter
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = $('#newsletterEmail').value;
      if (email) {
        showToast('Subscribed successfully!', 'success');
        newsletterForm.reset();
      }
    });
  }


  /* ============================================================
     MOBILE MENU
     ============================================================ */
  function toggleMobileMenu() {
    const isOpen = navLinks.classList.contains('active');
    if (isOpen) {
      closeMobileMenu();
    } else {
      navLinks.classList.add('active');
      hamburgerBtn.classList.add('active');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      mobileMenuOverlay.classList.add('active');
    }
  }

  function closeMobileMenu() {
    navLinks.classList.remove('active');
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileMenuOverlay.classList.remove('active');
  }





  function initScrollEffects() {
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;

      // Navbar shrink
      if (scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      lastScroll = scrollY;
    }, { passive: true });
  }


  /* ============================================================
     SCROLL REVEAL
     ============================================================ */
  function initScrollReveal() {
    $$('.reveal').forEach(el => el.classList.add('visible'));
  }

  function triggerReveal() {
    $$('.reveal').forEach(el => el.classList.add('visible'));
  }

});
