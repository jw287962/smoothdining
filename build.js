const fs = require("fs-extra");
const { execSync } = require("child_process");

// Transpile TypeScript files
execSync("tsc");

// Copy Pug files
fs.copySync("src/views", ".dist/views");
