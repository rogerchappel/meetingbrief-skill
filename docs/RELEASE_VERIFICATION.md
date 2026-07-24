# Release Verification

Use this checklist before cutting a package or asking reviewers to trust the current branch.

## Local Gate

```sh
npm run release:check
```

The release gate runs the project checks, smoke coverage, and package-install verification declared in `package.json`. The package smoke test creates a tarball, installs it in a temporary ESM consumer, imports the package-root API, and runs the installed CLI. It removes its temporary files after the check. CI mirrors the same gate so pull requests exercise the install path and published package boundary.

## Package Boundary

The `files` allowlist in `package.json` is intentionally conservative. Add new runtime directories there when future releases need them; do not rely on npm's implicit package contents.
