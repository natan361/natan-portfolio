/* Before/after drag slider.
   Lifted from the original script.js CompareSlider with two changes:
   it is now a module, and the handle is keyboard-operable — the old
   one was mouse/touch only, which left the comparison unreachable
   for anyone not using a pointer.

   Geometry stays physical (clientX, clip-path inset), so it behaves
   identically on an RTL page. */
export class CompareSlider {
  constructor(el) {
    this.el = el;
    this.beforeImg = el.querySelector(".compare-before-img");
    this.handleEl = el.querySelector(".compare-handle");
    this.badgeBefore = el.querySelector(".compare-badge-before");
    this.badgeAfter = el.querySelector(".compare-badge-after");
    if (!this.beforeImg || !this.handleEl) return;

    this.dragging = false;
    this.pos = 50;

    this._onMove = this._onMove.bind(this);
    this._onUp = this._onUp.bind(this);

    this.handleEl.addEventListener("pointerdown", e => this._down(e));
    this.el.addEventListener("click", e => {
      if (this.handleEl.contains(e.target)) return;
      this._set(this._posFrom(e.clientX));
    });

    // Keyboard: arrows nudge, Home/End slam to either edge.
    this.handleEl.setAttribute("role", "slider");
    this.handleEl.setAttribute("tabindex", "0");
    this.handleEl.setAttribute("aria-label", "השוואה בין לפני לאחרי");
    this.handleEl.setAttribute("aria-valuemin", "0");
    this.handleEl.setAttribute("aria-valuemax", "100");
    this.handleEl.addEventListener("keydown", e => {
      const step = e.shiftKey ? 10 : 4;
      let p = this.pos;
      if (e.key === "ArrowLeft") p -= step;
      else if (e.key === "ArrowRight") p += step;
      else if (e.key === "Home") p = 2;
      else if (e.key === "End") p = 98;
      else return;
      e.preventDefault();
      this._set(Math.max(2, Math.min(98, p)));
    });

    this._set(50);
  }

  _posFrom(clientX) {
    const r = this.el.getBoundingClientRect();
    return Math.max(2, Math.min(98, ((clientX - r.left) / r.width) * 100));
  }

  _set(pos) {
    this.pos = pos;
    this.beforeImg.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
    this.handleEl.style.left = `${pos}%`;
    this.handleEl.setAttribute("aria-valuenow", String(Math.round(pos)));
    if (this.badgeBefore) this.badgeBefore.style.opacity = pos > 12 ? "1" : "0";
    if (this.badgeAfter) this.badgeAfter.style.opacity = pos < 88 ? "1" : "0";
  }

  _down(e) {
    e.preventDefault();
    this.dragging = true;
    this.handleEl.classList.add("dragging");
    this.handleEl.setPointerCapture?.(e.pointerId);
    this._set(this._posFrom(e.clientX));
    addEventListener("pointermove", this._onMove);
    addEventListener("pointerup", this._onUp);
    addEventListener("pointercancel", this._onUp);
  }

  _onMove(e) {
    if (!this.dragging) return;
    e.preventDefault();
    this._set(this._posFrom(e.clientX));
  }

  _onUp() {
    this.dragging = false;
    this.handleEl.classList.remove("dragging");
    removeEventListener("pointermove", this._onMove);
    removeEventListener("pointerup", this._onUp);
    removeEventListener("pointercancel", this._onUp);
  }
}

export const initCompares = (root = document) =>
  [...root.querySelectorAll(".compare")].map(el => new CompareSlider(el));
