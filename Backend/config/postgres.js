const { Sequelize } = require("sequelize");
require('dotenv').config();

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    logging: console.log,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

async function testPostgresConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection to PostgreSQL has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the PostgreSQL database:', error);
        if (error.parent) {
            console.error('Detailed error:', error.parent.message);
            console.error('Error code:', error.parent.code);
            console.error('Error errno:', error.parent.errno);
        }
    }
}

testPostgresConnection();

module.exports = sequelize;