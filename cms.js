/* ── Live content ─────────────────────────────────────────
   Everything here was hardcoded in the HTML. It still is —
   the markup in the page is the seed, and stays correct with
   JS off and for a crawler on first fetch. This module then
   overwrites it from the database, so an edit in /admin
   reaches visitors without a deploy.

   Only Hebrew is overwritten. The English strings still come
   from i18n.js, so switching to EN falls back to them rather
   than showing Hebrew from the database.
   ────────────────────────────────────────────────────── */

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_KEY } from "./supabase-config.js";
import { currentLang } from "./i18n.js";

export const SVC_ICONS = [
  "<svg viewBox=\"0 0 24 24\"><rect x=\"2\" y=\"4\" width=\"14\" height=\"10\" rx=\"2\"/><path d=\"M5 18h8\"/><rect x=\"17\" y=\"9\" width=\"5\" height=\"11\" rx=\"1.5\"/></svg>",
  "<svg viewBox=\"0 0 24 24\"><path d=\"M21 12a9 9 0 1 1-2.6-6.4\"/><polyline points=\"21 3 21 9 15 9\"/></svg>",
  "<svg viewBox=\"0 0 24 24\"><polyline points=\"9 8 5 12 9 16\"/><polyline points=\"15 8 19 12 15 16\"/></svg>",
  "<svg viewBox=\"0 0 24 24\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"M21 21l-4.3-4.3\"/></svg>",
  "<svg viewBox=\"0 0 24 24\"><path d=\"M3 11l18-8-8 18-2-8-8-2z\"/></svg>",
  "<svg viewBox=\"0 0 24 24\"><path d=\"M12 2l9 5v6c0 5-3.8 8.4-9 9-5.2-.6-9-4-9-9V7l9-5z\"/><polyline points=\"9 12 11 14 15 10\"/></svg>",
];

const $  = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Paragraphs come out of a textarea as blank-line-separated text.
const paras = t => String(t || "").split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
// **bold** is the only markup the admin textareas accept.
const rich = t => esc(t).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>");

const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

/* Settings ─────────────────────────────────────────────── */
function paintSettings(s) {
  if (!s) return;

  // Contact points. The shell seeds these from its constants; the
  // database is what makes them changeable without an edit here.
  if (s.whatsapp) {
    for (const a of document.querySelectorAll('a[href*="wa.me/"]')) a.href = `https://wa.me/${s.whatsapp}`;
    const wa = $("#wa-link"); if (wa) wa.href = `https://wa.me/${s.whatsapp}`;
  }
  if (s.phone) {
    const digits = s.phone.replace(/\D/g, "");
    for (const a of document.querySelectorAll('a[href^="tel:"]')) a.href = `tel:${digits}`;
    const t = $("#tel-text"); if (t) t.textContent = s.phone;
  }
  if (s.email) {
    for (const a of document.querySelectorAll('a[href^="mailto:"]')) {
      a.href = `mailto:${s.email}`;
      // The address is also the visible label, in its own node beside an
      // icon — replacing the whole link would take the icon with it.
      const label = [...a.childNodes].find(n => n.nodeType === 3 && n.textContent.includes("@"));
      if (label) label.textContent = s.email;
    }
  }

  const set = (sel, val) => { const n = $(sel); if (n && val) n.textContent = val; };

  // Hero. An empty badge is a deliberate "hide it", not a missing value.
  const badge = $(".hero-status span:last-child");
  if (badge && s.hero_badge_he !== null && s.hero_badge_he !== undefined) {
    if (s.hero_badge_he.trim()) badge.textContent = s.hero_badge_he;
    else $(".hero-status")?.remove();
  }
  // In the headline **word** is the lime-highlighted word, which is an
  // <em> in this design — not the <strong> that ** means everywhere else.
  const h1 = $(".hero h1");
  if (h1 && s.hero_h1_he) {
    h1.innerHTML = esc(s.hero_h1_he).replace(/\*\*(.+?)\*\*/g, "<em>$1</em>");
  }
  set(".hero-sub", s.hero_sub_he);
  set('.hero-cta .btn:not(.btn-ghost) span', s.hero_cta_he);
  set(".hero-cta .btn-ghost", s.hero_cta2_he);
  set(".hero-note", s.hero_note_he);

  // About
  set("#about h2", s.about_title_he);
  const about = $("#about .about > div:last-child");
  if (about && s.about_he) {
    for (const p of about.querySelectorAll("p[data-i18n^='about.p']")) p.remove();
    const anchor = about.querySelector(".about-checks");
    const html = paras(s.about_he).map(p => `<p>${rich(p)}</p>`).join("");
    if (anchor) anchor.insertAdjacentHTML("beforebegin", html);
    else about.insertAdjacentHTML("beforeend", html);
  }
  const pts = $("#about .about-checks");
  if (pts && s.about_points_he?.length) {
    pts.innerHTML = s.about_points_he.map(p => `<li>${rich(p)}</li>`).join("");
  }
}

/* Lists ────────────────────────────────────────────────── */
// "10+" -> data-to 10, suffix "+", so motion.js still counts up.
function statParts(v) {
  const m = String(v).match(/^(\D*)(\d[\d,.]*)(.*)$/);
  return m ? { to: m[2].replace(/[,.]/g, ""), suffix: m[3] } : { to: null, suffix: "" };
}

// Carrying the original i18n key onto the generated node is what keeps the
// English toggle working: applyLang() finds it and swaps the text back.
// Rows beyond the ones the page shipped with have no key and stay Hebrew
// in English — the same as any copy Natan adds from now on.
const k = (tpl, i) => ` data-i18n="${tpl.replace("#", i + 1)}"`;

const PAINT = {
  ".stats-grid": rows => rows.map((r, i) => {
    const { to, suffix } = statParts(r.value_he);
    // Seeded with the final value, not 0 — motion.js resets it before
    // counting, and on a page without motion.js it must still be right.
    const n = to ? `<div class="stat-n" data-to="${esc(to)}" data-suffix="${esc(suffix)}">${esc(r.value_he)}</div>`
                 : `<div class="stat-n">${esc(r.value_he)}</div>`;
    return `<div class="stat fx">${n}<div class="stat-l"${k("stat.#", i)}>${esc(r.label_he)}</div></div>`;
  }).join(""),

  ".svc-grid": rows => rows.map((r, i) => `
    <article class="svc fx glow">
      <span class="svc-i" aria-hidden="true">${SVC_ICONS[i % SVC_ICONS.length]}</span>
      <h3${k("svc.#t", i)}>${esc(r.title_he)}</h3>
      <p${k("svc.#p", i)}>${rich(r.body_he)}</p>
    </article>`).join(""),

  ".steps": rows => rows.map((r, i) => `
    <div class="step fx">
      <div class="step-n">${String(i + 1).padStart(2, "0")}</div>
      <div>
        <h3${k("proc.#t", i)}>${esc(r.title_he)}</h3>
        <p${k("proc.#p", i)}>${rich(r.body_he)}</p>
      </div>
      ${r.duration_he ? `<div class="step-when"${k("proc.#w", i)}>${esc(r.duration_he)}</div>` : ""}
    </div>`).join(""),

  ".faq": rows => rows.map((r, i) => `
    <details>
      <summary><span${k("faq.q#", i)}>${esc(r.question_he)}</span></summary>
      ${paras(r.answer_he).map((p, j) =>
        `<p${j === 0 ? k("faq.a#", i) : ""}>${rich(p)}</p>`).join("")}
    </details>`).join(""),

  ".after-grid": rows => rows.map((r, i) => `
    <article class="after">
      <h3${k("pricepage.a#t", i)}>${esc(r.title_he)}</h3>
      ${r.amount_he ? `<div class="amt"${k("pricepage.a#p", i)}>${esc(r.amount_he)}</div>` : ""}
      <p${k("pricepage.a#d", i)}>${rich(r.body_he)}</p>
    </article>`).join(""),
};

/* faq.html — grouped, with the anchor nav above rebuilt to match.
   The homepage uses the flat .faq renderer above; this page does not. */
function paintFaqPage(rows) {
  const first = $("section.grp");
  if (!first || !rows.length) return;
  const host = first.parentNode;

  const groups = [];
  for (const r of rows) {
    const slug = r.group_slug || "general";
    let g = groups.find(x => x.slug === slug);
    if (!g) groups.push(g = { slug, label: r.group_he || "", items: [] });
    g.items.push(r);
  }

  for (const s of host.querySelectorAll("section.grp")) s.remove();
  let n = 0;   // running index across groups — the i18n keys are flat
  const html = groups.map((g, gi) => `
    <section class="grp" id="${esc(g.slug)}">
      ${g.label ? `<h2${k("faqpage.g#", gi)}>${esc(g.label)}</h2>` : ""}
      ${g.items.map(r => {
        const i = n++;
        return `
      <details class="qa">
        <summary><span${k("faqpage.q#", i)}>${esc(r.question_he)}</span></summary>
        <div class="a" data-i18n-html="faqpage.a${i + 1}">${paras(r.answer_he).map(p => `<p>${rich(p)}</p>`).join("")}</div>
      </details>`;
      }).join("")}
    </section>`).join("");

  const nav = $(".faq-nav");
  if (nav) nav.innerHTML = groups.filter(g => g.label)
    .map(g => `<a href="#${esc(g.slug)}">${esc(g.label)}</a>`).join("");

  (nav?.closest("header") || host.firstElementChild)
    .insertAdjacentHTML("afterend", html);
}

function paintList(sel, rows) {
  const box = $(sel);
  // No rows means the fetch failed or the table is empty. Either way the
  // markup already in the page is better than an empty section.
  if (!box || !rows?.length) return;
  box.innerHTML = PAINT[sel](rows);
}

/* ─────────────────────────────────────────────────────── */
let data;

async function load() {
  const home = !!$(".stats-grid");
  const [settings, stats, services, steps, faqs, extras] = await Promise.all([
    sb.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    home ? sb.from("stats").select("*").eq("is_published", true).order("sort_order") : { data: [] },
    home ? sb.from("services").select("*").eq("is_published", true).order("sort_order") : { data: [] },
    $(".steps")      ? sb.from("process_steps").select("*").eq("is_published", true).order("sort_order") : { data: [] },
    ($(".faq") || $("section.grp")) ? sb.from("faqs").select("*").eq("is_published", true).order("sort_order") : { data: [] },
    $(".after-grid") ? sb.from("extra_costs").select("*").eq("is_published", true).order("sort_order")   : { data: [] },
  ]);
  // The homepage shows a chosen few; faq.html shows all of them.
  const allFaqs = faqs.data || [];
  data = {
    settings: settings.data,
    stats: stats.data || [],
    services: services.data || [],
    steps: steps.data || [],
    // The homepage picks a few and orders them itself; faq.html shows all
    // of them in the grouped order.
    faqs: home
      ? allFaqs.filter(f => f.on_home)
               .sort((a, b) => (a.home_order ?? 99) - (b.home_order ?? 99))
      : allFaqs,
    extras: extras.data || [],
  };
}

function paint() {
  if (!data || currentLang() === "en") return;
  paintSettings(data.settings);
  paintList(".stats-grid", data.stats);
  paintList(".svc-grid",   data.services);
  paintList(".steps",      data.steps);
  paintList(".faq",        data.faqs);
  paintFaqPage(data.faqs);
  paintList(".after-grid", data.extras);
  // motion.js drives the count-up and the reveal on elements it saw at
  // load, so anything replaced here has to be handed back to it.
  dispatchEvent(new CustomEvent("natan:cms"));
}

load().then(paint).catch(() => { /* the markup in the page stands */ });
addEventListener("natan:lang", paint);
