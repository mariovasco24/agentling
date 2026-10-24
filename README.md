# Agentling

A tiny always-on-top desktop pet that tells you what your AI coding agent is doing — even when its window is minimized or on another desktop. Works with [Claude Code](https://claude.com/claude-code) today; other agents plug in through small **adapters**.

| State | Meaning |
|---|---|
| 🟢 **Idle** | The agent is done; nothing is running |
| 🟡 **Thinking** | You sent a prompt and the agent is reasoning |
| 🔵 **Working** | The agent is running tools (editing, running commands…) |
| 🔴 **Needs you** | The agent is waiting for a permission or an answer (plays a sound) |

With several sessions (even from different agents) it shows the most urgent one (needs you > working > thinking > idle).

> Unofficial community project, not affiliated with or endorsed by Anthropic or any agent vendor. Product names belong to their owners.
> Español: [README.es.md](README.es.md)

## Quick start

Requirements: [Node.js](https://nodejs.org) 18+ and a supported agent (Claude Code). Works on macOS, Windows and Linux (macOS is the most tested).

```bash
git clone https://github.com/mariovasco24/agentling.git
cd agentling
npm run setup     # installs dependencies and connects every detected agent
npm start         # launches the pet
```

Then **restart any running agent sessions** so they pick up the hooks. That's it.

Something not working? Run `npm run doctor` for a checklist.

### Everyday use

- **Drag** the pet anywhere; it remembers its position (and recovers if a monitor is unplugged).
- **Right-click** it, or use its menu-bar/tray icon, to show/hide, resize, change theme, toggle the sound, start at login, or quit.
- If a detected agent isn't connected yet, the menu shows **“Connect <agent>”** — one click.

### Uninstall

```bash
npm run disconnect        # removes only Agentling's hooks from the agents' settings
```

Then delete the folder. A one-time backup of your Claude Code settings is kept next to the file as `settings.json.bak-agentling`.

## How it works

```
 Agent ──hook event──▶ bin/agentling-hook.js <adapter> <event> ──▶ ~/.agentling/state/<adapter>__<session>
                              │ adapter.translate()                          │ polled every 400 ms
                              ▼                                  Electron app ◀┘ → aggregate → window / tray / sound
```

1. An **adapter** (`src/adapters/<agent>`) knows how to hook into one agent and how to translate its events into the four states. `npm run connect` asks each detected adapter to register itself.
2. For Claude Code that means six [hooks](https://docs.claude.com/en/docs/claude-code/hooks) (`UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Notification`, `Stop`, `SessionEnd`) added to `~/.claude/settings.json` (or `$CLAUDE_CONFIG_DIR/settings.json`). Existing hooks are untouched and reinstalling never duplicates.
3. Each hook runs a small Node script that writes the session's state to a file. It only reads what the adapter needs (`session_id`, `tool_name`) and never touches the network.
4. The Electron app watches that folder and renders the aggregated state.

Claude Code has no “thinking” event, so *thinking* is the time between your prompt and the first tool call (and between tool calls). If you interrupt with <kbd>Esc</kbd> no event is sent, so *thinking*/*working* fall back to *idle* after 5 minutes without signals.

## Supporting other agents

- **Anything that can run a command** works today through the generic adapter: `node bin/agentling-hook.js generic working` (events: `idle`, `thinking`, `working`, `attention`, `end`; optional `{"session_id": "…"}` on stdin).
- **First-class support** for an agent is one small file implementing `translate()` (plus optional `detect/connect/disconnect`). See [src/adapters/README.md](src/adapters/README.md) — PRs welcome.

## Themes

Pick one from the menu. Built in: **Spark** and **Traffic light**. Themes are plain HTML + CSS folders rendered in an isolated Shadow DOM: scaffold one with `npm run theme:new -- my-theme` or drop yours into the folder opened by the menu entry **Open themes folder** — no app code changes needed. See [THEMES.md](THEMES.md).

## Configuration

Stored in the app's user-data folder (`config.json`); everything is available from the menu. Environment variables:

| Variable | Purpose |
|---|---|
| `AGENTLING_STATE_DIR` | Where hooks write session state (default `~/.agentling/state`) |
| `CLAUDE_CONFIG_DIR` | Claude Code config folder (default `~/.claude`), used by its adapter |

## Troubleshooting

- **Nothing appears** — run `npm run doctor`; make sure the app is running (look for the colored dot in the tray) and use *Show / hide* from its menu.
- **Pet never changes state** — restart the agent after connecting. The hook command uses the absolute path of the `node` that ran `npm run setup`; if you change Node versions, run `npm run connect` again.
- **“Electron failed to install correctly”** — run `node scripts/ensure-electron.js`; it repairs a half-extracted download, or delete `node_modules` and `npm install` again.

## Development

```bash
npm test          # unit tests (node:test, no extra dependencies)
npm start
```

Code layout: `src/main` (Electron main process), `src/renderer` (UI shell), `src/adapters` (one folder/file per agent), `src/shared` (pure logic shared by app, hook and scripts), `bin/` (the hook executable), `scripts/`, `themes/`. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
