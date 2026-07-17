/* GSAP, pinned to an exact version.

   Pinned rather than @3 so a CDN bump can never silently change how
   the site moves. The /+esm builds are bundled — the raw index.js
   entry point pulls in dozens of relative modules, which on a phone
   over cellular is dozens of round-trips before anything animates.

   118KB raw / ~45KB gzipped total. Measured against the budget in
   DESIGN.md: still ~380x lighter than the 46MB this site used to be.

   Standard no-charge license. SplitText became free in 3.13, which is
   why the headline split costs 7KB instead of a subscription. */
export { default as gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.15.0/+esm";
export { default as ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.15.0/ScrollTrigger/+esm";
export { default as SplitText } from "https://cdn.jsdelivr.net/npm/gsap@3.15.0/SplitText/+esm";
