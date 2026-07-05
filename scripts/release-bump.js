#!/usr/bin/env node

const fs = require("fs/promises");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const VERSION_RE = /^\d+\.\d+\.\d+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function usage() {
  console.log(
    "Usage: node scripts/release-bump.js --version <x.y.z> --summary <text> [--date YYYY-MM-DD] [--dry-run]"
  );
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function parseArgs(argv) {
  const options = { dryRun: false };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg.startsWith("--version=")) {
      options.version = arg.slice("--version=".length);
      continue;
    }

    if (arg === "--version") {
      options.version = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg.startsWith("--summary=")) {
      options.summary = arg.slice("--summary=".length);
      continue;
    }

    if (arg === "--summary") {
      options.summary = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg.startsWith("--date=")) {
      options.date = arg.slice("--date=".length);
      continue;
    }

    if (arg === "--date") {
      options.date = argv[index + 1];
      index += 1;
      continue;
    }

    if (!options.version) {
      options.version = arg;
      continue;
    }

    if (!options.summary) {
      options.summary = [arg, ...argv.slice(index + 1)].join(" ");
      break;
    }
  }

  return options;
}

function ensureTrailingPeriod(text) {
  return text.endsWith(".") ? text : `${text}.`;
}

function replaceOnce(text, pattern, replacement, description) {
  if (!pattern.test(text)) {
    throw new Error(`Unable to find ${description}.`);
  }

  return text.replace(pattern, replacement);
}

async function main() {
  const { version, summary, date: suppliedDate, dryRun } = parseArgs(process.argv.slice(2));
  const releaseDate = suppliedDate || today();

  if (!version || !summary) {
    usage();
    throw new Error("Both --version and --summary are required.");
  }

  if (!VERSION_RE.test(version)) {
    throw new Error(`Invalid version "${version}". Expected x.y.z.`);
  }

  if (!DATE_RE.test(releaseDate)) {
    throw new Error(`Invalid date "${releaseDate}". Expected YYYY-MM-DD.`);
  }

  const packagePath = path.join(ROOT, "package.json");
  const lockPath = path.join(ROOT, "package-lock.json");
  const appPath = path.join(ROOT, "src", "app.js");
  const versionPath = path.join(ROOT, "VERSION.md");
  const readmePath = path.join(ROOT, "README.md");

  const [packageJsonText, packageLockText, appText, versionText, readmeText] = await Promise.all([
    fs.readFile(packagePath, "utf8"),
    fs.readFile(lockPath, "utf8"),
    fs.readFile(appPath, "utf8"),
    fs.readFile(versionPath, "utf8"),
    fs.readFile(readmePath, "utf8"),
  ]);

  const packageJson = JSON.parse(packageJsonText);
  const currentVersion = packageJson.version;

  if (currentVersion === version) {
    throw new Error(`Version ${version} is already set in package.json.`);
  }

  const normalizedSummary = ensureTrailingPeriod(summary.trim());
  const versionLine = `* ${version} - ${normalizedSummary}  ${releaseDate}`;

  const nextPackageJson = {
    ...packageJson,
    version,
  };

  const packageLock = JSON.parse(packageLockText);
  packageLock.version = version;
  if (packageLock.packages && packageLock.packages[""]) {
    packageLock.packages[""].version = version;
  }

  const nextAppText = replaceOnce(
    appText,
    /Build: v\d+\.\d+\.\d+, using Node\.js, Express, and PostgreSQL v18\.4/, 
    `Build: v${version}, using Node.js, Express, and PostgreSQL v18.4`,
    "app build banner"
  );

  const nextVersionText = `${versionText.trimEnd()}\n${versionLine}\n`;
  const nextReadmeText = replaceOnce(
    readmeText,
    /Latest release: `[^`]+` \([^)]*\)\./,
    `Latest release: \`${version}\` (${releaseDate}).`,
    "README latest release line"
  );

  if (dryRun) {
    console.log(`Would update package.json to ${version}`);
    console.log(`Would update package-lock.json to ${version}`);
    console.log(`Would update src/app.js build banner to ${version}`);
    console.log(`Would append to VERSION.md: ${versionLine}`);
    console.log(`Would update README.md latest release line to ${version} (${releaseDate})`);
    return;
  }

  await Promise.all([
    fs.writeFile(packagePath, `${JSON.stringify(nextPackageJson, null, 2)}\n`),
    fs.writeFile(lockPath, `${JSON.stringify(packageLock, null, 2)}\n`),
    fs.writeFile(appPath, nextAppText),
    fs.writeFile(versionPath, nextVersionText),
    fs.writeFile(readmePath, nextReadmeText),
  ]);

  console.log(`Release metadata updated to ${version} (${releaseDate}).`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
