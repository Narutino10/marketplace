const path = require('path');
const { exec } = require('child_process');
const configPath = path.resolve('.sequelizerc');

exec(`npx sequelize-cli migration:generate --name auto-migration`, (err, stdout, stderr) => {
    if (err) {
        console.error(`Error generating migrations: ${stderr}`);
        return;
    }
    console.log(`Migrations generated:\n${stdout}`);
});
