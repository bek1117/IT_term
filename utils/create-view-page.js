const path = require('node:path');

module.exports = page => path.resolve(__dirname, "../views", `${page}.hbs`)