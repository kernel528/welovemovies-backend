# We Love Movies

## Monthly Render DB Refresh Runbook
Last updated: 2026-09-01

### Scope
This runbook covers the monthly production refresh when Render free-tier Postgres is recreated, then migrations/seeds are reapplied, and both services are redeployed.

## Monthly Development And Production Refresh Plan

1. **Preflight both environments.** Confirm the target database, current
   branch and commit, credential access, and expected table counts with
   read-only MCP or SQL inspection. Record the baseline without exposing
   connection strings or secrets.
2. **Refresh development first.** Obtain approval for the destructive refresh,
   run `npm run refresh:dev`, then validate migrations, seeds, expected table
   counts, and local tests before any production action.
3. **Approve each production mutation.** Use Render MCP only for read-only
   preflight. Before deleting or creating a database, updating credentials or
   environment variables, refreshing data, or triggering a deploy, state the
   target and obtain explicit approval for that individual action.
4. **Refresh and validate production.** After approval, recreate the database
   if required, run `npm run refresh:prod`, verify table counts and seeded
   poster URLs, then redeploy the backend followed by the dashboard and run
   `npm run smoke:prod`.
5. **Close out.** Inspect time-bounded logs and metrics, record final resource
   IDs, counts, release and deploy SHAs, and the rollback target in the
   encrypted credential record and refresh history.

### Services
- Front-end: [kernel528-welovemovies-dashboard](https://kernel528-welovemovies-dashboard.onrender.com/)
- Back-end: [kernel528-WeLoveMovies-back-end](https://dashboard.render.com/web/srv-cu60jl56l47c73btmg3g)
- Database: [kernel528-welovemovies-pg18](https://dashboard.render.com/d/dpg-dab1tqf40ujc739j561g-a)

## Quick Monthly Refresh Checklist

- [ ] Confirm current branch/commit for deployment.
- [ ] Confirm working app URL for smoke tests.
- [ ] Confirm access to encrypted credential notes.
- [ ] Confirm local repo has current dependencies and `knex` scripts available.
- [ ] Pause front-end and back-end services in Render before DB deletion.
- [ ] Recreate the Render Postgres database and capture the new connection details.
- [ ] Update the encrypted credential store with the new DB entry.
- [ ] Update local `.env` with the new `PRODUCTION_DATABASE_URL`.
- [ ] Update the Render database and service environment variables manually in the dashboard.
- [ ] Run `npm run refresh:prod`.
- [ ] Validate production data in DBeaver and/or `psql`.
- [ ] Verify Pan's Labyrinth, Spirited Away, and Up use their API-hosted poster
  URLs after the refresh. Do not rely on numeric movie IDs, which can change
  when the seed data is recreated.
- [ ] Update the back-end Render `PRODUCTION_DATABASE_URL` env var.
- [ ] Redeploy back-end, then front-end.
- [ ] Run `npm run smoke:prod`.
- [ ] Watch Render logs.

### Optional Render MCP Read-Only Verification

- [ ] Select the intended Render workspace and confirm the API, dashboard, and
  Postgres resources.
- [ ] Review the most recent backend and frontend deploys.
- [ ] Query only time-bounded logs and metrics when investigating an issue.
- [ ] Use only read-only SQL for database inspection.
- [ ] Obtain explicit approval before triggering a deploy or changing an
  environment variable through Render MCP.

See `docs/render-mcp-operations.md` for the complete workflow and OpenCode
activation instructions.

## Procedure
1. Pause services in Render:
   - Suspend front-end and back-end first so no writes happen during DB recreation.
2. Recreate Render Postgres:
   - Delete old DB instance.
   - Create a new DB instance.
   - Capture `DB Name`, `DB Username`, `DB Password`, `Hostname`, `PSQL Command`, `External URL`, `Internal URL`.
3. Update encrypted credential store:
   - Linux decrypt:
     ```bash
     gpg --output credentials.md --decrypt credentials.md.gpg
     ```
   - macOS decrypt:
     ```bash
     gpg -d credentials.md.gpg >> credentials.md
     ```
   - Add a new dated entry:
     ```text
     ### Postgres - Render Hosted - We Love Movies - YYYY-MM-DD
     DB Name:
     DB Username:
     DB Password:
     Hostname:
     PSQL Command:
     External URL:
     Internal URL:
     ```
   - Re-encrypt and delete plaintext:
     ```bash
     gpg -c credentials.md
     rm credentials.md
     ```
4. Configure local environment for production DB operations:
   - Set `PRODUCTION_DATABASE_URL` in local `.env` to the new Render `External URL`.
   - Keep `NODE_ENV=development` in `.env`; use command-level `NODE_ENV=production` for prod DB commands.
5. Rebuild schema on the new production DB:
   ```bash
   NODE_ENV=production npx knex migrate:list
   NODE_ENV=production npx knex migrate:latest
   ```
   Expected: `Batch 1 run: 5 migrations`.
6. Seed production DB:
   ```bash
   NODE_ENV=production npx knex seed:run
   ```
   Expected: `Ran 6 seed files`.
7. Validate production DB data:
   - Use DBeaver and/or `psql` with the new `External URL`.
    - Validate key table counts:
      - `movies`
      - `theaters`
      - `reviews`
     - For the poster patch series, locate Pan's Labyrinth, Spirited Away, and
       Up by title, then verify their seeded `image_url` values.
8. Update Render back-end environment variable:
   - In back-end service environment, set `PRODUCTION_DATABASE_URL` to the new DB `External URL`.
   - Confirm there is no typo or stale host/database name.
9. Redeploy in order:
   - Resume back-end service and run `Clear build cache & deploy`.
   - After back-end is healthy, resume front-end and run `Clear build cache & deploy`.

## Post-Deploy Validation
1. Smoke test API endpoints:
   - `GET /movies`
   - `GET /theaters`
    - `GET /movies/:movieId/reviews` for a current movie with reviews
   - `GET /not-a-route` (confirm 404 handler behavior)
  2. Watch Render logs for 10-15 minutes:
    - DB connection errors
    - Migration/seed related startup errors
    - Elevated 5xx responses
3. After the poster patch series is deployed, locate Pan's Labyrinth, Spirited
   Away, and Up from the movie list and confirm each detail page resolves its
   poster. Do not rely on numeric movie IDs after a reseed.

## Rollback Plan
1. Pause front-end and back-end.
2. Re-point `PRODUCTION_DATABASE_URL` to last known good DB (if available) or recreate DB and rerun migrations/seeds.
3. Redeploy back-end, then front-end.
4. Re-run smoke tests and log checks.

## Render.com DB Refresh History
- June 2025: v16.9
- July 2025: v16.10
- October 2025: v17.6
- November 2025: v17.7
- December 2025: v17.7
- January 2026: v18.1
- February 2026: v18.2 (monthly refresh + reseed)
- March 2026: v18.3 (monthly refresh + reseed + runbook update)
- June 2026: v18.4 (monthly refresh + automation + release 2.5.0)
- July 2026: v18.4 (monthly refresh + validated release 2.5.1)
- August 2026: v18.4 (postgres refresh + reseed + smoke validated; deployment target release 2.5.2)
- September 2026: v18.6 (monthly refresh + reseed + backend and dashboard smoke validated)
