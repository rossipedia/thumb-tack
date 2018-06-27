const fs = require('fs');
const semver = require('semver');
const pkg = require('./package.json');
const manifest = require('./src/manifest.json');

manifest.version = semver.coerce(pkg.version).version;
manifest.version_name = pkg.version;

fs.writeFileSync('./src/manifest.json', JSON.stringify(manifest, void 0, 4));
