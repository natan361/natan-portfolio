/* ── Typewriter ───────────────────────────────────────────
   Types the headline out one character at a time, with a blinking
   caret. Replaces the gradient shimmer that was here before.

   Another port: Natan supplied this as a React + TypeScript + Tailwind
   component for a shadcn project, and this site is plain HTML with ES
   modules and no build step. The behaviour is carried over — speed,
   deleteSpeed, delay, loop, a caret, an array of phrases — but three
   things the original doesn't handle had to be solved, because the
   original animates a throwaway <span> and this animates the page's
   one and only <h1>:

   1. MARKUP SURVIVES. The React version slices a plain string, so any
      <em> in the headline would be destroyed. This types over a token
      list that remembers which characters were emphasised and rebuilds
      the tag around them as it goes.

   2. THE REAL TEXT STAYS READABLE. An <h1> that is empty for two
      seconds is an <h1> a crawler or a screen reader can catch empty.
      The full text sits in a visually-hidden span the whole time; the
      animated copy is aria-hidden. What Google indexes never changes.

   3. NO LAYOUT SHIFT. Typing grows the headline from one line to three
      and shoves the whole page down as it goes. The height is measured
      from the finished text first and pinned before a character is
      typed.
   ────────────────────────────────────────────────────── */

const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/** Flatten an element to [{ c, em }] — one entry per character. */
function tokenize(root) {
  const out = [];
  const walk = (node, em) => {
    for (const n of node.childNodes) {
      if (n.nodeType === 3) for (const c of n.textContent) out.push({ c, em });
      else if (n.nodeType === 1) walk(n, em || n.tagName === "EM");
    }
  };
  walk(root, false);
  return out;
}

/** Rebuild the first n characters, reopening <em> where it belongs. */
function partial(tokens, n) {
  let html = "", open = false;
  for (let i = 0; i < n; i++) {
    const t = tokens[i];
    if (t.em && !open) { html += "<em>"; open = true; }
    else if (!t.em && open) { html += "</em>"; open = false; }
    html += esc(t.c);
  }
  return open ? html + "</em>" : html;
}

/**
 * Type `el`'s current contents out. Pass `phrases` to cycle several
 * lines instead of the markup already in the element.
 * Returns a stop() that restores the original markup.
 */
export function typewriter(el, {
  phrases = null,
  speed = 55,
  deleteSpeed = 28,
  delay = 1800,
  loop = false,
  caret = true,
  startDelay = 220,
} = {}) {
  if (!el) return () => {};

  const original = el.innerHTML;
  const sets = phrases
    ? phrases.map(p => [...String(p)].map(c => ({ c, em: false })))
    : [tokenize(el)];
  const plain = sets.map(t => t.map(x => x.c).join(""));
  if (!sets[0].length) return () => {};

  // Reduced motion gets the finished headline, not a blank one that
  // never fills in.
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  /* text-wrap: balance is set on every heading in main.css, and it is
     the single worst thing that can happen to a line being typed: it
     redistributes ALL the lines on every character, so words leap from
     one line to the next and back again the whole way through. Turn it
     off first — then the wrap only ever moves forward, which is what
     typing is supposed to look like.

     setProperty, not el.style.textWrap: in current Chrome `text-wrap`
     is a shorthand over text-wrap-mode and text-wrap-style, and
     assigning the camelCase property left the computed value sitting
     on `balance`. Both longhands are set so nothing is left to
     re-balance from. */
  const wrapWas = el.style.getPropertyValue("text-wrap");
  el.style.setProperty("text-wrap", "wrap");
  el.style.setProperty("text-wrap-style", "auto");
  el.style.setProperty("text-wrap-mode", "wrap");

  // Pin the height BEFORE emptying, or the page reflows on every
  // character as the headline grows from one line to three. Measured
  // after the wrap change, so it reserves the height the finished text
  // will actually occupy.
  const lock = () => {
    el.style.minHeight = "";
    const h = el.getBoundingClientRect().height;
    if (h) el.style.minHeight = `${Math.ceil(h)}px`;
  };
  lock();
  addEventListener("resize", lock, { passive: true });

  // 2 · The real text, always present for crawlers and screen readers.
  el.innerHTML =
    `<span class="sr-only">${esc(plain.join(". "))}</span>` +
    `<span class="tw" aria-hidden="true"></span>` +
    (caret ? `<span class="tw-caret" aria-hidden="true"></span>` : "");
  const out = el.querySelector(".tw");

  let set = 0, i = 0, deleting = false, timer, dead = false;

  const tick = () => {
    if (dead) return;
    const tokens = sets[set];

    if (!deleting) {
      if (i < tokens.length) {
        i++;
        out.innerHTML = partial(tokens, i);
        timer = setTimeout(tick, speed);
        return;
      }
      if (!loop || sets.length === 0) { el.classList.add("tw-done"); return; }
      deleting = true;
      timer = setTimeout(tick, delay);
      return;
    }

    if (i > 0) {
      i--;
      out.innerHTML = partial(tokens, i);
      timer = setTimeout(tick, deleteSpeed);
      return;
    }
    deleting = false;
    set = (set + 1) % sets.length;
    timer = setTimeout(tick, speed);
  };

  timer = setTimeout(tick, startDelay);

  return () => {
    dead = true;
    clearTimeout(timer);
    removeEventListener("resize", lock);
    el.style.minHeight = "";
    el.style.textWrap = wrapWas;
    el.classList.remove("tw-done");
    el.innerHTML = original;
  };
}
