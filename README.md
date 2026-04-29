# Remi Design System

Design system created for my own personal projects, based off my favorite color, orange!

Remi consists of two tiers: design tokens, and stylesheets built on top of them.

## Installation

Install via npm:

```sh
npm install @echennau/remi
```

### Import into your project

These imports require a bundler (Vite, webpack, etc.) or TailwindCSS v4. Without one, reference the files directly, such as `./node_modules/@echennau/remi/dist/styles/index.css`.

#### Stylesheet

Includes all design tokens, base theming, and typography styles.

```css
@import "@echennau/remi";
```

Or, import individual stylesheets:

```css
/* CSS variables, automatically themed */
@import "@echennau/remi/styles/theme.css";
/* Tag-level typography styles */
@import "@echennau/remi/styles/typography.css";
```

#### Tailwind config

If you want Tailwind utility classes and the `@theme` configuration, import it separately:

```css
@import "@echennau/remi/tailwind.css";
```

#### Tokens only

Available in CSS, JavaScript ES6, and JSON.

```css
@import "@echennau/remi/tokens/tokens.css";
```

```js
import tokens from "@echennau/remi/tokens/tokens.js";
```

```js
import tokens from "@echennau/remi/tokens/tokens.json";
```

### Fonts

Remi uses three variable fonts:

- **Space Grotesk** - headings and body text
- **Montserrat** - display and utility
- **Source Code Pro** - monospace

#### Font Preloading

To optimize font loading, add the following to your HTML `<head>`. The exact paths will vary depending on your bundler or framework.

```html
<link
  rel="preload"
  href="/fonts/SpaceGrotesk-VariableFont_wght.ttf"
  as="font"
  type="font/ttf"
  crossorigin
/>
<link
  rel="preload"
  href="/fonts/Montserrat-VariableFont_wght.ttf"
  as="font"
  type="font/ttf"
  crossorigin
/>
<link
  rel="preload"
  href="/fonts/SourceCodePro-VariableFont_wght.ttf"
  as="font"
  type="font/ttf"
  crossorigin
/>
```

## Building locally

```sh
npm run build
```

This runs Style Dictionary to compile tokens into `dist/tokens/`, then copies the stylesheets to `dist/styles/`, fonts to `dist/fonts/`, and `tailwind.css` to `dist/tailwind.css`.

All files are exported from `dist` as specified in `package.json`.
