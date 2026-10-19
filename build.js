import StyleDictionary from "style-dictionary";

// Register custom TailwindCSS output format
StyleDictionary.registerFormat({
  name: "tailwind/css",
  format: ({ dictionary }) => {
    const tokens = dictionary.allTokens;

    const themeLines = [];
    const bgUtilities = new Map();
    const fgUtilities = new Map();
    const borderUtilities = new Map();
    const typographyTokens = new Map();

    for (const token of tokens) {
      const { path } = token;
      const last = path.at(-1);
      const cssVar = `--${token.name}`;

      if (path[0] === "typography") {
        typographyTokens.set(path[1], token);
        continue;
      }

      if (path[0] === "color") {
        if (path[1] === "bg" && last === "dark") {
          const name = path.slice(2, -1).join("-");
          bgUtilities.set(name, `--color-bg-${name}`);
          continue;
        }
        if (path[1] === "fg" && last === "dark") {
          const name = path.slice(2, -1).join("-");
          fgUtilities.set(name, `--color-fg-${name}`);
          continue;
        }
        if (path[1] === "border" && last === "dark") {
          const name = path.slice(2, -1).join("-");
          borderUtilities.set(name, `--color-border-${name}`);
          continue;
        }
        if (last === "light") {
          continue;
        }
        if (last === "dark") {
          const semanticVar = `--${path.slice(0, -1).join("-")}`;
          themeLines.push(`${semanticVar}: var(${semanticVar})`);
          continue;
        }
        // raw palette (no dark/light suffix)
        themeLines.push(`${cssVar}: var(${cssVar})`);
        continue;
      }

      // spacing, radius, shadow, duration
      themeLines.push(`${cssVar}: var(${cssVar})`);
    }

    const lines = [
      '@import "./styles/theme.css";',
      "",
      // dark is the default theme, so dark: applies unless under [data-theme="light"]
      '@custom-variant dark (&:where(:not([data-theme="light"], [data-theme="light"] *)));',
      "",
      "@theme inline reference {",
      ...themeLines.map((l) => `  ${l};`),
      "}",
      "",
    ];

    for (const [name, ref] of bgUtilities) {
      lines.push(
        `@utility bg-${name} {`,
        `  background-color: var(${ref});`,
        `}`,
        "",
      );
    }

    for (const [name, ref] of fgUtilities) {
      lines.push(`@utility text-${name} {`, `  color: var(${ref});`, `}`, "");
    }

    for (const [name, ref] of borderUtilities) {
      lines.push(
        `@utility border-${name} {`,
        `  border-color: var(${ref});`,
        `}`,
        "",
      );
    }

    for (const [name, token] of typographyTokens) {
      const extras = token.original.$extensions?.remi ?? {};
      const utilLines = [`  font: var(--typography-${name});`];
      if (extras.letterSpacing)
        utilLines.push(`  letter-spacing: ${extras.letterSpacing};`);
      if (extras.textTransform)
        utilLines.push(`  text-transform: ${extras.textTransform};`);
      lines.push(`@utility type-${name} {`, ...utilLines, `}`, "");
    }

    return lines.join("\n");
  },
});

// Register themed CSS variables format, mapping semantic colors to their dark/light values
StyleDictionary.registerFormat({
  name: "css/theme",
  format: ({ dictionary }) => {
    const root = [];
    const light = [];

    for (const token of dictionary.allTokens) {
      const { path } = token;
      const last = path.at(-1);
      if (path[0] !== "color" || (last !== "dark" && last !== "light")) {
        continue;
      }
      const semanticVar = `--${path.slice(0, -1).join("-")}`;
      const target = last === "dark" ? root : light;
      if (last === "dark" && token.$description) {
        target.push(`  /* ${token.$description} */`);
      }
      target.push(`  ${semanticVar}: var(--${token.name});`);
    }

    return [
      '@import "../tokens/tokens.css";',
      "",
      ":root {",
      // matches browser-drawn UI (date picker, scrollbars) to the theme
      "  color-scheme: dark;",
      ...root,
      "}",
      "",
      '[data-theme="light"] {',
      "  color-scheme: light;",
      ...light,
      "}",
      "",
    ].join("\n");
  },
});

const sd = new StyleDictionary({
  log: { verbosity: "verbose" },
  source: ["src/tokens/**/*.json"],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "dist/tokens/",
      files: [{ destination: "tokens.css", format: "css/variables" }],
    },
    js: {
      transformGroup: "js",
      buildPath: "dist/tokens/",
      files: [{ destination: "tokens.js", format: "javascript/es6" }],
    },
    json: {
      transformGroup: "js",
      buildPath: "dist/tokens/",
      files: [{ destination: "tokens.json", format: "json/nested" }],
    },
    tailwind: {
      transformGroup: "css",
      buildPath: "dist/",
      files: [{ destination: "tailwind.css", format: "tailwind/css" }],
    },
    theme: {
      transformGroup: "css",
      buildPath: "dist/styles/",
      files: [{ destination: "theme.css", format: "css/theme" }],
    },
  },
});

await sd.buildAllPlatforms();
