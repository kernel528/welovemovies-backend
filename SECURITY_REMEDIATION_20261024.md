# Security Remediation — 2026-10-24

## Scope

Address the Node.js TLS/decompression and eMudhra certificate guidance in the
Render advisory, and resolve fixable npm audit findings discovered while
reviewing this repository. This service is a Node.js application delivered as
a Docker image; no PHP runtime was found.

## Remediations in this branch

- Pin local development and both Docker stages to Node.js `22.23.4`.
- Refresh the Debian CA certificate package when building the runtime image.
- Update the npm lockfile to patched compatible releases; `npm audit` reported
  zero vulnerabilities after the update.

## Validation plan and status

1. Build the local Docker runtime image and run the application smoke test.
2. Run backend tests and `npm audit`.
3. Submit this branch for PR review; do not promote before validation and review.
4. After approval and merge, rebuild and redeploy the Render production service
   from the reviewed commit, then verify the production API smoke endpoint and
   deployed Node.js runtime.

Local Docker runtime build, application smoke test, backend tests, and
`npm audit` have passed. Release `3.0.5` is tagged and the security-updated
runtime was verified on Render. The October monthly refresh replaced and
reseeded production Postgres as `dpg-dbed893rjlhs73faub1g-a`; service cutover is
pending in the separate `3.0.6` monthly release process.
