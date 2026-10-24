# Writing a theme

Adding a theme never requires touching the app: drop a folder in and pick it from the menu.

```bash
npm run theme:new -- my-theme          # scaffolds themes/my-theme
npm run theme:new -- my-theme --dir ~/path/to/your/themes   # or anywhere you like
```

A theme is a folder with three files:

```
my-theme/
  theme.json   { "apiVersion": 1, "name": "My theme", "description": "…", "author": "you" }
  theme.html   the character's markup (HTML or inline SVG)
  theme.css    styles + animations
```

Built-in themes live in `themes/`. Your own go in the folder opened by **Open themes folder** in the pet's menu; a user theme with the same folder name overrides a built-in one. Themes are discovered every time the menu opens.

## The contract (API version 1)

Each theme is rendered inside its own **Shadow DOM**, so its CSS can't leak into the app or other themes, and you don't need to prefix anything.

| You get | How |
|---|---|
| The current state | `:host([data-state="idle"])`, `"thinking"`, `"working"`, `"attention"` |
| A state color | `var(--state-color)` (green / yellow / blue / red) |
| A 160×160 px box | Your HTML is laid out inside it |
| Your own images | Put them in the folder and reference `{{base}}/image.png` in `theme.html` |

The app draws the bubble, status label and glow; you only draw the character. Scripts are **not** supported (a strict Content-Security-Policy blocks them): themes are declarative HTML + CSS.

`apiVersion` declares which version of this contract the theme targets. A theme that asks for a newer version than the app supports is skipped (with a console warning) instead of rendering wrong.

## Minimal example

```html
<!-- theme.html -->
<div class="dot"></div>
```

```css
/* theme.css */
.dot { width: 80px; height: 80px; margin: 40px; border-radius: 50%; background: var(--state-color); }
:host([data-state="working"]) .dot { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
```

Avoid `body`, `#character` or `#root` selectors — they don't exist inside the shadow root, and the test suite rejects them in built-in themes.

## A note on copyrighted characters

Please don't submit themes that bundle third-party artwork (game characters, logos) to this repository. Keep those as private themes in your own user-data folder.
