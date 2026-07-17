/* ═══════════════════════════════════════════════════════
   Motion layer.

   Everything here is craft the visitor must FEEL without
   naming: this site is the only proof Natan can build.

   Non-negotiables (premium-frontend-ui + DESIGN.md §6):
     · transform + opacity only — never layout properties
     · pointer-driven effects behind (hover:hover)
     · prefers-reduced-motion kills motion but NEVER content
   ═══════════════════════════════════════════════════════ */
import { gsap, ScrollTrigger, SplitText } from "./vendor.js";

gsap.registerPlugin(ScrollTrigger, SplitText);

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

/* ── Nav: get out of the way going down, come back going up ── */
(() => {
  const nav = $("#nav");
  if (!nav) return;
  let last = 0;
  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate: self => {
      const y = self.scroll();
      nav.classList.toggle("scrolled", y > 12);
      // Never hide it over the hero, and never while a menu is open.
      if (y < 200 || $("#nav-links")?.classList.contains("open")) {
        nav.classList.remove("gone");
      } else {
        nav.classList.toggle("gone", y > last);
      }
      last = y;
    },
  });
})();

/* ═══════════════════════════════════════════════════════
   gsap.matchMedia — one place that decides what each
   visitor gets. Reduced motion gets the CONTENT, never a
   blank screen: everything lands in its final state.
   ═══════════════════════════════════════════════════════ */
const mm = gsap.matchMedia();

/* ── Reduced motion ──────────────────────────────────────
   Turns off MOTION, never content. Someone who asked for less
   movement gets the finished page, not an empty skeleton.
   ────────────────────────────────────────────────────── */
mm.add("(prefers-reduced-motion: reduce)", () => {
  $$(".fx").forEach(n => n.classList.add("in"));

  // The signature section still has to make its point: skip the
  // build and show the finished site.
  gsap.set(".build-real", { opacity: 1 });
  gsap.set(".wf-line", { scaleX: 1 });
  gsap.set(".wf-accent", { opacity: 1 });
  $(".build-body")?.style.setProperty("--wf-fill", 1);
  $$(".build-step").forEach(n => n.classList.add("on"));

  // Land on the final value INCLUDING its suffix — a bare "14"
  // where "14 days" belongs is a number with no meaning.
  $$(".stat-n").forEach(n => {
    if (n.dataset.to) n.textContent = n.dataset.to + (n.dataset.suffix || "");
  });
});

mm.add("(prefers-reduced-motion: no-preference)", () => {

  /* ── Hero ─────────────────────────────────────────────
     The hero is the first thing a paying visitor sees, so it
     animates from an explicit hidden state to an explicit
     visible one. gsap.from() reads the CURRENT value as the
     destination — if anything else has already hidden the
     element, from() animates 0 -> 0 and the hero never
     appears at all. Never use from() on hero copy.
     ─────────────────────────────────────────────────── */
  const heroBits = ".hero-status, .hero-sub, .hero-cta, .hero-note";
  gsap.set(heroBits, { opacity: 0, y: 22 });
  gsap.to(heroBits, {
    opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
    stagger: 0.09, delay: 0.42,
  });

  const h1 = $(".hero h1");
  if (h1) {
    // Fonts must be settled or SplitText measures the fallback face.
    const splitIt = () => {
      const split = new SplitText(h1, { type: "chars,words", charsClass: "ch", wordsClass: "word" });
      gsap.set(h1, { opacity: 1 });
      gsap.fromTo(split.chars,
        { yPercent: 108, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.72, ease: "power3.out",
          stagger: { each: 0.018, from: "start" }, delay: 0.1 });
    };
    // If the font never resolves, the headline must still show up.
    const fonts = document.fonts?.ready ?? Promise.resolve();
    Promise.race([fonts, new Promise(r => setTimeout(r, 1200))]).then(splitIt);
  }

  /* ── Hero stack ──────────────────────────────────────
     Cards arrive from the database after load, so this waits
     for the event rather than animating three empty frames.
     ─────────────────────────────────────────────────── */
  const dealStack = () => {
    const wins = $$(".hero-win");
    if (!wins.length) return;
    gsap.fromTo(wins,
      { yPercent: 14, opacity: 0, rotateY: -9 },
      { yPercent: 0, opacity: (i, el) =>
          el.classList.contains("hero-win-back") ? 0.38
          : el.classList.contains("hero-win-mid") ? 0.66 : 1,
        rotateY: 0, duration: 1, ease: "power3.out", stagger: 0.11, delay: 0.5 });

    // Each layer drifts at its own rate — depth you feel rather
    // than a drop shadow you look at.
    wins.forEach((win, i) => {
      gsap.to(win, {
        yPercent: -6 - i * 4, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.7 },
      });
    });
  };
  addEventListener("natan:hero-stack", dealStack, { once: true });

  /* ── Generic reveal ──────────────────────────────────
     Hide here, not in CSS, so nothing is hidden unless this
     code is running and about to bring it back.
     ─────────────────────────────────────────────────── */
  const fx = $$(".fx");
  if (fx.length) {
    gsap.set(fx, { opacity: 0, y: 24 });

    const reveal = batch => gsap.to(batch, {
      opacity: 1, y: 0, duration: 0.75, ease: "power2.out",
      stagger: 0.08, overwrite: true,
    });

    ScrollTrigger.batch(fx, {
      start: "top bottom-=40",
      once: true,
      onEnter: reveal,
    });

    // onEnter only fires on ENTERING. Land directly on #pricing or
    // #contact — which this site's own links do — and everything at
    // or above that point is already past the trigger, never enters,
    // and stays invisible forever. Reveal what is already there.
    const showWhatsAlreadyHere = () => {
      const here = fx.filter(n =>
        Number(gsap.getProperty(n, "opacity")) === 0 &&
        n.getBoundingClientRect().top < innerHeight);
      if (here.length) gsap.to(here, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 });
    };
    requestAnimationFrame(showWhatsAlreadyHere);
    // The browser's own jump to a #anchor can land after first paint.
    addEventListener("load", () => requestAnimationFrame(showWhatsAlreadyHere));

    // Last resort. If a trigger is miscalculated or a refresh is
    // missed, the page must not stay blank — being visible without
    // an animation beats an animation nobody ever sees.
    setTimeout(() => {
      const stuck = fx.filter(n => Number(gsap.getProperty(n, "opacity")) === 0 &&
                                   n.getBoundingClientRect().top < innerHeight * 1.5);
      if (stuck.length) gsap.to(stuck, { opacity: 1, y: 0, duration: 0.4 });
    }, 2500);
  }

  /* ── Counters ── */
  $$(".stat-n").forEach(el => {
    const to = parseFloat(el.dataset.to);
    if (Number.isNaN(to)) return;
    const suffix = el.dataset.suffix || "";
    const obj = { v: 0 };
    gsap.to(obj, {
      v: to, duration: 1.6, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
      onUpdate: () => { el.textContent = Math.round(obj.v) + suffix; },
    });
  });

  /* ═════════════════════════════════════════════════════
     THE SIGNATURE — a website builds itself as you scroll.
     Not decoration: this is Natan's product, animated. A
     visitor understands what he does, and that he can do
     it, before reading a word.
     ═════════════════════════════════════════════════════ */
  const build = $("#build");
  if (build) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: build,
        start: "top top",
        end: "+=2600",
        pin: ".build-pin",
        scrub: 0.8,
        anticipatePin: 1,
      },
    });

    const step = i => {
      tl.call(() => setStep(i), null, tl.duration());
    };

    // 1 · structure — the grid finds itself
    tl.from(".wf", {
      scaleY: 0, opacity: 0, transformOrigin: "top center",
      duration: 0.5, stagger: 0.08, ease: "power2.out",
    });
    step(0);

    // 2 · type — content lands in the boxes
    tl.to(".wf-line", { scaleX: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }, ">-0.1");
    step(1);

    // 3 · colour — the thing stops being a skeleton
    tl.to(".build-body", { "--wf-fill": 1, duration: 0.6, ease: "power1.inOut" }, ">-0.05")
      .to(".wf-accent", { opacity: 1, duration: 0.4 }, "<");
    step(2);

    // 4 · the real site
    tl.to(".build-real", { opacity: 1, duration: 0.7, ease: "power2.inOut" }, ">")
      .to(".wf-stack", { opacity: 0, duration: 0.5 }, "<");
    step(3);

    function setStep(i) {
      $$(".build-step").forEach((n, j) => n.classList.toggle("on", j === i));
    }
  }

  /* ── Work: vertical scroll drives a horizontal gallery ──
     The cards arrive from Supabase after load, so the track has
     zero width at this point. Build it only once site.js says
     the rail exists, then let ScrollTrigger measure it. */
  const buildRail = () => {
    const track = $(".hz-track");
    if (!track || !track.children.length) return;

    // RTL: content sits to the left of origin, so travel is positive.
    const rtl = document.documentElement.dir === "rtl";
    const distance = () =>
      Math.max(0, track.scrollWidth - track.parentElement.offsetWidth);

    gsap.to(track, {
      x: () => (rtl ? distance() : -distance()),
      ease: "none",  // MUST be none, or scroll and position drift apart
      scrollTrigger: {
        trigger: ".hz",
        pin: true,
        scrub: 0.6,
        end: () => "+=" + distance(),
        invalidateOnRefresh: true,
        id: "hz",
      },
    });
    ScrollTrigger.refresh();
  };

  mm.add("(min-width: 861px)", () => {
    if ($(".hz-track")?.children.length) buildRail();
    else addEventListener("natan:hz", buildRail, { once: true });
  });

  /* ── About photo drifts against the scroll ── */
  const photo = $(".about-photo");
  if (photo) {
    gsap.fromTo(photo, { yPercent: -6 }, {
      yPercent: 6, ease: "none",
      scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: true },
    });
  }
});

/* ═══════════════════════════════════════════════════════
   Pointer-only craft. A phone must not pay for any of it.
   ═══════════════════════════════════════════════════════ */
mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {

  /* ── Magnetic buttons ── */
  $$(".btn, .icon-btn").forEach(btn => {
    const strength = btn.classList.contains("icon-btn") ? 0.22 : 0.34;
    const xTo = gsap.quickTo(btn, "x", { duration: 0.45, ease: "power3" });
    const yTo = gsap.quickTo(btn, "y", { duration: 0.45, ease: "power3" });

    const move = e => {
      const r = btn.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const reset = () => { xTo(0); yTo(0); };

    btn.addEventListener("pointermove", move);
    btn.addEventListener("pointerleave", reset);
    // A magnet that keeps pulling a focused button away from the
    // keyboard user is a trap, not a flourish.
    btn.addEventListener("blur", reset);
  });

  /* ── Cards tilt toward the cursor ── */
  $$(".tilt").forEach(card => {
    const rx = gsap.quickTo(card, "rotateX", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(card, "rotateY", { duration: 0.5, ease: "power3" });

    card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect();
      rx(((e.clientY - r.top) / r.height - 0.5) * -7);
      ry(((e.clientX - r.left) / r.width - 0.5) * 7);
    });
    card.addEventListener("pointerleave", () => { rx(0); ry(0); });
  });

  /* ── Spotlight that follows the cursor across a card ── */
  $$(".glow").forEach(card => {
    card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });
});

/* ── Anchors vs. pinning ─────────────────────────────────
   The browser jumps to #pricing on load. THEN ScrollTrigger
   builds its pins and injects thousands of pixels of spacer
   above that point, so everything below shifts down and the
   visitor is left staring at empty space in the middle of a
   spacer — every anchor on this site lands nowhere.

   So: refresh first, then re-honour the hash against the real
   post-pin layout. Every nav link, footer link and the mobile
   bar depends on this.
   ────────────────────────────────────────────────────── */
function settleHash() {
  ScrollTrigger.refresh();
  if (!location.hash || location.hash === "#top") return;
  const target = document.querySelector(location.hash);
  if (!target) return;
  const y = target.getBoundingClientRect().top + scrollY -
            (parseFloat(getComputedStyle(document.documentElement)
              .getPropertyValue("--nav-h")) || 66) - 12;
  scrollTo({ top: y, behavior: "instant" });
}

// Fonts and images both move the layout; recalc once settled.
document.fonts?.ready.then(() => ScrollTrigger.refresh());
addEventListener("load", () => {
  settleHash();
  // The gallery is populated from the database after load, which
  // changes the pin distance again.
  addEventListener("natan:hz", () => setTimeout(settleHash, 60), { once: true });
});
