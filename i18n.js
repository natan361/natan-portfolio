/* ── Language ────────────────────────────────────────────
   Hebrew is the source and lives in the HTML itself, so the
   page is correct before JS runs and Google indexes the real
   thing. This dictionary only carries the English overlay.

   Keys map to data-i18n="key". Use data-i18n-html when the
   string contains markup, data-i18n-attr="placeholder:key"
   for attributes.
   ────────────────────────────────────────────────────── */
import { EN_PAGES } from "./i18n-pages.js";
import { EN_ARTICLES } from "./i18n-articles.js";

const EN_CORE = {
  "meta.title": "Natan Chaim — Websites for small businesses | Jerusalem",
  "meta.desc": "Websites for small businesses in Jerusalem. Fast, mobile-first, built to bring enquiries — ready in two weeks at a price agreed up front.",

  "nav.process": "How it works",
  "nav.pricing": "Pricing",
  "nav.faq": "FAQ",
  "nav.work": "Work",
  "nav.cta": "Let's talk",
  "nav.theme": "Switch theme",
  "nav.lang": "עברית",
  "nav.menu": "Open menu",
  "nav.menuclose": "Close menu",
  "nav.main": "Main navigation",

  "skip": "Skip to main content",

  "hero.status": "Available for new projects · Jerusalem area",
  "hero.h1": "Your website should be bringing you <em>customers</em>.",
  "hero.sub": "I build websites for small businesses. Fast, mobile-first, and built to bring enquiries — ready in two weeks, at a price agreed up front.",
  "hero.cta": "Let's talk — 15 minutes",
  "hero.cta2": "See the work",
  "hero.note": "No cost, no commitment. We'll just work out whether it's a fit.",

  "trust.1": "websites built and live",
  "trust.2n": "2 weeks",
  "trust.2": "from first call to live site",
  "trust.3n": "24 hours",
  "trust.3": "response time to an enquiry",
  "trust.4": "you own the site outright",

  "prob.eyebrow": "Why it matters",
  "prob.title": "3 signs your website is working against you",
  "prob.lede": "Most business owners don't need a prettier website. They need one that does the job.",
  "prob.1t": "It looks like 2015",
  "prob.1p": "A customer lands, forms an impression in a second, and leaves. They won't put it into words — they'll just go to the competitor who looks more serious.",
  "prob.2t": "It doesn't work on a phone",
  "prob.2p": "Most of your customers arrive from a phone, many of them straight from a Facebook ad. A site you have to pinch and drag is a site people close.",
  "prob.3t": "It brings in nothing",
  "prob.3p": "A website that doesn't generate calls is a cost, not an investment. No clear button and no easy way to make contact means no enquiries.",

  "work.eyebrow": "The work",
  "work.title": "Want to see what I've built?",
  "work.p": "Websites for businesses, institutions and service providers — plus renders and video. All in one place, without weighing this page down.",
  "work.sites": "websites",
  "work.renders": "renders",
  "work.videos": "videos",
  "work.cta": "To the portfolio",

  "proc.eyebrow": "The process",
  "proc.title": "How it works",
  "proc.lede": "No surprises and no \"we'll see as we go\". You know what you're getting and what it costs before anything starts.",
  "proc.1t": "A short call",
  "proc.1p": "We work out what your business needs and who your customer is. No cost, no commitment. If it isn't a fit, I'll tell you.",
  "proc.1w": "15 minutes",
  "proc.2t": "A quote, fixed",
  "proc.2p": "You get it in writing: exactly what gets built and what it costs. The price doesn't move afterwards.",
  "proc.2w": "within 24 hours",
  "proc.3t": "Building",
  "proc.3p": "You get a link to look at within days and tell me what to change. We work on it together until it's right.",
  "proc.3w": "7–14 days",
  "proc.4t": "It goes live",
  "proc.4p": "Your site, on your domain, owned by you. I stay available afterwards too.",
  "proc.4w": "one day",

  "price.eyebrow": "Pricing",
  "price.title": "What it costs",
  "price.lede": "I publish ranges because I think you deserve to know before you pick up the phone. The final price comes out of the call, based on what your business actually needs.",
  "price.1t": "Business card",
  "price.1for": "For a business that needs a clear presence online",
  "price.1a": "One page, mobile-first",
  "price.1b": "WhatsApp and call buttons",
  "price.1c": "Connected to your domain",
  "price.1d": "Ready in a week",
  "price.2t": "Full site",
  "price.2for": "For a business that wants the site to bring enquiries",
  "price.2a": "Everything in the previous package",
  "price.2b": "As many pages as you need",
  "price.2c": "Enquiry form that reaches your inbox",
  "price.2d": "Gallery, testimonials, FAQ",
  "price.2e": "A month of support after launch",
  "price.3t": "Site + advertising",
  "price.3for": "For a business that wants traffic, not just a site",
  "price.3tag": "Tailored",
  "price.3a": "Everything in the full site",
  "price.3b": "Facebook campaign set up",
  "price.3c": "Enquiry tracking and measurement",
  "price.3d": "Monthly report in plain language",
  "price.badge": "Most popular",
  "price.cta": "Get a quote",
  "price.cta3": "Let's talk",
  "price.note": "All prices include the first year of hosting. The domain is registered in your name — your site, always.",
  "price.from": "From ",

  "faq.eyebrow": "FAQ",
  "faq.title": "What people usually ask me",
  "faq.q1": "How long does it take?",
  "faq.a1": "A one-page site, about a week. A full site, two weeks. It depends mostly on how fast you get me content and answers, not on me.",
  "faq.q2": "Will I own the site?",
  "faq.a2": "Completely. The domain is registered in your name and the site belongs to you. If you want to move to someone else tomorrow, you take everything with you. I don't hold you hostage.",
  "faq.q3": "What if I want to change something after it's live?",
  "faq.a3": "Small changes in the first month are included. After that, either I do it hourly, or I build you a simple panel so you can update it yourself. Your call.",
  "faq.q4": "Who handles hosting and the domain?",
  "faq.a4": "I set all of it up. The first year of hosting is included. After that it's a small annual cost paid directly to the provider — not through me.",
  "faq.q5": "What if I don't like the result?",
  "faq.a5": "That's why you see the site within days rather than at the end. We fix things as we go, not after. If it's heading the wrong way early on, we stop, at no cost.",
  "faq.q6": "You work with AI. Does that mean the site is generic?",
  "faq.a6": "No. AI is what lets me deliver in two weeks at a price that suits a small business, instead of two months at studio rates. The content, the structure and the decisions are mine and yours, based on your business.",
  "faq.q7": "Do you do renders and video too?",
  "faq.a7": "Yes. Architectural renders (before/after) and video — you can see examples in the portfolio. But websites for businesses are the main thing.",

  "test.eyebrow": "Clients",
  "test.title": "What clients say",

  "about.name": "Natan Chaim · Jerusalem",
  "about.title": "You talk to me. Not to an account manager.",
  "about.p1": "I've built 10 websites for businesses and institutions — synagogues, service providers, and small businesses. I work with AI tools, which is why I deliver in two weeks what a studio delivers in two months, at a price that suits a small business.",
  "about.p2": "No team, no queue, nobody in the middle. You talk to me directly, from the quote through to after the site is live.",

  "contact.eyebrow": "Get in touch",
  "contact.title": "Let's find out if it's a fit",
  "contact.p": "A 15-minute call. I ask about the business, you ask whatever you like, and if it isn't a fit I'll say so straight.",
  "contact.wa": "WhatsApp — fastest",
  "contact.email": "Email",
  "contact.subject": "Subject",
  "contact.subj0": "Choose a subject…",
  "contact.subj1": "A new website",
  "contact.subj2": "Rebuilding an existing site",
  "contact.subj3": "Automation",
  "contact.subj4": "Renders",
  "contact.subj5": "Something else",
  "contact.noteph": "Tell me briefly about the business and what you need…",
  "form.noemail": "That email doesn't look right. Without it I can't get back to you.",
  "form.nosubject": "Pick a subject so I know what it's about.",
  "float.t": "Let's talk",
  "float.s": "Natan · reply within 24h",
  "contact.name": "Name",
  "contact.phone": "Phone",
  "contact.biz": "Type of business",
  "contact.bizph": "Restaurant, barber, service provider…",
  "contact.note": "Anything I should know?",
  "contact.submit": "Send — I'll get back to you within 24 hours",
  "contact.fine": "Your details stay with me and are never passed on.",

  "form.noname": "I need a name so I know how to address you.",
  "form.nophone": "That number doesn't look right. Without it I can't get back to you.",
  "form.sending": "Sending…",
  "form.failed": "Sending failed. Send me a WhatsApp instead and I'll get back to you right away.",
  "form.ok": "Got it. I'll get back to you within 24 hours.",

  "foot.rights": "© 2026 Natan Chaim · Jerusalem",
  "foot.portfolio": "Portfolio",
  "foot.pricing": "Pricing",
  "foot.a11y": "Accessibility statement",
  "foot.home": "Home",

  "pfmeta.title": "Portfolio — Natan Chaim",
  "pfmeta.desc": "Websites I've built for businesses and institutions, architectural renders and video.",
  "pf.eyebrow": "Portfolio",
  "pf.title": "What I've built.",
  "pf.lede": "Websites for businesses and institutions. Plus architectural renders and video — for anyone looking specifically for those.",
  "pf.sites": "Websites",
  "pf.renders": "Renders",
  "pf.videos": "Videos",
  "pf.ctat": "Want a site like this for your business?",
  "pf.ctap": "A 15-minute call, no cost and no commitment.",
  "pf.cta": "Let's talk",
  "pf.empty.sites": "No websites to show yet",
  "pf.empty.renders": "No renders yet",
  "pf.empty.videos": "No videos yet",
  "pf.empty.body": "They'll appear here as soon as they're added in the admin area.",
  "pf.err": "Couldn't load the content",
  "pf.errbody": "Check your connection and refresh the page.",
  "pf.noshot": "No screenshot",
  "pf.before": "Before",
  "pf.after": "After",
};

export const EN = { ...EN_CORE, ...EN_PAGES, ...EN_ARTICLES };

const KEY = "natan-lang";
const descEl = () => document.querySelector('meta[name="description"]');

export function currentLang() {
  return localStorage.getItem(KEY) || "he";
}

export function applyLang(lang) {
  const en = lang === "en";
  const root = document.documentElement;
  root.lang = en ? "en" : "he";
  root.dir = en ? "ltr" : "rtl";
  localStorage.setItem(KEY, lang);

  for (const el of document.querySelectorAll("[data-i18n]")) {
    const k = el.dataset.i18n;
    if (en) {
      // Stash the Hebrew once so switching back is lossless.
      if (el.dataset.he === undefined) el.dataset.he = el.textContent;
      if (EN[k] !== undefined) el.textContent = EN[k];
    } else if (el.dataset.he !== undefined) {
      el.textContent = el.dataset.he;
    }
  }

  for (const el of document.querySelectorAll("[data-i18n-html]")) {
    const k = el.dataset.i18nHtml;
    if (en) {
      if (el.dataset.heHtml === undefined) el.dataset.heHtml = el.innerHTML;
      if (EN[k] !== undefined) el.innerHTML = EN[k];
    } else if (el.dataset.heHtml !== undefined) {
      el.innerHTML = el.dataset.heHtml;
    }
  }

  for (const el of document.querySelectorAll("[data-i18n-attr]")) {
    for (const pair of el.dataset.i18nAttr.split(",")) {
      const [attr, k] = pair.split(":").map(s => s.trim());
      const stash = "he" + attr.replace(/[^a-z]/gi, "");
      if (en) {
        if (el.dataset[stash] === undefined) el.dataset[stash] = el.getAttribute(attr) || "";
        if (EN[k] !== undefined) el.setAttribute(attr, EN[k]);
      } else if (el.dataset[stash] !== undefined) {
        el.setAttribute(attr, el.dataset[stash]);
      }
    }
  }

  const titleKey = document.documentElement.dataset.titleKey;
  if (titleKey) {
    if (!applyLang._he) applyLang._he = { title: document.title, desc: descEl()?.content };
    document.title = en && EN[titleKey] ? EN[titleKey] : applyLang._he.title;
    const d = descEl();
    if (d) d.content = en && EN[titleKey.replace(".title", ".desc")]
      ? EN[titleKey.replace(".title", ".desc")]
      : applyLang._he.desc;
  }

  const btn = document.getElementById("lang-toggle");
  if (btn) {
    // The button always names the language you'd switch TO.
    btn.textContent = en ? "עברית" : "EN";
    btn.setAttribute("aria-label", en ? "החלף לעברית" : "Switch to English");
  }
  // Views that build their own DOM after this ran need a nudge.
  dispatchEvent(new CustomEvent("natan:lang", { detail: { lang } }));
  return en;
}

export const t = key => (currentLang() === "en" && EN[key] !== undefined ? EN[key] : null);
