require('dotenv').config();
const pg = require('pg');
pg.defaults.ssl = true;

// Function that accepts a connection object or URL
// and returns object to set up one environment
const dbSettings = (connection) => ({
  client: 'pg',
  connection, // should start with postgres://
  pool: {
    min: 2,
    max: 10
  },
  useNullAsDefault: true,
  migrations: {
    directory: './database/migrations'
  },
  seeds: {
    directory: `./database/seeds${process.env.NODE_ENV === 'testing' ? '/testing' : ''}`
  }
});

// Configures knex for DB clusters in each environment
module.exports = {
  testing: dbSettings(process.env.DB_TEST),
  production: dbSettings(process.env.DATABASE_URL),
  development: {
      client: 'sqlite3',
      userNullAsDefault: true,
      connection: {
        filename: './database/bingo.db3'
      },
      migrations: {
        directory: './database/migrations'
      },
      seeds: {
        directory: './database/seeds'
      }
    },
};

