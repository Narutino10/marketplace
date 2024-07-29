const { spawn } = require('child_process');

const geocodeAddress = (query) => {
    return new Promise((resolve, reject) => {
        const geocode = spawn('addok-geocode', ['--columns', 'address', '--semicolon']);
        let output = '';

        geocode.stdout.on('data', (data) => {
            output += data.toString();
        });

        geocode.stderr.on('data', (data) => {
            console.error(`Error: ${data}`);
        });

        geocode.on('close', (code) => {
            if (code !== 0) {
                return reject('Geocoding process failed');
            }
            const results = output.split('\n').map(line => line.split(';')).filter(line => line.length > 1);
            resolve(results);
        });

        geocode.stdin.write(`address;${query}\n`);
        geocode.stdin.end();
    });
};

module.exports = {
    geocodeAddress
};
