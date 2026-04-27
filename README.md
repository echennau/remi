# Remi Design System

Design system created for my own personal projects, based off my favorite color, orange!

Remi consists of two tiers: design tokens, and stylesheets built on top of them.

## Installation

Install via npm:

```sh
npm install remi
```

### Import into your project

#### Tokens only

Available in CSS, JavaScript ES6, and JSON.

```css
@import "remi/dist/tokens/tokens.css";
```

```js
import tokens from "remi/tokens/tokens.js";
```

```js
import tokens from "remi/tokens/tokens.json";
```

#### Stylesheet

Includes all tokens, base theming, and Tailwind utility classes.

```css
@import "remi";
```

Or import individual components:

```css
/* CSS variables, automatically themed */
@import "remi/dist/styles/theme.css";
/* Tailwind utility classes */
@import "remi/dist/styles/tailwind.css";
/* Tag-level typography styles */
@import "remi/dist/styles/typography.css";
```

### Fonts

Remi uses three variable fonts:

- **Space Grotesk** - headings and body text
- **Montserrat** - display and utility
- **Source Code Pro** - monospace

#### Font Preloading

To optimize font loading, add the following to your HTML `<head>`:

```html
<link
  rel="preload"
  href="node_modules/remi/fonts/SpaceGrotesk-VariableFont_wght.ttf"
  as="font"
  type="font/ttf"
  crossorigin
/>
<link
  rel="preload"
  href="node_modules/remi/fonts/Montserrat-VariableFont_wght.ttf"
  as="font"
  type="font/ttf"
  crossorigin
/>
<link
  rel="preload"
  href="node_modules/remi/fonts/SourceCodePro-VariableFont_wght.ttf"
  as="font"
  type="font/ttf"
  crossorigin
/>
```

## Building locally

```sh
npm run build
```

This runs Style Dictionary to compile tokens into `dist/tokens/`, then copies the stylesheets to `dist/styles/`.
`package.json` then exports all files from `dist`.
