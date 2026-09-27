#!/usr/bin/env node

const { execFileSync } = require("child_process");

function main() {
  const swarmState = execFileSync(
    "docker",
    ["info", "--format", "{{.Swarm.LocalNodeState}}"],
    { encoding: "utf8" }
  ).trim();

  if (swarmState !== "active") {
    throw new Error("The selected Docker daemon is not an active Swarm manager.");
  }

  execFileSync("docker", ["stack", "rm", "welovemovies-dev"], {
    stdio: "inherit",
  });
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
