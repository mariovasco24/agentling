# Writing a theme

A theme is a folder with three files:

```
my-theme/
  theme.json   { "name": "My theme", "description": "…", "author": "you" }   (optional)
  theme.html   the character's markup (HTML or inline SVG)
  theme.css    styles + animations
```

Built-in themes live in `themes/`. Your own go in the folder opened by **Open themes folder** in the pet's menu; a user theme with the same folder name overrides a built-in one. Restart the app (or reselect the theme) after editing.

## Rules

- The HTML is injected into `#character`, a 160×160 px box. Scope all your selectors under `#character .your-theme`.
- The current state is on the body: `body[data-state="idle|thinking|working|attention"]`. Use it to switch expressions and start animations.
- `body` exposes `--state-color` (green / yellow / blue / red) if you want to tint something.
- Bubble, status label and glow are drawn by the app; you only draw the character.
- To use images, put them in the theme folder and reference them as `{{base}}/image.png` in `theme.html`.
- Scripts are **not** supported (a strict Content-Security-Policy blocks them): themes are declarative HTML + CSS only.

## Minimal example

```html
<!-- theme.html -->
<div class="dot"></div>
```

```css
/* theme.css */
#character .dot { width: 80px; height: 80px; margin: 40px; border-radius: 50%; background: var(--state-color); }
body[data-state="working"] #character .dot { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
```

## A note on copyrighted characters

Please don't submit themes that bundle third-party artwork (game characters, logos) to this repository. Keep those as private themes in your own user-data folder.
