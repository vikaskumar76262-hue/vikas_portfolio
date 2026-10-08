/**
 * Vikas S - Portfolio Script
 * Handles:
 * 1. Night Mode Toggle & OS theme detection (CSS media queries)
 * 2. Responsive Vertical Navbar (Mobile/Tablet drawer toggle & backdrop)
 * 3. Active navigation section highlighting via IntersectionObserver
 * 4. Interactive retro contact form submission feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. THEME CONTROLLER (NIGHT MODE / LIGHT MODE)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem('theme');

  function getPreferredTheme() {
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    return mediaQuery.matches ? 'dark' : 'light';
  }

  function applyTheme(theme, isExplicit = false) {
    if (isExplicit) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    } else {
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    }

    const currentTheme = isExplicit ? theme : (savedTheme || (mediaQuery.matches ? 'dark' : 'light'));

    if (themeToggleBtn) {
      const iconSpan = themeToggleBtn.querySelector('.theme-icon');
      const textSpan = themeToggleBtn.querySelector('.theme-text');
      if (currentTheme === 'dark') {
        if (iconSpan) iconSpan.textContent = '☀️';
        if (textSpan) textSpan.textContent = 'LIGHT';
        themeToggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
      } else {
        if (iconSpan) iconSpan.textContent = '🌙';
        if (textSpan) textSpan.textContent = 'NIGHT';
        themeToggleBtn.setAttribute('aria-label', 'Switch to Night Mode');
      }
    }
  }

  // Initialize theme on load
  applyTheme(getPreferredTheme(), Boolean(savedTheme));

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || (mediaQuery.matches ? 'dark' : 'light');
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme, true);
    });
  }

  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light', false);
    }
  });

  /* ==========================================================================
     2. RESPONSIVE VERTICAL NAVBAR & MOBILE DRAWER TOGGLE
     ========================================================================== */
  const menuToggleBtn = document.getElementById('menu-toggle');
  const menuCloseBtn = document.getElementById('menu-close-btn');
  const mainNav = document.getElementById('main-nav');
  const navOverlay = document.getElementById('nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link');

  function openMenu() {
    if (mainNav && navOverlay) {
      mainNav.classList.add('is-open');
      navOverlay.classList.add('is-open');
      if (menuToggleBtn) {
        menuToggleBtn.setAttribute('aria-expanded', 'true');
      }
      document.body.style.overflow = 'hidden';
      // Shift focus to close button for keyboard accessibility
      if (menuCloseBtn) {
        setTimeout(() => menuCloseBtn.focus(), 100);
      }
    }
  }

  function closeMenu() {
    if (mainNav && navOverlay) {
      mainNav.classList.remove('is-open');
      navOverlay.classList.remove('is-open');
      if (menuToggleBtn) {
        menuToggleBtn.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';
    }
  }

  if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', () => {
      const isOpen = mainNav && mainNav.classList.contains('is-open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (menuCloseBtn) {
    menuCloseBtn.addEventListener('click', () => {
      closeMenu();
      if (menuToggleBtn) menuToggleBtn.focus();
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
  }

  // Close drawer when pressing Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav && mainNav.classList.contains('is-open')) {
      closeMenu();
      if (menuToggleBtn) menuToggleBtn.focus();
    }
  });

  // Close mobile drawer when clicking any navigation link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        closeMenu();
      }
    });
  });

  // Handle viewport resize: auto-close drawer and reset scroll lock when moving to desktop view
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && mainNav && mainNav.classList.contains('is-open')) {
      closeMenu();
    }
    updateActiveNavLink();
  });

  /* ==========================================================================
     3. ACTIVE SECTION HIGHLIGHTING IN VERTICAL NAVBAR
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    // If scrolled to the bottom of the page, activate the last section (Contact)
    const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);
    if (isAtBottom && sections.length > 0) {
      const lastSectionId = sections[sections.length - 1].getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${lastSectionId}`);
      });
      return;
    }

    const headerThreshold = window.innerWidth >= 1024 ? 100 : 140;
    let currentSectionId = '';

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= headerThreshold && rect.bottom > headerThreshold - 60) {
        currentSectionId = section.getAttribute('id');
      }
    });

    // Default to first section (hero) if near top
    if (!currentSectionId && window.scrollY < 200 && sections.length > 0) {
      currentSectionId = sections[0].getAttribute('id');
    }

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentSectionId}`);
      });
    }
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  /* ==========================================================================
     4. RETRO CONTACT FORM DISPATCH INTERACTION
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('contact-name');
      const senderName = nameInput ? nameInput.value.trim() : 'Adventurer';

      formStatus.className = 'form-status is-success';
      formStatus.textContent = `▶ TRANSMISSION CONFIRMED! Thank you, ${senderName}. Vikas S will respond soon.`;

      contactForm.reset();

      setTimeout(() => {
        formStatus.style.display = 'none';
        formStatus.className = 'form-status';
      }, 7000);
    });
  }
});
