/* ── Ask-me panel ─────────────────────────────────────────
   A guided funnel, not a FAQ list: pick the subject, pick the
   question, get the answer Natan already wrote. Three screens, one
   choice each, a way back from every one of them, and a way out to a
   real conversation from all of them.

   Why a funnel and not an accordion: a wall of twenty-nine questions
   is a reading task, and someone who is deciding whether to spend
   ₪2,500 has already decided not to read. Two taps to the answer is
   a different experience from scanning for it.

   Why it exists at all: the site has one call to action — WhatsApp —
   and a visitor who isn't ready to message a stranger had nothing to
   do but leave. This gives them the thing they were going to ask for
   anyway, and stops Natan answering "כמה זה עולה" by hand twenty
   times a week.

   The bank is the SAME `faqs` table that fills faq.html and the home
   page — one source, edited in /admin, three places to read it. A
   question added there appears here with no code change.

   Loaded on first press, never on page load: on a paid mobile visit
   nobody should pay for a panel they don't open.
   ────────────────────────────────────────────────────── */
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_KEY } from "./supabase-config.js";
import { waHref, wireWhatsApp } from "./_shell.js?v=6";

const esc = s => String(s ?? "").replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Blank line = new paragraph, the same convention the rest of the site
// uses for text Natan types into /admin.
const paras = t => String(t || "").split(/\n{2,}/).map(p => p.trim()).filter(Boolean);

const CHEV = `<svg class="qa-go" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>`;

let panel = null;    // built once, on first open
let rows = null;     // the fetched bank
let lastFocus = null;
let topic = null;    // where we are in the funnel

/* ── Shell ──────────────────────────────────────────────── */
function build() {
  const el = document.createElement("div");
  el.className = "qa-panel";
  el.id = "qa-panel";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.setAttribute("aria-labelledby", "qa-title");
  el.hidden = true;
  el.innerHTML = `
    <div class="qa-head">
      <button type="button" class="qa-back" hidden>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        <span>חזרה</span>
      </button>
      <div class="qa-titles">
        <h2 id="qa-title">שאלות נפוצות</h2>
        <p class="qa-sub">על מה השאלה שלך?</p>
      </div>
      <button type="button" class="qa-x" aria-label="סגירת החלון">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="qa-body" tabindex="-1"></div>
    <div class="qa-foot">
      <span class="qa-foot-t">לא מצאת את התשובה?</span>
      <a href="#" class="btn btn-wa btn-sm" data-wa><span>צור קשר</span></a>
    </div>`;
  document.body.append(el);

  el.querySelector(".qa-x").addEventListener("click", close);
  el.querySelector(".qa-back").addEventListener("click", () => {
    if (topic) showTopics(); else close();
  });
  return el;
}

/* ── Screens ────────────────────────────────────────────── */
const head = () => panel.querySelector(".qa-sub");
const body = () => panel.querySelector(".qa-body");
const back = () => panel.querySelector(".qa-back");

/** The WhatsApp button in the footer always carries whatever the visitor
 *  was last looking at, so the message Natan gets already has context. */
function askText(question) {
  return question
    ? `היי נתן, קראתי באתר את התשובה על "${question}" ויש לי עוד שאלה על זה.`
    : "היי נתן, הגעתי מהאתר. יש לי שאלה שלא מצאתי עליה תשובה באתר.";
}
function setFootAsk(question) {
  const a = panel.querySelector(".qa-foot [data-wa]");
  a.dataset.wa = askText(question);
  wireWhatsApp(panel);
}

function slide(html) {
  const b = body();
  b.innerHTML = html;
  b.scrollTop = 0;
  // Re-triggering the animation is what makes the funnel feel like it
  // moves forward rather than swapping text in place.
  b.classList.remove("qa-in");
  void b.offsetWidth;
  b.classList.add("qa-in");
}

/** Screen 1 — the subjects. */
function showTopics() {
  topic = null;
  back().hidden = true;
  head().textContent = "על מה השאלה שלך?";
  setFootAsk(null);

  const topics = [...new Set(rows.map(r => r.group_he).filter(Boolean))];
  slide(topics.map(t => {
    const n = rows.filter(r => r.group_he === t).length;
    return `<button type="button" class="qa-row qa-cat" data-t="${esc(t)}">
      <span class="qa-row-t">${esc(t)}</span>
      <span class="qa-count">${n}</span>
      ${CHEV}
    </button>`;
  }).join(""));

  for (const b of body().querySelectorAll(".qa-cat")) {
    b.addEventListener("click", () => showQuestions(b.dataset.t));
  }
}

/** Screen 2 — the questions inside one subject. */
function showQuestions(t) {
  topic = t;
  back().hidden = false;
  head().textContent = t;
  setFootAsk(null);

  const list = rows.filter(r => r.group_he === t);
  slide(list.map((r, i) => `
    <button type="button" class="qa-row qa-q" data-i="${i}">
      <span class="qa-row-t">${esc(r.question_he)}</span>
      ${CHEV}
    </button>`).join(""));

  for (const b of body().querySelectorAll(".qa-q")) {
    b.addEventListener("click", () => showAnswer(list[+b.dataset.i]));
  }
}

/** Screen 3 — the answer. */
function showAnswer(r) {
  back().hidden = false;
  head().textContent = topic;
  setFootAsk(r.question_he);

  slide(`
    <article class="qa-answer">
      <h3>${esc(r.question_he)}</h3>
      ${paras(r.answer_he).map(p => `<p>${esc(p)}</p>`).join("")}
    </article>
    <button type="button" class="qa-more">שאלה אחרת בנושא הזה</button>`);

  body().querySelector(".qa-more").addEventListener("click", () => showQuestions(topic));
  body().focus();
}

/* ── Open / close ───────────────────────────────────────── */
const backdrop = () => {
  let b = document.getElementById("qa-backdrop");
  if (!b) {
    b = document.createElement("div");
    b.id = "qa-backdrop";
    b.className = "qa-backdrop";
    b.hidden = true;
    b.addEventListener("click", close);
    document.body.append(b);
  }
  return b;
};

function close() {
  if (!panel || panel.hidden) return;
  panel.hidden = true;
  backdrop().hidden = true;
  document.body.classList.remove("qa-open");
  document.getElementById("qa-launch")?.setAttribute("aria-expanded", "false");
  lastFocus?.focus?.();
}

function onKey(e) {
  if (e.key !== "Escape" || !panel || panel.hidden) return;
  // Escape steps back through the funnel before it gives up on it.
  if (topic) showTopics(); else close();
}

export async function toggleQA() {
  if (panel && !panel.hidden) { close(); return; }

  lastFocus = document.activeElement;
  if (!panel) {
    panel = build();
    addEventListener("keydown", onKey);
  }

  if (!rows) {
    body().innerHTML = `<p class="qa-empty">רגע…</p>`;
    const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
    const { data, error } = await sb.from("faqs")
      .select("question_he,answer_he,group_he,sort_order")
      .eq("is_published", true)
      .order("sort_order").order("created_at");

    if (error || !data?.length) {
      // Never a dead end: if the bank can't load, hand them WhatsApp.
      rows = null;
      head().textContent = "";
      body().innerHTML =
        `<p class="qa-empty">לא הצלחתי לטעון את השאלות כרגע.<br>
         אפשר פשוט לשאול אותי — <a href="${waHref()}" target="_blank" rel="noopener">בוואטסאפ</a>.</p>`;
    } else {
      rows = data;
      showTopics();
    }
  } else {
    showTopics();
  }

  panel.hidden = false;
  backdrop().hidden = false;
  document.body.classList.add("qa-open");
  document.getElementById("qa-launch")?.setAttribute("aria-expanded", "true");
  panel.querySelector(".qa-row, .qa-x")?.focus();
}
