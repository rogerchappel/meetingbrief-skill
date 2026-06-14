# Meetingbrief Skill

Local-first meeting preparation brief generator for agents.

Meetingbrief Skill is a local-first agent skill package that turns a meeting context bundle into a concise prep brief, agenda, risk checklist, and follow-up draft. It is designed for dry-run agent workflows where inputs are explicit files and outputs are reviewable artifacts.

## Quickstart

```bash
npm install
npm test
npm run smoke
node bin/meetingbrief-skill.js fixtures/product-sync.json --format markdown
```

## CLI

```bash
node bin/meetingbrief-skill.js fixtures/product-sync.json --format markdown
node bin/meetingbrief-skill.js fixtures/product-sync.json --format json
```

The CLI reads meeting bundle JSON and prints a meeting prep brief. It never calls external services, writes to third-party systems, or reads credentials.

## Library

Import from `src/index.js` for tests or agent wrappers. The public functions are intentionally small so other agents can inspect and adapt the behavior.

## Safety Notes

- Local file input only.
- No network calls.
- No credential handling.
- Any external action must happen in a separate, explicitly approved workflow.

## Limitations

This is a deterministic MVP. It uses simple heuristics and fixtures, not live enrichment or model calls. Treat output as a review packet, not an authority.
