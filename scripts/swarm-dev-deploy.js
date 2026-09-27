#!/usr/bin/env node

const { execFileSync } = require("child_process");
const path = require("path");
require("dotenv").config();

const requiredEnvVars = ["DEVELOPMENT_DATABASE_URL"];
const stackFile = path.resolve(__dirname, "..", "swarm.dev.yml");
const environment = {
  ...process.env,
  SWARM_API_IMAGE:
    process.env.SWARM_API_IMAGE || "kernel528/welovemovies-backend:dev-latest",
  SWARM_DASHBOARD_IMAGE:
    process.env.SWARM_DASHBOARD_IMAGE ||
    "kernel528/welovemovies-frontend:dev-latest",
};

function runDocker(args) {
  execFileSync("docker", args, { env: environment, stdio: "inherit" });
}

function main() {
  const missing = requiredEnvVars.filter((name) => !environment[name]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  const swarmState = execFileSync(
    "docker",
    ["info", "--format", "{{.Swarm.LocalNodeState}}"],
    { encoding: "utf8" }
  ).trim();

  if (swarmState !== "active") {
    throw new Error("The selected Docker daemon is not an active Swarm manager.");
  }

  runDocker([
    "stack",
    "deploy",
    "--compose-file",
    stackFile,
    "--resolve-image",
    "always",
    "--with-registry-auth",
    "welovemovies-dev",
  ]);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
