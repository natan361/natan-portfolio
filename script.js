/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   NATAN Portfolio · script.js
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* ── 1. Reveal on scroll ──────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ── 2. Active nav link on scroll ─────────────────────── */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a[href^='#']");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
sections.forEach((s) => navObserver.observe(s));

/* ── 3. Before/After Compare Slider ──────────────────── */
class CompareSlider {
  constructor(el) {
    this.el = el;
    this.beforeImg = el.querySelector(".compare-before-img");
    this.handleEl  = el.querySelector(".compare-handle");
    this.badgeBefore = el.querySelector(".compare-badge-before");
    this.badgeAfter  = el.querySelector(".compare-badge-after");
    this.dragging = false;
    this.pos = 50;
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp   = this._onMouseUp.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
    this._onTouchEnd  = this._onTouchEnd.bind(this);
    this.init();
  }

  init() {
    this.handleEl.addEventListener("mousedown",  this._startDrag.bind(this));
    this.handleEl.addEventListener("touchstart", this._startTouch.bind(this), { passive: false });
    this.el.addEventListener("click", this._onClick.bind(this));
  }

  _getPos(clientX) {
    const rect = this.el.getBoundingClientRect();
    return Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100));
  }

  _setPos(pos) {
    this.pos = pos;
    // clip-path approach: clip the right side of the before image
    this.beforeImg.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
    this.handleEl.style.left = `${pos}%`;
    if (this.badgeBefore) this.badgeBefore.style.opacity = pos > 10 ? "1" : "0";
    if (this.badgeAfter)  this.badgeAfter.style.opacity  = pos < 90 ? "1" : "0";
  }

  _startDrag(e) {
    e.preventDefault();
    this.dragging = true;
    this.handleEl.classList.add("dragging");
    this._setPos(this._getPos(e.clientX));
    document.addEventListener("mousemove", this._onMouseMove);
    document.addEventListener("mouseup",   this._onMouseUp);
  }

  _startTouch(e) {
    e.preventDefault();
    this.dragging = true;
    this.handleEl.classList.add("dragging");
    this._setPos(this._getPos(e.touches[0].clientX));
    document.addEventListener("touchmove", this._onTouchMove, { passive: false });
    document.addEventListener("touchend",  this._onTouchEnd);
  }

  _onMouseMove(e) {
    if (!this.dragging) return;
    this._setPos(this._getPos(e.clientX));
  }

  _onTouchMove(e) {
    if (!this.dragging) return;
    e.preventDefault();
    this._setPos(this._getPos(e.touches[0].clientX));
  }

  _onMouseUp() {
    this.dragging = false;
    this.handleEl.classList.remove("dragging");
    document.removeEventListener("mousemove", this._onMouseMove);
    document.removeEventListener("mouseup",   this._onMouseUp);
  }

  _onTouchEnd() {
    this.dragging = false;
    this.handleEl.classList.remove("dragging");
    document.removeEventListener("touchmove", this._onTouchMove);
    document.removeEventListener("touchend",  this._onTouchEnd);
  }

  _onClick(e) {
    if (this.handleEl.contains(e.target)) return;
    this._setPos(this._getPos(e.clientX));
  }
}

// Init all sliders on page
document.querySelectorAll(".compare").forEach((el) => new CompareSlider(el));

/* ── 4. Mobile Category Tabs ──────────────────────────── */
(function () {
  const tabs       = document.querySelectorAll(".mobile-tab");
  const sectionMap = {
    visualizations: document.getElementById("visualizations"),
    websites:       document.getElementById("websites"),
    videos:         document.getElementById("videos"),
  };

  function isMobile() {
    return window.innerWidth <= 640;
  }

  /* Force reveal animations for elements that were hidden (display:none)
     when the IntersectionObserver first ran — they never got .visible */
  function revealSection(sectionEl) {
    if (!sectionEl) return;
    setTimeout(() => {
      sectionEl.querySelectorAll(".reveal:not(.visible)").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 60 && rect.bottom > -60) {
          el.classList.add("visible");
        } else {
          // Re-observe so it animates as user scrolls into it
          revealObserver.observe(el);
        }
      });
    }, 60); // small delay so display:block has painted
  }

  /* scroll=true only when triggered by a user tap (not on init) */
  function activate(target, scroll) {
    // Update tab buttons
    tabs.forEach((tab) =>
      tab.classList.toggle("active", tab.dataset.target === target)
    );

    // Show / hide sections
    Object.entries(sectionMap).forEach(([key, el]) => {
      if (!el) return;
      const isActive = key === target;
      el.classList.toggle("mob-active", isActive);
      if (isActive) revealSection(el);
    });

    // Scroll so the tab bar sits just below the nav (only on user tap)
    if (scroll) {
      const tabBar = document.getElementById("mobile-tabs");
      if (tabBar) {
        // Use .top (not .bottom) so the bar is fully visible under the nav
        const tabTop = tabBar.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: Math.max(0, tabTop - 54), behavior: "smooth" });
      }
    }
  }

  function initMobile() {
    if (isMobile()) {
      activate("visualizations", false); // false = don't scroll on page load
    } else {
      // Desktop: show all sections, remove mobile state
      Object.values(sectionMap).forEach((el) => {
        if (el) el.classList.remove("mob-active");
      });
    }
  }

  // Wire up tab clicks — scroll only on actual user tap
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (isMobile()) activate(tab.dataset.target, true);
    });
  });

  initMobile();
  window.addEventListener("resize", () => initMobile());
})();

/* ── 6. Cursor Proximity Text Effect ──────────────────── */
/*
 * Ported from danielpetho/text-cursor-proximity (React/Motion)
 * to vanilla JS — same gaussian falloff, same letter-level tracking.
 */
class CursorProximity {
  constructor({ container, element, fromColor, toColor, fromScale = 1, toScale = 1.3, radius = 140, falloff = "gaussian" }) {
    this.container  = container;
    this.mouse      = { x: -9999, y: -9999 };
    this.letters    = [];
    this.fromRGB    = this._hex(fromColor);
    this.toRGB      = this._hex(toColor);
    this.fromScale  = fromScale;
    this.toScale    = toScale;
    this.radius     = radius;
    this.falloff    = falloff;

    this._split(element);
    this._bind();
    this._tick();
  }

  /* Parse "#RRGGBB" → {r,g,b} */
  _hex(h) {
    return {
      r: parseInt(h.slice(1, 3), 16),
      g: parseInt(h.slice(3, 5), 16),
      b: parseInt(h.slice(5, 7), 16),
    };
  }

  /* Lerp two {r,g,b} objects */
  _lerp(a, b, t) {
    return {
      r: Math.round(a.r + (b.r - a.r) * t),
      g: Math.round(a.g + (b.g - a.g) * t),
      b: Math.round(a.b + (b.b - a.b) * t),
    };
  }

  /* Proximity falloff (matches React component exactly) */
  _falloff(dist) {
    const n = Math.min(Math.max(1 - dist / this.radius, 0), 1);
    switch (this.falloff) {
      case "exponential": return n * n;
      case "gaussian":    return Math.exp(-Math.pow(dist / (this.radius / 2), 2) / 2);
      default:            return n;          /* linear */
    }
  }

  /* Split element text into per-letter <span class="prox-letter"> */
  _split(el) {
    const raw = el.textContent.trim();
    el.setAttribute("aria-label", raw);
    el.innerHTML = "";

    for (const char of raw) {
      if (char === " ") {
        const sp = document.createElement("span");
        sp.style.display = "inline-block";
        sp.innerHTML = "&nbsp;";
        el.appendChild(sp);
      } else {
        const sp = document.createElement("span");
        sp.className = "prox-letter";
        sp.setAttribute("aria-hidden", "true");
        sp.textContent = char;
        el.appendChild(sp);
        this.letters.push(sp);
      }
    }
  }

  /* Track mouse relative to container */
  _bind() {
    this.container.addEventListener("mousemove", (e) => {
      const r = this.container.getBoundingClientRect();
      this.mouse.x = e.clientX - r.left;
      this.mouse.y = e.clientY - r.top;
    });
    this.container.addEventListener("mouseleave", () => {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
    });
    /* Touch support */
    this.container.addEventListener("touchmove", (e) => {
      const r = this.container.getBoundingClientRect();
      this.mouse.x = e.touches[0].clientX - r.left;
      this.mouse.y = e.touches[0].clientY - r.top;
    }, { passive: true });
  }

  /* RAF animation loop */
  _tick() {
    const cr = this.container.getBoundingClientRect();

    this.letters.forEach((letter) => {
      const lr   = letter.getBoundingClientRect();
      const cx   = lr.left + lr.width  / 2 - cr.left;
      const cy   = lr.top  + lr.height / 2 - cr.top;
      const dist = Math.hypot(this.mouse.x - cx, this.mouse.y - cy);
      const prox = this._falloff(dist);

      const scale = this.fromScale + (this.toScale - this.fromScale) * prox;
      const col   = this._lerp(this.fromRGB, this.toRGB, prox);

      letter.style.transform = `scale(${scale.toFixed(4)})`;
      letter.style.color     = `rgb(${col.r},${col.g},${col.b})`;
    });

    requestAnimationFrame(() => this._tick());
  }
}

/* — Init on hero name — */
(function () {
  // No mouse on touch-only devices → skip the RAF loop entirely (saves battery)
  if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

  const hero    = document.getElementById("top");
  const nameEl  = document.getElementById("hero-name");
  const tagEl   = document.getElementById("hero-tagline");
  if (!hero || !nameEl) return;

  /* Big name: white → electric yellow, scale 1 → 1.28, gaussian */
  new CursorProximity({
    container: hero,
    element:   nameEl,
    fromColor: "#EDECEB",
    toColor:   "#E8FF4B",
    fromScale: 1,
    toScale:   1.28,
    radius:    160,
    falloff:   "gaussian",
  });

  /* Tagline: subtler — white → yellow at smaller scale, linear */
  if (tagEl) {
    new CursorProximity({
      container: hero,
      element:   tagEl,
      fromColor: "#EDECEB",
      toColor:   "#E8FF4B",
      fromScale: 1,
      toScale:   1.12,
      radius:    100,
      falloff:   "linear",
    });
  }
})();

/* ── 7. Scroll-driven background video ────────────────── */
(function () {
  const video = document.getElementById("site-video");
  if (!video) return;

  // Hold at frame 0 — no autoplay
  video.pause();
  video.currentTime = 0;

  let ticking = false;

  function updateVideo() {
    const scrollY   = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;

    const progress = Math.min(scrollY / maxScroll, 1);

    // Only seek when video data is available
    if (video.readyState >= 2) {
      video.currentTime = progress * video.duration;
    }
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateVideo);
      ticking = true;
    }
  }, { passive: true });

  // Snap to correct frame on load (in case page was refreshed mid-scroll)
  video.addEventListener("loadedmetadata", updateVideo);
})();

/* ── 8. Duplicate ticker content for seamless loop ─────── */
document.querySelectorAll(".ticker").forEach((ticker) => {
  const original = ticker.innerHTML;
  ticker.innerHTML = original + original; // duplicate for seamless loop
});

/* ── 9. Accessibility Widget Panel ────────────────────────── */
(function () {
  const panel    = document.getElementById("a11y-panel");
  const backdrop = document.getElementById("a11y-backdrop");
  const fab      = document.getElementById("a11y-fab");
  const closeBtn = document.getElementById("a11y-panel-close");
  let lastFocus  = null;

  function openPanel() {
    if (!panel) return;
    lastFocus = document.activeElement;
    panel.classList.add("open");
    backdrop.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    fab.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    closeBtn?.focus();
  }

  function closePanel() {
    if (!panel) return;
    panel.classList.remove("open");
    backdrop.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    fab.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    lastFocus?.focus();
  }

  fab?.addEventListener("click", openPanel);
  closeBtn?.addEventListener("click", closePanel);
  backdrop?.addEventListener("click", closePanel);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel?.classList.contains("open")) closePanel();
  });

  /* ── Text size ── */
  const sizeBtns = document.querySelectorAll(".a11y-size-btn");
  const SIZE_KEY = "natan_font_scale";

  function applySize(scale) {
    document.documentElement.style.fontSize = `${scale * 100}%`;
    sizeBtns.forEach((btn) => {
      const active = parseFloat(btn.dataset.scale) === scale;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
    localStorage.setItem(SIZE_KEY, scale);
  }

  sizeBtns.forEach((btn) => {
    btn.addEventListener("click", () => applySize(parseFloat(btn.dataset.scale)));
  });

  // Restore saved size
  const savedScale = parseFloat(localStorage.getItem(SIZE_KEY) || "1");
  if (savedScale !== 1) applySize(savedScale);

  /* ── High contrast ── */
  const contrastBtn = document.getElementById("toggle-contrast");
  const CONTRAST_KEY = "natan_high_contrast";

  function applyContrast(on) {
    document.documentElement.classList.toggle("high-contrast", on);
    contrastBtn?.setAttribute("aria-checked", String(on));
    localStorage.setItem(CONTRAST_KEY, on ? "1" : "0");
  }

  contrastBtn?.addEventListener("click", () => {
    applyContrast(contrastBtn.getAttribute("aria-checked") !== "true");
  });

  if (localStorage.getItem(CONTRAST_KEY) === "1") applyContrast(true);

  /* ── Reduce motion ── */
  const motionBtn = document.getElementById("toggle-motion");
  const MOTION_KEY = "natan_reduce_motion";

  function applyMotion(on) {
    document.documentElement.classList.toggle("reduce-motion", on);
    motionBtn?.setAttribute("aria-checked", String(on));
    localStorage.setItem(MOTION_KEY, on ? "1" : "0");
  }

  motionBtn?.addEventListener("click", () => {
    applyMotion(motionBtn.getAttribute("aria-checked") !== "true");
  });

  // Also respect OS prefers-reduced-motion
  const osPrefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (localStorage.getItem(MOTION_KEY) === "1" || osPrefersReduced) applyMotion(true);
})();

/* ── 10. Terms modal ──────────────────────────────────────── */
(function () {
  const modal = document.getElementById("terms-modal");
  if (!modal) return;

  function openModal() {
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modal.querySelector("[tabindex='-1']")?.focus();
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  modal.querySelector(".modal-close")?.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  modal.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  document.getElementById("btn-terms")?.addEventListener("click", openModal);
})();

/* ── 11. Cookie consent ───────────────────────────────────── */
(function () {
  const banner   = document.getElementById("cookie-banner");
  const COOKIE_KEY = "natan_cookie_consent";
  if (!banner) return;

  if (!localStorage.getItem(COOKIE_KEY)) {
    setTimeout(() => { banner.hidden = false; }, 1400);
  }

  document.getElementById("cookie-accept")?.addEventListener("click", () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    banner.hidden = true;
  });
  document.getElementById("cookie-decline")?.addEventListener("click", () => {
    localStorage.setItem(COOKIE_KEY, "declined");
    banner.hidden = true;
  });
})();

/* ── 11. Mobile nav ─────────────────────────────────────── */
(function () {
  const mobileBtn  = document.querySelector(".nav-mobile-btn");
  const navLinksEl = document.querySelector(".nav-links");
  if (!mobileBtn || !navLinksEl) return;

  const NAV_H = 54; // mobile nav height (px) — must match CSS

  function openNav() {
    navLinksEl.style.cssText =
      `display:flex; flex-direction:column; position:fixed;` +
      ` top:${NAV_H}px; left:0; right:0;` +
      ` background:rgba(11,11,11,0.97);` +
      ` padding:20px 28px; gap:4px; z-index:99;` +
      ` border-bottom:0.5px solid rgba(237,236,235,0.07);`;
    mobileBtn.setAttribute("aria-expanded", "true");
  }

  function closeNav() {
    navLinksEl.style.cssText = "";
    mobileBtn.setAttribute("aria-expanded", "false");
  }

  function isOpen() {
    return navLinksEl.style.display === "flex";
  }

  // Toggle on hamburger click
  mobileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    isOpen() ? closeNav() : openNav();
  });

  // Close when any nav link is clicked
  navLinksEl.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", closeNav)
  );

  // Close when tapping outside the nav
  document.addEventListener("click", (e) => {
    if (isOpen() && !navLinksEl.contains(e.target) && e.target !== mobileBtn) {
      closeNav();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) closeNav();
  });
})();
