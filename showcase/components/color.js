import {
  el,
  mkSection,
  mkSublabel,
  mkSwatch,
  mkRamp,
  isScale,
} from "./utils.js";

const STATE_KEYS = new Set(["hover", "focus", "active", "disabled"]);

const STATUS_KEYS = ["success", "warning", "danger", "info"];

const FG_TAGS = {
  default: { tag: "span", text: "Default" },
  emphasis: { tag: "strong", text: "Strong" },
  body: { tag: "span", text: "Body" },
  muted: { tag: "small", text: "Muted" },
};

function renderScaleRamp(group, prefix) {
  const keys = Object.keys(group)
    .filter(isScale)
    .sort((a, b) => parseInt(b) - parseInt(a));
  const frag = document.createDocumentFragment();
  [keys.slice(0, 5), keys.slice(5)].forEach((row) => {
    if (row.length)
      frag.append(
        mkRamp(row.map((k) => mkSwatch(`color.${prefix}.${k}`, group[k]))),
      );
  });
  return frag;
}

function renderPairRows(group, nameFn) {
  const light = [],
    dark = [];
  for (const [name, val] of Object.entries(group)) {
    if (val?.light) light.push(mkSwatch(nameFn(name, "light"), val.light));
    if (val?.dark) dark.push(mkSwatch(nameFn(name, "dark"), val.dark));
  }
  const frag = document.createDocumentFragment();
  if (dark.length) frag.append(mkRamp(dark));
  if (light.length) frag.append(mkRamp(light));
  return frag;
}

function renderStateRows(group, prefix) {
  const states = [];
  if (group.dark || group.light)
    states.push(["default", { dark: group.dark, light: group.light }]);
  states.push(...Object.entries(group).filter(([k]) => STATE_KEYS.has(k)));
  if (!states.length) return null;
  const frag = document.createDocumentFragment();
  for (const mode of ["dark", "light"]) {
    const swatches = states
      .filter(([, v]) => v[mode])
      .map(([k, v]) => mkSwatch(`color.${prefix}.${k}.${mode}`, v[mode]));
    if (swatches.length) frag.append(mkRamp(swatches));
  }
  return frag;
}

function mkFgDot(fgName, fgHex, mode) {
  const dot = el("li", "fg-dot");
  const dotColor = el("div", "fg-dot-color");
  dotColor.style.background = fgHex;
  const specCfg = FG_TAGS[fgName];
  const spec = el(specCfg?.tag ?? "span", "fg-dot-specimen");
  spec.textContent = specCfg?.text ?? fgName;
  spec.style.color = fgHex;
  const dotInfo = el("div", "fg-dot-info");
  const dotName = el("span", "fg-dot-name");
  dotName.textContent = `fg.${fgName}.${mode}`;
  const dotHex = el("span", "fg-dot-hex");
  dotHex.textContent = fgHex;
  dotInfo.append(dotName, dotHex);
  const dotRow = el("div", "fg-dot-row");
  dotRow.append(dotColor, spec);
  dot.append(dotRow, dotInfo);
  return dot;
}

function renderBgFg(bg, fg) {
  const cols = el("div", "theme-cols");
  for (const mode of ["dark", "light"]) {
    const col = el("div", "bg-theme");
    col.dataset.mode = mode;

    for (const [bgName, bgVal] of Object.entries(bg)) {
      const bgHex = bgVal[mode];
      const card = el("figure", "bg-card");
      card.style.background = bgHex;

      const caption = el("figcaption", "bg-card-head");
      const nameEl = el("span", "bg-card-name");
      nameEl.textContent = `color.bg.${bgName}.${mode}`;
      const hexEl = el("span", "bg-card-hex");
      hexEl.textContent = bgHex;
      caption.append(nameEl, hexEl);

      const dots = el("ul", "fg-swatches");
      const dotsFrag = document.createDocumentFragment();
      for (const [fgName, fgVal] of Object.entries(fg)) {
        dotsFrag.append(mkFgDot(fgName, fgVal[mode], mode));
      }
      dots.append(dotsFrag);

      card.append(caption, dots);
      col.append(card);
    }
    cols.append(col);
  }
  return cols;
}

export function renderColorScales(color) {
  const sec = mkSection("Colors");

  sec.append(mkSublabel("Primary"));
  sec.append(renderScaleRamp(color.primary, "primary"));

  sec.append(mkSublabel("Neutral"));
  sec.append(renderScaleRamp(color.neutral, "neutral"));

  sec.append(mkSublabel("Accent — light / dark"));
  sec.append(renderPairRows(color.accent, (n, m) => `color.accent.${n}.${m}`));

  const status = Object.fromEntries(STATUS_KEYS.map((k) => [k, color[k]]));
  sec.append(mkSublabel("Status — light / dark"));
  sec.append(renderPairRows(status, (n, m) => `color.${n}.${m}`));

  return sec;
}

export function renderColorReference(color) {
  const sec = el("section", "section");

  const bgFgLabel = el("h3", "section-label");
  bgFgLabel.textContent = "Background / Foreground";
  sec.append(bgFgLabel);
  sec.append(renderBgFg(color.bg, color.fg));

  return sec;
}
