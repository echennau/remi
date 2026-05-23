import { el, mkSection, asPx } from "./utils.js";

export function renderShadows(shadow) {
  const sec = mkSection("Shadows");
  const grid = el("ul", "shadow-grid");

  for (const [k, v] of Object.entries(shadow)) {
    // spread is intentionally omitted - shadow tokens don't define it
    const shadowVal = `${asPx(v.offsetX)} ${asPx(v.offsetY)} ${v.blur} ${v.color}`;
    const item = el("li");
    item.dataset.shadow = k;
    const fig = el("figure", "shadow-card");
    const sw = el("div", "shadow-swatch");
    sw.style.boxShadow = shadowVal;
    const cap = el("figcaption", "shadow-name");
    cap.textContent = `shadow.${k}`;
    fig.append(sw, cap);
    item.append(fig);
    grid.append(item);
  }

  sec.append(grid);
  return sec;
}
