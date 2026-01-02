#!/usr/bin/env node

/**
 * Script to generate bcrypt password hash for admin authentication
 * 
 * Usage: node scripts/generate-password-hash.js <password>
 * 
 * Example: node scripts/generate-password-hash.js mySecurePassword123
 * 
 * Copy the output hash to your .env file as ADMIN_PASSWORD_HASH
 */

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/generate-password-hash.js <password>');
  console.error('Example: node scripts/generate-password-hash.js mySecurePassword123');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);

console.log('\n=== Password Hash Generated ===\n');
console.log('Add this to your .env file:\n');
console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
console.log('\n================================\n');
