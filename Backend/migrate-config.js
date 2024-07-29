const path = require('path');

module.exports = {
    development: {
        config: path.resolve('config', 'config.json'),
        migrationsDir: path.resolve('migrations'),
        modelsDir: path.resolve('models', 'postgres_models'),
    }
};
