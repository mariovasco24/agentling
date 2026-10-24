# Contributing

Thanks for helping! Bug reports, themes and platform fixes are all welcome.

## Setup

```bash
git clone <your fork>
cd agentling
npm run setup
npm test
```

## Workflow

`main` is protected: open a pull request from a short-lived branch (`feat/…`, `fix/…`, `docs/…`); CI must pass and the maintainer reviews. Add a line under **Unreleased** in [CHANGELOG.md](CHANGELOG.md). Please follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Guidelines

- Keep **runtime dependencies at zero**; `electron` is the only dev dependency.
- Logic that doesn't need Electron goes in `src/shared` or is a pure function, and gets a test in `test/`.
- The hook (`bin/agentling-hook.js`) must never fail loudly or slow Claude Code down: always exit 0, no network.
- Adapters must be idempotent and reversible, never touch config they don't own, and back up what they edit. New agent? Read [src/adapters/README.md](src/adapters/README.md).
- New themes: see [THEMES.md](THEMES.md). No third-party copyrighted artwork.
- Run `npm test` before opening a PR; CI runs it on Linux, macOS and Windows.
