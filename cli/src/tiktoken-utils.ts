// Tiktoken utilities for accurate token counting
// Export o200k_base ranks to avoid ESM import issues

// Use require for CommonJS compatibility
const o200k_base = require('js-tiktoken/ranks/o200k_base');

export { o200k_base };