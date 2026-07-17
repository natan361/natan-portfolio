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
};

// One place. Every page and the mobile bar read from here.
// wa.me needs the international form: 055-680-7812 -> 972556807812
export const PHONE = "972556807812";
export const PHONE_LOCAL = "055-680-7812";
export const EMAIL = "ntyyml72@gmail.com";

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
      <a href="index.html#contact" class="btn nav-cta" data-i18n="nav.cta">בוא נדבר</a>
      <button class="nav-burger" id="burger" aria-label="פתיחת תפריט" aria-expanded="false" aria-controls="nav-links">${ICON.burger}</button>`;
  }

  const foot = document.getElementById("footer");
  if (foot) {
    foot.className = "footer wrap";
    foot.innerHTML = `
      <span data-i18n="foot.rights">© 2026 נתן חיים · ירושלים</span>
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

  const bar = document.getElementById("mobile-bar");
  if (bar) {
    bar.className = "mobile-bar";
    bar.innerHTML = `
      <a class="btn" href="https://wa.me/${PHONE}" target="_blank" rel="noopener">
        ${ICON.wa}<span data-i18n="bar.wa">וואטסאפ</span>
      </a>
      <a class="btn btn-ghost" href="index.html#contact">
        ${ICON.phone}<span data-i18n="bar.call">השאר פרטים</span>
      </a>`;
  }
}
