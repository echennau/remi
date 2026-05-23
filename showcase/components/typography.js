import { el, mkSection } from "./utils.js";

const TYPO_MAP = {
  h1: { tag: "h1" },
  h2: { tag: "h2" },
  h3: { tag: "h3" },
  h4: { tag: "h4" },
  h5: { tag: "h5" },
  lede: { tag: "p", cls: "lede" },
  body: { tag: "p" },
  eyebrow: { tag: "h5", alias: "h5" },
  mono: { tag: "code" },
};

const SPECIMENS = {
  h1: "Display Heading",
  h2: "Section Heading",
  h3: "Subsection Heading",
  h4: "Card or Group Heading",
  h5: "Same as eyebrow",
  body: "Body text is the base reading size used across paragraphs, labels, and UI copy throughout the system. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  mono: 'const specimen = "Source Code Pro, 13px / 1.6";',
  lede: "Lede text sits directly below an h1 or h2, bridging the heading and body copy. Larger than body but lighter in weight than any heading — use it for article intros, page summaries, or section openers where a single sentence of context is needed before the main content begins.",
  eyebrow: "Above h1, h2, or h3",
};

export function renderTypography(typography) {
  const sec = mkSection("Type Scale");
  const order = [
    "h1",
    "eyebrow",
    "h2",
    "lede",
    "h3",
    "h4",
    "h5",
    "body",
    "mono",
  ];
  const entries = order
    .filter((k) => k in typography)
    .map((k) => [k, typography[k]]);

  for (const [name, val] of entries) {
    const cfg = TYPO_MAP[name] ?? { tag: "p" };
    const textEl = el(cfg.tag, cfg.cls ?? "");
    textEl.textContent = SPECIMENS[name] ?? name;

    const nameDisplay = cfg.alias
      ? `typography.${name} / ${cfg.alias}`
      : `typography.${name}`;
    const metaEl = el("div", "type-meta");
    metaEl.textContent = `${nameDisplay} — ${val.fontWeight} · ${val.fontSize} / ${val.lineHeight}`;

    const row = el("div", "type-row");
    row.append(textEl, metaEl);
    sec.append(row);
  }

  return sec;
}
