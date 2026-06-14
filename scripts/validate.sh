#!/usr/bin/env bash
set -euo pipefail
npm test
npm run check
npm run build
npm run smoke >/tmp/meetingbrief-skill-smoke.md
test -s /tmp/meetingbrief-skill-smoke.md
