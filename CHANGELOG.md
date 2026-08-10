# Changelog

## Unreleased

- Validate meeting bundle scalar and list fields instead of stringifying invalid values.
- Report invalid meeting bundles as concise, nonzero CLI failures.
- Exposed `buildMeetingBrief` from the package root for ESM consumers.
- Expanded release verification to install and exercise the packed library and CLI.

## 0.1.0

- Initial local-first meeting preparation brief generator for agents.
- Added deterministic fixtures for product-sync, sparse, and malformed meeting inputs.
- Included release validation for syntax checks, tests, build checks, smoke output, and npm package dry runs.
