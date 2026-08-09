#!/usr/bin/env node

if (!process.env.SKIP_DOTENV) {
  require("dotenv").config();
}

const environment = process.argv[2] || "production";
const databaseEnvVars = {
  development: "DEVELOPMENT_DATABASE_URL",
  production: "PRODUCTION_DATABASE_URL",
};

const databaseEnvVar = databaseEnvVars[environment];

process.env.NODE_ENV = environment;
process.env.PGSSLMODE = process.env.PGSSLMODE || "no-verify";

const requiredEnvVars = [databaseEnvVar];
const tablesToCount = ["movies", "theaters", "reviews", "critics", "movies_theaters"];

function validateEnvironment() {
  if (!databaseEnvVar) {
    throw new Error(
      `Unsupported environment "${environment}". Use development or production.`
    );
  }

  const missing = requiredEnvVars.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

async function logTableCounts(knex) {
  const counts = {};

  for (const tableName of tablesToCount) {
    const result = await knex(tableName).count({ count: "*" }).first();
    counts[tableName] = Number(result.count);
  }

  console.log("Table counts:");

  for (const [tableName, count] of Object.entries(counts)) {
    console.log(`- ${tableName}: ${count}`);
  }
}

async function main() {
  let knex;

  try {
    validateEnvironment();

    knex = require("../src/db/connection");

    console.log("Checking migration status...");
    const [completed, pending] = await knex.migrate.list();
    console.log(`Completed migrations: ${completed.length}`);
    console.log(`Pending migrations: ${pending.length}`);

    console.log("Running migrations...");
    const migrations = await knex.migrate.latest();
    console.log("Migrations result:", migrations);

    console.log("Running seeds...");
    const seeds = await knex.seed.run();
    console.log("Seeds result:", seeds);

    await logTableCounts(knex);

    console.log(`${environment} refresh completed successfully.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    if (knex) {
      await knex.destroy();
    }
  }
}

main();
