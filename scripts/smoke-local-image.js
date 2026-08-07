const { execFileSync } = require("child_process");

const containerName = "welovemovies-backend-smoke";
const image = "kernel528/welovemovies-backend:local";
const baseUrl = "http://localhost:5001/";
const attempts = 15;

function runDocker(args, ignoreFailure = false) {
  try {
    execFileSync("docker", args, {
      stdio: ignoreFailure ? "ignore" : "inherit",
    });
  } catch (error) {
    if (!ignoreFailure) throw error;
  }
}

async function smokeTest() {
  runDocker(["rm", "--force", containerName], true);

  try {
    runDocker([
      "run",
      "--detach",
      "--name",
      containerName,
      "--publish",
      "5001:5001",
      "--env",
      "NODE_ENV=test",
      image,
    ]);

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        const response = await fetch(baseUrl);
        if (response.ok) {
          console.log(`Smoke test passed on attempt ${attempt}.`);
          return;
        }
      } catch (error) {
        // The server has not finished applying its in-memory migrations yet.
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    throw new Error(`Smoke test failed after ${attempts} attempts.`);
  } finally {
    runDocker(["rm", "--force", containerName], true);
  }
}

smokeTest().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
