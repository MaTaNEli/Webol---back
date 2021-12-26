const { Pool } = require('pg')

const pool = new Pool({
    "user": process.env.PG_USER,
    "database": process.env.PG_DB,
    "password": process.env.PG_PASS,
    "port": process.env.PG_PORT,
    "max": 20,
    "connectionTimeoutMillis" : 0,
    "idleTimeoutMillis": 0
});

module.exports = pool;
