#!/usr/bin/env node

if (!process.env.SKIP_DOTENV) {
  require("dotenv").config();
}

function getBaseUrl() {
  const baseUrl = process.env.APP_URL || process.env.SMOKE_BASE_URL;

  if (!baseUrl) {
    throw new Error("Missing APP_URL or SMOKE_BASE_URL for smoke tests.");
  }

  return baseUrl.replace(/\/$/, "");
}

async function checkEndpoint(baseUrl, path, expectedStatus) {
  const response = await fetch(`${baseUrl}${path}`);

  if (response.status !== expectedStatus) {
    throw new Error(
      `GET ${path} returned ${response.status}, expected ${expectedStatus}`
    );
  }

  console.log(`GET ${path} -> ${response.status}`);
  return response;
}

async function main() {
  try {
    const baseUrl = getBaseUrl();
    console.log(`Running smoke tests against ${baseUrl}`);

    const moviesResponse = await checkEndpoint(baseUrl, "/movies", 200);
    const movies = await moviesResponse.json();
    const movieId = movies.data?.[0]?.movie_id;

    if (!movieId) {
      throw new Error("GET /movies returned no movie ID for review smoke testing.");
    }

    await checkEndpoint(baseUrl, "/theaters", 200);
    await checkEndpoint(baseUrl, `/movies/${movieId}/reviews`, 200);
    await checkEndpoint(baseUrl, "/not-a-route", 404);

    console.log("Smoke tests completed successfully.");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

main();
