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
  "meta.title": "Natan — Websites for small businesses",
  "meta.desc": "Web design and development for small businesses across Israel. Fast, mobile-first, built to bring enquiries — at a price agreed up front — around 60% below agency rates.",

  "nav.process": "How it works",
  "nav.pricing": "Pricing",
  "nav.faq": "FAQ",
  "nav.work": "Work",
  "cta.wa": "Get in touch",
  "nav.theme": "Switch theme",
  "nav.lang": "עברית",
  "nav.menu": "Open menu",
  "nav.menuclose": "Close menu",
  "nav.main": "Main navigation",

  "skip": "Skip to main content",

  "qa.launch": "Got a question?",
  "qa.launchs": "Answered here, no waiting on me",

  "hero.status": "Available for new projects · Working with businesses nationwide",
  "hero.h1": "Web design and development <em>that brings customers</em>.",
  "hero.sub": "I'm not another supplier who hands over a file and disappears. I get into the business, work out who your customer is, and build a site that works for them — at a price agreed up front.",
  "hero.cta2": "Or see what I've built first",
  "hero.note": "No cost, no commitment. We'll just work out whether it's a fit.",

  "trust.1": "websites built and live",
  "trust.2n": "60%",
  "trust.2": "below what an agency charges",
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
  "price.note": "All prices include the first year of hosting. The domain is registered in your name — your site, always.",
  "price.from": "From ",

  "faq.eyebrow": "FAQ",
  "faq.title": "What people usually ask me",
  "faq.q1": "How long does it take?",
  "faq.a1": "There is no fixed number — it varies from project to project. What moves the date most is how fast you get me content and answers, not me.",
  "faq.q2": "Will I own the site?",
  "faq.a2": "Completely. The domain is registered in your name and the site belongs to you. If you want to move to someone else tomorrow, you take everything with you. I don't hold you hostage.",
  "faq.q3": "What if I want to change something after it's live?",
  "faq.a3": "Small changes in the first month are included. After that, either I do it hourly, or I build you a simple panel so you can update it yourself. Your call.",
  "faq.q4": "Who handles hosting and the domain?",
  "faq.a4": "I set all of it up. The first year of hosting is included. After that it's a small annual cost paid directly to the provider — not through me.",
  "faq.q5": "What if I don't like the result?",
  "faq.a5": "That's why you see the site within days rather than at the end. We fix things as we go, not after. If it's heading the wrong way early on, we stop, at no cost.",
  "faq.q6": "You work with AI. Does that mean the site is generic?",
  "faq.a6": "No. AI is what lets me build a full brochure site for \u20aa2,499 when an agency charges \u20aa6,000\u20139,000 for the same thing. The content, the structure and the decisions are mine and yours, based on your business.",
  "faq.q7": "Do you do renders and video too?",
  "faq.a7": "Yes. Architectural renders (before/after) and video — you can see examples in the portfolio. But websites for businesses are the main thing.",

  "test.eyebrow": "Clients",
  "test.title": "What clients say",

  "about.name": "Natan",
  "about.title": "Natan. One person, not a studio.",
  "about.p1": "I build websites for small businesses across Israel. I've built 10 sites — synagogues, service providers, and small businesses. I work with AI tools, which is why I can deliver at a price a studio cannot come close to.",
  "about.p2": "When you write to me, you're talking to me — not an account manager, not a team, not someone relaying messages. I'm the one who answers, the one who builds, and the one you can call even after the site is live.",
  "about.c1": "You talk to me directly, not an account manager",
  "about.c2": "A price fixed upfront, no surprises",
  "about.c3": "The site is fully yours, on your own domain",

  "contact.eyebrow": "Get in touch",
  "contact.title": "Let's find out if it's a fit",
  "contact.p": "Message me on WhatsApp and we'll set up a 15-minute call. I ask about the business, you ask whatever you like, and if it isn't a fit I'll say so straight.",
  "ctmeta.title": "Let's talk — 15 minutes, at no cost | Natan",
  "ctmeta.desc": "A short call, no commitment. We work out what your business needs, and if it's a fit we begin. Fill the form or send a WhatsApp.",
  "ct.eyebrow": "Get in touch",
  "ct.biolabel": "About me",
  "ct.bioh": "Natan. One person, not a studio.",
  "ct.biop1": "I build websites for small businesses across Israel. I've built over 10 sites — synagogues, service providers, small businesses. I work with AI tools, which is why I can deliver at a price a studio cannot come close to.",
  "ct.biop2": "When you message me, you talk to me. Not an account manager, not a team, not someone relaying messages. I'm the one who answers, the one who builds, and the one you can call even after the site is live.",
  "ct.qalabel": "About the call",
  "ct.qah": "What people ask before they reach out",
  "ct.q1": "How do I get in touch?",
  "ct.a1": "On WhatsApp. Press the button, a chat with me opens on your phone with the message already written, and you just send it. I reply within a few hours. There is no form to fill in — the message comes straight to me, not to a system.",
  "ct.q2": "What happens on the call?",
  "ct.a2": "I ask about the business — what you do, who your customer is, and what you want the site to do. You ask me anything you like. By the end you have a clear picture of whether and how I can help.",
  "ct.q3": "How long does it take?",
  "ct.a3": "About fifteen minutes, sometimes less. Enough to work out whether it's a fit — and no waste of anyone's time if it isn't.",
  "ct.q4": "Does it cost anything?",
  "ct.a4": "No, the call is completely free and no commitment. Even if we don't end up working together, you leave with a clear answer.",
  "ct.q5": "What happens after the call?",
  "ct.a5": "If it's a fit, you get a fixed written quote within 24 hours — exactly what will be built and what it costs. No surprises and no pressure to decide on the spot.",
  "ct.q6": "Do I need to prepare anything?",
  "ct.a6": "Not necessarily. If you have an existing site, or someone else's site you liked, send a link — it helps. But you can start with nothing at all.",

  "ct.h1": "Let's talk — 15 minutes.",
  "ct.lede": "No cost and no commitment. I ask about the business, you ask whatever you like, and if it isn't a fit I'll say so straight.",
  "ct.1t": "We work out what you need",
  "ct.1p": "What the business does, who your customer is, and what you want to happen when someone lands on the site.",
  "ct.2t": "I tell you the truth",
  "ct.2p": "If a site won't help you right now, or something else would suit you better, I'll say so — even if it means we don't work together.",
  "ct.3t": "No pressure",
  "ct.3p": "No sales pitch and no \"let's close now\". You leave the call with a clear answer, and decide in your own time.",
  "ct.sidet": "Fastest — WhatsApp",
  "ct.sidep": "Send me your name and what the business needs, and I reply within a few hours. No forms and no waiting — the message comes straight to me.",
  "ct.why1": "You talk to me directly, not to an account manager",
  "ct.why2": "A price agreed up front, no surprises",
  "ct.why3": "The site is yours outright, on your own domain",


  "foot.rights": "© 2026 Natan — Web Design",
  "foot.portfolio": "Portfolio",
  "foot.pricing": "Pricing",
  "foot.a11y": "Accessibility statement",
  "foot.privacy": "Privacy policy",
  "foot.terms": "Terms of use",
  "foot.home": "Home",

  "pfmeta.title": "Portfolio — Natan",
  "pfmeta.desc": "Selected web design work for businesses and institutions, plus architectural renders and video.",
  "pf.eyebrow": "Portfolio",
  "pf.title": "Selected work.",
  "pf.lede": "A selection of what I've built — websites for businesses and institutions, plus architectural renders and video for anyone looking specifically for those.",
  "pf.sites": "Websites",
  "pf.renders": "Renders",
  "pf.videos": "Videos",
  "pf.ctat": "Want a site like this for your business?",
  "pf.ctap": "A 15-minute call, no cost and no commitment.",
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
