#!/usr/bin/env node

const path = require('path');

// Check if we're in development or production
const isDev = require('fs').existsSync(path.join(__dirname, '../src'));

if (isDev) {
  // Development: use ts-node
  require('ts-node/register');
  require(path.join(__dirname, '../src/interactive.ts'));
} else {
  // Production: use compiled JS
  require(path.join(__dirname, '../dist/interactive.js'));
}
