const { Sequelize } = require('sequelize');

module.exports = new Sequelize(
    process.env.DB_NAME, // Database name
    process.env.DB_USER, // User name 
    process.env.DB_PASSWORD, // Password from db 
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    }
)