# "מקופסה ריקה לאתר חי" — the removed signature section

Natan asked for this off the site on 2026-07-30. Everything it was made of
is in this folder, so putting it back is copy-and-paste, not rebuilding.

It was the pinned section under the hero where a wireframe assembled
itself as you scrolled and then resolved into a real client site. It was
also the single most expensive block on the page: **3.8 screens of scroll
on a phone** before the shortening, 2.1 after, none of which showed the
visitor anything new.

## What is in here

| File | Goes back into | Where |
|---|---|---|
| `index.section.html` | `index.html` | Between the testimonials section and the PROBLEM section |
| `main.css.snippet` | `main.css` | Before the `HORIZONTAL WORK GALLERY` comment |
| `motion.js.snippet` | `motion.js` | Two pieces — see the marker inside the file |
| `site.js.snippet` | `site.js` | Before the `Hero stack` block |

`motion.js.snippet` holds two separate fragments. The first six lines
belong inside the `prefers-reduced-motion: reduce` block, which lands the
animation in its finished state instead of leaving a blank frame. The rest,
after the `--- reduced-motion block ---` marker, is the ScrollTrigger
timeline itself and belongs inside `mm.add("(prefers-reduced-motion:
no-preference)")`.

## If you put it back, put this back too

The section's `refreshPriority: 0` mattered. The work gallery above it is
pinned as well and is created LAST, because its cards arrive from Supabase
after load. Without an explicit priority on both, ScrollTrigger measures
this section before the gallery's spacer exists, and it pins early and
paints straight over the testimonial. The gallery's `refreshPriority: 1`
was left in `motion.js` on purpose — it is harmless on its own and it is
half of that fix.

## The honest reason it went

It was beautiful and it was proof of capability. It was also the thing
standing between a visitor and the work, on a page whose measured median
dwell time is 11 seconds.
