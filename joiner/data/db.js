const { Pool } = require('pg');
const { postgres } = require('../../config.json');

const sql = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: postgres.password,
    port: 5432,
});

sql.connect();

module.exports = sql;
