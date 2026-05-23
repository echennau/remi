import { el, mkSection, asPx } from "./utils.js";

export function renderSpacing(spacing) {
  const sec = mkSection("Spacing / Dimensions");
  const dl = el("dl");

  for (const [k, v] of Object.entries(spacing)) {
    const val = asPx(v);
    const row = el("div", "spacing-row");
    const name = el("dt", "spacing-name");
    name.textContent = `spacing.${k}`;
    const bar = el("div", "spacing-bar");
    bar.style.width = val;
    const valEl = el("dd", "spacing-val");
    valEl.textContent = String(val);
    row.append(name, bar, valEl);
    dl.append(row);
  }

  sec.append(dl);
  return sec;
}
