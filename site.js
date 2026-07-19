import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_KEY } from "./supabase-config.js";
import { applyLang, currentLang, t } from "./i18n.js";

const $ = s => document.querySelector(s);

/* ── Theme ───────────────────────────────────────────────
   Dark is the brand default. An explicit choice is stored and
   wins over the OS; with nothing stored the OS decides via
   prefers-color-scheme in main.css.
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
    // Light is the default now, so an unset theme means light unless
    // the OS says otherwise.
    const now = root.dataset.theme
      || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
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

/* ── Mobile action bar ───────────────────────────────────
   Two behaviours:
   · .up   — allowed to show at all, once the hero's own CTAs have
             scrolled away (no two competing asks on screen at once).
   · .hide — tucked away while scrolling DOWN, back on scrolling UP,
             mirroring the top nav so it's out of the way when reading
             and there the moment you look for it.
   ────────────────────────────────────────────────────── */
const bar = $("#mobile-bar");
if (bar) {
  const anchor = $(".hero") || $(".page-head");
  if (anchor) {
    new IntersectionObserver(
      ([e]) => bar.classList.toggle("up", !e.isIntersecting),
      { threshold: 0 }
    ).observe(anchor);
  } else {
    bar.classList.add("up");
  }

  let last = window.scrollY;
  addEventListener("scroll", () => {
    const y = window.scrollY;
    // Ignore tiny jitters; near the foot, always show (the CTA is right there).
    if (Math.abs(y - last) > 6) {
      const nearBottom = innerHeight + y > document.documentElement.scrollHeight - 120;
      bar.classList.toggle("hide", y > last && !nearBottom);
      last = y;
    }
  }, { passive: true });
}

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

/* ── Signature section ───────────────────────────────────
   The wireframe resolves into a real site. Which site comes
   from the database: this was hardcoded to פאר יוסף, and kept
   showing it — captioned "a real site I built" — after Natan
   had deleted it. Anything claiming to be real work has to be
   read from the one place that knows what's still live.
   ────────────────────────────────────────────────────── */
const buildReal = $(".build-real");
if (buildReal) {
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
  sb.from("sites").select("name_he,name_en,screenshot_url")
    .eq("is_published", true).not("screenshot_url", "is", null)
    .order("sort_order").limit(1)
    .then(({ data, error }) => {
      const r = data?.[0];
      // No live site with a screenshot means no honest payoff —
      // drop the section rather than end the animation on nothing.
      if (error || !r) { $("#build")?.remove(); return; }
      buildReal.src = r.screenshot_url;
      const cap = $(".build-cap");
      const paint = () => {
        const en = currentLang() === "en";
        buildReal.alt = (en && r.name_en) || r.name_he;
        if (cap) cap.textContent = ((en && r.name_en) || r.name_he) +
          (en ? " · a real site I built" : " · אתר אמיתי שבניתי");
      };
      paint();
      addEventListener("natan:lang", paint);
    });
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
    .order("sort_order").limit(3)
    .then(({ data, error }) => {
      // No screenshots means no stack. An empty browser chrome
      // sitting in the hero is worse than a one-column hero.
      if (error || !data?.length) { heroStack.closest(".hero-visual")?.remove(); return; }

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
      return `
      <article class="price glow fx in${r.is_featured ? " featured" : ""}">
        ${r.is_featured ? `<span class="price-badge">${esc(en ? "Most popular" : "הכי נפוץ")}</span>` : ""}
        <h3>${esc(pick(r, "name"))}</h3>
        ${r.for_he ? `<p class="price-for">${esc(pick(r, "for"))}</p>` : ""}
        <div class="price-tag">${esc(pick(r, "price"))}</div>
        <ul>${feats.map(f => `<li>${TICK} <span>${esc(f)}</span></li>`).join("")}</ul>
        <a href="#contact" class="btn btn-on-paper">${esc(pick(r, "cta") || (en ? "Get a quote" : "לקבלת הצעה"))}</a>
      </article>`;
    }).join("");
  };

  sb.from("packages").select("*").eq("is_published", true).order("sort_order")
    .then(({ data, error }) => {
      if (error || !data?.length) { $("#pricing")?.remove(); return; }
      paint(data);
      addEventListener("natan:lang", () => paint(data));
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
    hzTrack.innerHTML = rows.map(r => `
      <a class="hz-card" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">
        <div class="hz-shot">${r.screenshot_url
          ? `<img src="${esc(r.screenshot_url)}" alt="${esc(r.name_he)}" loading="lazy" />`
          : ""}</div>
        <div class="hz-body">
          <div class="hz-name">${esc((en && r.name_en) || r.name_he)}</div>
          ${r.description_he ? `<p class="hz-desc">${esc((en && r.description_en) || r.description_he)}</p>` : ""}
        </div>
      </a>`).join("");
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

/* ── Lead form ───────────────────────────────────────────
   Submitting is the whole point of the page, so failure has
   to leave the visitor a way through rather than a dead end.
   ────────────────────────────────────────────────────── */
const form = $("#lead-form");
if (form) {
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
  const btn = $("#lf-submit");
  const msg = $("#form-msg");

  const show = (text, kind) => {
    msg.innerHTML = "";
    if (!text) return;
    const d = document.createElement("div");
    d.className = "form-msg " + kind;
    d.setAttribute("role", kind === "err" ? "alert" : "status");
    d.textContent = text;
    msg.append(d);
  };

  const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const name = $("#lf-name").value.trim();
    const email = $("#lf-email").value.trim();
    const subject = $("#lf-subject").value.trim();

    if (!name) {
      show(t("form.noname") || "צריך שם כדי שאדע איך לפנות אליך.", "err");
      $("#lf-name").focus(); return;
    }
    if (!emailOk(email)) {
      show(t("form.noemail") || "האימייל לא נראה תקין. בלעדיו לא אוכל לחזור אליך.", "err");
      $("#lf-email").focus(); return;
    }
    if (!subject) {
      show(t("form.nosubject") || "בחר נושא כדי שאדע במה מדובר.", "err");
      $("#lf-subject").focus(); return;
    }

    show("", "ok");
    const label = btn.textContent;   // after any language switch
    btn.disabled = true;
    btn.textContent = t("form.sending") || "שולח…";

    const lead = {
      name, email, subject,
      note: $("#lf-note").value.trim() || null,
      source: location.pathname + location.search,
    };

    // 1. Save to the database first — this must succeed for the lead
    //    to count. Email is a notification on top, never the record.
    const { error } = await sb.from("leads").insert(lead);

    // 2. Fire the email notification. Best-effort: a failure here does
    //    NOT fail the submission, because the lead is already saved and
    //    visible in /admin.
    if (!error) {
      try {
        await fetch(`${SUPABASE_URL}/functions/v1/notify-lead`, {
          method: "POST",
          headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY },
          body: JSON.stringify(lead),
        });
      } catch (_) { /* email is optional; the lead is safe */ }
    }

    btn.disabled = false;
    btn.textContent = label;

    if (error) {
      // Never strand a lead on a technical failure — hand them WhatsApp.
      show(t("form.failed") || "השליחה נכשלה. תוכל לשלוח לי וואטסאפ ואחזור אליך מיד.", "err");
      return;
    }

    form.reset();
    show(t("form.ok") || "קיבלתי. אחזור אליך תוך 24 שעות.", "ok");
  });
}

/* ── Floating CTA: step aside once the form is on screen ── */
const floatCta = $("#float-cta");
const contactSec = $("#contact");
if (floatCta && contactSec) {
  new IntersectionObserver(
    ([e]) => floatCta.classList.toggle("at-contact", e.isIntersecting),
    { threshold: 0.2 }
  ).observe(contactSec);
}
