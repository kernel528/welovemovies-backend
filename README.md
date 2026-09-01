[![Latest Version](https://img.shields.io/github/v/tag/kernel528/welovemovies-backend)](https://github.com/kernel528/welovemovies-backend/releases/latest)

# Chegg Skills Back-end Web Development Capstone
This repository contains the source code for the We Love Movies Capstone to the Chegg Skills Back-end Web Development Certificate Program.

## Current Baseline

- Latest release: `2.6.1` (2026-09-01).
- Dependabot alerts: none open (verified 2026-08-09).
- CI/CD status: Docker validation, development image publishing, tagged release
  publishing, and Render production smoke checks are operational.
- Back-end repo: https://github.com/kernel528/welovemovies-backend
- Front-end repo: https://github.com/kernel528/welovemovies-frontend
- Local project root: `~/Projects/WeLoveMovies/`
- Monthly operations runbook: `Monthly_Prod_Notes.md`.
- Version history and release notes: `VERSION.md`.

### Front-end Setup
- The front-end app now lives in the sibling repository `~/Projects/WeLoveMovies/welovemovies-frontend`.
- Configure the front-end `VITE_API_BASE_URL` to point at this deployed or local back-end API.

## Quickstart
1. Install dependencies: `npm install`
2. Configure environment: set the appropriate `LOCAL_DATABASE_URL`,
   `DEVELOPMENT_DATABASE_URL`, or `PRODUCTION_DATABASE_URL` in `.env`.
3. Create schema and seed data: `npm run migrate` then `npm run seed`
4. Start the API: `npm run start:dev`
5. Verify: open `http://localhost:5001/movies`

## Automation

The repo now includes portable Node/npm helpers for monthly maintenance.

- `npm run refresh:prod` runs production migrations, seeds, and table-count validation.
- `npm run refresh:dev` runs the same workflow against
  `DEVELOPMENT_DATABASE_URL` (the non-SSL `jedi` development database).
- `npm run smoke:prod` checks the deployed API using `APP_URL` or `SMOKE_BASE_URL`.
- `npm run monthly:verify` runs the refresh flow followed by smoke tests.
- `npm run release:bump -- --version x.y.z --summary "..."` updates release metadata and the API build banner.
- Set `SKIP_DOTENV=1` when you want to test the scripts without loading local `.env` values.

Use `.env.sample` as the template for local and production-related environment variables. For the full monthly release process, see `Monthly_Prod_Notes.md`.

`npm run refresh:dev` clears and reseeds the development data, including the
poster URLs in `src/db/seeds/01_movies.js`. Run it only when replacing the
current development dataset.

## Docker And CI

Build and test the application in Docker with `npm run docker:test`. This runs
the Jest/Supertest suite with the in-memory SQLite test database and requires no
database credentials. Build the runtime image with `npm run docker:build`, run
it locally with `npm run docker:run`, or build and smoke-test it with
`npm run docker:smoke`.

Drone runs Docker-based validation for pull requests targeting `dev` and
`main`. A trusted push to `dev` publishes
`kernel528/welovemovies-backend:dev-<commit>-drone-build-<number>` and
`kernel528/welovemovies-backend:dev-latest`. A version tag on `main` publishes
the version tag, an immutable commit/build tag, and `latest`; it posts to the
optional Render deploy hook when configured and then verifies the production API.

Configure these repository secrets in `drone.kernelsanders.biz`:

- `docker_username`
- `docker_password`
- `slack_webhook_drone_alerts`
- `render_deploy_hook` (optional when Render deploys from Git)
- `production_api_url`

The Docker runner must be a trusted repository runner with access to
`/var/run/docker.sock`. Test and pull-request pipelines do not receive database
or Docker Hub credentials.

## Project Structure
```plaintext
welovemovies-backend/
├── .env
├── .gitignore
├── knexfile.js
├── package.json
├── package-lock.json
├── README.md
├── VERSION.md
├── docs/
    ├── routes/
        ├── movies_list.md
        ├── movies_read.md
        ├── reviews_destroy.md
        ├── reviews_update.md
        ├── theaters_list.md
    ├── tables/
        ├── critics.md
        ├── movies.md
        ├── movies_theaters.md
        ├── reviews.md
        ├── theaters.md
├── images/
├── src/
    ├── app.js
    ├── server.js
    ├── db/
        ├── connection.js
        ├── migrations/
            |── <migration 1>
            |── <migration 2>
            |── <migration ...>
        ├── seeds/
            |── 00_drop_tables.js
            |── 01_movies.js
            |── 02_critics.js
            |── 03_reviews.js
            |── 04_theaters.js
            |── 05_movies_theaters.js
    ├── errors/
        ├── asyncErrorBoundary.js
        ├── methodNotAllowed.js
    ├── movies/
        ├── movies.controller.js
        ├── movies.router.js
        ├── movies.service.js
    ├── reviews/
        ├── reviews.controller.js
        ├── reviews.router.js
        ├── reviews.service.js
    ├── theaters/
        ├── theaters.controller.js
        ├── theaters.router.js
        ├── theaters.service.js
    ├── utils/
        ├── map-properties.js
        ├── reduce-properties.js
└── test/
```

## Database Versions
- Local Docker: Postgres 18.4 (example image `kernel528/postgres:18.4` or `kernel528/postgres:18.4-arm64`).
- Render (production): Postgres 18.6.
- Default local API port: `http://localhost:5001`.

## Change History (Condensed)

### 1.x to 2.0

- `1.0.0` initial capstone release.
- `1.1.0` theaters route enabled.
- `1.2.0` reviews `PUT/DELETE` enabled.
- `2.0.0` cloud deployment established.

### 2.0.x to 2.3.x

- Added local dev support and route/docs improvements.
- Formalized monthly Render DB maintenance process.
- Applied recurring security and dependency updates.
- Upgraded Node runtime in the `2.3.0` series.

### 2.4.x series

- `2.4.0`: docs cleanup and Postgres 18 refresh.
- `2.4.1`: monthly refresh and runbook updates.
- `2.4.2`: monthly refresh and production redeploy runbook update.
- `2.4.3`: monthly refresh and production redeploy.

### Recent merged PRs (post-2.4.2)

- `#67` security remediation release preparation: SQLite 6 and patched
  transitive dependencies.
- `#69` release metadata for `2.5.3`.
- `#71` CI handling for Render Git-based deployment when no hook is configured.
- `#49` release metadata bump and monthly refresh references for `2.4.3`.
- `#46` Dependabot bump: `picomatch` to `2.3.2`.
- `#47` Dependabot bump: `path-to-regexp` to `0.1.13`.
- `#48` Dependabot bump: `lodash` to `4.18.1`.
- `#44` Dependabot bump: `minimatch` to `3.1.5`.

## v3 Automation Roadmap

### 3.0.0 - Monthly Refresh Automation Foundation

1. Add `.env.example` with required variables for local, development, and production operations.
2. Add `scripts/refresh-prod-db.js` for production-targeted migrate/seed with required env flags.
3. Add `scripts/smoke-prod.js` to validate deployed API endpoints and fail fast on unexpected responses.
4. Add npm scripts for one-command execution (for example: `refresh:prod`, `smoke:prod`, `monthly:verify`).
5. Expand this README with an automation section that separates manual Render steps from scriptable local steps.

### 3.1.0 - Release and Documentation Automation

1. Added `scripts/release-bump.js` to update `package.json`, `package-lock.json`, `src/app.js`, `README.md`, and append `VERSION.md`.
2. Add `scripts/monthly-notes-template.js` to append a dated maintenance entry to `Monthly_Prod_Notes.md`.
3. Print a short post-run validation checklist at script completion.

### 3.2.0 - CI Guardrails

1. Add a manual GitHub Actions workflow (`workflow_dispatch`) to run smoke tests against deployed API URL.
2. Add CI job to run `npm test` on PRs that change routes/controllers/services.
3. Add a lightweight consistency check for synchronized version references.

### 3.3.0 - Optional Quality of Life

1. Add script preflight checks for required tools (`node`, `npm`, `knex`, `curl`).
2. Improve script error messages for DB connectivity and SSL negotiation issues.
3. Evaluate explicit production migration control to avoid accidental migration behavior at startup.

## Working Rules for v3 Work

- Keep scripts idempotent where practical.
- Keep secrets out of source control; use `.env` and Render environment variables.
- Update docs in the same PR as script changes.
- Validate with `npm test` and smoke checks before each monthly release PR.

## Implementation & Deployment Logs
Detailed historical setup notes, route task logs, validation transcripts, and deployment steps are kept in `docs/Capstone_Project_Logs.md`.
