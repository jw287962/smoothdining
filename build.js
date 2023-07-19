const fs = require("fs-extra");
const { execSync } = require("child_process");

// Transpile TypeScript files
execSync("tsc");

// Copy Pug files
fs.copySync("src/views", ".dist/src/views");

fs.copySync("public/stylesheets", ".dist/src/public/stylesheets");
