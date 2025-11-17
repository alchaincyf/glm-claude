#!/usr/bin/env node

/**
 * GLM Claude CLI 入口点
 */

const { main } = require('../src/index');

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
