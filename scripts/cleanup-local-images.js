#!/usr/bin/env node

const { spawnSync } = require("child_process");

const repositories = new Set([
  "kernel528/welovemovies-backend",
  "kernel528/welovemovies-frontend",
]);
const retainedTags = new Set(["latest", "dev-latest"]);

function docker(args, options = {}) {
  const result = spawnSync("docker", args, { encoding: "utf8" });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0 && !options.allowFailure) {
    throw new Error(result.stderr.trim() || `docker ${args.join(" ")} failed.`);
  }

  return result.stdout.trim();
}

function imageId(image) {
  const id = docker(["image", "inspect", image, "--format", "{{.Id}}"], {
    allowFailure: true,
  });

  return id || null;
}

function activeImageIds() {
  const ids = new Set();
  const containers = docker(["container", "ls", "--quiet"]);

  if (containers) {
    for (const container of containers.split("\n")) {
      const id = docker(["container", "inspect", container, "--format", "{{.Image}}"]);
      ids.add(id);
    }
  }

  const services = docker(["service", "ls", "--quiet"]);

  if (services) {
    for (const service of services.split("\n")) {
      const image = docker([
        "service",
        "inspect",
        service,
        "--format",
        "{{.Spec.TaskTemplate.ContainerSpec.Image}}",
      ]);
      const id = imageId(image);

      if (id) {
        ids.add(id);
      }
    }
  }

  return ids;
}

function main() {
  const activeIds = activeImageIds();
  const images = docker(["image", "ls", "--no-trunc", "--format", "{{json .}}"])
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
  let removed = 0;

  for (const image of images) {
    if (!repositories.has(image.Repository) || retainedTags.has(image.Tag)) {
      continue;
    }

    if (activeIds.has(image.ID)) {
      console.log(`Keeping in-use image ${image.Repository}:${image.Tag}.`);
      continue;
    }

    const reference = `${image.Repository}:${image.Tag}`;
    docker(["image", "rm", reference]);
    console.log(`Removed ${reference}.`);
    removed += 1;
  }

  console.log(`Removed ${removed} old WeLoveMovies image tag${removed === 1 ? "" : "s"}.`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
