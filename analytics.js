/* ── Anonymous first-party analytics ──────────────────────
   Loaded lazily from _shell.js on public pages only (admin never
   imports the shell, so it is never tracked). No PII: the visitor id
   is a random client-side token — no name, no email, no IP kept.

   Three event types land in public.analytics_events:
     · pageview  — one per page load, with source + device
     · click     — meaningful buttons only (WhatsApp, CTAs, phone…)
     · session   — dwell time on the page, sent when the tab is hidden

   Accuracy of the "visitors" number depends on NOT counting things
   that aren't a real person: bots and link-preview crawlers are
   skipped, a privacy-blocked browser is kept to one id per session
   (not one per page), and Natan can flag his own browser (na_optout)
   so his constant testing never inflates the count.

   Everything is wrapped so a tracking failure can never break the page.
   ────────────────────────────────────────────────────── */
import { SUPABASE_URL, SUPABASE_KEY } from "./supabase-config.js";

const ENDPOINT = `${SUPABASE_URL}/rest/v1/analytics_events`;
const HEADERS = {
  "Content-Type": "application/json",
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Prefer": "return=minimal",
};

const rid = () =>
  (crypto?.randomUUID ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2));

// ── Who we DON'T count ───────────────────────────────────
// Bots, uptime checkers and the link-preview crawlers that fetch a URL
// when it's shared (Facebook, WhatsApp, Telegram…) each look like a
// "visitor" and inflate the number. Headless browsers cover automated
// testing. And na_optout lets Natan silence his own browser.
const skip = () => {
  const ua = navigator.userAgent || "";
  if (/bot|crawl|spider|slurp|facebookexternalhit|meta-externalagent|telegrambot|whatsapp|pinterest|embedly|preview|headless|lighthouse|gtmetrix|pingdom|uptimerobot|ahrefsbot|semrush/i.test(ua)) return true;
  try { if (localStorage.getItem("na_optout") === "1") return true; } catch { /* storage blocked */ }
  return false;
};

if (!skip()) {
  // ── Stable anonymous visitor id ──
  // localStorage first: it persists across visits, so a returning
  // person stays ONE visitor. If storage is blocked (privacy mode),
  // fall back to sessionStorage so a whole browsing session is one
  // visitor rather than a fresh one on every page — the single biggest
  // source of over-counting. Only if both fail is it a per-page id.
  const stableId = (stores, key) => {
    for (const store of stores) {
      try {
        let v = store.getItem(key);
        if (!v) { v = rid(); store.setItem(key, v); }
        return v;
      } catch { /* try the next store */ }
    }
    return rid();
  };
  const visitor_id = stableId([localStorage, sessionStorage], "na_vid");
  const session_id = stableId([sessionStorage], "na_sid");

  // ── Which channel sent them ──────────────────────────────
  const normalize = (s) => {
    s = s.toLowerCase();
    if (/face|fb|meta/.test(s)) return "facebook";
    if (/insta|ig\b/.test(s))   return "instagram";
    if (/goog/.test(s))         return "google";
    if (/you|yt\b/.test(s))     return "youtube";
    if (/whats|wa\b/.test(s))   return "whatsapp";
    return s || "other";
  };
  const detectSource = () => {
    try {
      const p = new URLSearchParams(location.search);
      const utm = p.get("utm_source");
      if (utm) return normalize(utm);
      if (p.has("fbclid")) return "facebook";
      if (p.has("gclid"))  return "google";
      const r = document.referrer;
      if (!r) return "direct";
      const h = new URL(r).hostname.replace(/^www\./, "");
      if (h === location.hostname) return "direct";       // internal nav
      if (/facebook|fbcdn|fb\.com/.test(h)) return "facebook";
      if (/instagram/.test(h))              return "instagram";
      if (/google/.test(h))                 return "google";
      if (/youtube|youtu\.be/.test(h))      return "youtube";
      if (/whatsapp|wa\.me/.test(h))        return "whatsapp";
      return "other";
    } catch { return "other"; }
  };
  const source = detectSource();

  // ── Device class ─────────────────────────────────────────
  const device = matchMedia("(pointer:coarse)").matches
    ? (Math.min(innerWidth, innerHeight) >= 600 ? "tablet" : "mobile")
    : "desktop";

  const path = location.pathname.replace(/index\.html$/, "") || "/";

  // ── Send: keepalive fetch survives page unload, and unlike sendBeacon
  //    can carry the apikey header the endpoint requires. ──
  const send = (body) => {
    try {
      fetch(ENDPOINT, {
        method: "POST", headers: HEADERS, keepalive: true,
        body: JSON.stringify({ visitor_id, session_id, source, device, path, ...body }),
      }).catch(() => {});
    } catch { /* never break the page */ }
  };

  // ── 1 · pageview ──
  send({ type: "pageview" });

  // ── 2 · clicks on the buttons that matter ──
  // First match wins, so order most-specific first.
  const CLICKS = [
    ["#wa-link, .wa-btn, a[href*='wa.me']",      "whatsapp"],
    ["#lf-submit",                                "form-submit"],
    ["a[href^='mailto:'], .mail-link",            "email"],
    ["a[href^='tel:']",                           "phone"],
    ["#float-cta, .float-cta",                    "float-cta"],
    [".nav-cta",                                  "nav-cta"],
    [".price a, .btn-on-paper",                   "pricing-cta"],
    ["a[href='#contact']",                        "cta-contact"],
    ["a[href='contact.html']",                    "cta-contact-page"],
    ["a[href='portfolio.html']",                  "cta-portfolio"],
  ];
  addEventListener("click", (e) => {
    try {
      for (const [sel, label] of CLICKS) {
        if (e.target.closest(sel)) { send({ type: "click", label }); return; }
      }
    } catch { /* ignore */ }
  }, { capture: true, passive: true });

  // ── 3 · dwell time, sent once when the tab first goes away ──
  const start = performance.now();
  let sent = false;
  const endSession = () => {
    if (sent) return;
    sent = true;
    // Cap so a tab left open for hours can't skew the average.
    const dur = Math.min(1800, Math.round((performance.now() - start) / 1000));
    send({ type: "session", duration_sec: dur });
  };
  // visibilitychange fires on document — bind there, not on window.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") endSession();
  });
  addEventListener("pagehide", endSession);
}
