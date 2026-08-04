# Backend CI/CD Roadmap

## Purpose

Establish reproducible Docker-based validation and release automation for the
We Love Movies API through `drone.kernelsanders.biz` and Docker Hub.

## Delivery Policy

1. Create `dev` from `main` before enabling feature work.
2. Create feature branches from `dev` using the `dev/<feature>` convention.
3. A pull request from `dev/<feature>` to `dev` runs the Drone validation
   pipeline. It must pass before review and merge.
4. A merge into `dev` triggers a trusted development-image publish pipeline.
5. A pull request from `dev` to `main` runs the same validation pipeline. It
   must pass before review and merge.
6. Do not publish a production image from a `main` push. Create an annotated
   version tag on the reviewed `main` commit instead.
7. A tag on `main` publishes the production image and triggers the existing
   Render production deployment.
8. Never merge into `dev` or `main`, tag a release, or deploy without explicit
   human approval.

## Image Tags

Use Docker Hub repository `kernel528/welovemovies-backend`.

| Event | Tags |
| --- | --- |
| Merge/push to `dev` | `dev-${DRONE_COMMIT:0:8}-drone-build-${DRONE_BUILD_NUMBER}`, `dev-latest` |
| Version tag on `main` | `${DRONE_TAG}`, `${DRONE_COMMIT:0:8}-drone-build-${DRONE_BUILD_NUMBER}`, `latest` |

Tags based on a commit and Drone build number are immutable build references.
`dev-latest` and `latest` are convenience tags and must not be used as the only
deployment record.

## Phase 1: Container Build and Local Verification

1. Add a multi-stage `Dockerfile` using Node `22.15.0`, matching `.nvmrc`.
2. Add a `test` target that copies the lockfiles and source, runs `npm ci`, and
   executes `NODE_ENV=test npm test -- --runInBand`.
3. Keep test execution inside the Docker build so a failed test prevents a
   runtime image from being created.
4. Add a runtime target that installs only production dependencies and starts
   `node src/server.js`.
5. Add `.dockerignore` for `node_modules`, `.env*`, coverage, Git metadata,
   local downloads, and editor files. Preserve `.env.sample` if it is needed
   for image documentation.
6. Add npm scripts for local Docker test-target build, runtime-image build,
   and smoke testing.
7. Run the test target locally and verify the runtime image starts with an
   explicitly supplied non-production database configuration.

The existing Jest/Supertest tests use Knex's in-memory SQLite `test`
configuration. The CI test target must set only `NODE_ENV=test`; it must not
receive local, development, or production database credentials.

## Phase 2: Drone Validation Pipeline

1. Add `.drone.yml` with a Docker runner pipeline named `validation`.
2. Trigger validation for pull requests targeting `dev` or `main`.
3. Mount the Drone runner host Docker socket using the established
   `/var/run/docker.sock` pattern from `www.kernelsanders.biz`.
4. Build the `test` Docker target with a local immutable CI tag.
5. Build the runtime image only after the test target succeeds.
6. Run the runtime image in a uniquely named disposable container.
7. Probe the API root endpoint with a short retry loop, then always remove the
   container through a status-independent cleanup step.
8. Post successful and failed pipeline status to Slack using
   `slack_webhook_drone_alerts`.

Validation pull requests must not publish Docker images or consume registry
credentials. This protects Docker Hub credentials from untrusted PR code.

## Phase 3: Development Image Publishing

1. Add a trusted Drone pipeline triggered only by a `push` to `dev`.
2. Rebuild and test the commit before publication; do not assume a prior PR
   build artifact is available.
3. Publish the two development tags defined above with `plugins/docker`.
4. Read `docker_username` and `docker_password` exclusively from Drone
   secrets.
5. Record the immutable development tag in the Drone build log for review and
   potential test deployment use.

## Phase 4: Production Release Pipeline

1. Add a tag-only Drone pipeline that verifies the tag commit belongs to
   `main` before publishing.
2. Rebuild, execute the Docker test target, build the runtime image, and run
   the smoke test before publishing the production tags.
3. Publish `${DRONE_TAG}`, the immutable build tag, and `latest` to
   `kernel528/welovemovies-backend`.
4. Trigger Render production deployment only after the Docker publish succeeds.
   Use Render's configured Git tag deployment mechanism or a Drone secret-held
   deploy hook; do not place the hook URL in the repository.
5. Wait for the Render deployment result and run a smoke request against the
   production API URL.
6. Report the release image tag, deployment result, and smoke-test result to
   Slack.

## Required Drone Configuration

1. Connect `kernel528/welovemovies-backend` to `drone.kernelsanders.biz` and
   enable GitHub webhook delivery.
2. Configure repository secrets: `docker_username`, `docker_password`, and
   `slack_webhook_drone_alerts`.
3. Add the Render deploy hook as a protected secret only if tag deployment is
   not handled directly by Render's Git integration.
4. Confirm the Docker runner can access `/var/run/docker.sock` and is allowed
   to pull Node, Docker CLI, and curl test images.
5. Configure GitHub branch protection for `dev` and `main` to require the
   Drone validation status and a pull request review.

## Phase 5: Future Self-Hosted Production Migration

1. Design and provision a private production Docker host, reverse proxy, TLS,
   firewall rules, monitoring, backups, and rollback procedures.
2. Deploy the API at `welovemovies-backend.kernelsanders.biz` and
   `welovemovies-backend.kernelsanders.us` using immutable Docker Hub tags.
3. Add health checks, deployment readiness checks, and an authenticated
   deployment mechanism to the release pipeline.
4. Update frontend production configuration only after both API domains have
   valid TLS certificates and verified CORS behavior.
5. Run a staged cutover from Render with smoke tests, DNS rollback planning,
   and an agreed decommission date.

## Completion Criteria

1. Every PR to `dev` and `main` has a passing Docker build-based test and
   runtime smoke-test status in Drone.
2. Every `dev` merge publishes traceable development image tags.
3. Every approved version tag on `main` publishes the specified production
   tags and successfully deploys to Render.
4. No CI test or image build has access to production database credentials.
