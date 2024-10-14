const fs = require('fs');
const cbConfig = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

function log(message) {
    const timestamp = new Date().toISOString();
    console.log(`log: ${timestamp}: ${message}`);
}

module.exports = {
    log
}