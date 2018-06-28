const spawn = require('cross-spawn');
const path = require('path');
const fs = require('fs');

const argv = process.argv.slice(2);
const dotenv = require('dotenv');

const envpath = path.resolve(__dirname, '.env');
if (!fs.existsSync(envpath)) {
    console.error('.env file not found in ' + __dirname);
    process.exit(-1);
}

dotenv.load({ path: envpath });

spawn(argv[0], argv.slice(1), { stdio: 'inherit' }).on('exit', exitCode => {
    process.exit(exitCode);
});
