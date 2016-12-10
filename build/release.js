const spawnSync = require('child_process').spawnSync

const {version} = require('highlight.js/package.json')
spawnSync('kp', [version], {stdio: 'inherit'})
