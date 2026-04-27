const TYPO_MAP = {
  h1: { tag: "h1", letterSpacing: "-0.02em" },
  h2: { tag: "h2", letterSpacing: "-0.01em" },
  h3: { tag: "h3" },
  h4: { tag: "h4" },
  lede: { tag: "p", cls: "lede" },
  body: { tag: "p" },
  eyebrow: { tag: "h5", letterSpacing: "0.14em", textTransform: "uppercase" },
  mono: { tag: "code" },
};

const SPECIMENS = {
  h1: "Display Heading",
  h2: "Section Heading",
  h3: "Subsection Heading",
  h4: "Card or Group Heading",
  lede: "Lede text — larger introductory copy used above body paragraphs.",
  body: "Body text is the base reading size used across paragraphs, labels, and UI copy throughout the system. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  eyebrow: "Category Label",
  mono: 'const specimen = "Source Code Pro, 13px / 1.6";',
};

const STATE_KEYS = new Set(["hover", "focus", "active", "disabled"]);
const isScale = (k) => /^\d+$/.test(k);
const asPx = (v) => (v === 0 ? "0" : v);

// --- DOM helpers ---

function el(tag, cls = "") {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  return e;
}

function mkSection(label) {
  const s = el("div", "section");
  const l = el("div", "section-label");
  l.textContent = label;
  s.append(l);
  return s;
}

function mkSublabel(text) {
  const d = el("div", "section-sublabel");
  d.textContent = text;
  return d;
}

function mkSwatch(name, hex) {
  const d = el("div", "sw");
  const color = el("div", "sw-color");
  color.style.background = hex;
  const label = el("div", "sw-label");
  const step = el("span", "sw-step");
  step.textContent = name;
  const hexEl = el("span", "sw-hex");
  hexEl.textContent = hex;
  label.append(step, hexEl);
  d.append(color, label);
  return d;
}

function mkRamp(swatches) {
  const row = el("div", "ramp");
  swatches.forEach((s) => row.append(s));
  return row;
}

// --- Colors ---

function renderScaleRamp(group, prefix) {
  const keys = Object.keys(group)
    .filter(isScale)
    .sort((a, b) => parseInt(b) - parseInt(a)); // dark to light
  const mid = Math.ceil(keys.length / 2);
  const frag = document.createDocumentFragment();
  [keys.slice(0, mid), keys.slice(mid)].forEach((row) => {
    if (row.length)
      frag.append(
        mkRamp(row.map((k) => mkSwatch(`color.${prefix}.${k}`, group[k]))),
      );
  });
  return frag;
}

function renderPairRows(group, nameFn) {
  // each entry is { light, dark } — render as two labeled ramps
  const light = [],
    dark = [];
  for (const [name, val] of Object.entries(group)) {
    if (val?.light) light.push(mkSwatch(nameFn(name, "light"), val.light));
    if (val?.dark) dark.push(mkSwatch(nameFn(name, "dark"), val.dark));
  }
  const frag = document.createDocumentFragment();
  if (light.length) frag.append(mkRamp(light));
  if (dark.length) frag.append(mkRamp(dark));
  return frag;
}

function renderStateRows(group, prefix) {
  // group keys: hover/focus/active/disabled, each with { dark, light }
  const states = Object.entries(group).filter(([k]) => STATE_KEYS.has(k));
  if (!states.length) return null;
  const frag = document.createDocumentFragment();
  for (const mode of ["dark", "light"]) {
    frag.append(
      mkRamp(
        states.map(([k, v]) =>
          mkSwatch(`color.${prefix}.${k}.${mode}`, v[mode]),
        ),
      ),
    );
  }
  return frag;
}

function renderComponentStates() {
  const states = ["default", "hover", "focus", "active", "disabled"];
  const grid = el("div", "demo-grid");

  // header row
  ["", "Primary", "Neutral", "Link", "Input"].forEach((h) => {
    const cell = el("div", "demo-header");
    cell.textContent = h;
    grid.append(cell);
  });

  states.forEach((state) => {
    const mod = state === "default" ? "" : ` is-${state}`;
    const isDisabled = state === "disabled";

    // state label
    const labelCell = el("div", "demo-cell");
    const label = el("span", "demo-state");
    label.textContent = state;
    labelCell.append(label);
    grid.append(labelCell);

    // primary button
    const btnP = el("button", `demo-btn demo-btn-primary${mod}`);
    btnP.textContent = "Button";
    if (isDisabled) btnP.disabled = true;
    const cellBtnP = el("div", "demo-cell");
    cellBtnP.append(btnP);
    grid.append(cellBtnP);

    // neutral button
    const btnN = el("button", `demo-btn demo-btn-neutral${mod}`);
    btnN.textContent = "Button";
    if (isDisabled) btnN.disabled = true;
    const cellBtnN = el("div", "demo-cell");
    cellBtnN.append(btnN);
    grid.append(cellBtnN);

    // link
    const link = el("a", `demo-link${mod}`);
    link.textContent = "Link text";
    if (isDisabled) link.setAttribute("aria-disabled", "true");
    else link.href = "#";
    const cellLink = el("div", "demo-cell");
    cellLink.append(link);
    grid.append(cellLink);

    // input
    const input = el("input", `demo-input${mod}`);
    input.type = "text";
    input.placeholder = "Placeholder";
    if (isDisabled) input.disabled = true;
    if (state === "focus" || state === "active") input.value = "Input value";
    const cellInput = el("div", "demo-cell");
    cellInput.append(input);
    grid.append(cellInput);
  });

  return grid;
}

function renderBgFg(bg, fg) {
  const cols = el("div", "theme-cols");
  for (const mode of ["dark", "light"]) {
    const textCol =
      mode === "dark" ? "var(--color-neutral-400)" : "var(--color-neutral-600)";
    const hexCol = "var(--color-neutral-500)";
    const col = el("div", "bg-theme");

    for (const [bgName, bgVal] of Object.entries(bg)) {
      const bgHex = bgVal[mode];
      const card = el("div", "bg-card");
      card.style.background = bgHex;

      const head = el("div", "bg-card-head");
      const nameEl = el("span", "bg-card-name");
      nameEl.textContent = `color.bg.${bgName}.${mode}`;
      nameEl.style.color = textCol;
      const hexEl = el("span", "bg-card-hex");
      hexEl.textContent = bgHex;
      hexEl.style.color = hexCol;
      head.append(nameEl, hexEl);

      const dots = el("div", "fg-swatches");
      for (const [fgName, fgVal] of Object.entries(fg)) {
        const fgHex = fgVal[mode];
        const dot = el("div", "fg-dot");
        const dotColor = el("div", "fg-dot-color");
        dotColor.style.background = fgHex;
        const dotInfo = el("div", "fg-dot-info");
        const dotName = el("span", "fg-dot-name");
        dotName.textContent = `fg.${fgName}.${mode}`;
        dotName.style.color = textCol;
        const dotHex = el("span", "fg-dot-hex");
        dotHex.textContent = fgHex;
        dotHex.style.color = hexCol;
        dotInfo.append(dotName, dotHex);
        dot.append(dotColor, dotInfo);
        dots.append(dot);
      }

      card.append(head, dots);
      col.append(card);
    }
    cols.append(col);
  }
  return cols;
}

function renderColors(color) {
  const sec = mkSection("Colors");

  sec.append(mkSublabel("Neutral"));
  sec.append(renderScaleRamp(color.neutral, "neutral"));

  sec.append(mkSublabel("Primary"));
  sec.append(renderScaleRamp(color.primary, "primary"));

  sec.append(mkSublabel("Accent — light / dark"));
  sec.append(renderPairRows(color.accent, (n, m) => `color.accent.${n}.${m}`));

  const status = {
    success: color.success,
    warning: color.warning,
    danger: color.danger,
    info: color.info,
  };
  sec.append(mkSublabel("Semantic — light / dark"));
  sec.append(renderPairRows(status, (n, m) => `color.${n}.${m}`));

  sec.append(mkSublabel("Interactive States — primary (dark / light)"));
  sec.append(renderStateRows(color.primary, "primary"));
  sec.append(mkSublabel("Interactive States — neutral (dark / light)"));
  sec.append(renderStateRows(color.neutral, "neutral"));

  sec.append(mkSublabel("Component States"));
  sec.append(renderComponentStates());

  sec.append(mkSublabel("Background / Foreground"));
  sec.append(renderBgFg(color.bg, color.fg));

  return sec;
}

// --- Spacing ---

function renderSpacing(spacing) {
  const sec = mkSection("Spacing / Dimensions");
  for (const [k, v] of Object.entries(spacing)) {
    const val = asPx(v);
    const row = el("div", "spacing-row");
    const name = el("span", "spacing-name");
    name.textContent = `spacing.${k}`;
    const bar = el("div", "spacing-bar");
    bar.style.width = val === "0" ? "0px" : val;
    const valEl = el("span", "spacing-val");
    valEl.textContent = String(val);
    row.append(name, bar, valEl);
    sec.append(row);
  }
  return sec;
}

// --- Radius ---

function renderRadius(radius) {
  const sec = mkSection("Radius");
  const grid = el("div", "radius-grid");
  for (const [k, v] of Object.entries(radius)) {
    const val = v === 0 ? "0px" : v;
    const card = el("div", "radius-card");
    const sw = el("div", "radius-swatch");
    sw.style.borderRadius = val;
    const label = el("div", "radius-label");
    const name = el("span", "radius-name");
    name.textContent = `radius.${k}`;
    const valEl = el("span", "radius-val");
    valEl.textContent = val;
    label.append(name, valEl);
    card.append(sw, label);
    grid.append(card);
  }
  sec.append(grid);
  return sec;
}

// --- Typography ---

function renderTypography(typography) {
  const sec = mkSection("Typography");
  for (const [name, val] of Object.entries(typography)) {
    const cfg = TYPO_MAP[name] ?? { tag: "p" };
    const textEl = document.createElement(cfg.tag);
    if (cfg.cls) textEl.className = cfg.cls;
    textEl.textContent = SPECIMENS[name] ?? name;
    if (cfg.letterSpacing) textEl.style.letterSpacing = cfg.letterSpacing;
    if (cfg.textTransform) textEl.style.textTransform = cfg.textTransform;

    const ls = cfg.letterSpacing ? ` · ${cfg.letterSpacing}` : "";
    const metaEl = el("div", "type-meta");
    metaEl.textContent = `typography.${name} — ${val.fontWeight} · ${val.fontSize} / ${val.lineHeight}${ls}`;

    const row = el("div", "type-row");
    row.append(textEl, metaEl);
    sec.append(row);
  }
  return sec;
}

// --- Shadows ---

function renderShadows(shadow) {
  const sec = mkSection("Shadows");
  const grid = el("div", "shadow-grid");
  for (const [k, v] of Object.entries(shadow)) {
    const shadowVal = `${asPx(v.offsetX)} ${asPx(v.offsetY)} ${v.blur} ${v.color}`;
    const card = el("div", "shadow-card");
    const sw = el("div", "shadow-swatch");
    sw.style.boxShadow = shadowVal;
    if (k === "glow") sw.style.background = "var(--color-primary-400)";
    const name = el("span", "shadow-name");
    name.textContent = `shadow.${k}`;
    card.append(sw, name);
    grid.append(card);
  }
  sec.append(grid);
  return sec;
}

// --- Motion ---

function renderMotion(duration) {
  const sec = mkSection("Motion");
  const grid = el("div", "motion-grid");
  for (const [k, v] of Object.entries(duration)) {
    const col = el("div");
    const label = el("div", "ball-col-label");
    const name = el("span", "ball-col-name");
    name.textContent = `duration.${k}`;
    const meta = el("span", "ball-col-meta");
    meta.textContent = v;
    label.append(name, meta);
    const track = el("div", "ball-track");
    const ball = el("div", `ball d-${k}`);
    track.append(ball);
    col.append(label, track);
    grid.append(col);
  }
  sec.append(grid);
  return sec;
}

// --- Init ---

async function init() {
  const tokens = await fetch("../dist/tokens/tokens.json").then((r) =>
    r.json(),
  );
  const app = document.getElementById("app");
  app.append(
    renderColors(tokens.color),
    renderSpacing(tokens.spacing),
    renderRadius(tokens.radius),
    renderTypography(tokens.typography),
    renderShadows(tokens.shadow),
    renderMotion(tokens.duration),
  );
}

init();
