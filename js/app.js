/**
 * ============================================================
 * SecondLeaf — Main Application JavaScript
 * ============================================================
 * This file handles ALL interactivity for the SecondLeaf
 * agricultural company website. It reads data from data.js
 * global variables and renders dynamic content, manages UI
 * state, animations, and user interactions.
 *
 * Dependencies: data.js (must be loaded before this file)
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';



  // ==========================================================
  // 2. SCROLL PROGRESS BAR
  // ==========================================================
  // A thin progress bar at the top of the page that fills as
  // the user scrolls down, giving visual feedback of position.

  const scrollProgress = document.getElementById('scroll-progress');

  function updateScrollProgress() {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = scrollPercent + '%';
  }

  // ==========================================================
  // 3. STICKY NAVBAR WITH SHRINK
  // ==========================================================
  // Adds a 'scrolled' class to the navbar after scrolling past
  // 50px, enabling CSS to shrink/style it differently.

  const navbar = document.querySelector('.navbar');

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }



  // ==========================================================
  // 25. ACTIVE NAV LINK HIGHLIGHTING
  // ==========================================================
  // Determines which section is currently in view and toggles
  // the 'active' class on the corresponding navigation link.

  const navLinks = document.querySelectorAll('.nav-links a[href^="#"], .mobile-menu a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  function highlightActiveNav() {
    const scrollPos = window.scrollY + 100; // offset for navbar height

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // ==========================================================
  // COMBINED SCROLL HANDLER (passive for performance)
  // ==========================================================
  // Merges all scroll-dependent functions into a single handler.

  window.addEventListener('scroll', () => {
    updateScrollProgress();
    handleNavbarScroll();
    highlightActiveNav();
  }, { passive: true });

  // Fire once on load to set initial states
  updateScrollProgress();
  handleNavbarScroll();

  // ==========================================================
  // 4. MOBILE MENU TOGGLE
  // ==========================================================
  // Hamburger button toggles the mobile navigation drawer.
  // Clicking a link or outside the menu closes it.

  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    // Close menu when a link inside is clicked
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
      }
    });
  }

  // ==========================================================
  // 5. SMOOTH SCROLLING FOR ANCHOR LINKS
  // ==========================================================
  // Let the browser handle smooth scrolling natively via CSS
  // (scroll-behavior: smooth). We only close the mobile menu.

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', () => {
      // Close mobile menu if open
      if (hamburger && mobileMenu) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
      }
    });
  });

  // ==========================================================
  // 6. SCROLL REVEAL (IntersectionObserver)
  // ==========================================================
  // Watches elements with the 'reveal' class and adds 'active'
  // once they scroll into view, triggering CSS animations.

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target); // Only animate once
        }
      });
    },
    { threshold: 0.1 }
  );

  /**
   * Observe all current and future '.reveal' elements.
   * Called after dynamic content is rendered.
   */
  function observeRevealElements() {
    document.querySelectorAll('.reveal').forEach((el) => {
      el.classList.add('active');
    });
  }

  // ==========================================================
  // 20. TOAST NOTIFICATION SYSTEM
  // ==========================================================
  // Displays temporary toast messages for user feedback.

  /**
   * Shows a toast notification.
   * @param {string} message - The message to display.
   * @param {'info'|'success'|'error'} type - The toast type.
   */
  function showToast(message, type = 'info') {
    // Find or create toast container
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    // Determine icon based on type
    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ'
    };
    const icon = icons[type] || icons.info;

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-message">${message}</span>`;
    container.appendChild(toast);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3000);
  }

  // ==========================================================
  // 21. MODAL SYSTEM
  // ==========================================================
  // Reusable modal overlay for lightboxes, forms, etc.

  /**
   * Opens a modal with the given HTML content.
   * @param {string} contentHTML - Inner HTML for the modal body.
   */
  function openModal(contentHTML) {
    // Find or create the overlay
    let overlay = document.querySelector('.modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.innerHTML = '<div class="modal-content"></div>';
      document.body.appendChild(overlay);
    }

    const modalContent = overlay.querySelector('.modal-content');
    // Prepend a close button
    modalContent.innerHTML =
      '<button class="modal-close" aria-label="Close modal">&times;</button>' + contentHTML;

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scroll

    // Close button handler
    const closeBtn = modalContent.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    // Handle form submission inside modal (for quote form)
    const quoteForm = modalContent.querySelector('#quote-form');
    if (quoteForm) {
      quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Quote request submitted successfully!', 'success');
        closeModal();
      });
    }
  }

  /**
   * Closes the active modal.
   */
  function closeModal() {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
    document.body.style.overflow = '';
  }

  // Close modal on overlay click (but not on content click)
  document.addEventListener('click', (e) => {
    const overlay = document.querySelector('.modal-overlay.active');
    if (overlay && e.target === overlay) {
      closeModal();
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // ==========================================================
  // 27. RENDER HERO CONTENT
  // ==========================================================
  // Populates the hero section from companyInfo data.

  if (typeof companyInfo !== 'undefined') {
    const heroTitle = document.querySelector('.hero-title, .hero h1');
    const heroSubtitle = document.querySelector('.hero-subtitle, .hero p');

    if (heroTitle) heroTitle.textContent = companyInfo.tagline || '';
    if (heroSubtitle) heroSubtitle.textContent = companyInfo.description || '';
  }

  // ==========================================================
  // 26. RENDER ABOUT SECTION CONTENT
  // ==========================================================
  // Fills the about section with company info, mission, vision,
  // and core values.

  if (typeof companyInfo !== 'undefined') {
    const aboutDesc = document.querySelector('.about-description, #about .about-text p');
    const missionEl = document.getElementById('about-mission');
    const visionEl = document.getElementById('about-vision');

    if (aboutDesc) aboutDesc.textContent = companyInfo.description || '';
    if (missionEl) missionEl.textContent = companyInfo.mission || '';
    if (visionEl) visionEl.textContent = companyInfo.vision || '';

  }

  // ==========================================================
  // 7. RENDER SERVICES GRID
  // ==========================================================
  // Dynamically creates service cards from the services data.

  const servicesGrid = document.getElementById('services-grid');

  if (servicesGrid && typeof services !== 'undefined' && Array.isArray(services)) {
    servicesGrid.innerHTML = services
      .map(
        (service) => `
      <div class="service-card reveal">
        <h3>${service.title || ''}</h3>
        <p>${service.description || ''}</p>
      </div>
    `
      )
      .join('');
  }

  // ==========================================================
  // 8. RENDER STATISTICS
  // ==========================================================
  const statsGrid = document.getElementById('stats-grid');

  if (statsGrid && typeof statistics !== 'undefined') {
    const statEntries = Object.values(statistics);

    statsGrid.innerHTML = statEntries
      .map(
        (stat) => `
      <div class="stat-item">
        <div class="stat-number" data-target="${stat.value}" data-suffix="${stat.suffix || ''}">0${stat.suffix || ''}</div>
        <div class="stat-label">${stat.label || ''}</div>
      </div>
    `
      )
      .join('');

    // Animate stats when they scroll into view
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    statsObserver.observe(statsGrid);
  }

  function animateStats() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const suffix = counter.getAttribute('data-suffix');
      const duration = 1200; // ms
      const stepTime = 30; // ms
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target.toLocaleString() + suffix;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current).toLocaleString() + suffix;
        }
      }, stepTime);
    });
  }

  // Timeline rendering removed for clean redesign

  // ==========================================================
  // 10. RENDER GALLERY (First 6 Items)
  // ==========================================================
  // Displays a curated grid of gallery images. Clicking any
  // image opens it in a lightbox modal.

  const galleryGrid = document.getElementById('gallery-grid');

  if (galleryGrid && typeof gallery !== 'undefined' && Array.isArray(gallery)) {
    let currentGalleryItems = [];

    function renderGalleryGlimpse() {
      // Shuffle the array to get 6 random items for a dynamic glimpse
      const shuffled = [...gallery].sort(() => 0.5 - Math.random());
      currentGalleryItems = shuffled.slice(0, 6);

      // Add fade out effect
      galleryGrid.style.opacity = '0';
      
      setTimeout(() => {
        galleryGrid.innerHTML = currentGalleryItems
          .map(
            (item, index) => `
          <div class="gallery-item" data-index="${index}">
            <img src="${item.image || ''}" alt="${item.title || ''}" loading="lazy">
            <span class="gallery-badge">${(item.category || 'field').toUpperCase()}</span>
            <div class="gallery-overlay">
              <div class="gallery-info">
                <h3>${item.title || ''}</h3>
                <span class="gallery-action">
                  View Image
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        `
          )
          .join('');
          
        // Fade in
        galleryGrid.style.opacity = '1';
        galleryGrid.style.transition = 'opacity 0.4s ease-in-out';
      }, 300);
    }

    // Initial render
    renderGalleryGlimpse();

    // Automatic shuffle setup
    let autoShuffleInterval = setInterval(renderGalleryGlimpse, 4000);

    // Pause auto-shuffle when hovering over the gallery
    galleryGrid.addEventListener('mouseenter', () => clearInterval(autoShuffleInterval));
    galleryGrid.addEventListener('mouseleave', () => {
      autoShuffleInterval = setInterval(renderGalleryGlimpse, 4000);
    });

    // ==========================================================
    // 11. LIGHTBOX — Gallery Item Click
    // ==========================================================
    galleryGrid.addEventListener('click', (e) => {
      const galleryItem = e.target.closest('.gallery-item');
      if (!galleryItem) return;

      const index = parseInt(galleryItem.getAttribute('data-index'), 10);
      const item = gallery[index];
      if (!item) return;

      openModal(`
        <div class="lightbox">
          <img src="${item.image || ''}" alt="${item.title || ''}">
          <p class="lightbox-caption">${item.title || ''}</p>
        </div>
      `);
    });
  }

  // ==========================================================
  // 12. BEFORE / AFTER COMPARISON SLIDER
  // ==========================================================
  // Allows users to drag a handle across an image to compare
  // before and after states (e.g., untreated vs. treated crops).

  const comparisonContainer = document.querySelector('.comparison-container');

  if (comparisonContainer) {
    const slider = comparisonContainer.querySelector('.comparison-slider');
    const afterContainer = comparisonContainer.querySelector('.comparison-after');
    let isDragging = false;

    /**
     * Updates the slider and image clip position.
     * @param {number} clientX - The horizontal cursor/touch position.
     */
    function updateSlider(clientX) {
      const rect = comparisonContainer.getBoundingClientRect();
      let percent = ((clientX - rect.left) / rect.width) * 100;

      // Clamp between 5% and 95%
      percent = Math.max(5, Math.min(95, percent));

      if (slider) slider.style.left = percent + '%';
      if (afterContainer) {
        afterContainer.style.clipPath = `polygon(${percent}% 0, 100% 0, 100% 100%, ${percent}% 100%)`;
      }
    }

    if (slider) {
      // Mouse events
      slider.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
        slider.classList.add('active');
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        updateSlider(e.clientX);
      });

      document.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          slider.classList.remove('active');
        }
      });

      // Touch events
      slider.addEventListener('touchstart', (e) => {
        isDragging = true;
        slider.classList.add('active');
      }, { passive: true });

      document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        if (touch) updateSlider(touch.clientX);
      }, { passive: true });

      document.addEventListener('touchend', () => {
        if (isDragging) {
          isDragging = false;
          slider.classList.remove('active');
        }
      });
    }
  }

  // ==========================================================
  // 13. RENDER REVIEWS CAROUSEL
  // ==========================================================
  // Creates review cards and duplicates them for a seamless
  // infinite scrolling effect driven by CSS animation.

  const reviewsTrack = document.getElementById('reviews-track');

  if (reviewsTrack && typeof reviews !== 'undefined' && Array.isArray(reviews)) {
    // Duplicate the array for seamless infinite loop
    const duplicatedReviews = [...reviews, ...reviews];

    /**
     * Generates star HTML based on a numeric rating.
     * @param {number} rating - Star rating (1–5).
     * @returns {string} Star characters.
     */
    function renderStars(rating) {
      const fullStars = Math.min(Math.max(Math.round(rating || 0), 0), 5);
      return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
    }

    reviewsTrack.innerHTML = duplicatedReviews
      .map(
        (review) => `
      <div class="review-card">
        <div class="client-info">
          <div>
            <h4>${review.name || ''}</h4>
            <span class="client-location">${review.location || ''}</span>
          </div>
        </div>
        <div class="stars">${renderStars(review.rating)}</div>
        <p class="review-text">${review.review || ''}</p>
        <span class="review-company">${review.company || ''}</span>
      </div>
    `
      )
      .join('');

    // JS backup: pause animation on hover
    const reviewsWrapper = document.querySelector('.reviews-track-wrapper');
    if (reviewsWrapper) {
      reviewsWrapper.addEventListener('mouseenter', () => {
        reviewsTrack.style.animationPlayState = 'paused';
      });
      reviewsWrapper.addEventListener('mouseleave', () => {
        reviewsTrack.style.animationPlayState = 'running';
      });
    }
  }

  // ==========================================================
  // 14. RENDER PARTNER LOGOS
  // ==========================================================
  // Duplicates the uploaded partner logos for a seamless
  // full-color auto-scrolling carousel.

  const partnersTrack = document.getElementById('partners-track');

  if (partnersTrack && typeof partners !== 'undefined' && Array.isArray(partners)) {
    const duplicatedPartners = [...partners, ...partners];

    partnersTrack.innerHTML = duplicatedPartners
      .map(
        (partner) => `
      <div class="partner-logo">
        <img src="${partner.logo || ''}" alt="${partner.name || 'Partner logo'}" loading="eager" decoding="async">
      </div>
    `
      )
      .join('');
  }

  // ==========================================================
  // 15. RENDER TEAM CARDS (Removed - statically rendered in index.html)
  // ==========================================================

  // ==========================================================
  // 16. RENDER FAQ ACCORDION
  // ==========================================================
  // Creates collapsible FAQ items. Only one can be open at a
  // time (accordion pattern).

  const faqContainer = document.getElementById('faq-container');

  if (faqContainer && typeof faqs !== 'undefined' && Array.isArray(faqs)) {
    faqContainer.innerHTML = faqs
      .map(
        (faq) => `
      <div class="faq-item">
        <div class="faq-question" aria-expanded="false">
          <span>${faq.question || ''}</span>
          <span class="faq-icon">+</span>
        </div>
        <div class="faq-answer">
          <p>${faq.answer || ''}</p>
        </div>
      </div>
    `
      )
      .join('');

    // Accordion click handler using event delegation
    faqContainer.addEventListener('click', (e) => {
      const question = e.target.closest('.faq-question');
      if (!question) return;

      const faqItem = question.closest('.faq-item');
      if (!faqItem) return;

      const isActive = faqItem.classList.contains('active');

      // Close all FAQ items first
      faqContainer.querySelectorAll('.faq-item').forEach((item) => {
        item.classList.remove('active');
        const q = item.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
        const icon = item.querySelector('.faq-icon');
        if (icon) icon.textContent = '+';
      });

      // If the clicked item wasn't already active, open it
      if (!isActive) {
        faqItem.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        const icon = faqItem.querySelector('.faq-icon');
        if (icon) icon.textContent = '−';
      }
    });
  }

  // ==========================================================
  // 17. CONTACT FORM HANDLER
  // ==========================================================
  // Validates all fields and shows a toast on submit.

  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Gather all input/textarea/select values
      const fields = contactForm.querySelectorAll('input, textarea, select');
      let isValid = true;

      fields.forEach((field) => {
        if (field.hasAttribute('required') && !field.value.trim()) {
          isValid = false;
        }
      });

      // Also check that at least some fields have values
      const allValues = Array.from(fields).map((f) => f.value.trim());
      if (allValues.every((v) => v === '')) {
        isValid = false;
      }

      if (isValid) {
        showToast('Message Sent Successfully!', 'success');
        contactForm.reset();
      } else {
        showToast('Please fill in all fields', 'error');
      }
    });
  }



  // Quote Modal, static footer, and WhatsApp float logic removed. Footer is statically rendered in index.html.

  // ==========================================================
  // FINAL INITIALIZATION
  // ==========================================================
  // Observe all dynamically rendered '.reveal' elements after
  // all content has been inserted into the DOM.

  observeRevealElements();

  // Log successful initialization
  console.log('✅ SecondLeaf app.js initialized successfully.');
});
