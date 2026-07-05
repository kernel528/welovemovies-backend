[![Latest Version](https://img.shields.io/github/v/tag/kernel528/WeLoveMovies)](https://github.com/kernel528/WeLoveMovies/releases/latest)

# Chegg Skills Back-end Web Development Capstone
This repository contains the source code for the We Love Movies Capstone to the Chegg Skills Back-end Web Development Certificate Program.

## Current Baseline

- Latest release: `2.5.0` (2026-06-05).
- Monthly operations runbook: `Monthly_Prod_Notes.md`.
- Version history and release notes: `VERSION.md`.

### Front-end Setup
- The starter-movie-front-end is a symlink in this repo to the fork from Chegg Skills located here: [starter-movie-frontend](https://github.com/kernel528/starter-movie-front-end). This was setup to test progress in addition to test cases.
- Due to using the `qualified-attach` to sync local changes with qualified site, this previously defaulted to the `Final_Capstone_WeLoveMovies_Guild_Node_18_1` folder name before moving to repo root.

## Quickstart
1. Install dependencies: `npm install`
2. Configure environment: set `DATABASE_URL` (and `NODE_ENV=development` for local).
3. Create schema and seed data: `npm run migrate` then `npm run seed`
4. Start the API: `npm run start:dev`
5. Verify: open `http://localhost:5001/movies`

## Automation

The repo now includes portable Node/npm helpers for monthly maintenance.

- `npm run refresh:prod` runs production migrations, seeds, and table-count validation.
- `npm run smoke:prod` checks the deployed API using `APP_URL` or `SMOKE_BASE_URL`.
- `npm run monthly:verify` runs the refresh flow followed by smoke tests.
- `npm run release:bump -- --version x.y.z --summary "..."` updates release metadata and the API build banner.
- Set `SKIP_DOTENV=1` when you want to test the scripts without loading local `.env` values.

Use `.env.sample` as the template for local and production-related environment variables. For the full monthly release process, see `Monthly_Prod_Notes.md`.

## Project Structure
```plaintext
WeLoveMovies/
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
├── starter-movie-front-end (symlink)
├── starter-movie-front-end.old/
└── test/
```

## Database Versions
- Local Docker: Postgres 18.4 (example image `kernel528/postgres:18.4` or `kernel528/postgres:18.4-arm64`).
- Render (production): Postgres 18.4.
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
Detailed historical setup notes, route task logs, validation transcripts, and deployment steps are kept in `Capstone_Project_Logs.md`.
