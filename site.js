import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_KEY } from "./supabase-config.js";
import { applyLang, currentLang, t } from "./i18n.js";
// Cards rendered from the database need their WhatsApp links wired after
// the fact — mountChrome() has already run by the time they exist.
import { wireWhatsApp } from "./_shell.js?v=5";
// Overlays the hardcoded copy with whatever is in /admin. Imported here
// rather than per page so every page picks up the contact details.
import "./cms.js";

const $ = s => document.querySelector(s);

/* ── Theme ───────────────────────────────────────────────
   Light is the default, always — the site does not follow the OS
   setting. Dark is opt-in via the toggle, and once chosen it is
   stored and persists.
   ────────────────────────────────────────────────────── */
const THEME_KEY = "natan-theme";
const themeBtn = $("#theme-toggle");
if (themeBtn) {
  const meta = $("#theme-color");
  const paint = () => {
    const light = getComputedStyle(document.documentElement)
      .getPropertyValue("--black").trim();
    if (meta && light) meta.content = light;
  };
  paint();
  themeBtn.addEventListener("click", () => {
    const root = document.documentElement;
    // Light is the default; an unset theme is light, never the OS value.
    const now = root.dataset.theme || "light";
    const next = now === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    paint();
  });
}

/* ── Language ── */
applyLang(currentLang());
const langBtn = $("#lang-toggle");
if (langBtn) {
  langBtn.addEventListener("click", () => {
    applyLang(currentLang() === "en" ? "he" : "en");
  });
}

/* ── Nav: hairline appears only once you've left the hero ── */
const nav = $("#nav");
if (nav) {
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 12);
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });
}

/* ── Mobile menu ── */
const burger = $("#burger");
const links = $("#nav-links");
if (burger && links) {
  const setOpen = open => {
    links.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open
      ? (t("nav.menuclose") || "סגירת תפריט")
      : (t("nav.menu") || "פתיחת תפריט"));
  };
  burger.addEventListener("click", () => setOpen(!links.classList.contains("open")));
  links.addEventListener("click", e => { if (e.target.tagName === "A") setOpen(false); });
  addEventListener("keydown", e => { if (e.key === "Escape") setOpen(false); });
  // A menu left open across a resize into desktop would strand the panel.
  addEventListener("resize", () => { if (innerWidth > 700) setOpen(false); });
}

/* The five-icon mobile action bar and the scroll logic that showed and
   hid it are gone — see the note in _shell.js. The floating WhatsApp
   pill is the only fixed element left at the foot of a phone screen. */

/* ── Reveal on scroll ── */
const reveals = document.querySelectorAll(".reveal");
if (reveals.length) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    reveals.forEach(n => n.classList.add("in"));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("in");
        obs.unobserve(e.target);   // reveal is one-way; stop watching
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(n => io.observe(n));
  }
}

/* ── Portfolio counters ──────────────────────────────────
   Read live rather than hardcoded: a hidden project must not
   leave a stale "6" advertising work the visitor can't find.
   ────────────────────────────────────────────────────── */
const stats = $("#teaser-stats");
if (stats) {
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
  for (const kind of ["sites", "renders", "videos"]) {
    sb.from(kind).select("*", { count: "exact", head: true })
      .eq("is_published", true)
      .then(({ count, error }) => {
        const node = stats.querySelector(`[data-count="${kind}"]`);
        if (!node) return;
        // On failure leave the dot rather than print a wrong number.
        if (!error && count != null) node.textContent = String(count);
      });
  }
}

/* ── Hero stack ──────────────────────────────────────────
   Real sites, in the hero, from the database — so it can never
   show work that's been hidden in /admin, and it fills the half
   of the screen that used to be void.
   ────────────────────────────────────────────────────── */
const heroStack = $("#hero-stack");
if (heroStack) {
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  sb.from("sites").select("name_he,url,screenshot_url")
    .eq("is_published", true).not("screenshot_url", "is", null)
    .order("sort_order").limit(1)
    .then(({ data, error }) => {
      // No screenshots means no window. An empty browser chrome sitting on
      // the hero photo is worse than the photo on its own — and only the
      // window goes, never .hero-visual, which is now the face as well.
      if (error || !data?.length) { heroStack.remove(); return; }

      // A no-code demo host in the address bar — busbarjl-haiojnej
      // .manus.space — reads as "hobby project" to the exact person
      // this hero is for. Show a real custom domain when there is
      // one; otherwise the business name, which is the true subject
      // anyway. Never advertise the builder Natan used.
      const DEMO_HOSTS = /(manus\.space|lovable\.app|vercel\.app|netlify\.app|github\.io)$/i;
      const label = r => {
        const host = (r.url || "").replace(/^https?:\/\//, "").split("/")[0];
        return (!host || DEMO_HOSTS.test(host)) ? r.name_he : host;
      };

      const wins = [...heroStack.querySelectorAll(".hero-win")];
      // Front window last so the strongest work sits on top.
      const rows = data.slice(0, wins.length).reverse();
      wins.forEach((win, i) => {
        const r = rows[i];
        if (!r) { win.remove(); return; }
        win.innerHTML = `
          <div class="browser-bar">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            <span class="browser-url">${esc(label(r))}</span>
          </div>
          <img class="hero-shot" src="${esc(r.screenshot_url)}" alt="" />`;
      });

      const front = rows[rows.length - 1];
      if (front) {
        const cap = document.createElement("span");
        cap.className = "hero-cap";
        cap.textContent = front.name_he;
        heroStack.append(cap);
      }
      dispatchEvent(new CustomEvent("natan:hero-stack"));
    });
}

/* ── Pricing ─────────────────────────────────────────────
   Rendered from the database so Natan sets his own prices in
   /admin. Prices were the one thing on this site I invented,
   and inventing a man's prices for him was never right.
   ────────────────────────────────────────────────────── */
const priceGrid = $("#price-grid");
if (priceGrid) {
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const TICK = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`;

  const paint = rows => {
    const en = currentLang() === "en";
    const pick = (r, k) => (en && r[k + "_en"]) || r[k + "_he"];
    priceGrid.innerHTML = rows.map(r => {
      const feats = (en && r.features_en?.length ? r.features_en : r.features_he) || [];
      // Every card asks for the same thing as every other button on the
      // site. What the DB's per-package cta text used to say now rides in
      // the WhatsApp message instead, so the first thing Natan reads is
      // which package the person was looking at.
      const name = pick(r, "name");
      const ask = en
        ? `Hi Natan, I came from the site — I'm interested in the "${name}" package.`
        : `היי נתן, הגעתי מהאתר ומעניינת אותי חבילת "${name}".`;
      return `
      <article class="price glow fx in${r.is_featured ? " featured" : ""}">
        ${r.is_featured ? `<span class="price-badge">${esc(en ? "Most popular" : "הכי נפוץ")}</span>` : ""}
        <h3>${esc(name)}</h3>
        ${r.for_he ? `<p class="price-for">${esc(pick(r, "for"))}</p>` : ""}
        <div class="price-tag">${esc(pick(r, "price"))}</div>
        <ul>${feats.map(f => `<li>${TICK} <span>${esc(f)}</span></li>`).join("")}</ul>
        <a href="#" class="btn btn-wa" data-wa="${esc(ask)}">
          <span>${esc(en ? "Get in touch" : "צור קשר")}</span>
        </a>
      </article>`;
    }).join("");
    wireWhatsApp(priceGrid);
  };

  sb.from("packages").select("*").eq("is_published", true).order("sort_order")
    .then(({ data, error }) => {
      if (error || !data?.length) { $("#pricing")?.remove(); return; }
      paint(data);
      addEventListener("natan:lang", () => paint(data));
    });
}

/* ── What the rest of the market charges ─────────────────
   Deliberately a list and not a bar chart. The rows are ranges,
   and one of them is a MONTHLY fee — putting those on one shared
   scale would draw a picture that isn't true. The numbers do the
   work on their own here.

   Every row that isn't Natan's carries the price list it came
   from, as a real link. A comparison against unnamed competitors
   is a claim; a comparison a visitor can click is evidence.
   ────────────────────────────────────────────────────── */
const market = $("#market-cmp");
if (market) {
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  sb.from("market_prices").select("*").eq("is_published", true).order("sort_order")
    .then(({ data, error }) => {
      if (error || !data?.length) return;   // stays hidden

      const paint = () => {
        const en = currentLang() === "en";
        market.innerHTML = `
          <h3 class="market-t">${esc(en ? "What the same site costs elsewhere" : "כמה עולה אותו אתר במקום אחר")}</h3>
          <ul class="market-list">
            ${data.map(r => `
              <li class="market-row${r.is_mine ? " mine" : ""}">
                <span class="market-label">${esc(r.label_he)}</span>
                <span class="market-range">${esc(r.range_he)}</span>
                ${r.note_he ? (r.source_url
                  ? `<a class="market-src" href="${esc(r.source_url)}" target="_blank" rel="noopener nofollow">${esc(r.note_he)}</a>`
                  : `<span class="market-src">${esc(r.note_he)}</span>`) : ""}
              </li>`).join("")}
          </ul>`;
        market.hidden = false;
      };

      paint();
      addEventListener("natan:lang", paint);
    });
}

/* ── Pricing comparison table ────────────────────────────
   The columns are the published packages, not a fixed three.
   Natan can run a single flat price and the table becomes one
   column on its own — the whole reason this moved out of HTML.

   The price and "suits" rows read from the package itself rather
   than from the matrix, so a price is edited in exactly one place.
   ────────────────────────────────────────────────────── */
const cmp = $("#cmp");
if (cmp) {
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const paint = (packs, feats, cells) => {
    const en = currentLang() === "en";
    const pick = (r, k) => (en && r[k + "_en"]) || r[k + "_he"];
    const hot = p => (p.is_featured ? ' class="col-hot"' : "");

    // A package with no row in the matrix reads as "not included",
    // so adding a package never requires backfilling every feature.
    const cellOf = (p, f) => {
      const c = cells.find(x => x.package_id === p.id && x.feature_id === f.id);
      if (!c || c.kind === "no") return `<td class="no${p.is_featured ? " col-hot" : ""}">—</td>`;
      if (c.kind === "yes")      return `<td class="yes${p.is_featured ? " col-hot" : ""}">✓</td>`;
      return `<td${hot(p)}>${esc((en && c.text_en) || c.text_he || "")}</td>`;
    };

    cmp.innerHTML = `
      <table>
        <caption class="sr-only">${esc(en ? "Package comparison" : "השוואת חבילות")}</caption>
        <thead>
          <tr>
            <th scope="col"></th>
            ${packs.map(p => `<th scope="col"${hot(p)}>${esc(pick(p, "name"))}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">${esc(en ? "Price" : "מחיר")}</th>
            ${packs.map(p => `<td${hot(p)}><b>${esc(pick(p, "price"))}</b></td>`).join("")}
          </tr>
          ${packs.some(p => p.for_he) ? `
          <tr>
            <th scope="row">${esc(en ? "Suits" : "מתאים ל")}</th>
            ${packs.map(p => `<td${hot(p)}>${esc(pick(p, "for") || "")}</td>`).join("")}
          </tr>` : ""}
          ${feats.map(f => `
          <tr>
            <th scope="row">${esc(pick(f, "label"))}</th>
            ${packs.map(p => cellOf(p, f)).join("")}
          </tr>`).join("")}
        </tbody>
      </table>`;
  };

  Promise.all([
    sb.from("packages").select("*").eq("is_published", true).order("sort_order"),
    sb.from("pricing_features").select("*").eq("is_published", true).order("sort_order"),
    sb.from("package_features").select("*"),
  ]).then(([p, f, c]) => {
    // An empty table is worse than no table — it reads as a broken page.
    if (p.error || !p.data?.length) { cmp.remove(); return; }
    const args = [p.data, f.data || [], c.data || []];
    paint(...args);
    addEventListener("natan:lang", () => paint(...args));
  });
}

/* ── Work gallery ────────────────────────────────────────
   Rendered from the database so /admin is the only place the
   portfolio is ever edited. Dispatches natan:hz so the motion
   layer can measure a track that didn't exist at load.
   ────────────────────────────────────────────────────── */
const hzTrack = $("#hz-track");
if (hzTrack) {
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const paint = rows => {
    const en = currentLang() === "en";
    // Point at the case page, not the client's site. Sending a visitor
    // straight out spends the ad click that brought them here: they leave,
    // and nothing guarantees they come back. The case page shows the same
    // site scrolling in a frame and keeps them. Rows with no slug yet fall
    // back to the old outbound link so nothing breaks mid-migration.
    hzTrack.innerHTML = rows.map(r => {
      const internal = !!r.slug;
      const href = internal ? `case.html?s=${encodeURIComponent(r.slug)}` : r.url;
      const target = internal ? "" : ` target="_blank" rel="noopener noreferrer"`;
      return `
      <a class="hz-card" href="${esc(href)}"${target}>
        <div class="hz-shot">${r.screenshot_url
          ? `<img src="${esc(r.screenshot_url)}" alt="${esc(r.name_he)}" loading="lazy" />`
          : ""}</div>
        <div class="hz-body">
          <div class="hz-name">${esc((en && r.name_en) || r.name_he)}</div>
          ${r.description_he ? `<p class="hz-desc">${esc((en && r.description_en) || r.description_he)}</p>` : ""}
        </div>
      </a>`;
    }).join("");
    dispatchEvent(new CustomEvent("natan:hz"));
  };

  sb.from("sites").select("*").eq("is_published", true).order("sort_order")
    .then(({ data, error }) => {
      if (error || !data?.length) { $("#work")?.remove(); return; }  // empty rail is worse than none
      paint(data);
      addEventListener("natan:lang", () => paint(data));
    });
}

/* ── Testimonials ────────────────────────────────────────
   The section starts hidden and only unhides if the database
   actually returns published rows. An empty "what clients say"
   heading is worse than no section at all.
   ────────────────────────────────────────────────────── */
const testGrid = $("#test-grid");
if (testGrid) {
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  sb.from("testimonials").select("*").eq("is_published", true)
    .order("sort_order")
    .then(({ data, error }) => {
      if (error || !data?.length) return;   // stay hidden
      const en = currentLang() === "en";
      testGrid.innerHTML = data.map(r => `
        <figure class="test reveal">
          <blockquote>${esc((en && r.quote_en) || r.quote_he)}</blockquote>
          <figcaption>
            ${r.photo_url ? `<img src="${esc(r.photo_url)}" alt="" loading="lazy" />` : ""}
            <div>
              <b>${esc((en && r.author_en) || r.author_he)}</b>
              ${r.role_he ? `<span>${esc((en && r.role_en) || r.role_he)}</span>` : ""}
            </div>
          </figcaption>
        </figure>`).join("");
      $("#testimonials").hidden = false;
      testGrid.querySelectorAll(".reveal").forEach(n => n.classList.add("in"));
    });
}

/* The lead form is gone. It collected a name and a phone number into
   public.leads and fired the notify-lead edge function; the site asks
   for one thing now, over WhatsApp, so there is nothing here to submit.
   The table and the function are untouched — every lead already taken
   is still in /admin. */

/* The floating pill used to fade out at the contact section, back when
   it was a second copy of the same ask. It opens the answers now, which
   is worth having on screen wherever someone is still deciding. */
