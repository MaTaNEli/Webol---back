const { Pool } = require('pg')

const pool = new Pool({
    "user": 'postgres',
    "database": 'webol',
    "password": 'allober77354hhzxm',
    "port": 5433,
    "max": 20,
    "connectionTimeoutMillis" : 0,
    "idleTimeoutMillis": 0
});

module.exports = pool;
