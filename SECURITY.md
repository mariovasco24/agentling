# Security policy

## Supported versions

Only the latest release receives security fixes.

## Reporting a vulnerability

Please **do not open a public issue**. Use GitHub's
[private vulnerability reporting](https://github.com/mariovasco24/agentling/security/advisories/new)
and include steps to reproduce. You can expect an acknowledgement within a few days.

## What Agentling touches

Useful context when assessing a report:

- The hook (`bin/agentling-hook.js`) reads a small JSON payload from an agent and writes one file per session in `~/.agentling/state`. It makes no network calls.
- Connecting an agent edits that agent's own config (for Claude Code, `settings.json`) to add hooks. The edit is idempotent, reversible and backed up.
- Themes are HTML + CSS rendered in a Shadow DOM under a strict Content-Security-Policy; scripts are blocked.
