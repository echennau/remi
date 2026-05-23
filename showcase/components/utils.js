export function el(tag, cls = "") {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  return e;
}

export function mkTopSection(label) {
  const s = el("section", "top-section");
  const h = el("h2", "top-section-label");
  h.textContent = label;
  s.append(h);
  return s;
}

export function mkSection(label) {
  const s = el("section", "section");
  const h = el("h3", "section-label");
  h.textContent = label;
  s.append(h);
  return s;
}

export function mkSublabel(text) {
  const h = el("h4", "section-sublabel");
  h.textContent = text;
  return h;
}

export function mkSwatch(name, hex) {
  const item = el("li", "sw");
  const color = el("div", "sw-color");
  color.style.background = hex;
  const label = el("div", "sw-label");
  const step = el("span", "sw-step");
  step.textContent = name;
  const hexEl = el("span", "sw-hex");
  hexEl.textContent = hex;
  label.append(step, hexEl);
  item.append(color, label);
  return item;
}

export function mkRamp(swatches) {
  const row = el("ul", "ramp");
  row.append(...swatches);
  return row;
}

// token values are already px strings except for 0, which Style Dictionary outputs as a number
export const asPx = (v) => (v === 0 ? "0px" : v);
export const isScale = (k) => /^\d+$/.test(k);
