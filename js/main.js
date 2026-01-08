/* main.js - Jamiphy web components & site-wide JS */

// ---------------- Theme constants ----------------
const THEME_KEY = 'jamiphy-theme';
const THEMES = ['light', 'dark', 'system'];

// ---------------- Header Component ----------------
class JamiphyHeader extends HTMLElement {
  connectedCallback() {
    // Determine current page for active state
    const path = window.location.pathname;
    const isHome = path === '/' || path === '/index.html';
    const isAbout = path.startsWith('/about');
    const isContact = path.startsWith('/contact');

    this.innerHTML = `
      <nav>
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <!-- Logo -->
            <div class="flex items-center">
              <a href="/" class="logo text-xl flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span class="text-[var(--retro-accent)]">&lt;</span>Jamiphy<span class="text-[var(--retro-accent)]">/&gt;</span>
              </a>
            </div>
            
            <!-- Desktop navigation -->
            <div class="hidden md:flex items-center gap-1">
              <a href="/" class="nav-link px-4 py-2 text-sm ${isHome ? 'active text-[var(--retro-accent)]' : ''}">Home</a>
              <a href="/about/" class="nav-link px-4 py-2 text-sm ${isAbout ? 'active text-[var(--retro-accent)]' : ''}">About</a>
              <a href="/contact/" class="nav-link px-4 py-2 text-sm ${isContact ? 'active text-[var(--retro-accent)]' : ''}">Contact</a>
              <div class="w-px h-6 bg-[var(--retro-border)] mx-2"></div>
              <button data-theme-toggle class="theme-toggle" aria-label="Toggle theme" title="Toggle theme">
                <span class="material-symbols-rounded theme-icon">desktop_windows</span>
              </button>
            </div>
            
            <!-- Mobile menu button -->
            <div class="md:hidden flex items-center gap-2">
              <button data-theme-toggle class="theme-toggle" aria-label="Toggle theme">
                <span class="material-symbols-rounded theme-icon">desktop_windows</span>
              </button>
              <button id="nav-toggle" aria-label="Toggle menu" aria-expanded="false">
                <span class="material-symbols-rounded">menu</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Mobile menu -->
        <div id="mobile-menu" class="md:hidden hidden">
          <a href="/" class="${isHome ? 'text-[var(--retro-accent)]' : ''}">Home</a>
          <a href="/about/" class="${isAbout ? 'text-[var(--retro-accent)]' : ''}">About</a>
          <a href="/contact/" class="${isContact ? 'text-[var(--retro-accent)]' : ''}">Contact</a>
        </div>
      </nav>
    `;

    // Mobile menu toggle
    const navToggleBtn = this.querySelector('#nav-toggle');
    const mobileMenu = this.querySelector('#mobile-menu');

    if (navToggleBtn && mobileMenu) {
      navToggleBtn.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.toggle('hidden');
        navToggleBtn.setAttribute('aria-expanded', !isHidden);
        
        // Toggle icon
        const icon = navToggleBtn.querySelector('.material-symbols-rounded');
        icon.textContent = isHidden ? 'menu' : 'close';
      });
    }

    // Initialize theme toggles
    initThemeToggles(this);
  }
}

// ---------------- Footer Component ----------------
class JamiphyFooter extends HTMLElement {
  connectedCallback() {
    const year = new Date().getFullYear();
    this.innerHTML = `
      <footer>
        <div class="max-w-6xl mx-auto px-4">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p class="text-center sm:text-left">
              <span class="text-[var(--retro-accent)]">©</span> ${year} Jamiphy. All rights reserved.
            </p>
            <div class="flex items-center gap-4 text-sm">
              <a href="/" class="hover:text-[var(--retro-accent)] transition-colors">Home</a>
              <span class="text-[var(--retro-border)]">•</span>
              <a href="/about/" class="hover:text-[var(--retro-accent)] transition-colors">About</a>
              <span class="text-[var(--retro-border)]">•</span>
              <a href="/contact/" class="hover:text-[var(--retro-accent)] transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
}

// Register custom elements
if (!customElements.get('jamiphy-header')) {
  customElements.define('jamiphy-header', JamiphyHeader);
}
if (!customElements.get('jamiphy-footer')) {
  customElements.define('jamiphy-footer', JamiphyFooter);
}

// ---------------- Synthwave Grid Animation ----------------
function initSynthwave() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'synthwave-canvas';
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:0;';
  hero.style.position = 'relative';
  hero.prepend(canvas);

  // Ensure content stays above canvas
  hero.querySelectorAll(':scope > *:not(canvas)').forEach(el => {
    const style = getComputedStyle(el);
    if (style.position === 'static') el.style.position = 'relative';
    el.style.zIndex = '1';
  });

  const ctx = canvas.getContext('2d');
  let width, height, dpr;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  
  window.addEventListener('resize', resize);
  resize();

  // Grid configuration
  const rowCount = 35;
  const colSpacing = 100;
  let offset = 0;

  function draw() {
    const horizon = height * 0.45;
    ctx.clearRect(0, 0, width, height);

    const theme = currentEffectiveTheme();
    const isDark = theme === 'dark';

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    if (isDark) {
      bgGrad.addColorStop(0, '#0a0a0f');
      bgGrad.addColorStop(0.4, '#0f0f1a');
      bgGrad.addColorStop(1, '#1a103a');
    } else {
      bgGrad.addColorStop(0, '#faf9f7');
      bgGrad.addColorStop(0.5, '#f5f4f2');
      bgGrad.addColorStop(1, '#ede9fe');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Sun/glow effect
    const sunGrad = ctx.createRadialGradient(
      width / 2, horizon, 0,
      width / 2, horizon, height * 0.4
    );
    if (isDark) {
      sunGrad.addColorStop(0, 'rgba(129, 140, 248, 0.15)');
      sunGrad.addColorStop(0.5, 'rgba(167, 139, 250, 0.05)');
      sunGrad.addColorStop(1, 'transparent');
    } else {
      sunGrad.addColorStop(0, 'rgba(99, 102, 241, 0.08)');
      sunGrad.addColorStop(0.5, 'rgba(124, 58, 237, 0.03)');
      sunGrad.addColorStop(1, 'transparent');
    }
    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    const gridAlpha = isDark ? 0.4 : 0.2;
    const gridColor = isDark ? `rgba(129, 140, 248, ${gridAlpha})` : `rgba(99, 102, 241, ${gridAlpha})`;
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;

    // Horizontal perspective lines
    for (let i = 1; i < rowCount; i++) {
      const progress = (i + offset) / rowCount;
      const y = horizon + Math.pow(progress, 2.8) * (height - horizon);
      const alpha = Math.min(1, progress * 1.5);
      ctx.globalAlpha = alpha * gridAlpha;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.globalAlpha = gridAlpha;

    // Vertical converging lines
    const cols = Math.ceil(width / colSpacing) + 2;
    for (let i = -cols; i <= cols; i++) {
      const x = width / 2 + i * colSpacing;
      ctx.beginPath();
      ctx.moveTo(x, height);
      ctx.lineTo(width / 2, horizon);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;

    // Animate
    offset += 0.02;
    if (offset > 1) offset -= 1;

    requestAnimationFrame(draw);
  }
  
  draw();
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSynthwave);
} else {
  initSynthwave();
}

// ---------------- Theme Management ----------------

function getStoredTheme() {
  const t = localStorage.getItem(THEME_KEY);
  return THEMES.includes(t) ? t : 'system';
}

function applyTheme(theme) {
  const root = document.documentElement;
  
  if (theme === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', theme);
  }

  // Update all toggle icons
  const iconMap = { light: 'light_mode', dark: 'dark_mode', system: 'desktop_windows' };
  document.querySelectorAll('[data-theme-toggle] .theme-icon').forEach(icon => {
    icon.textContent = iconMap[theme] || 'desktop_windows';
  });
}

function nextTheme(current) {
  const idx = THEMES.indexOf(current);
  return THEMES[(idx + 1) % THEMES.length];
}

function initThemeToggles(root) {
  const buttons = root.querySelectorAll('[data-theme-toggle]');
  if (!buttons.length) return;

  let currentTheme = getStoredTheme();
  applyTheme(currentTheme);

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentTheme = nextTheme(currentTheme);
      localStorage.setItem(THEME_KEY, currentTheme);
      applyTheme(currentTheme);
    });
  });
}

function currentEffectiveTheme() {
  const explicit = document.documentElement.getAttribute('data-theme');
  if (explicit) return explicit;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// ---------------- Smooth reveal animations ----------------
function initRevealAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.animate-fade-in').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

// Add revealed state styles
const style = document.createElement('style');
style.textContent = `.animate-fade-in.revealed { opacity: 1 !important; }`;
document.head.appendChild(style);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRevealAnimations);
} else {
  initRevealAnimations();
}
