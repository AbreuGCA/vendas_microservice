const mysql = require('mysql2');

// Criando o pool de conexões
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT
});

// Fazendo o pool funcionar com promises
const promisePool = pool.promise();  // Permite o uso de async/await

module.exports = promisePool;
