const { sequelize } = require('./models/index');

const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: true }); // Synchronise tous les modèles
        console.log('Database synchronized');
    } catch (error) {
        console.error('Unable to synchronize the database:', error);
    }
};

syncDatabase();
