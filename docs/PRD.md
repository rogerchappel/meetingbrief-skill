# Meetingbrief Skill PRD

## Goal

Create a reusable, local-first agent skill that turns a meeting context bundle into a concise prep brief, agenda, risk checklist, and follow-up draft.

## Users

- Agent builders who need reusable skill instructions.
- Operators who need reviewable dry-run output.
- Maintainers who want fixture-backed behavior before connector integration.

## MVP Scope

- CLI and library API.
- Fixture-backed tests.
- Markdown and JSON output.
- Skill instructions with side-effect boundaries.
- Release-candidate documentation.

## Out Of Scope

- External service calls.
- Credential access.
- Automatic writes to user systems.
- Package publishing.

## Success Criteria

- All verification commands pass locally.
- Fixtures cover complete, sparse, malformed cases.
- README and SKILL.md explain safe use without hidden side effects.
