#!/usr/bin/env node

const { execFileSync } = require("child_process");
require("dotenv").config();

const stackName = "welovemovies-dev";
const environment = {
  ...process.env,
  SWARM_API_URL: process.env.SWARM_API_URL || "http://192.168.1.5:5001",
  SWARM_DASHBOARD_URL:
    process.env.SWARM_DASHBOARD_URL || "http://192.168.1.5:3002",
};

function docker(args) {
  return execFileSync("docker", args, { env: environment, encoding: "utf8" }).trim();
}

function verifySwarmState() {
  const state = docker(["info", "--format", "{{.Swarm.LocalNodeState}}"]);

  if (state !== "active") {
    throw new Error("The selected Docker daemon is not an active Swarm manager.");
  }
}

function verifyReplicas() {
  const services = docker([
    "stack",
    "services",
    stackName,
    "--format",
    "{{.Name}} {{.Replicas}}",
  ]);
  const replicas = new Map(
    services
      .split("\n")
      .filter(Boolean)
      .map((line) => line.trim().split(/\s+/, 2))
  );

  for (const service of ["api", "dashboard"]) {
    const name = `${stackName}_${service}`;

    if (replicas.get(name) !== "1/1") {
      throw new Error(`Service ${name} is not healthy: ${replicas.get(name) || "missing"}.`);
    }
  }
}

async function get(url, description) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${description} returned HTTP ${response.status}.`);
  }

  return response;
}

async function verifyApi() {
  const response = await get(new URL("/movies", environment.SWARM_API_URL), "API /movies");
  const payload = await response.json();

  if (!Array.isArray(payload.data) || payload.data.length === 0) {
    throw new Error("API /movies did not return movie data.");
  }
}

async function verifyDashboardBundle() {
  const dashboard = await get(
    new URL("/movies", environment.SWARM_DASHBOARD_URL),
    "Dashboard /movies"
  );
  const html = await dashboard.text();
  const match = html.match(/<script[^>]+src="([^"]+\.js)"/);

  if (!match) {
    throw new Error("Dashboard page does not reference a JavaScript bundle.");
  }

  const bundle = await get(
    new URL(match[1], environment.SWARM_DASHBOARD_URL),
    "Dashboard JavaScript bundle"
  );

  if (!(await bundle.text()).includes(environment.SWARM_API_URL)) {
    throw new Error(
      `Dashboard bundle does not target ${environment.SWARM_API_URL}. Rebuild and publish the dashboard image.`
    );
  }
}

async function main() {
  verifySwarmState();
  verifyReplicas();
  await verifyApi();
  await verifyDashboardBundle();
  console.log("Swarm development stack verification passed.");
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
