# Contributing

Thanks for improving `meetingbrief-skill`.

## Local Setup

```bash
npm install
npm run release:check
```

## Pull Requests

- Keep changes small and focused.
- Add or update fixtures when brief generation behavior changes.
- Run `npm run release:check` before opening a PR.
- Document user-facing behavior changes in `README.md` or `docs/`.

## Safety Expectations

Keep the package local-first. Do not add network calls, credential handling, telemetry, or live calendar integrations to the briefing path without explicit design review.
