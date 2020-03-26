#!/usr/bin/env node
const path = require('path');
const fs = require('fs');

const argumentsFile = path.join(__dirname, 'lastArguments.test.txt');
const responseFile = path.join(__dirname, 'nextResponse.test.txt');

const argumentsFileContents = process.argv.slice(2).join('\n');
fs.writeFileSync(argumentsFile, argumentsFileContents);

if (!fs.existsSync(responseFile)) {
  console.log('No file');
  process.exit(1);
}
const response = fs.readFileSync(responseFile, 'utf8');
console.log(response);
