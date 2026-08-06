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
  /* The real WhatsApp mark, not an approximation of one: the official
     silhouette (bubble + tail) filled white on the brand green #25D366,
     with the handset knocked back out in green. Drawing "a phone in a
     speech bubble" by hand gets the proportions wrong and reads as a
     lookalike — which is the one thing a trust badge must not do.
     Geometry from the published WhatsApp glyph, inset inside the disc. */
  wa: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#25D366"/><g transform="translate(3.9 3.6) scale(.675)"><path fill="#fff" d="M20.463 3.488A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/><path fill="#25D366" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347Z"/></g></svg>`,
  phone: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  // A question mark in a speech bubble: this opens answers, not a chat
  // with a person, and the shape should not promise a person.
  ask: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 14.5a2.5 2.5 0 0 1-2.5 2.5H8l-4.5 4V5.5A2.5 2.5 0 0 1 6 3h12.5A2.5 2.5 0 0 1 21 5.5z"/><path d="M9.6 8.4a2.5 2.5 0 1 1 3.6 2.2c-.85.45-1.2.95-1.2 1.7"/><circle cx="12" cy="15.4" r=".6" fill="currentColor" stroke="none"/></svg>`,
};

// One place. Every page reads from here.
// wa.me needs the international form: 055-680-7812 -> 972556807812
export const PHONE = "972556807812";
export const PHONE_LOCAL = "055-680-7812";
export const EMAIL = "work71work72@gmail.com";

/* ── The one call to action ───────────────────────────────
   The site used to ask for three different things — start a
   conversation, request a quote, go look at the portfolio — and a
   visitor who is offered three next steps takes none. Every button
   on every page is now the same button: WhatsApp, opened with the
   first message already typed so the visitor only has to press send.

   Anything that wants to be that button carries data-wa. An optional
   value overrides the default opening line (a pricing card names its
   own package, a case study names the project), so the message Natan
   receives already says what the person was looking at.
   ────────────────────────────────────────────────────── */
export const WA_TEXT = "היי נתן, הגעתי מהאתר ואשמח לשמוע פרטים על בניית אתר לעסק שלי.";
export const waHref = (text) =>
  `https://wa.me/${PHONE}?text=${encodeURIComponent(text || WA_TEXT)}`;

/* The WhatsApp mark that rides the button's leading corner. Injected
   here rather than pasted into eight HTML files — the badge is one
   shape and it should have one definition. */
const WA_BADGE = `<span class="wa-badge" aria-hidden="true">${ICON.wa}</span>`;

/** Points every [data-wa] element at WhatsApp and gives the pill buttons
 *  their badge. Safe to call again after new markup is rendered from the
 *  database — it never double-adds. */
export function wireWhatsApp(root = document) {
  for (const a of root.querySelectorAll("[data-wa]")) {
    a.href = waHref(a.dataset.wa);
    a.target = "_blank";
    a.rel = "noopener";
    // Opening WhatsApp is the loudest possible "I am in touch now".
    // The consultation popup must not interrupt that person afterwards.
    // Written here rather than by importing consult.js: this fires on
    // the single most valuable click on the site, and it is not worth a
    // network request to set one string.
    if (!a.dataset.waWired) {
      a.dataset.waWired = "1";
      a.addEventListener("click", quietConsult);
    }
    // The nav pill is 66px tall and carries the mark inline instead —
    // a badge rising 17px above it would hang off the top of the page.
    if (a.classList.contains("btn-wa") && !a.classList.contains("nav-cta")
        && !a.querySelector(".wa-badge")) {
      a.insertAdjacentHTML("afterbegin", WA_BADGE);
    }
  }
}

/* ── The consultation popup's trigger ─────────────────────
   The panel itself lives in consult.js and is fetched only when one of
   these two signals fires, so a visitor who leaves in ten seconds never
   downloads it. On paid mobile traffic that is ad budget, not bytes.

   Two signals, whichever lands first:
     · fifteen seconds on the page
     · half the page scrolled

   Neither is arbitrary. Both are the cheapest available proxies for
   "this person is reading rather than bouncing", and asking someone who
   has read nothing whether they want a consultation is how a modal
   becomes a back-button press.

   Not armed at all where a popup would be indefensible: the legal and
   accessibility pages, where someone may be mid-way through exercising
   a right, and any page reached with ?noconsult (so Natan can screenshot
   his own site in peace).
   ────────────────────────────────────────────────────── */
const CONSULT_KEY = "na_consult";
const CONSULT_WEEK = 7 * 24 * 60 * 60 * 1000;

/** Mark the popup as unwanted for a week. Exported behaviour lives in
 *  consult.js; this is the same write, done without loading it. */
function quietConsult() {
  try {
    if (localStorage.getItem(CONSULT_KEY) !== "done") {
      localStorage.setItem(CONSULT_KEY, String(Date.now()));
    }
  } catch { /* private mode: nothing to remember with */ }
}

const NO_CONSULT = ["privacy.html", "terms.html", "accessibility.html"];

function armConsult() {
  const page = location.pathname.split("/").pop() || "index.html";
  if (NO_CONSULT.includes(page)) return;
  if (new URLSearchParams(location.search).has("noconsult")) return;

  // Cheap local check before anything else — a returning visitor who
  // already left details must never pay to find that out.
  let seen;
  try { seen = localStorage.getItem(CONSULT_KEY); } catch { seen = null; }
  if (seen === "done") return;
  if (seen && Date.now() - Number(seen) < CONSULT_WEEK) return;

  let fired = false;
  const fire = () => {
    if (fired) return;
    fired = true;
    clearTimeout(timer);
    removeEventListener("scroll", onScroll);
    import("./consult.js?v=6").then(m => m.open()).catch(() => {});
  };

  const timer = setTimeout(fire, 15000);

  const onScroll = () => {
    const h = document.documentElement;
    const scrollable = h.scrollHeight - innerHeight;
    // A page shorter than the viewport can never reach 50%; it has the
    // timer, and that is the correct answer for it.
    if (scrollable > 0 && (h.scrollTop || document.body.scrollTop) / scrollable >= 0.5) fire();
  };
  addEventListener("scroll", onScroll, { passive: true });
}

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
        <!-- ?v= is not decoration. netlify.toml serves everything under
             assets-opt/ with max-age=31536000, immutable — a browser that
             has this file will not ask for it again for a year. Swapping
             the logo without changing the URL leaves every returning
             visitor on the old one. Bump this whenever the file changes. -->
        <img src="assets-opt/logo-nav.webp?v=2" alt="" width="34" height="34" />
        <span dir="ltr">Natan-עיצוב אתרים</span>
      </a>
      <ul class="nav-links" id="nav-links">
        ${LINKS.map(l => `<li><a href="${l.href}"${l.href === active ? ' aria-current="page"' : ""} data-i18n="${l.key}">${l.he}</a></li>`).join("")}
      </ul>
      <div class="nav-tools">
        <button class="icon-btn" id="theme-toggle" aria-label="החלפת ערכת צבע" data-i18n-attr="aria-label:nav.theme">${ICON.sun}${ICON.moon}</button>
        <button class="icon-btn lang" id="lang-toggle" aria-label="Switch to English">EN</button>
      </div>
      <a href="#" class="btn btn-wa nav-cta" data-wa aria-label="צור קשר בוואטסאפ" data-i18n-attr="aria-label:cta.wa">
        <span class="nav-wa" aria-hidden="true">${ICON.wa}</span>
        <span class="nav-cta-txt" data-i18n="cta.wa">צור קשר</span>
      </a>
      <button class="nav-burger" id="burger" aria-label="פתיחת תפריט" aria-expanded="false" aria-controls="nav-links">${ICON.burger}</button>`;
  }

  const foot = document.getElementById("footer");
  if (foot) {
    foot.className = "footer wrap";
    foot.innerHTML = `
      <span data-i18n="foot.rights">© 2026 <span dir="ltr">Natan-עיצוב אתרים</span></span>
      <div class="footer-links">
        <a href="index.html" data-i18n="foot.home">דף הבית</a>
        <a href="portfolio.html" data-i18n="foot.portfolio">תיק עבודות</a>
        <a href="articles.html" data-i18n="nav.art">מדריכים</a>
        <a href="pricing.html" data-i18n="foot.pricing">מחירים</a>
        <span class="footer-sep" aria-hidden="true"></span>
        <a href="accessibility.html" data-i18n="foot.a11y">הצהרת נגישות</a>
        <a href="privacy.html" data-i18n="foot.privacy">מדיניות פרטיות</a>
        <a href="terms.html" data-i18n="foot.terms">תנאי שימוש</a>
      </div>`;
  }

  // The contact block on the homepage reads the same constant, so the
  // number can never be right in one place and stale in another.
  const wa = document.getElementById("wa-link");
  if (wa) wa.href = waHref();
  const tel = document.getElementById("tel-link");
  if (tel) tel.href = `tel:+${PHONE}`;
  const telText = document.getElementById("tel-text");
  if (telText) telText.textContent = PHONE_LOCAL;

  /* The five-icon bar that used to live along the bottom of every phone
     screen is gone. It was a second navigation competing with the top
     one, it sat on top of the content permanently, and it put four
     browsing links at thumb height next to the one thing that actually
     matters. The menu is the burger now — same menu, same place, on
     every screen size — and the bottom of a phone screen belongs to the
     single call to action instead. */

  /* The floating pill was a second WhatsApp button. It is now the way in
     to the answers instead — a visitor who is not ready to message has
     something to do other than leave, and the questions Natan gets asked
     twenty times a week get answered without him typing.

     It opens a panel; the panel's own footer is the WhatsApp button. So
     the page still asks for exactly one thing, it just stops asking for
     it twice at once.

     The panel itself lives in qa.js and is fetched on first press —
     nobody pays for it on a page load they never interact with. */
  if (!document.getElementById("qa-launch")) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "float-cta";
    btn.id = "qa-launch";
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-haspopup", "dialog");
    btn.innerHTML = `
      <span class="float-cta-av">${ICON.ask}</span>
      <span class="float-cta-txt">
        <b data-i18n="qa.launch">יש לך שאלה?</b>
        <small data-i18n="qa.launchs">תשובה מיידית, בלי לחכות לי</small>
      </span>`;
    document.body.appendChild(btn);

    let opening = false;
    btn.addEventListener("click", async () => {
      if (opening) return;
      opening = true;
      btn.classList.add("is-loading");
      try {
        const { toggleQA } = await import("./qa.js?v=6");
        await toggleQA();
      } finally {
        btn.classList.remove("is-loading");
        opening = false;
      }
    });
  }

  // Every button on the page, including the one just appended.
  wireWhatsApp();

  armConsult();

  // Anonymous visitor analytics — loaded at idle so it never competes
  // with first paint on a paid-ad mobile visit. Public pages only:
  // admin.html doesn't mount the shell, so it is never tracked.
  const startTracking = () => import("./analytics.js").catch(() => {});
  if ("requestIdleCallback" in window) requestIdleCallback(startTracking, { timeout: 3000 });
  else setTimeout(startTracking, 1200);
}
