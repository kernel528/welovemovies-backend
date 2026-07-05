# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains the Express API (`app.js`, `server.js`) and feature modules: `movies/`, `theaters/`, and `reviews/` with `*.router.js`, `*.controller.js`, and `*.service.js` per resource.
- `src/db/` holds `connection.js`, migrations in `migrations/`, and seed data in `seeds/`.
- `test/routes/` contains Jest + Supertest route tests (one file per resource).
- `docs/` documents routes and database tables.
- `starter-movie-front-end.old/` is a legacy front-end copy; it is not part of the API runtime.

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run start`: run the API with Node (`src/server.js`).
- `npm run start:dev`: run with nodemon for live reload.
- `npm test`: run Jest tests in `test/`.
- `npm run migrate`, `npm run rollback`, `npm run seed`, `npm run reset`: manage database schema and seed data via Knex.
- `npm run docker:build` / `npm run docker:run`: build and run the Docker image locally.

## Coding Style & Naming Conventions
- JavaScript (CommonJS) with semicolons and double quotes; use 2-space indentation to match existing files (see `src/movies/movies.controller.js`).
- Organize new endpoints with router/controller/service separation and keep responses wrapped in `{ data: ... }`.
- Use descriptive, lower_snake_case for route params (e.g., `:movie_id`, `:review_id`).

## Testing Guidelines
- Frameworks: Jest + Supertest.
- Tests live in `test/routes/` and are named by resource (e.g., `movies.test.js`).
- Run `npm test` after changes to routes, controllers, or services.

## Commit & Pull Request Guidelines
- Commit messages in history are short, sentence-case updates (e.g., “Updated Monthly_Prod_Notes.md...”) and version bump commits like `2.3.4`.
- PRs are typically used for changes (merge commits reference PR numbers). Include a clear summary, tests run (e.g., `npm test`), and any DB migration/seed notes.

## Configuration & Data Notes
- The API expects database settings via environment variables (see `knexfile.js`). For local work, set up Postgres 18.4 and run `npm run migrate` + `npm run seed`.
- Monthly Render refresh workflow:
  - manual Render steps still required: recreate the Postgres 18.4 instance, update the Render back-end `PRODUCTION_DATABASE_URL`, and update local `.env`
  - scripted steps: `npm run refresh:prod`, `npm run smoke:prod`, or `npm run monthly:verify`
  - release/version files to update for a tagged release: `package.json`, `package-lock.json`, `src/app.js`, `VERSION.md`, `README.md`, and `Monthly_Prod_Notes.md`
  - keep `scripts/monthly-refresh.js`, `scripts/smoke-prod.js`, and `.env.sample` aligned with the current workflow
