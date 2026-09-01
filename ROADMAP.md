# Backend Delivery Roadmap

## Current State

- Latest release: `2.6.1`, prepared from `dev` on 2026-09-01.
- Node `22.15.0` is pinned for local and Docker builds.
- Dependabot has no open alerts as of 2026-08-09.
- Drone validates pull requests with Docker test and runtime builds plus an API
  smoke test. Trusted `dev` pushes publish development images; annotated tags on
  `main` publish versioned production images.
- Render deploys from its Git integration. The optional `render_deploy_hook`
  secret is used when configured; an unset hook is a successful no-op, allowing
  the tag pipeline to continue to its production API smoke test.
- Production endpoints: API `https://kernel528-welovemovies.onrender.com/` and
  dashboard `https://kernel528-welovemovies-dashboard.onrender.com/`.

## Roadmap Status

| Phase | Status | Target / outcome |
| --- | --- | --- |
| Delivery foundation | Complete | `2.5.3`: Docker, Drone, tagged releases, and production smoke checks |
| Tag reconciliation | Complete | Local `2.5.1` now matches the accurate remote release tag at `25c18fb` |
| Poster remediation | Complete | `2.5.4` through `2.5.6`: API-hosted assets for Pan's Labyrinth, Spirited Away, and Up; production reseeded and dashboard rendering verified |
| Automated poster refresh verification | Complete | Production smoke verifies poster assets and title-based seeded URLs |
| Render MCP review | Complete | Read-only workspace, service, deploy, logs, metrics, and Postgres inspection verified |
| Self-hosted production | Future | Evaluate a Docker host, TLS, monitoring, and rollback process |

## Delivery Policy

1. Create feature branches from `dev` using the `feature/<feature>` convention.
2. Require a passing Drone pull-request validation before merging to `dev` or
   `main`.
3. Treat `dev` as the development-image publication branch and `main` as the
   release branch.
4. Create an annotated version tag only on a reviewed `main` commit.
5. Never merge, tag, or deploy without explicit human approval.

## Delivered Capabilities

### Local And Container Validation

- Multi-stage Docker builds use the pinned Node runtime.
- The test stage installs from the lockfile and runs the Jest/Supertest suite
  with `NODE_ENV=test` and its in-memory SQLite configuration.
- Runtime images are smoke-tested without production database credentials.
- `npm run docker:test`, `npm run docker:build`, and `npm run docker:smoke`
  provide equivalent local checks.

### Drone Automation

- Pull requests build test and runtime targets, smoke-test a disposable
  container, clean it up on either outcome, and notify Slack.
- Trusted `dev` pushes rebuild, test, smoke-test, and publish immutable
  `dev-<commit>-drone-build-<number>` plus `dev-latest` Docker Hub tags.
- Tags verify that the target commit belongs to `main`, publish the release,
  immutable build, and `latest` tags, run optional deployment notification, and
  smoke-test the production API.

### Security Maintenance

- Backend dependency remediation was released in `2.5.3`.
- The lockfile is reproducible with `npm ci`; the current dependency graph has
  no open Dependabot alerts.

## Completed Poster Remediation

- `2.5.4` adds `pans_labyrinth_poster.jpg`, `2.5.5` adds
  `spirited_away_poster.jpg`, and `2.5.6` adds `up_poster.jpg`.
- Each asset is served from the API's `/images` route, allowlisted in the Docker
  build context, and copied into the production runtime image.
- The affected seed records reference the API-hosted URLs. Run
  `npm run refresh:prod` after deploying a seed change so production receives
  the new URL; numeric movie IDs are not stable across reseeds.
- Jest/Supertest regression coverage verifies each asset endpoint and seed URL.

## Image Tags

Use Docker Hub repository `kernel528/welovemovies-backend`.

| Event | Tags |
| --- | --- |
| Merge/push to `dev` | `dev-${DRONE_COMMIT:0:8}-drone-build-${DRONE_BUILD_NUMBER}`, `dev-latest` |
| Version tag on `main` | `${DRONE_TAG}`, `${DRONE_COMMIT:0:8}-drone-build-${DRONE_BUILD_NUMBER}`, `latest` |

Commit/build tags are immutable release records. `dev-latest` and `latest` are
convenience tags, not a complete deployment record.

## Required Drone Configuration

- `docker_username`, `docker_password`, and `slack_webhook_drone_alerts`
- `production_api_url` for the post-deployment smoke test
- `render_deploy_hook` only when a manual Render deploy is required
- Trusted repository access to `/var/run/docker.sock`

## Future Work

1. Evaluate a self-hosted production Docker platform with TLS, monitoring,
   backups, deployment readiness checks, and rollback procedures.
2. Complete a staged Render-to-self-hosted cutover only after the target API
   domains, CORS policy, and operational runbook are verified.
3. Continue monthly production database maintenance using the documented
   refresh and smoke-test process.
4. Complete the in-progress automated production checks for poster asset
   endpoints and seeded URLs in the refresh/smoke workflow.
