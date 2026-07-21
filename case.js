/* ═══════════════════════════════════════════════════════
   Case study page.

   Why this page exists: a portfolio card that links straight to
   the client's site spends the visitor to prove the claim. They
   leave, the tab closes, and the ad click that brought them here
   is gone. This page proves the same thing by SHOWING the site —
   scrolling, inside a frame — and only offers the real link at
   the bottom, in a new tab.
   ═══════════════════════════════════════════════════════ */
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_KEY } from "./supabase-config.js";

/* ── Demo copy ────────────────────────────────────────────
   PLACEHOLDER. Deliberately kept in this file and NOT written
   to the database.

   The projects here are real businesses. Writing invented
   results into Supabase would publish fabricated claims about
   someone else's company the moment the site deploys, and there
   would be nothing left to distinguish them from the true ones.
   Living in code, this copy is visibly flagged in the UI and is
   replaced the instant Natan fills the real fields in admin.

   Nothing here states a measurable outcome — no percentages, no
   revenue, no traffic numbers — precisely because those are the
   claims that would be defamatory to invent.
   ─────────────────────────────────────────────────────── */
const DEMO = {
  sector:   "עסק",
  duration: "שבועיים",
  // Describes the SITE — what it is, who it serves, how it's built —
  // rather than a client "problem". That was the brief.
  overview:
    "אתר תדמית לעסק שנותן שירות ללקוחות. המטרה פשוטה: שכל מי שמגיע — מחיפוש בגוגל או ממודעה בפייסבוק — " +
    "יבין תוך שניות מה העסק עושה, אם הוא מתאים לו, ואיך יוצרים קשר.\n\n" +
    "האתר בנוי מכמה מסכים: עמוד בית שמציג את השירותים והיתרונות, מקטע שמסביר איך התהליך עובד, " +
    "אזור המלצות שבונה אמון, וטופס יצירת קשר שמגיע ישירות לוואטסאפ. כל עמוד תוכנן קודם כל לנייד — " +
    "כי שם מגיע רוב הקהל.",
  approach:
    "בחרתי מבנה ברור על פני עיצוב עמוס. כל מסך סובב סביב פעולה אחת — לקבל הצעה, ליצור קשר — " +
    "והכפתור הראשי נשאר גלוי לכל אורך הגלילה. הצבעים והשפה נלקחו מהעסק עצמו, כדי שהאתר ירגיש שייך " +
    "ולא כמו תבנית ששוכפלה.",
  steps: [
    { t: "שיחה ואפיון",
      d: "רבע שעה כדי להבין מה העסק עושה ומי הלקוח שלו, ואז שאלון קצר שממפה את כל התוכן מראש — כדי שלא נגלה באמצע שחסר חצי." },
    { t: "בנייה ומשוב",
      d: "מעלה גרסה חיה תוך ימים, ואתה רואה את האתר מתעדכן. סבב תיקונים אחד מרוכז במקום עשרים הודעות ווטסאפ." },
    { t: "עלייה לאוויר",
      d: "דומיין, אחסון, חיבור לגוגל וקוד מעקב. אחרי זה שבועיים ליווי — כל שינוי קטן שצריך, בלי חשבון." },
  ],
};

const ICONS = {
  0: '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  1: '<svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  2: '<svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
};

const root = document.getElementById("case-root");
if (root) {
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const lang = () => (document.documentElement.lang === "en" ? "en" : "he");
  // Fall back to Hebrew — a missing translation must never blank the page.
  const pick = (r, base) => (lang() === "en" ? (r[base + "_en"] || r[base + "_he"]) : r[base + "_he"]) || "";

  const slug = new URLSearchParams(location.search).get("s");

  const notFound = () => {
    root.innerHTML = `
      <div class="case-error">
        <h1 style="font-size:26px;margin-bottom:10px">הפרויקט לא נמצא</h1>
        <p style="margin-bottom:22px">יכול להיות שהקישור ישן, או שהפרויקט ירד מהאתר.</p>
        <a class="btn" href="portfolio.html">לכל העבודות</a>
      </div>`;
  };

  if (!slug) notFound();
  else {
    // One round trip: the project plus every sibling, for the related
    // grid and the pager. Order must match portfolio.html or "next" lies.
    sb.from("sites").select("*").eq("is_published", true)
      .order("sort_order").order("created_at")
      .then(({ data, error }) => {
        if (error || !data?.length) return notFound();
        const i = data.findIndex(r => r.slug === slug);
        if (i === -1) return notFound();
        paint(data, i);
      });
  }

  /* Two pages of the site, each in its own browser frame — the
     reference's "two device mockups" move. gallery_urls holds
     viewport-height captures of different pages; for a genuinely
     single-page site the second shot is a lower section of the same
     page, so the caption stays honestly vague ("עוד מהאתר"). */
  /* Every screenshot Natan attached in admin, in the order he set.
     No invented captions — he may attach two shots or five, and
     labelling the third one "עוד מהאתר" would be a guess. */
  function pagesBlock(row, name) {
    const g = Array.isArray(row.gallery_urls) ? row.gallery_urls.filter(Boolean) : [];
    const shots = g.length ? g : [row.fullshot_url || row.screenshot_url].filter(Boolean);
    if (!shots.length) return "";
    const solo = shots.length === 1 ? ` style="grid-template-columns:1fr;max-width:680px"` : "";
    return `<div class="pages"${solo}>${shots.map((src, n) => `
      <figure class="stage s${n % 2}">
        <div class="pageframe">
          <div class="bar" aria-hidden="true"><span></span><span></span><span></span></div>
          <div class="shot"><img src="${esc(src)}" alt="${esc(name)} — תמונה ${n + 1}" loading="lazy" /></div>
        </div>
      </figure>`).join("")}</div>`;
  }

  function paint(all, i) {
    const row  = all[i];
    const prev = all[(i - 1 + all.length) % all.length];
    const next = all[(i + 1) % all.length];

    const name = pick(row, "name");
    const desc = pick(row, "description");
    const shot = row.fullshot_url || row.screenshot_url || "";

    // Real content wins; demo only fills what is genuinely empty.
    const sector   = pick(row, "sector")   || DEMO.sector;
    const duration = pick(row, "duration") || DEMO.duration;
    const overview = pick(row, "challenge") || DEMO.overview;
    const approach = pick(row, "decision")  || DEMO.approach;
    const outcome  = pick(row, "outcome");

    // Steps come from the database when Natan has written them, in the
    // "כותרת | תיאור" shape the admin textarea produces. Anything without
    // a title is skipped rather than rendered as an empty card.
    const rowSteps = (lang() === "en" ? (row.steps_en?.length ? row.steps_en : row.steps_he) : row.steps_he) || [];
    const steps = rowSteps.length
      ? rowSteps.map(s => {
          const [t, ...rest] = String(s).split("|");
          return { t: t.trim(), d: rest.join("|").trim() };
        }).filter(s => s.t)
      : DEMO.steps;

    document.title = `${name} — נתן חיים`;

    const host = (() => { try { return new URL(row.url).host; } catch { return row.url; } })();

    const facts = [
      ["לקוח", esc(name)],
      ["תחום", esc(sector)],
      ["משך הבנייה", esc(duration)],
      row.tags?.length
        ? ["כולל", `<span class="tags">${row.tags.map(t => `<span>${esc(t)}</span>`).join("")}</span>`]
        : null,
    ].filter(Boolean).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");

    const stepsHtml = steps.map((s, n) => `
      <article class="cs-step">
        <span class="cs-step-num" aria-hidden="true">${String(n + 1).padStart(2, "0")}</span>
        <div class="cs-step-i" aria-hidden="true">${ICONS[n % 3]}</div>
        <h3>${esc(s.t)}</h3>
        ${s.d ? `<p>${esc(s.d)}</p>` : ""}
      </article>`).join("");

    const related = all.filter((_, n) => n !== i).slice(0, 3).map(r => `
      <a class="rel" href="case.html?s=${encodeURIComponent(r.slug)}">
        <div class="rel-shot">${(r.fullshot_url || r.screenshot_url)
          ? `<img src="${esc(r.fullshot_url || r.screenshot_url)}" alt="${esc(pick(r, "name"))}" loading="lazy" />`
          : ""}</div>
        <div class="rel-body">
          <span class="rel-tag">${esc(pick(r, "sector") || (r.tags?.[0] ?? "פרויקט"))}</span>
          <span class="rel-name">${esc(pick(r, "name"))}</span>
        </div>
      </a>`).join("");

    root.innerHTML = `
      <div class="case-top">
        <a class="crumb" href="portfolio.html">← כל העבודות</a>
        <div class="case-hero">
          ${shot ? `<img src="${esc(shot)}" alt="${esc(name)}" fetchpriority="high" />` : ""}
        </div>
      </div>

      <div class="case-intro">
        <span class="case-pill">${esc(sector)}</span>
        <h1 class="case-h1">${esc(name)}</h1>
        ${desc ? `<p class="case-lede">${esc(desc)}</p>` : ""}
      </div>

      <dl class="facts">${facts}</dl>

      <section class="case-sec">
        <h2>סקירת הפרויקט</h2>
        <p>${esc(overview)}</p>
        ${pagesBlock(row, name)}
      </section>

      <section class="case-sec">
        <h2>הגישה</h2>
        <p>${esc(approach)}</p>
        ${outcome ? `<p style="margin-top:18px">${esc(outcome)}</p>` : ""}
      </section>

      ${row.fullshot_url ? `
      <section class="panel">
        <div class="panel-in">
          <div class="panel-head">
            <h2>ככה זה נראה</h2>
            <p>האתר המלא, בלי לצאת מכאן — כמחשב וכנייד, וגוללים בכל אחד מהם בנפרד.</p>
          </div>
          <div class="devices">
            <div class="device-laptop">
              <div class="mockup">
                <img class="shell" src="assets-opt/device-laptop.webp" alt="" aria-hidden="true" />
                <div class="screen-wrap">
                  <div class="screen" tabindex="0" aria-label="גלילה בתוך האתר ${esc(name)} — תצוגת מחשב">
                    <img src="${esc(row.fullshot_url)}" alt="האתר ${esc(name)} — תצוגת מחשב" loading="lazy" decoding="async" />
                  </div>
                  <div class="scroll-hint" aria-hidden="true">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    <span>גלול לראות את כל האתר</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="device-phone">
              <div class="mockup">
                <img class="shell" src="assets-opt/device-phone.webp" alt="" aria-hidden="true" />
                <div class="screen-wrap">
                  <div class="screen" tabindex="0" aria-label="גלילה בתוך האתר ${esc(name)} — תצוגת נייד">
                    <!-- The phone-width capture when one was uploaded, so the
                         frame shows the real mobile layout. Falls back to the
                         desktop capture scaled down, which is what every
                         project shows until a mobile shot is added. -->
                    <img src="${esc(row.fullshot_mobile_url || row.fullshot_url)}" alt="האתר ${esc(name)} — תצוגת נייד" loading="lazy" decoding="async" />
                  </div>
                  <div class="scroll-hint" aria-hidden="true">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    <span>גלול</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p class="preview-note">גלול בתוך כל מסך כדי לראות את האתר כולו</p>
        </div>
      </section>` : ""}

      <section class="case-sec">
        <h2>איך זה נבנה</h2>
        <p>אותו תהליך בכל פרויקט, כדי שתמיד תדע איפה הדברים עומדים.</p>
        <div class="cs-steps">${stepsHtml}</div>
      </section>

      <div class="live">
        <div>
          <b>רוצה לראות את האתר החי?</b>
          <p>נפתח בלשונית חדשה — העמוד הזה יישאר פתוח.</p>
        </div>
        <a class="btn" href="${esc(row.url)}" target="_blank" rel="noopener noreferrer">לאתר של ${esc(name)} ↗</a>
      </div>

      ${related ? `
      <section class="case-sec">
        <h2>עבודות נוספות</h2>
        <div class="rel-grid">${related}</div>
      </section>` : ""}

      <nav class="pager" aria-label="ניווט בין פרויקטים">
        <a href="case.html?s=${encodeURIComponent(prev.slug)}">
          <span class="k">הפרויקט הקודם</span><b>${esc(pick(prev, "name"))}</b>
        </a>
        <a class="next" href="case.html?s=${encodeURIComponent(next.slug)}">
          <span class="k">הפרויקט הבא</span><b>${esc(pick(next, "name"))}</b>
        </a>
      </nav>

      <section class="case-cta">
        <h2>רוצה אתר כזה לעסק שלך?</h2>
        <p>שיחה של רבע שעה, והצעה בכתב תוך 24 שעות.</p>
        <a class="btn" href="contact.html">בוא נדבר</a>
      </section>`;

    if (row.fullshot_url) initPreview();
  }

  /* ── Scroll preview ───────────────────────────────────
     The site plays inside .screen via plain native overflow — no JS
     needed to move it. The only thing JS owns here is the hint: most
     visitors have never had to scroll INSIDE a box before, so it says
     so, then gets out of the way the first time someone actually
     scrolls. */
  function initPreview() {
    document.querySelectorAll(".screen-wrap").forEach(wrap => {
      const screen = wrap.querySelector(".screen");
      if (!screen) return;
      screen.addEventListener("scroll", () => wrap.classList.add("scrolled"), { passive: true, once: true });
    });
  }
}
