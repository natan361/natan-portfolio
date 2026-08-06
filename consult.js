/* ── Consultation popup ───────────────────────────────────
   Two fields and a question: "צריכים ייעוץ?" It exists because the
   site asks for exactly one thing — a WhatsApp message — and messaging
   a stranger is a bigger step than it looks. Someone who wants the
   service but isn't ready to open a chat had nothing to leave behind.
   This is that second door, and it is deliberately the smaller one:
   the WhatsApp link sits inside the panel too, for whoever would
   rather just talk now.

   Only a name and a phone number. Unbounce's benchmark across 41k
   landing pages has conversion falling off consistently past three
   fields, and everything else Natan can ask in the first message.

   WHEN it appears is the whole design. Not on arrival — someone who
   has read nothing has no reason to want a consultation, and a modal
   over an unread page is a bounce. It waits for a signal of interest:
   fifteen seconds, or half the page scrolled, whichever lands first.

   It is also quiet afterwards. Dismissed once, it stays away a week;
   submitted, it never returns; and it never interrupts someone who
   already chose WhatsApp — the loudest possible signal that they
   don't need this.

   Loaded only when the trigger fires (see _shell.js), so a visitor
   who leaves in ten seconds pays nothing for it. That matters here:
   the traffic is paid mobile, and every kilobyte is ad budget.
   ────────────────────────────────────────────────────── */
import { sb, SUPABASE_URL, SUPABASE_KEY } from "./supabase-config.js";
import { wireWhatsApp } from "./_shell.js?v=6";
import { applyLang, currentLang, t } from "./i18n.js";

/* The success screen greets the visitor by the name they just typed, so
   that name goes through innerHTML. Escaped, always — the only person
   who can exploit it is the visitor themselves, which is still one
   person too many. */
const esc = s => String(s ?? "").replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ── Memory ───────────────────────────────────────────────
   One key, three states. "done" is permanent — a lead who left
   details must never be asked again, on any page, ever. A dismissal
   is a timestamp, and it expires. */
const KEY = "na_consult";
const WEEK = 7 * 24 * 60 * 60 * 1000;

const read = () => {
  try { return localStorage.getItem(KEY); } catch { return null; }
};
const write = v => {
  try { localStorage.setItem(KEY, v); } catch { /* private mode: just don't remember */ }
};

/** Whether the popup is allowed to appear at all, right now. */
export function mayShow() {
  const v = read();
  if (v === "done") return false;                       // they left details
  if (v && Date.now() - Number(v) < WEEK) return false; // dismissed recently
  return true;
}

/** Called when a visitor opens WhatsApp. They picked the other door;
 *  stop knocking on this one. */
export function suppress() {
  if (read() !== "done") write(String(Date.now()));
}

/* ── Panel ────────────────────────────────────────────────── */
let panel = null;
let lastFocus = null;

const PRIVACY = "privacy.html";

function build() {
  const el = document.createElement("div");
  el.className = "cs-panel";
  el.id = "cs-panel";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.setAttribute("aria-labelledby", "cs-title");
  el.setAttribute("aria-describedby", "cs-sub");
  el.hidden = true;
  el.innerHTML = `
    <button type="button" class="cs-x" aria-label="סגירת החלון"
            data-i18n-attr="aria-label:cs.close">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>

    <div class="cs-body">
      <h2 id="cs-title" data-i18n="cs.title">צריכים ייעוץ?</h2>
      <p id="cs-sub" class="cs-sub" data-i18n="cs.sub">השאירו פרטים ונחזור אליכם</p>

      <form class="cs-form" novalidate>
        <label class="cs-field">
          <span class="cs-label" data-i18n="cs.name">שם</span>
          <input type="text" id="cs-name" name="name" autocomplete="name"
                 enterkeyhint="next" required />
        </label>
        <label class="cs-field">
          <span class="cs-label" data-i18n="cs.phone">טלפון</span>
          <input type="tel" id="cs-phone" name="phone" autocomplete="tel"
                 inputmode="tel" enterkeyhint="send" dir="ltr" required />
        </label>

        <div class="cs-msg" aria-live="polite"></div>

        <button type="submit" class="btn cs-submit" data-i18n="cs.send">שליחה</button>

        <!-- data-i18n-html, not data-i18n: the sentence carries the link to
             the privacy policy, and a textContent swap would drop it. -->
        <p class="cs-legal" data-i18n-html="cs.legalfull">
          הפרטים משמשים רק כדי לחזור אליכם, ולא מועברים לאף אחד.
          <a href="${PRIVACY}">מדיניות הפרטיות</a>
        </p>
      </form>

      <div class="cs-or"><span data-i18n="cs.or">או</span></div>
      <a href="#" class="cs-wa" data-i18n="cs.wa"
         data-wa="היי נתן, הגעתי מהאתר ואשמח לייעוץ לגבי אתר לעסק שלי.">
        מעדיפים לדבר עכשיו? כתבו לי בוואטסאפ
      </a>
    </div>`;

  document.body.append(el);
  // Built after i18n already ran for this page, so it needs the nudge the
  // other late-rendering views get.
  applyLang(currentLang());
  el.querySelector(".cs-x").addEventListener("click", () => close("dismiss"));
  el.querySelector(".cs-form").addEventListener("submit", submit);
  // Choosing WhatsApp from inside the panel is still a choice to be
  // contacted — close it, and don't come back.
  el.querySelector(".cs-wa").addEventListener("click", () => close("dismiss"));
  wireWhatsApp(el);
  return el;
}

const backdrop = () => {
  let b = document.getElementById("cs-backdrop");
  if (!b) {
    b = document.createElement("div");
    b.id = "cs-backdrop";
    b.className = "cs-backdrop";
    b.hidden = true;
    b.addEventListener("click", () => close("dismiss"));
    document.body.append(b);
  }
  return b;
};

/* ── Messages ─────────────────────────────────────────────── */
function say(text, kind) {
  const box = panel.querySelector(".cs-msg");
  box.innerHTML = "";
  if (!text) return;
  const d = document.createElement("div");
  d.className = "cs-note is-" + kind;
  d.setAttribute("role", kind === "err" ? "alert" : "status");
  d.textContent = text;
  box.append(d);
}

// Nine digits is enough to reject a stray keystroke without picking a
// fight over local vs. international formatting.
const phoneOk = v => v.replace(/\D/g, "").length >= 9;

/* ── Submit ───────────────────────────────────────────────── */
async function submit(e) {
  e.preventDefault();
  const nameEl = panel.querySelector("#cs-name");
  const phoneEl = panel.querySelector("#cs-phone");
  const btn = panel.querySelector(".cs-submit");

  const name = nameEl.value.trim();
  const phone = phoneEl.value.trim();

  if (!name) {
    say(t("cs.noname") || "צריך שם כדי שאדע איך לפנות אליכם.", "err");
    nameEl.focus();
    return;
  }
  if (!phoneOk(phone)) {
    say(t("cs.nophone") || "מספר הטלפון לא נראה תקין. בלעדיו לא אוכל לחזור אליכם.", "err");
    phoneEl.focus();
    return;
  }

  say("", "ok");
  const label = btn.textContent;   // whatever the current language put there
  btn.disabled = true;
  btn.textContent = t("cs.sending") || "שולח…";

  const lead = {
    name,
    phone,
    subject: "בקשת ייעוץ",
    contact_method: "phone",
    contact_time: null,
    note: null,
    // Which page the popup caught them on — the only way to tell later
    // whether it earns its place on the pricing page or just the home one.
    source: "popup " + location.pathname,
  };

  // The row is the record. If this fails, nothing happened.
  const { error } = await sb.from("leads").insert(lead);

  // The email is a notification on top of the record, never instead of
  // it — a bounced send must not lose a lead that is already saved.
  if (!error) {
    try {
      await fetch(`${SUPABASE_URL}/functions/v1/notify-lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY },
        body: JSON.stringify(lead),
      });
    } catch { /* the lead is safe in the table; /admin will show it */ }
  }

  btn.disabled = false;
  btn.textContent = label;

  if (error) {
    // Never a dead end. If the database is unreachable, the person in
    // front of us still wants to talk — hand them the channel that works.
    say(t("cs.failed") || "השליחה נכשלה. אפשר לכתוב לי בוואטסאפ ואחזור אליכם מיד.", "err");
    return;
  }

  write("done");
  // Their own first name back at them — the cheapest possible proof that
  // a person, not a form, received this.
  const first = esc(name.split(/\s+/)[0]);
  const got = t("cs.done") || "קיבלתי";
  panel.querySelector(".cs-body").innerHTML = `
    <div class="cs-done">
      <span class="cs-tick" aria-hidden="true">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </span>
      <h2>${got.replace(/[.。]$/, "")}, ${first}.</h2>
      <p>${esc(t("cs.dones") || "אחזור אליכם תוך 24 שעות.")}</p>
    </div>`;
  panel.querySelector(".cs-done").setAttribute("role", "status");
  setTimeout(() => close("done"), 2600);
}

/* ── Open / close ─────────────────────────────────────────── */
function trap(e) {
  if (!panel || panel.hidden) return;
  if (e.key === "Escape") { close("dismiss"); return; }
  if (e.key !== "Tab") return;

  // A modal that lets Tab wander onto the page behind it is a modal
  // only for people using a mouse.
  const f = [...panel.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled])')]
    .filter(n => n.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

export function close(reason = "dismiss") {
  if (!panel || panel.hidden) return;
  if (reason === "dismiss") suppress();
  panel.hidden = true;
  backdrop().hidden = true;
  document.body.classList.remove("cs-open");
  removeEventListener("keydown", trap);
  lastFocus?.focus?.();
}

export function open() {
  // The answers panel is a modal too, and two of them stacked is a trap.
  // Whoever got there first wins; this one will get its next trigger.
  const qa = document.getElementById("qa-panel");
  if (qa && !qa.hidden) return;

  if (!panel) panel = build();
  if (!panel.hidden) return;

  lastFocus = document.activeElement;
  panel.hidden = false;
  backdrop().hidden = false;
  document.body.classList.add("cs-open");
  addEventListener("keydown", trap);

  // The close button, not the name field: focusing an input pops the
  // keyboard on a phone the instant the panel lands, which reads as an
  // ambush. The field is one tab away for anyone who wants it.
  panel.querySelector(".cs-x").focus();

  dispatchEvent(new CustomEvent("natan:consult-shown"));
}
