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

Remi can be used on its own or alongside Tailwind.

#### Standalone

Includes all design tokens, base theming, typography, and component styles.

```css
@import "@echennau/remi";
```

Or, import individual stylesheets:

```css
/* CSS variables, automatically themed */
@import "@echennau/remi/styles/theme.css";
/* Tag-level typography styles */
@import "@echennau/remi/styles/typography.css";
/* Component styles */
@import "@echennau/remi/styles/components.css";
```

#### With Tailwind (v4)

`@echennau/remi/tailwind.css` maps Remi's tokens to Tailwind utility classes (`bg-primary`, `text-muted`, `p-4`, `type-h1`, etc.). It does not import Tailwind itself, so import Tailwind first:

```css
@import "tailwindcss";
@import "@echennau/remi";
@import "@echennau/remi/tailwind.css";
```

Order matters: `tailwindcss` must come before `@echennau/remi`. Both place their styles in Tailwind's `base` layer, so if Remi comes first, Tailwind's Preflight reset overrides Remi's typography and component styles.

To use only Remi's utility classes without its typography and component styles, omit `@import "@echennau/remi";`.

#### Theming

Remi defaults to the dark theme.
Set `data-theme="light"` on any element (usually `<html>`) to switch it and its children to the light theme.
Themed utilities such as `bg-primary` update automatically, and Tailwind's `dark:` variant follows the same attribute instead of the OS color scheme.

```html
<html data-theme="light"></html>
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

This runs Style Dictionary to compile tokens into `dist/tokens/` and generate `dist/tailwind.css` and `dist/styles/theme.css`, then copies the remaining stylesheets to `dist/styles/` and fonts to `dist/fonts/`.

All files are exported from `dist` as specified in `package.json`.

## Publishing to npm

The publish workflow triggers on any tag matching `v*`. To publish a new version:

1 - Bump the version in `package.json`
2 - Commit the change
3 - Push a matching git tag:

```sh
git tag vX.Y.Z
git push origin vX.Y.Z
```

The tag push triggers the workflow, which publishes whatever version is in `package.json` at that commit.

## Authors

Ethan Chennault - <ethanolchennault@gmail.com>
