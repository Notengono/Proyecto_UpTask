const { Sequelize } = require('sequelize');
// Extraer variables.env
require('dotenv').config({ path: 'variables.env' })

// // Option 1: Passing a connection URI
// const sequelize = new Sequelize('sqlite::memory:') // Example for sqlite
// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname') // Example for postgres

// // Option 2: Passing parameters separately (sqlite)
// const sequelize = new Sequelize({
//     dialect: 'sqlite',
//     storage: 'path/to/database.sqlite'
// });

// Option 2: Passing parameters separately (other dialects)
const db = new Sequelize(process.env.BD_NOMBRE,
    process.env.BS_USER,
    process.env.BS_PASS,
    {
        host: process.env.BD_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT,
        // operatorsAliases: false,
        define: {
            timestamps: false
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
        /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
    });

module.exports = db;