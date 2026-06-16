# Security Policy

## Supported Versions

The `main` branch and the latest published package version receive security fixes.

## Reporting a Vulnerability

Please report suspected vulnerabilities through GitHub Security Advisories or a private maintainer report with reproduction details, affected versions, and expected impact.

Do not include confidential meeting notes, private customer names, credentials, or unreleased roadmap details in reports. Use redacted fixtures or synthetic examples.

## Security Model

`meetingbrief-skill` reads local meeting JSON and renders deterministic preparation briefs. It should not call external services, store credentials, or transmit meeting content.
