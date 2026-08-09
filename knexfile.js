const path = require("path");
require("dotenv").config();

const {
  NODE_ENV = "development",
  LOCAL_DATABASE_URL,
  DEVELOPMENT_DATABASE_URL,
  PRODUCTION_DATABASE_URL,
} = process.env;

// Select the appropriate database URL based on NODE_ENV
const DATABASE_URLS = {
  local: LOCAL_DATABASE_URL,
  development: DEVELOPMENT_DATABASE_URL,
  production: PRODUCTION_DATABASE_URL,
};

const DATABASE_URL = DATABASE_URLS[NODE_ENV];

module.exports = {
  local: {
    client: "postgresql",
    connection: LOCAL_DATABASE_URL,
    pool: { min: 0, max: 5 },
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    ssl: false,
  },

  development: {
    client: "postgresql",
    connection: DEVELOPMENT_DATABASE_URL,
    pool: { min: 0, max: 5 },
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    ssl: false,
  },

  production: {
    client: "postgresql",
    connection: PRODUCTION_DATABASE_URL,
    pool: { min: 0, max: 5 },
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    ssl: {
      rejectUnauthorized: false,
    },
  },

  test: {
    client: "sqlite3",
    connection: {
      filename: ":memory:",
    },
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    useNullAsDefault: true,
  },
};
