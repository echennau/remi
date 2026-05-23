import { el, mkSection, asPx } from "./utils.js";

export function renderRadius(radius) {
  const sec = mkSection("Radius");
  const grid = el("ul", "radius-grid");

  for (const [k, v] of Object.entries(radius)) {
    const val = asPx(v);
    const item = el("li", "radius-card");
    const fig = el("figure");
    const sw = el("div", "radius-swatch");
    sw.style.borderRadius = val;
    const cap = el("figcaption", "radius-label");
    const name = el("span", "radius-name");
    name.textContent = `radius.${k}`;
    const valEl = el("span", "radius-val");
    valEl.textContent = val;
    cap.append(name, valEl);
    fig.append(sw, cap);
    item.append(fig);
    grid.append(item);
  }

  sec.append(grid);
  return sec;
}
