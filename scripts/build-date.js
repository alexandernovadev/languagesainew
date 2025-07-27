#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Generate build date
const buildDate = new Date().toISOString();

// Path to package.json to update build date
const packageJsonPath = path.join(__dirname, '../package.json');

// Read the current package.json file
let packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
const packageJson = JSON.parse(packageJsonContent);

// Add buildDate to package.json
packageJson.buildDate = buildDate;

// Write back to the file
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log(`✅ Frontend build date updated: ${buildDate}`); 