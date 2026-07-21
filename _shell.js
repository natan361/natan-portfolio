/* ── Shared chrome ────────────────────────────────────────
   Nav and footer are identical on every page. Hand-copying them
   into five files guarantees they drift apart, so they are built
   from one definition here.

   The Hebrew is inlined into the markup by these builders before
   first paint, so the page is still correct with JS disabled for
   everything except the chrome — an acceptable trade for keeping
   one source of truth. Page CONTENT stays in the HTML.
   ────────────────────────────────────────────────────── */

const ICON = {
  burger: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
  sun: `<svg class="i-sun" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>`,
  moon: `<svg class="i-moon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`,
  wa: `<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5 0-.2 0-.4-.1-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/></svg>`,
  phone: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  home: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-9"/></svg>`,
  work: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7.5" width="18" height="12" rx="2"/><path d="M8 7.5V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1.5"/></svg>`,
  price: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 6.5c0-1.8-2-3-5-3s-5 1.3-5 3.3 2 2.8 5 3.2 5 1.4 5 3.3-2 3.2-5 3.2-5-1.2-5-3"/></svg>`,
  faq: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="M9.3 9.3a2.7 2.7 0 1 1 3.9 2.4c-.9.5-1.2 1-1.2 1.9"/><circle cx="12" cy="17" r=".25" fill="currentColor"/></svg>`,
};

// One place. Every page and the mobile bar read from here.
// wa.me needs the international form: 055-680-7812 -> 972556807812
export const PHONE = "972556807812";
export const PHONE_LOCAL = "055-680-7812";
export const EMAIL = "work71work72@gmail.com";

const LINKS = [
  { href: "process.html",   key: "nav.process", he: "איך זה עובד" },
  { href: "pricing.html",   key: "nav.pricing", he: "מחירים" },
  { href: "faq.html",       key: "nav.faq",     he: "שאלות" },
  { href: "articles.html",  key: "nav.art",     he: "מדריכים" },
  { href: "portfolio.html", key: "nav.work",    he: "עבודות" },
];

export function mountChrome({ active = "" } = {}) {
  const nav = document.getElementById("nav");
  if (nav) {
    nav.innerHTML = `
      <a href="index.html" class="nav-logo">
        <img src="assets-opt/logo-nav.webp" alt="" width="34" height="34" />
        <span>נתן חיים</span>
      </a>
      <ul class="nav-links" id="nav-links">
        ${LINKS.map(l => `<li><a href="${l.href}"${l.href === active ? ' aria-current="page"' : ""} data-i18n="${l.key}">${l.he}</a></li>`).join("")}
      </ul>
      <div class="nav-tools">
        <button class="icon-btn" id="theme-toggle" aria-label="החלפת ערכת צבע" data-i18n-attr="aria-label:nav.theme">${ICON.sun}${ICON.moon}</button>
        <button class="icon-btn lang" id="lang-toggle" aria-label="Switch to English">EN</button>
      </div>
      <a href="contact.html" class="btn nav-cta" data-i18n="nav.cta">בוא נדבר</a>
      <button class="nav-burger" id="burger" aria-label="פתיחת תפריט" aria-expanded="false" aria-controls="nav-links">${ICON.burger}</button>`;
  }

  const foot = document.getElementById("footer");
  if (foot) {
    foot.className = "footer wrap";
    foot.innerHTML = `
      <span data-i18n="foot.rights">© 2026 נתן חיים</span>
      <div class="footer-links">
        <a href="index.html" data-i18n="foot.home">דף הבית</a>
        <a href="portfolio.html" data-i18n="foot.portfolio">תיק עבודות</a>
        <a href="articles.html" data-i18n="nav.art">מדריכים</a>
        <a href="pricing.html" data-i18n="foot.pricing">מחירים</a>
        <a href="accessibility.html" data-i18n="foot.a11y">הצהרת נגישות</a>
      </div>`;
  }

  // The contact block on the homepage reads the same constant, so the
  // number can never be right in one place and stale in another.
  const wa = document.getElementById("wa-link");
  if (wa) wa.href = `https://wa.me/${PHONE}`;
  const tel = document.getElementById("tel-link");
  if (tel) tel.href = `tel:+${PHONE}`;
  const telText = document.getElementById("tel-text");
  if (telText) telText.textContent = PHONE_LOCAL;

  /* The persistent mobile nav — icons, not a hidden hamburger drawer.
     Someone browsing on a phone shouldn't need to open a menu to get
     to the portfolio or pricing; those are the two pages that close a
     sale. WhatsApp stays the one visually distinct item — it's the
     fastest path to a real conversation. */
  const bar = document.getElementById("mobile-bar");
  if (bar) {
    bar.className = "mobile-bar";
    const items = [
      { href: "index.html",     icon: ICON.home,  key: "bar.home",  he: "בית" },
      { href: "portfolio.html", icon: ICON.work,  key: "bar.work",  he: "עבודות" },
      { href: "pricing.html",   icon: ICON.price, key: "bar.price", he: "מחירים" },
      { href: "faq.html",       icon: ICON.faq,   key: "bar.faq",   he: "שאלות" },
    ];
    bar.innerHTML = `
      ${items.map(it => `
      <a class="mbar-i${it.href === active ? " current" : ""}" href="${it.href}"${it.href === active ? ' aria-current="page"' : ""}>
        ${it.icon}<span data-i18n="${it.key}">${it.he}</span>
      </a>`).join("")}
      <a class="mbar-i mbar-wa" href="https://wa.me/${PHONE}" target="_blank" rel="noopener">
        ${ICON.wa}<span data-i18n="bar.wa">וואטסאפ</span>
      </a>`;
  }

  /* Floating "בוא נדבר" pill — built here so it rides EVERY page, not
     just the homepage where it used to be hardcoded. Skipped on the
     contact page (you're already there) and never duplicated if a page
     still ships its own. Hidden under 700px, where the mobile-bar takes
     over — that rule lives in main.css. */
  if (active !== "contact.html" && !document.getElementById("float-cta")) {
    const cta = document.createElement("a");
    cta.href = "contact.html";
    cta.className = "float-cta";
    cta.id = "float-cta";
    cta.setAttribute("aria-label", "בוא נדבר");
    cta.innerHTML = `
      <span class="float-cta-av"><img src="assets-opt/natan-avatar.webp" alt="" width="46" height="46" loading="lazy" /></span>
      <span class="float-cta-txt">
        <b data-i18n="float.t">בוא נדבר</b>
        <small data-i18n="float.s">נתן · תגובה תוך 24 שעות</small>
      </span>
      <span class="float-cta-arrow" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      </span>`;
    document.body.appendChild(cta);
  }

  // Anonymous visitor analytics — loaded at idle so it never competes
  // with first paint on a paid-ad mobile visit. Public pages only:
  // admin.html doesn't mount the shell, so it is never tracked.
  const startTracking = () => import("./analytics.js").catch(() => {});
  if ("requestIdleCallback" in window) requestIdleCallback(startTracking, { timeout: 3000 });
  else setTimeout(startTracking, 1200);
}
