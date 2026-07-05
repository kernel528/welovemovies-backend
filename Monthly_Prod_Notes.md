# We Love Movies

## Monthly Render DB Refresh Runbook
Last updated: 2026-07-05

### Scope
This runbook covers the monthly production refresh when Render free-tier Postgres is recreated, then migrations/seeds are reapplied, and both services are redeployed.

### Services
- Front-end: [kernel528-WeLoveMovies-front-end](https://dashboard.render.com/web/srv-cu61j7l6l47c73btue80)
- Back-end: [kernel528-WeLoveMovies-back-end](https://dashboard.render.com/web/srv-cu60jl56l47c73btmg3g)
- Database: [WeLoveMoviesDB](https://dashboard.render.com/d/dpg-cv1kpfhu0jms738j2da0-a)

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
- [ ] Update the back-end Render `PRODUCTION_DATABASE_URL` env var.
- [ ] Redeploy back-end, then front-end.
- [ ] Run `npm run smoke:prod`.
- [ ] Watch Render logs.

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
   - `GET /movies/:movieId/reviews` (example: `/movies/1/reviews`)
   - `GET /not-a-route` (confirm 404 handler behavior)
2. Watch Render logs for 10-15 minutes:
   - DB connection errors
   - Migration/seed related startup errors
   - Elevated 5xx responses

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
