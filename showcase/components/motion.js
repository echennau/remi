import { el, mkSection } from "./utils.js";

export function renderMotion(duration) {
  const sec = mkSection("Motion");
  const grid = el("ul", "motion-grid");

  for (const [k, v] of Object.entries(duration)) {
    const item = el("li");
    const fig = el("figure");
    const cap = el("figcaption", "ball-col-label");
    const name = el("span", "ball-col-name");
    name.textContent = `duration.${k}`;
    const meta = el("span", "ball-col-meta");
    meta.textContent = v;
    cap.append(name, meta);
    const track = el("div", "ball-track");
    const ball = el("div", `ball d-${k}`);
    track.append(ball);
    fig.append(cap, track);
    item.append(fig);
    grid.append(item);
  }

  sec.append(grid);
  return sec;
}
