#!/usr/bin/env node
/**
 * Deploy Salesforce flows using jsforce (no SF CLI needed)
 * Usage: SF_TOKEN='your_session_id' node deploy-node.js
 */
const jsforce = require('jsforce');
const fs = require('fs');

const sessionId = process.env.SF_TOKEN;
const instanceUrl = 'https://enmish42-dev-ed.develop.my.salesforce.com';

if (!sessionId) {
  console.error('ERROR: Set SF_TOKEN environment variable');
  console.error('Usage: SF_TOKEN=\'00Dxxxx!...\' node deploy-node.js');
  process.exit(1);
}

const conn = new jsforce.Connection({
  sessionId: sessionId,
  serverUrl: instanceUrl + '/services/Soap/u/62.0'
});

console.log('Deploying flows to', instanceUrl);
console.log('Using flows-deploy.zip...');

const zipStream = fs.createReadStream('./flows-deploy.zip');

conn.metadata.deploy(zipStream, {
  rollbackOnError: true,
  singlePackage: true
}).complete(true, (err, result) => {
  if (err) {
    console.error('Deploy failed:', err.message || err);
    process.exit(1);
  }

  if (result.success) {
    console.log('\n✅ Deploy successful!');
    console.log('Status:', result.status);
    console.log('Components deployed:', result.numberComponentsDeployed);
    console.log('\nFlows deployed:');
    console.log('  1. Get Contact\'s Upcoming Bookings');
    console.log('  2. Cancel Contact\'s Booking');
    console.log('\nYou can now check the Trailhead challenge!');
  } else {
    console.error('\n❌ Deploy failed');
    console.error('Status:', result.status);
    if (result.details && result.details.componentFailures) {
      const failures = Array.isArray(result.details.componentFailures)
        ? result.details.componentFailures
        : [result.details.componentFailures];
      failures.forEach(f => console.error('-', f.fullName, ':', f.problem));
    }
    process.exit(1);
  }
});
