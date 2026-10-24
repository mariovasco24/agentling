# Changelog

All notable changes are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/) and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed
- Electron updated from 33 to 44.
- README rewritten as a complete user manual (English and Spanish).

### Added
- `npm run update` to pull the latest version and refresh dependencies.

### Fixed
- `ensure-electron` now repairs a broken install using the cached download for the *installed* Electron version.
- The hook no longer waits indefinitely when its stdin is open but empty.

## [1.0.0] - 2026-10-23

### Added
- Always-on-top desktop pet with four states: idle, thinking, working, needs you.
- Adapter architecture: Claude Code adapter plus a generic command-line adapter for any agent.
- Themes rendered in an isolated Shadow DOM with a versioned manifest; built-in *Spark* and *Traffic light*; `npm run theme:new` scaffold.
- Tray icon and context menu: show/hide, size, theme, sound, start at login.
- `npm run setup`, `connect`, `disconnect` and `doctor` for easy install and troubleshooting.
- Unit tests and CI on Linux, macOS and Windows.

[1.0.0]: https://github.com/mariovasco24/agentling/releases/tag/v1.0.0
